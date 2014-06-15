/*==================================================*\
||  Licensed Under LGPL v3                          ||
||  This Library requires jQuery & bootstrap        ||
||  Untested in IE                                  ||
||  Source: https://Github.com/JojoXD/JojoLib-js    ||
\*==================================================*/
console.log("[JojoLib] [INIT]: Started");
var foo = new Date();

if(typeof jQuery === 'undefined'){console.warn("JojoLib needs jQuery to function properly.");}

var JojoLib = {
	postInit: function(){
		
		// calculate how quick init was:
		var bar = new Date();
		var diff = bar - foo;
		JojoLib.out.log('INIT', 'Completed after ' + diff + " ms");
		
		// Version Check:
		JojoLib._core.versionCheck();
		
		// Define Errors:
		JojoLib.error.undefinedError.prototype = new Error();
		JojoLib.error.undefinedError.prototype.constructor = JojoLib.error.undefinedError;
		
		// fixes & stuff: 
		JojoLib.thirdParty.fixes();
		
		// postinit variables:
		
		JojoLib.out.log("POSTINIT", "Complete");
	},
	
	out: {
		log: function(prefix, text){
			console.log("[JojoLib] [" + prefix + "]: " + text);
		},
		
		warn: function(prefix, text){
			console.warn("[JojoLib] [" + prefix + "]: " + text);
		},
		
		todo: function(text){
			console.log("[JojoLib] [TODO]: " + text);
		},
		
		// will only show if JojoLib.vars.debug is set to true
		debug: function(text){
			if(JojoLib.vars.debug){
				JojoLib.out.log("DEBUG", text);
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
		
		getPageMode: function(){
			var mode = JojoLib.core.getURLParam('mode');
			if(mode == false){
				if(JojoLib.vars.core.getPageModeHasRun !== true){
					JojoLib.out.warn("URLCheck", "No mode specified. (this will set the page to render everything)");
					JojoLib.vars.core.getPageModeHasRun = true;
				}
				return "nomode";
			}
			if(mode !== "" || !mode){
				if(JojoLib.vars.core.getPageModeHasRun !== true){
					JojoLib.out.log('URLCheck', "Mode Found: " + mode);
					JojoLib.vars.core.getPageModeHasRun = true;
				}
				return mode;
			}
		},
	},
	
	_core: {
		versionCheck: function(){
			$(document).ready(function(){
				if(JojoLib.vars.version.versionCheck){
					JojoLib.out.log("VersionCheck", "Started");
					var renderChangelog = false;
					var str = "";
					var thisVersion = JojoLib.vars.version._version.split('.');
					
					$.get('http://jojoxd.nl/JojoLib/newestVersion.php', function(data){
						var version = data.split('.');
						if(Number(version[0]) <= Number(thisVersion[0])){str += "Major "}else{renderChangelog = true;} // convert string to number for comparison
						if(Number(version[1]) <= Number(thisVersion[1])){str += "Minor "}else{renderChangelog = true;}
						if(Number(version[2]) <= Number(thisVersion[2])){str += "Maintainance"}else{renderChangelog = true;}
						JojoLib.out.debug(str);
						if(renderChangelog){
							JojoLib.out.log("VersionCheck", "There's a new version available: " + data + ", you are running version " + JojoLib.vars.version._version);
							if(JojoLib.vars.showChangelog){
								JojoLib._core.changelog();
							}
						}
						else{
							JojoLib.out.log("Version Checker", "You are up to date (v" + JojoLib.vars.version._version + ")");
						}
					});
				}
				else{
					JojoLib.out.log("VersionCheck", "Disabled");
				}
			});
		},
		
		changelog: function(){
			$.get('http://jojoxd.nl/JojoLib/changeLog.php', function(data){
				JojoLib.out.log("Changelog:", "\n" + data);
			});
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
		// whatArr = JSON = {width: xxx||"auto", height: xxx||"auto", UvID||UpID: "unique video or playlist id", options:{autoplay: true||false, loop: true||false, modestBranding: true||false,},}
		player: function(whatArr, where){
			if(whatArr.options){
				JojoLib.out.debug("YT - Options Found");
				var options = "";
				// decide if the link needs ? or &
				if(whatArr.UvID){
					// link is video
					options += "?";
					JojoLib.out.debug(options);
				}
				else if(whatArr.UpID){
					// link is playlist
					options += "&";
					JojoLib.out.debug(options);
				}
				
				if(whatArr.options.autoplay){
					options += "autoplay=1";
					JojoLib.out.debug(options);
				}
				if(whatArr.options.loop){
					if(whatArr.options.autoplay){options += "&";} // if autoplay add &
					options += "loop=1";
					JojoLib.out.debug(options);
				}
				if(whatArr.options.modestBranding){
					if(whatArr.options.autoplay || whatArr.options.loop){options += "&";} // if autoplay or loop add &
					options += "modestbranding=1";
					JojoLib.out.debug(options);
				}
				JojoLib.out.debug(options);
			}
			
			$(document).ready(function(){
				if(whatArr.width == "auto" && typeof(Number(whatArr.height)) == "number"){
					whatArr.width = whatArr.height * 16 / 9;
					JojoLib.out.debug("YT - Auto width : " + whatArr.width);
				}
				else if(whatArr.height == "auto" && typeof(Number(whatArr.width)) == "number"){
					whatArr.height = whatArr.width / 16 * 9;
					JojoLib.out.debug("YT - Auto height : " + whatArr.height);
				}
				
				JojoLib.out.debug("width: " + whatArr.width + " | height: " + whatArr.height);
				
				if(whatArr.UpID){
					JojoLib.out.debug("UpID: " + whatArr.UpID);
					// playlist
					// note: using youtube-nocookie.com does not currently work with playlists (as of 2nd June 2014) bug me when it works again: https://twitter.com/JojoXD_
					JojoLib.out.documentAppend(where, '<iframe width="'+ whatArr.width +'" height="' + whatArr.height + '" src="http://www.youtube.com/embed/videolist?list=' + whatArr.UpID + options + '" frameborder="0" allowfullscreen></iframe>');
				}
				else{
					// video
					JojoLib.out.debug("UvID: " + whatArr.UvID);
					JojoLib.out.documentAppend(where, '<iframe width="' + whatArr.width + '" height="' + whatArr.height + '" src="http://www.youtube-nocookie.com/embed/' + whatArr.UvID + options + '" frameborder="0" allowfullscreen></iframe>');
				}
			});
		},
	},
	
	twitch: {
		getStreamerFromURL: function(){
			ret = JojoLib.core.getURLParam('streamer');
			return ret;
		},
		
		frontpage: function(names, tableDIV, tableID, imageDIV, imageID){
			$(document).ready(function(){
				JojoLib.out.log("TwitchFP", "Render starting");
				for(index = 0; index < names.length; index++){
					$.getJSON("https://api.twitch.tv/kraken/streams/" + names[index] + "/?callback=?", function(json){
						if(json.stream !== null){
							// the streamer is live
							JojoLib.out.debug(json.stream.channel.display_name + " is live");
							
							// null checks
							if(json.stream.channel.game == null){
								json.stream.channel.game = ""; // still looks better than 'undefined'
							}
							if(json.stream.channel.status == null){
								json.stream.channel.status = "";
							}
							
							// render code
							$('#' + tableDIV).append("<tr id='"+ tableID + json.stream.channel.name + "_' style='display: none;'><td><a href='./player.php?streamer=" + json.stream.channel.name + "' title='Watch " + json.stream.channel.display_name + " Live!'>" + json.stream.channel.display_name + "</td><td>" + json.stream.channel.status + "</td><td>" + json.stream.channel.game + "</td></tr>");
							$('#'+ tableID + json.stream.channel.name + '_').fadeIn();
							$('#' + imageDIV).append("<div class='col-xs-12 col-sm-12 col-md-4 col-lg-4' id='"+ imageID + json.stream.channel.name + "_' style='text-align: center; display: none;'><div class='panel panel-default'><div class='panel-heading'><a href='./player.php?streamer=" + json.stream.channel.name + "'><h3 class='panel-title'>" + json.stream.channel.display_name + "</h3></a></div><div class='panel-body'><a href='./player.php?streamer=" + json.stream.channel.name + "'><img src='" + json.stream.preview.large + "' style='width: 100%; height: auto; text-align: center;'></a></div></div></div>");
							$('#'+ imageID + json.stream.channel.name + '_').fadeIn();
						}
						else{
							// the streamer is not live
							if(JojoLib.vars.debug){
								var thisname = json._links.self;
								var thisname = thisname.split('/');
								JojoLib.out.debug(thisname[5] + " is not live");
							}
						}
						// every time do:
					});
				}
				// on completion (note: this for loop runs in async, so this will probably run before everything is done.) do:
			});
		},
		
		_player: function(who, where){
			var columns = JojoLib.twitch.getPlayerCol()[0];
			var render = JojoLib.twitch.getPlayerCol()[1];
			var streamer = who;
			JojoLib.out.debug("PLAYER: who: " + who + " --> " + streamer); JojoLib.out.debug("PLAYER: col: " + columns); JojoLib.out.debug("PLAYER: where: " + where);
			if(!streamer){
				throw new JojoLib.error.UndefinedError("twitch/player", "you need to specify a streamer in the URL (?streamer=Jojo_XD2)");
				return false;
			}
			if(render){
				// main jQuery code
				$('#' + where).append("<div id='playerChatRow' class='row'></div>");
				$('#playerChatRow').append("<div id='player' class='" + columns + "' style='display: none'></div>");
				$('#player').append('<object type="application/x-shockwave-flash" height="500px" width="100%" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel=' + streamer + '" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel=' + streamer + '&auto_play=true&start_volume=25" /></object>');
				$('#player').fadeIn(2000);
				$('#playerChatRow').append("<span id='TTVchat'></span>");
			}
			else{
			}
		},
		
		_chat: function(who, where){
			var columns = JojoLib.twitch.getChatCol()[0];
			var render = JojoLib.twitch.getChatCol()[1];
			var mode = JojoLib.twitch.getChatCol()[2];
			var streamer = who;
			JojoLib.out.debug("CHAT: who " + who + " --> " + streamer); JojoLib.out.debug("CHAT: col: " + columns); JojoLib.out.debug("CHAT: where: " + where);
			
			if(!streamer){
				throw new JojoLib.error.UndefinedError("twitch/chat", "you need to specify a streamer in the URL (?streamer=Jojo_XD2)");
			}
			if(render){
				if(mode == 'chatonly'){
					// the mode is chatonly, so add a new div.row
					$('#' + where).append('<div id="chatRow" class="row" style="display: none"></div>');
					$('#chatRow').append('<div id="chatCol" class="' + columns + '"></div>');
					$('#chatCol').append('<iframe frameborder="0" height="500px" width="100%" scrolling="no" id="chat_embed" src="http://twitch.tv/chat/embed?channel=' + streamer + '&popout_chat=true" style="min-width: 336px;"></iframe>');
					$('#chatRow').fadeIn(5000);
					return;
				}
				else{
					// the mode is playerchat, or undefined
					$('#TTVchat').append('<div id="chatCol" class="' + columns + '"  style="display: none"></div>');
					$('#chatCol').append('<iframe frameborder="0" height="500px" width="100%" scrolling="no" id="chat_embed" src="http://twitch.tv/chat/embed?channel=' + streamer + '&popout_chat=true" style="min-width: 336px;"></iframe>');
					$('#chatCol').fadeIn(5000);
					return;
				}
				// the mode is playeronly
				return false;
			}
		},
		
		renderChat: function(who, where){
			$(document).ready(function(){
				JojoLib.twitch._chat(who, where);
			});
		},
		
		renderPlayer: function(who, where){
			$(document).ready(function(){
				JojoLib.twitch._player(who, where);
			});
		},
		
		render: function(who, where){
			$(document).ready(function(){
				JojoLib.out.debug("Document ready!");
				JojoLib.twitch._player(who, where);
				JojoLib.twitch._chat(who, where);
			});
		},
		
		// getChatCol[0] == column, getChatCol[1] == render
		getChatCol: function(){
			var mode = JojoLib.core.getPageMode().toLowerCase();
			var col = null;
			var render = null;
			if(mode == "playeronly"){
				col = "";
				render = false;
			}
			else if(mode == "chatonly"){
				col = "col-xs-12 col-sm-12 col-md-12 col-lg-12";
				render = true;
			}
			else if(mode == "playerchat" || !mode || mode == "nomode"){
				col = "col-xs-12 col-sm-12 col-md-4 col-lg-4";
				render = true;
			}
			var ret = [col, render, mode];
			return ret;
		},
		
		getPlayerCol: function(){
			var mode = JojoLib.core.getPageMode().toLowerCase();
			var col = null;
			var render = null;
			if(mode == "playeronly"){
				col = "col-xs-12 col-sm-12 col-md-12 col-lg-12";
				render = true;
			}
			else if(mode == "chatonly"){
				col = "";
				render = false;
			}
			else if(mode == "playerchat" || !mode || mode == "nomode"){
				col = "col-xs-12 col-sm-12 col-md-8 col-lg-8";
				render = true;
			}
			var ret = [col, render, mode];
			return ret;
		},
	},
	
	// json contains: {fa: [true|false], cse: [true|false], cseToBootstrap: [true|false], twitterWidth: [true|false], bootstrapWidth: [true|false]}
	thirdParty: {
		fixes: function(){
			$(document).ready(function(){
				json = JojoLib.vars.fixes;
				if(json.fa){
					// FontAwesome in navbar alignment fix:
					$('head').append("<style>.NAVFA.fa{margin-top: -5px; margin-bottom: -5px; margin-left: -15px; margin-right: -15px;}</style>");
				}

				if(json.cse){
					// google cse coloring (transparent BG): 
					$('head').append("<style>.cse .gsc-control-cse, .gsc-control-cse{background-color: transparent !important; border: transparent !important;}</style>");
				}

				if(json.cseToBootstrap){
					// google cse to bootstrap: 
					$('head').append("<style>.gsc-input{background-image: none !important;} td.gsc-input{padding-right: 0px !important;}</style>");
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
					$('head').append("<style>#twitter-widget-0{width: 100% !important;}</style>");
				}

				if(json.bootstrapWidth){
					// weird bootstrap width fix
					$('head').append("<style>div.row{width: 100% !important;}</style>");
				}
			});
		},
		
		loadCSE: function(CSEID /* XXXX:YYYY */){
			if(typeof CSEID === 'undefined'){
				throw JojoLib.error.undefinedError("No CSEID Given", "You need to add your custom search ID to the function")
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
	
	// variables:
	vars: {
		core: {
			getPageModeHasRun: false,
		},
		
		fixes: {
			fa: true,
			cse: true,
			cseToBootstrap: true,
			twitterWidth: true,
			bootstrapWidth: true,
		},
		
		version: {
			_version: "0.3.0",
			versionCheck: true,
			showChangelog: true,
		},
		
		debug: false,
	},
};
JojoLib.postInit();