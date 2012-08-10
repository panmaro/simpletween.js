
	// Simple Tween v0.9
	// maro@wrak.tk
	// more info: 
	var Tween = (function()	{
	
		var tweens = []; // target, tween
		var fps = 30;
		
		// find index of tween in tweens array
		var tweenIndex = function(target) {
			for (var i = tweens.length-1; i>=0; i--)
			{
				if (tweens[i] && tweens[i].target === target) return i;
			}
			
			return -1;
		}
		
		var hexColorToRGB = function(hex) {
			var r = {};
			var hash = hex.indexOf('#'); if (hash<0) hash = 0;
			var value = parseInt(hex.substr(hash), 16);
			r.r = (value >>16) & 255;
			r.g = (value >>8) & 255;
			r.b = (value) & 255;
			return r;
		}
		
		// parse 'rgb(0,0,0)' to object {r:0, g:0, b:0}
		var rgbParser = function(rgb) {
			rgb = rgb.match(/([0-9]+)/g);
			return {r: parseInt(rgb[0]), g: parseInt(rgb[1]), b: parseInt(rgb[2])};
		}
	
		//Returns true if it is a DOM element    
		function isElement(o){
			return (
				typeof HTMLElement == "object" ? o instanceof HTMLElement : //DOM2
				o && typeof o == "object" && o.nodeType === 1 && typeof o.nodeName==="string"
			);
		}

		// some ease functions from various sources
		var easingFunctions = {
			ease_in: function (t,b,c,d) { return c*(t/=d)*t*t*t + b;},
			ease_out: function (t,b,c,d) { return -c * ((t=t/d-1)*t*t*t - 1) + b;},
			ease_inout: function (t,b,c,d) { if ((t/=d/2) < 1) return c/2*t*t*t*t + b; return -c/2 * ((t-=2)*t*t*t - 2) + b; },
			ease_outin: function (t,b,c,d) { var ts=(t/=d)*t, tc=ts*t; return b+c*(-0.002546148949710947*tc*ts + 0.006365372374279588*ts*ts + 5.996180776575432*tc + -9.00063653723743*ts + 4.000636537237429*t) } ,
			ease_linear: function (t,b,c,d) { return c*t/d + b; },
			ease_elastic: function (t,b,c,d) { var ts=(t/=d)*t, tc=ts*t; return b+c*(1.5109254498714684*tc*ts + -11.272493573264782*ts*ts + 18.149100257069406*tc + -10.205655526992288*ts + 2.8181233933161955*t); }
		}
		
		// this property names will be translate ( x -> left) 
		var translationNames = {
			x: 'left',
			y: 'top',
			alpha: 'opacity'
		};
		
		var defaultTargets = {
			style: 'top,bottom,right,left,width,height,opacity'.split(',')
		}

		var defaultUnits = {
			px: 'top,bottom,right,left,width,height'.split(',')
		};
		
		// main class
		var CTween = function(target, props, duration, callbacks) {
			
			this.state = 0; // 0 - init, 1 - delayBefore, 2 - tween, 3 - delayAfter
			this.dtime = 1000/fps;	// interval value between 2 frames
			this.target = target; 	// target object (can be DOMElement or object)
			this.props = []; // target (in DOMElement this is style), name, from, to, unit
			this.duration = duration;	// duration (sec)
			this.currentFrame = 0;	
			this.properitesCount = 0;	
			this.easingFunction = easingFunctions.ease_inout;
			this.delayBefore = 0;	// delay before tweening (here in frames)
			this.delayAfter = 0; 	// delay after tweening (here in frames)
			
			if (typeof callbacks == 'object') {
				this.onComplete = callbacks.onComplete;
				this.onStep = callbacks.onStep;
				this.onStart = callbacks.onStart;
				this.callbackParams = callbacks.params;
			} else if (typeof callbacks == 'function') this.onComplete = callbacks;
			
			
			if (typeof duration == 'object')
			{
				this.delayBefore = Math.round(duration.delayBefore * fps) || Math.round(duration.delay * fps) || 0;
				this.delayAfter = Math.round(duration.delayAfter * fps) || 0;
				this.duration = duration.duration || 1;
				if (duration.easing && typeof easingFunctions['ease_'+duration.easing] == 'function') this.easingFunction = easingFunctions['ease_'+duration.easing];
			}
			
			this.count = Math.round(this.duration * fps); // total frames count
			
			var bElement = isElement(target);
			
			for (var p in props) {
				
				this.props.push( this.newProperty(p, props[p], bElement) );
				this.properitesCount++;
			}
			
			this.state = 1;
			if (navigator.userAgent.search('MSIE')==-1) {
				this.interval = setInterval(this.step, this.dtime, this);
			} else {
				var that = this;
				this.interval = setInterval(function() {that.step(that);}, this.dtime);
			}
		}

		// create new property described as target (in DOMElement this is style), name, from, to, unit
		CTween.prototype.newProperty = function(name, prop, domElement) {
			
			var p = {};
			
			p.type = 'number';
		
			if (typeof prop != 'object') {
				prop = {to: prop};
			}
			
			if (domElement) {
				p.name = translationNames[name] || name;
				p.target = this.defaultTarget(p.name);
				
				var tmp = this.getInitialValueFromTargetStyle(p.target[p.name] || 0);
				
				p.from = prop.from || tmp.value;
				p.unit = prop.unit || tmp.unit;
				p.type = prop.type || tmp.type;
				
				p.to = (p.type=='color')?rgbParser(prop.to):prop.to;
				
			} else
			{
				p.name = name;
				p.target = this.target;
				p.from = prop.from || p.target[p.name] || 0;
				p.to = prop.to;
				p.unit = prop.unit || null;
			}
			
			return p;
		}

		
		// getting initial value and unit from css style of target DOMElement
		CTween.prototype.getInitialValueFromTargetStyle = function(value) {
			var r = {unit:null, type:'number'};
			
			if (typeof value == 'number') 
			{
				r.value = value;
			} 
			else if (value.indexOf('rgb')!=-1) { 
				r.type = 'color';
				r.value = rgbParser(value);
			} else if ( /^[0-9\.]+[a-z]+$/.test(value) ) 
			{
				var tmp = value.match (/^([0-9\.]+)([a-z]+)$/);
				r.value = parseFloat(tmp[1]);
				r.unit = tmp[2];
			} else r.value = parseFloat(value);
			
			return r;
		}

		
		CTween.prototype.step = function(that) {
		
			// check delay and state
			switch (that.state) {
				case 1:
					if (that.delayBefore) {
						that.delayBefore--;
						return;
					} else {
						that.state = 2;
						if (this.onStart) this.onStart.call(this, this.callbackParams);
						break;
					}
					
				case 3:
					if (that.delayAfter) {
						that.delayAfter--;
						return;
					} else that.state = 4;
					
				case 4:
					that.stop.call(that, -1);
					return;
			}
			
			// case this.state = 2
			
			// last frame reached?
			var last = (that.currentFrame >= that.count);
			
			// values - parameter for onStep callback
			var values = {};
			
			for (var i = 0; i<that.properitesCount; i++)
			{
				var prop = that.props[i];
				var value;
				if (prop.type=='color') {
					value = [];
					value.push( Math.round(that.easingFunction(that.currentFrame, prop.from.r, prop.to.r-prop.from.r, that.count)) );
					value.push( Math.round(that.easingFunction(that.currentFrame, prop.from.g, prop.to.g-prop.from.g, that.count)) );
					value.push( Math.round(that.easingFunction(that.currentFrame, prop.from.b, prop.to.b-prop.from.b, that.count)) );
					value = 'rgb('+value.join(',')+')';
				} else {
					value = that.easingFunction(that.currentFrame, prop.from, prop.to-prop.from, that.count);
				}						
				that.setProperty(prop, value);
				values[prop.name] = value;
			}
			
			that.currentFrame++;
			
			if (that.onStep) that.onStep.call(that, that.callbackParams, values);
			if (last) that.state = 3;
		}
		
		CTween.prototype.stop = function(index) {
			
			if (!index) index = tweenIndex(this.target);
			clearInterval(this.interval);
			delete tweens[index];
			if (this.onComplete) this.onComplete.call(this, this.callbackParams);
		}
		
		CTween.prototype.defaultTarget = function(name) {
			return this.target.style;
		}
		
		CTween.prototype.setProperty = function(prop, value) {
			if (prop.unit) value += prop.unit;
			prop.target[prop.name] = value;
		}
		
		var to = function(target, props, duration, callbacks) {
		
			if (typeof target == 'string') target = document.getElementById(target);
			
			var index = tweenIndex(target);
			if (index!=-1) tweens[index].tween.stop(index);
			
			var tween = new CTween(target, props, duration, callbacks);
			
			tweens.push({target:target, tween:tween});
			
		}
		
		return {to:to};
		
	})();