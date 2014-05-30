/*==================================================*\
||  Licensed Under LGPL v3                          ||
||  This Library requires jQuery & bootstrap        ||
||  Untested in IE                                  ||
||  Source: https://Github.com/JojoXD/JojoLib-js    ||
\*==================================================*/
console.log("[JojoLib] [INIT]: Started");
var JojoLib = {
	postInit: function(){
		// Define Errors
		JojoLib.error.undefinedError.prototype = new Error();
		JojoLib.error.undefinedError.prototype.constructor = JojoLib.error.undefinedError;
		
		// postinit variables
		
		JojoLib.out.log("PostInit", "Complete");
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
		
		debug: function(text){
			if(JojoLib.vars.debug){
				JojoLib.out.log("DEBUG", text);
			}
		},
		
		documentAppend: function(where, what){
			$(where).append(what);
		},
		documentOverwrite: function(where, what){
			$(where).html(what);
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
					JojoLib.out.warn("core - URLCheck", "No mode specified. (this will set the page to render everything)");
					JojoLib.vars.core.getPageModeHasRun = true;
				}
				return "nomode";
			}
			if(mode !== "" || !mode){
				if(JojoLib.vars.core.getPageModeHasRun !== true){
					JojoLib.out.log('core - URLCheck', "Mode Found: " + mode);
					JojoLib.vars.core.getPageModeHasRun = true;
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
	
	twitch: {
		getStreamerFromURL: function(){
			ret = JojoLib.core.getURLParam('streamer');
			return ret;
		},
		
		frontpage: function(names, tableDIV, tableID, imageDIV, imageID){
			JojoLib.out.log("TwitchFP", "Render starting");
			for(index = 0; index < names.length; index++){
				$.getJSON("https://api.twitch.tv/kraken/streams/" + names[index] + "/?callback=?", function(json){
					if(json.stream !== null){
						// the streamer is live
						JojoLib.out.debug(json.stream.channel.display_name + " is live");
						
						// null checks
						if(json.stream.channel.game == null){
							json.stream.channel.game = "";
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
		},
		
		player: function(who, where){
			var columns = JojoLib.twitch.getPlayerCol()[0];
			var render = JojoLib.twitch.getPlayerCol()[1];
			var streamer = who;
			JojoLib.out.debug("who: " + who + " --> " + streamer); JojoLib.out.debug("col: " + columns); JojoLib.out.debug("where: " + where);
			if(!streamer){
				throw new JojoLib.error.UndefinedError("twitch/player", "you need to specify a streamer in the URL (?streamer=Jojo_XD2)");
				return false;
			}
			// main jQuery code
			$('#' + where).append("<div id='playerChatRow' class='row'></div>");
			$('#playerChatRow').append("<div id='player' class='" + columns + "' style='display: none'></div>");
			$('#player').append('<object type="application/x-shockwave-flash" height="500px" width="100%" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel=' + streamer + '" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel=' + streamer + '&auto_play=true&start_volume=25" /></object>');
			$('#player').fadeIn(2000);
			$('#playerChatRow').append("<span id='TTVchat'></span>");
		},
		
		chat: function(who, where){
			var col = JojoLib.twitch.getChatCol();
			JojoLib.out.todo("add chat code here");
		},
		
		render: function(who, where){
			$(document).ready(function(){
				JojoLib.out.debug("Document ready!");
				JojoLib.twitch.player(who, where);
				JojoLib.twitch.chat(who, where);
			});
		},
		
		// getChatCol[0] == column, getChatCol[1] == render
		getChatCol: function(){
			var mode = JojoLib.core.getPageMode().toLowerCase();
			var col = null;
			var render = null;
			if(mode == "playeronly"){
				col = "1";
				render = false;
			}
			else if(mode == "chatonly"){
				col = "3";
				render = true;
			}
			else if(mode == "playerchat" || !mode || mode == "nomode"){
				col = "2";
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
	
	// variables:
	vars: {
		core: {
			getPageModeHasRun: false,
		},
		
		debug: false,
		
		twitch: {
			fprenderHasRun: false,
		},
	},
};
console.log("[JojoLib] [INIT]: done");
JojoLib.postInit();