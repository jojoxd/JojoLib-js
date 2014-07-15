/*	JojoLib:										||
||	Licensed under LGPL v3							||
||	Source: https://github.com/jojoxd/jojolib-js	||
||	Untested in IE	--	Requires jQuery & Bootstrap	*/

console.log("[JojoLib] [INIT]: Started");
var startTime = new Date();

// check for jQuery
if(typeof jQuery === 'undefined'){console.warn("JojoLib requires jQuery.");}

// namespace: 
var JojoLib = {
	_postInit: function(){
		// postInit stuff here:
		
		// Calculate how quick init was:
		var endTime = new Date();
		var diff = endTime - startTime;
		JojoLib.out.log("INIT", "Completed after " + diff + " ms");
		diff = null; startTime = null; endTime = null; // so you can use these variables in your script
		
		JojoLib.out.log("POSTINIT", "Started");
		// version check:
		JojoLib._core.versionCheck();
		
		// define Errors:
		JojoLib.error.undefinedError.prototype = new Error();
		JojoLib.error.undefinedError.prototype.constructor = JojoLib.error.undefinedError;
		
		// fixes and stuff:
		JojoLib.thirdParty.fixes();
		
		JojoLib.out.log("POSTINIT", "Complete");
	},
	
	out: {
		log: function(prefix, text, namespace){
			// how it looks in console: [<namespace>] [<prefix>]: <text> || [JojoLib] [<prefix>]: <text> || [JojoLib]: <prefix>
			if(typeof namespace === 'undefined'){namespace = "JojoLib";}
			
			if(typeof text === 'undefined'){
				console.log("[" + namespace + "]: " + prefix);
			}
			else{
				console.log("[" + namespace + "] [" + prefix + "]: " + text);
			}
		},
		
		warn: function(prefix, text, namespace){
			// how it looks in console: ![<namespace>] [<prefix>]: <text> || ![JojoLib] [<prefix>]: <text> || ![JojoLib]: <prefix>
			if(typeof namespace === 'undefined'){namespace = "JojoLib";}
			
			if(typeof text === 'undefined'){
				console.warn("[" + namespace + "]: " + text);
			}
			else{
				console.warn("[" + namespace + "] [" + prefix + "]: " + text);
			}
		},
		
		todo: function(text, namespace){
			// how it looks in console: [<namespace>] [TODO]: <text> || [JojoLib] [TODO]: <text>
			if(typeof namespace === 'undefined'){namespace = "JojoLib";}
			
			console.log("[" + namespace + "] [TODO]: " + text);
		},
		
		// will only run if JojoLib.settings.debug = true;
		debug: function(prefix, text, namespace){
			// how it looks in console: [<namespace>] [DEBUG [<prefix>]]: <text> || [JojoLib] [DEBUG [<prefix>]]: <text> || [JojoLib] [DEBUG]: <prefix>
			if(JojoLib.settings.debug){
				if(typeof namespace === 'undefined'){namespace = "JojoLib";}
				
				if(typeof text === 'undefined'){
					JojoLib.out.log("DEBUG", prefix, namespace);
				}
				else{
					JojoLib.out.log("DEBUG [" + prefix + "]", text, namespace);
				}
			}
		},
		
		documentAppend: function(where, what){
			$('#' + where).append(what);
		},
		
		documentOverwrite: function(where, what){
			$('#' + where).html(what);
		}
	},
	
	core: {
		getURLParam: function(parameter){
			var searchString = window.location.search.substring(1);
			var variableArray = searchString.split('&');
			for(var i = 0; i < variableArray.length; i++){
				var keyValuePair = variableArray[i].split('=');
				if(keyValuePair[0] == parameter){
					return keyValuePair[1];
				}
			}
			JojoLib.out.debug("parameter not found: " + parameter);
			return false;
		},
		
		// compat patch, will be out once redone
		getPageMode: function(){
			return JojoLib.mode.get();
		},
		
		loadLibrary: function(name, where, initFunction){
			/*	A library needs an init function		||
			||	like name.init()						||
			||	or user defined for more inits on load	||
			||	The name NEEDS TO MATCH YOUR NAMESPACE	||
			||	/ VARIABLE NAME							*/
			
			JojoLib.out.log("Library", "Loading library: " + name);
			var js = document.createElement('script');
			var id = "JojoLib_" + name + "_Library";
			js.setAttribute('type', 'text/javascript'); // not needed for html5, but has to be here for html <5
			if(typeof initFunction === 'undefined'){
				js.setAttribute('onload', name + ".init()");
			}
			else{
				js.setAttribute('onload', initFunction);
			}
			js.setAttribute('id', id);
			js.setAttribute('src', where);
			document.head.appendChild(js);
			JojoLib.out.log("Library", "Loaded library: " + name);
			JojoLib._vars.loadedLibrary = JojoLib._vars.loadedLibrary.concat(name);
		},
		
		sendEvent: function(name){
			var evt = document.createEvent('CustomEvent');
			evt.initCustomEvent(name, true, false, null);
			JojoLib.out.log("EVENT", "Dispatching event " + name);
			document.dispatchEvent(evt);
		},
	},
	
	_core: {
		versionCheck: function(){
			JojoLib.out.debug("1");
			$(document).ready(function(){
				JojoLib.out.debug("2");
				if(JojoLib.settings.version.versionCheck){
					JojoLib.out.debug("3");
					var renderChangelog = false;
					var thisVersion = JojoLib._vars.version;
					$.get('http://jojoxd.nl/JojoLib/newestVersion.php', function(data){
						JojoLib.out.debug("4");
						var comparison = JojoLib._core.versionCompare("" + thisVersion, "" + data);
						
						if(comparison < 0){
							// new version available
							JojoLib.out.debug("10.1");
							JojoLib.out.log("Version Checker", "There's a new version available! ("+ data +") you are running " + thisVersion);
							if(JojoLib.settings.version.showChangelog){
								JojoLib._core.changelog();
							}
							else{
								JojoLib.out.log("Changelog", "Disabled");
							}
						}
						else if(comparison == 0){
							JojoLib.out.debug("10.2");
							// the versions are equal
							JojoLib.out.log("version Checker", "You are running the latest known version of JojoLib");
						}
						else if(comparison > 0){
							JojoLib.out.debug("10.3");
							// you are running a [DEV|CUSTOM] build of JojoLib
							if(JojoLib.settings.version.isDEV || JojoLib.settings.version.isCUSTOM){
								JojoLib.out.log("Version Checker", "You are running a custom/dev version of JojoLib.");
							}
							else{
								JojoLib.out.log("This version# is not recognized, maybe you are running a newer version that is not available yet");
							}
						}
					});
					
					
				}
				else{
					// version check disabled
				}
			});
		},
		
		versionCompare: function(v1, v2, options){
			// thanks to Jon Papaioannou ( https://gist.githubusercontent.com/TheDistantSea/8021359/raw/0ef72e403ae51c4860cd2af9d4d18f14c1c98b01/version_compare.js )
			var lexicographical = false;
			var zeroExtend = false;
			JojoLib.out.debug("5");
			if(options){
				if(options.lexicographical){
					var lexicographical = true;
				}
				
				if(options.zeroExtend){
					var zeroExtend = true;
				}
			}
			
			JojoLib.out.debug("6");
			var v1parts = v1.split(".");
			var v2parts = v2.split(".");
			
			JojoLib.out.debug("7");
			
			function isValidPart(x) {
				JojoLib.out.debug("8");
				return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
			}

			if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
				return NaN;
			}

			if (zeroExtend) {
				while (v1parts.length < v2parts.length) v1parts.push("0");
				while (v2parts.length < v1parts.length) v2parts.push("0");
			}

			if (!lexicographical) {
				v1parts = v1parts.map(Number);
				v2parts = v2parts.map(Number);
			}
			
			JojoLib.out.debug("9");
			
			for (var i = 0; i < v1parts.length; ++i) {
				if (v2parts.length == i) {
					return 1;
				}

				if (v1parts[i] == v2parts[i]) {
					continue;
				}
				else if (v1parts[i] > v2parts[i]) {
					return 1;
				}
				else {
					return -1;
				}
			}

			if (v1parts.length != v2parts.length) {
				return -1;
			}

			return 0;
		},
	
		changelog: function(){
			$.get('http://jojoxd.nl/JojoLib/changeLog.php', function(data){
				JojoLib.out.log("Changelog:", "\n" + data);
			});
		},
		
		getSite: function(){
			if(window.location.protocol == "file:"){
				
			};
			return window.location.protocol + "//" + window.location.host;
		},
	},
		
	// mode specific code goes here:
	mode: {
		get: function(){
			var mode = JojoLib.core.getURLParam('mode');
			if(mode == false){
				if(JojoLib._vars.core.getPageModeHasRun !== true){
					JojoLib.out.warn("URLCheck", "No mode specified. (this will set the page to render everything)");
					JojoLib._vars.core.getPageModeHasRun = true;
				}
				return "nomode";
			}
			if(mode !== "" || !mode){
				if(JojoLib._vars.core.getPageModeHasRun !== true){
					JojoLib.out.log('URLCheck', "Mode Found: " + mode);
					JojoLib._vars.core.getPageModeHasRun = true;
				}
				return mode;
			}
		},
	},
	
	error: {
		undefinedError: function(name, message){
			this.name = "[JojoLib_Undefined_Error] " + name;
			this.message = message || "No message given.";
			this.description = message || "No message given.";
		},
	},
	
	youtube: {
		load: function(where){
			if(typeof where !== 'undefined'){
				JojoLib.core.loadLibrary("youtube", where);
			}
			else{
				JojoLib.core.loadLibrary("youtube", JojoLib._core.getSite() + JojoLib.settings.javascriptFolder + 'youtube.js');
			}
		},
	},
	
	twitch: {
		load: function(where){
			if(typeof where !== 'undefined'){
				JojoLib.core.loadLibrary("twitch", where);
			}
			else{
				JojoLib.core.loadLibrary("twitch", JojoLib._core.getSite() + JojoLib.settings.javascriptFolder + "twitch.js");
			}
		},
	},
	
	thirdParty: {
		fixes: function(){
			$(document).ready(function(){
				json = JojoLib.settings.fixes;
				JojoLib.out.debug("ThirdPartyFixes", "fa: " + json.fa);
				JojoLib.out.debug("ThirdPartyFixes", "cse: " + json.cse);
				JojoLib.out.debug("ThirdPartyFixes", "cseToBootstrap: " + json.cseToBootstrap);
				JojoLib.out.debug("ThirdPartyFixes", "twitterWidth: " + json.twitterWidth);
				JojoLib.out.debug("ThirdPartyFixes", "bootstrapWidth: " + json.bootstrapWidth);
				if(json.fa || json.cse || json.cseToBootstrap || json.twitterWidth || json.bootstrapWidth){
					$('head').append('<style id="JojoLib-Fixes"></style>');
				}
				
				if(json.fa){
					// FontAwesome in navbar alignment fix:
					$('#JojoLib-Fixes').append(".NAVFA.fa{\n\tmargin-top: -5px; \n\tmargin-bottom: -5px; \n\tmargin-left: -15px; \n\tmargin-right: -15px;\n}\n\n");
				}

				if(json.cse){
					// google cse coloring (transparent BG): 
					$('#JojoLib-Fixes').append(".cse .gsc-control-cse, .gsc-control-cse{\n\tbackground-color: transparent !important; \n\tborder: transparent !important;\n}\n\n");
				}

				if(json.cseToBootstrap){
					// google cse to bootstrap: 
					$('#JojoLib-Fixes').append(".gsc-input{\n\tbackground-image: none !important;\n}\n\ntd.gsc-input{\n\tpadding-right: 0px !important;\n}\n\n");
					setTimeout(function(){
						$('form.gsc-search-box').addClass('navbar-form');
						$('table.gsc-search-box').addClass("input-group");
						$('input.gsc-input').toggleClass('form-control gsc-input').css("margin-up", "-10px").css("margin-down", "-10px");
						$('input.gsc-search-button').toggleClass("btn btn-default gsc-search-button").css("margin-up", "-10px").css("margin-down", "-10px");
						$('td.gsc-search-button').addClass("input-group-btn");
						$('td.gsc-clear-button').remove();
						setTimeout(function(){
							$('#GOOGLESEARCH').fadeIn();
						}, 50);
					}, 1000);
				}

				if(json.twitterWidth){
					// twitter width can be more than 350px: 
					$('#JojoLib-Fixes').append("#twitter-widget-0{\n\twidth: 100% !important;\n}\n\n");
				}
				
				if(json.bootstrapWidth){
					// weird bootstrap width fix
					$('#JojoLib-Fixes').append("div.row{\n\twidth: 100% !important;\n}\n\n");
				}
			});
		},
		
		loadCSE: function(CSEID /* XXXX:YYYY */){
			if(typeof CSEID === 'undefined'){
				throw JojoLib.error.undefinedError("No CSEID Given", "You need to add your custom search ID to the function");
			}
			else{
				JojoLib.out.log("Google Custom Search", "Loading with id: " + CSEID);
				var cx = CSEID;
				var gcse = document.createElement('script');
				gcse.type = 'text/javascript';
				gcse.async = true;
				gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//www.google.com/cse/cse.js?cx=' + cx;
				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(gcse, s);
				JojoLib.out.log("Google Custom Search", "Loaded");
			}
		},
		
		loadAnalytics: function(TrackingCode /* UA-XXXX-Y */, siteName){
			JojoLib.out.log("Google Analytics", "Loading with TC: " + TrackingCode + ", & site: " + siteName);
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','http://www.google-analytics.com/analytics.js','ga');
			ga('create', TrackingCode, siteName);
			ga('send', 'pageview');
			JojoLib.out.log("Google Analytics", "Loaded");
		},
	},
	
	_vars: {
		version: "0.5.0",
		loadedLibrary: [],
		core: {
			getPageModeHasRun: false,
		},
	},
	settings: {
		// from siteRoot: e.g. if your JojoLib.js is in http://sub.domain.com/js/ you set this to /js/
		javascriptFolder: "/js/",
		
		version: {
			versionCheck: true,
			showChangelog: true,
			isDEV: false,
			isCUSTOM: false,
		},
		
		fixes: {
			fa: true,
			cse: true,
			cseToBootstrap: true,
			twitterWidth: true,
			bootstrapWidth: true,
		},
		
		debug: false,
	},
};

JojoLib._postInit();