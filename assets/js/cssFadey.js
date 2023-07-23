var cssFadey = function(newOptions) {
    var options = (function() {
        var mergedOptions = {},
        defaultOptions = {
            presentationTime: 4,
            durationTime: 1,
            fadeySelector: '#fadey',
            cssAnimationName: 'fadey',
            fallbackFunction: function() {}
        };
        for (var option in defaultOptions) mergedOptions[option] = defaultOptions[option];
        for (var option in newOptions) mergedOptions[option] = newOptions[option];
        return mergedOptions;
    })(),
    CS = this;
    CS.animationString = 'animation';
    CS.hasAnimation = false;
    CS.keyframeprefix = '';
    CS.domPrefixes = 'Webkit Moz O Khtml'.split(' ');
    CS.pfx = '';
    CS.element = document.getElementById(options.fadeySelector.replace('#', ''));
    CS.init = (function() {
        if (CS.element.style.animationName !== undefined) CS.hasAnimation = true;
        if (CS.hasAnimation === false) {
            for (var i = 0; i < CS.domPrefixes.length; i++) {
                if (CS.element.style[CS.domPrefixes[i] + 'AnimationName'] !== undefined) {
                    CS.pfx = domPrefixes[i];
                    CS.animationString = pfx + 'Animation';
                    CS.keyframeprefix = '-' + pfx.toLowerCase() + '-';
                    CS.hasAnimation = true;
                    break;
                }
            }
        }
        if (CS.hasAnimation === true) {
			function loaded() { 
				var imgAspectRatio = firstImage.naturalHeight / (firstImage.naturalWidth / 100);   
				var imageCount = CS.element.getElementsByTagName("img").length,
				totalTime = (options.presentationTime + options.durationTime) * imageCount, 
				css = document.createElement("style"); 
				css.type = "text/css";
	            css.id = options.fadeySelector.replace('#', '') + "-css";
	            css.innerHTML += "@" + keyframeprefix + "keyframes " + options.cssAnimationName + " {\n";
	            css.innerHTML += "0% { opacity: 1; }\n";
	            css.innerHTML += (options.presentationTime / totalTime) * 100+"% { opacity: 1; }\n";
	            css.innerHTML += (1/imageCount)*100+"% { opacity: 0; }\n";
	            css.innerHTML += (100-(options.durationTime/totalTime*100))+"% { opacity: 0; }\n";
	            css.innerHTML += "100% { opacity: 1; }\n";
  css.innerHTML += "}\n";
	            css.innerHTML += options.fadeySelector + " img { position: absolute; top: 0; left: 0; " + keyframeprefix + "animation: " + options.cssAnimationName + " " + totalTime + "s ease-in-out infinite; }\n";
	          css.innerHTML += options.fadeySelector + "{ box-sizing: border-box; padding-bottom: " + imgAspectRatio + "%; }\n";
	          for (var i=0; i < imageCount; i++) {
	            css.innerHTML += options.fadeySelector + " img:nth-last-child("+(i+1)+") { " + keyframeprefix + "animation-delay: "+ i * (options.durationTime + options.presentationTime) + "s; }\n";
	            }
			document.body.appendChild(css); 
		}
		var firstImage = CS.element.getElementsByTagName("img")[0];
		if (firstImage.complete) {
			loaded();
		} else {
			firstImage.addEventListener('load', loaded);
			firstImage.addEventListener('error', function() {
				alert('error');
			})
		}
	} else {
		// fallback function
		options.fallbackFunction();
        }
    })();
}
cssFadey();