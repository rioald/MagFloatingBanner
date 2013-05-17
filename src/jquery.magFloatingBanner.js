/*!
 * Magnetic Floating Banner jQuery Plugin v1.0
 * http://lab.zzune.com
 * https://github.com/rioald/MagFloatingBanner
 *
 * Copyright (c) 2012 zune-seok Moon (zune rioald).
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Wed Nov 14 15:39:24 2012 +0900
 */

(function($) {

var MagFloatingBanner = function(targetContainer, options) {
	"use strict";
	
	var target = $(targetContainer);
	var options = jQuery.extend({
		"position": "bottom", // 2mode : top, bottom
		"scrolling": "ontop" // 3mode : ontop, once, follow
	}, options);
	
	var self = this;
	
	var _init = function() {
		target.css({"position": "absolute", "left": 0, "overflow": "hidden", "z-index": 1});
		
		_positioning();
		
		if(!DeviceChecker.isIOS) {
			target.css("position", "fixed");
		}
		
		// calculate container dimention
		if(target.height() == 0) {
			var imgs = target.find("img");
			if(imgs.length > 0) {
				imgs.bind("load", _calculateDimension);
			} else {
				_calculateDimension();
			}
		}
		
		_initEventListener();
		_onorientationchange();
	};
	
	var _initEventListener = function() {
		// add scroll event
		$(window).scroll(_scrolling);
		
		// add touch start, end (iOS only)
		if(DeviceChecker.isIOS) {
			$(document.body).bind("touchstart", function(e) {
				if($.contains(target.get(0), e.target)) {
					return true;
				}
				
				target.css("visibility", "hidden");
			});
			
			$(document.body).not(target).bind("touchend", function(e) {
				_placing();
				target.css("visibility", "yes");
			});
		}
	};
	
	var _calculateDimension = function() {
		var looper = function(jqObj, dimension, resultArray) {
			resultArray = resultArray || [];
			
			var current;
			
			if(dimension == "width") { current = jqObj.innerWidth(); } 
			else { current = jqObj.innerHeight(); }
			
			resultArray.push(current);
			
			if(jqObj.children().length <= 0) {
				return Math.max.apply(null, resultArray);
			}
			
			return looper(jqObj.children(), dimension, resultArray);
		};
		
		var calcHeight = looper(target.children(), "height");
		target.height(calcHeight);
	};
	
	var _scrolling = function() {
		if(options.scrolling == "ontop") {
			if($(window).scrollTop() <= 1) {
				target.show();
				_placing();
			} else {
				target.hide();
			}
		} else if(options.scrolling == "once") {
			$(window).scroll(function() {
				target.hide();
			});
			
			if(_placing) {
				_placing();
			} else {
				return;
			}
			
			_placing = null;
		} else if(options.scrolling == "follow") {
			_placing();
		}
	};
	
	var _positioning = function() {
		if(options.position == "top") {
			target.css({"top": 0});
		} else if(options.position == "bottom") {
			target.css({"bottom": 0});
		}
	};
	
	var _placing = function() {
		if(!DeviceChecker.isIOS) {
			_positioning();
			
			return;
		}
		
		_calculateDimension();
		
		if(options.position == "top") {
			target.css({"top": $(window).scrollTop() + "px", "bottom": 0});
		} else if(options.position == "bottom") {
			target.css({"top": (window.innerHeight + $(window).scrollTop() - target.height()) + "px", "bottom": 0});
		}
	};
	
	var _onorientationchange = function() {
		// bind window.onresize
		if(DeviceChecker.isIOS) {
			$(window).bind("orientationchange", _placing);	
		} else {
			$(window).bind("resize", _placing);	
		}
	};
	
	// init FloatingBanner
	_init();
};

var DeviceChecker = {
	isAndroid: navigator.userAgent.search("Android") > -1,
	isIOS: navigator.userAgent.search("iPhone|iPod|iPad") > -1
};



$.fn.magFloatingBanner = function(options) {
	if(this.length <= 0) {
		return null;
	}

	var maps = [];

	this.each(function(i, v) {
		v.magFloatingBanner = new MagFloatingBanner(v, options);

		maps.push(v.magFloatingBanner);
	});
	
	return this.magFloatingBanner = maps;
};

})(jQuery);