simpletween.js
==============

Simple (but powerful) tween written in java script.

##How to use it

Firstly, include js:  
```<script type="text/javascript" src='simpletween-min.js'></script>```


Simple syntax:  
```Tween.to(target, properties, duration, callback);```

where
* target (string|object|DOMELement)- id of DOMElement, or DOMElement, or another object with any properties,  
* properties (object) - object with properites and values, ex. ```{left: 10, top: 25}```,
* duration (number|object) - time in seconds
* callback (function|object) [optional] - function which is call after complete  

The simplest use:  

```Tween.to('div', {x:10, y:20, width:25}, 2);```

or more complicated  

```Tween.to('div', {x:10, y:20, width:25, alpha: 0.7, backgroundColor: 'rgb(10,155,20)', borderRadius: 10}, 2);```

How to use easing functions:  

```
Tween.to('div3', {x:500}, {duration: 3, easing: 'in'});
Tween.to('div4', {x:500}, {duration: 3, easing: 'out'});
Tween.to('div5', {x:500}, {duration: 3, easing: 'inout'});
Tween.to('div6', {x:500}, {duration: 3, easing: 'outin'});
Tween.to('div7', {x:500}, {duration: 3, easing: 'linear'});
Tween.to('div8', {x:500}, {duration: 3, easing: 'elastic'});
```

Delays and callback functions:

```
Tween.to(
	'div2', 
	{width:50, height: 50}, 
	{delayBefore:0, delayAfter:0, duration: 1, easing: 'inout'}, 
	{onStep: function() {}, onComplete: function() {}}
);
```

Using their own objects:

Here is example, how to tween properties of object "test":   

```
var test = { a: 0, b:100};

var myParams = {someParam:1};

Tween.to(
	test, 
	{a:100, b:0}, 
	{duration: 5, easing: 'inout'}, 
	{
		onStep: function(params, values) 
		{
			console.log(params, values);
		}, 
		onComplete: function(params) {
			console.log('done!);
		},
		params: myParams
	}
		
);
```

That`s all:) 

More demos you can find in file "Tween.html". 