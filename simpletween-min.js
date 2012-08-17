var Tween=function(){function f(a){return typeof HTMLElement=="object"?a instanceof HTMLElement:a&&typeof a=="object"&&a.nodeType===1&&typeof a.nodeName==="string"}var a=[];var b=30;var c=function(b){for(var c=a.length-1;c>=0;c--){if(a[c]&&a[c].target===b)return c}return-1};var d=function(a){var b={};var c=a.indexOf("#");if(c<0)c=0;var d=parseInt(a.substr(c),16);b.r=d>>16&255;b.g=d>>8&255;b.b=d&255;return b};var e=function(a){a=a.match(/([0-9]+)/g);return{r:parseInt(a[0]),g:parseInt(a[1]),b:parseInt(a[2])}};var g={ease_in:function(a,b,c,d){return c*(a/=d)*a*a*a+b},ease_out:function(a,b,c,d){return-c*((a=a/d-1)*a*a*a-1)+b},ease_inout:function(a,b,c,d){if((a/=d/2)<1)return c/2*a*a*a*a+b;return-c/2*((a-=2)*a*a*a-2)+b},ease_outin:function(a,b,c,d){var e=(a/=d)*a,f=e*a;return b+c*(-.002546148949710947*f*e+.006365372374279588*e*e+5.996180776575432*f+ -9.00063653723743*e+4.000636537237429*a)},ease_linear:function(a,b,c,d){return c*a/d+b},ease_elastic:function(a,b,c,d){var e=(a/=d)*a,f=e*a;return b+c*(1.5109254498714684*f*e+ -11.272493573264782*e*e+18.149100257069406*f+ -10.205655526992288*e+2.8181233933161955*a)}};var h={x:"left",y:"top",alpha:"opacity"};var i={style:"top,bottom,right,left,width,height,opacity".split(",")};var j={px:"top,bottom,right,left,width,height".split(",")};var k=function(a,c,d,e){this.state=0;this.dtime=1e3/b;this.target=a;this.props=[];this.duration=d;this.currentFrame=0;this.properitesCount=0;this.easingFunction=g.ease_inout;this.delayBefore=0;this.delayAfter=0;if(typeof e=="object"){this.onComplete=e.onComplete;this.onStep=e.onStep;this.onStart=e.onStart;this.callbackParams=e.params}else if(typeof e=="function")this.onComplete=e;if(typeof d=="object"){this.delayBefore=Math.round(d.delayBefore*b)||Math.round(d.delay*b)||0;this.delayAfter=Math.round(d.delayAfter*b)||0;this.duration=d.duration||1;if(d.easing&&typeof g["ease_"+d.easing]=="function")this.easingFunction=g["ease_"+d.easing]}this.count=Math.round(this.duration*b);var h=f(a);for(var i in c){this.props.push(this.newProperty(i,c[i],h));this.properitesCount++}this.state=1;if(navigator.userAgent.search("MSIE")==-1){this.interval=setInterval(this.step,this.dtime,this)}else{var j=this;this.interval=setInterval(function(){j.step(j)},this.dtime)}};k.prototype.newProperty=function(a,b,c){var d={};d.type="number";if(typeof b!="object"){b={to:b}}if(c){d.name=h[a]||a;d.target=this.defaultTarget(d.name);var f=this.getInitialValueFromTargetStyle(d.target[d.name]||0);d.from=b.from||f.value;d.unit=b.unit||f.unit;d.type=b.type||f.type;d.to=d.type=="color"?e(b.to):b.to}else{d.name=a;d.target=this.target;d.from=b.from||d.target[d.name]||0;d.to=b.to;d.unit=b.unit||null}return d};k.prototype.getInitialValueFromTargetStyle=function(a){var b={unit:null,type:"number"};if(typeof a=="number"){b.value=a}else if(a.indexOf("rgb")!=-1){b.type="color";b.value=e(a)}else if(/^[0-9\.]+[a-z]+$/.test(a)){var c=a.match(/^([0-9\.]+)([a-z]+)$/);b.value=parseFloat(c[1]);b.unit=c[2]}else b.value=parseFloat(a);return b};k.prototype.step=function(a){switch(a.state){case 1:if(a.delayBefore){a.delayBefore--;return}else{a.state=2;if(a.onStart)a.onStart.call(a,a.callbackParams);break};case 3:if(a.delayAfter){a.delayAfter--;return}else a.state=4;case 4:if(a.onComplete)a.onComplete.call(a,a.callbackParams);a.stop.call(a,-1);return}var b=a.currentFrame>=a.count;var c={};for(var d=0;d<a.properitesCount;d++){var e=a.props[d];var f;if(e.type=="color"){f=[];f.push(Math.round(a.easingFunction(a.currentFrame,e.from.r,e.to.r-e.from.r,a.count)));f.push(Math.round(a.easingFunction(a.currentFrame,e.from.g,e.to.g-e.from.g,a.count)));f.push(Math.round(a.easingFunction(a.currentFrame,e.from.b,e.to.b-e.from.b,a.count)));f="rgb("+f.join(",")+")"}else{f=a.easingFunction(a.currentFrame,e.from,e.to-e.from,a.count)}a.setProperty(e,f);c[e.name]=f}a.currentFrame++;if(a.onStep)a.onStep.call(a,a.callbackParams,c);if(b)a.state=3};k.prototype.stop=function(b){if(!b)b=c(this.target);clearInterval(this.interval);delete a[b]};k.prototype.defaultTarget=function(a){return this.target.style};k.prototype.setProperty=function(a,b){if(a.unit)b+=a.unit;a.target[a.name]=b};var l=function(b,d,e,f){if(typeof b=="string")b=document.getElementById(b);var g=c(b);if(g!=-1)a[g].tween.stop(g);var h=new k(b,d,e,f);a.push({target:b,tween:h})};return{to:l}}()