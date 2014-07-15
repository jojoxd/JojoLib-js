var twitch = {
	init: function(){
		JojoLib.out.log("INIT", "Started", "Twitch");
		JojoLib.twitch = twitch._twitch;
		
		twitch._postInit();
	},
	
	_postInit: function(){
		JojoLib.out.log("INIT", "Complete", "Twitch");
		JojoLib.out.log("POSTINIT", "Started", "Twitch");
		JojoLib.core.sendEvent('twitchLoaded');
		JojoLib.out.log("POSTINIT", "Complete", "Twitch");
	},
	
	_twitch: {
		getStreamerFromURL: function(){
			ret = JojoLib.core.getURLParam('streamer');
			return ret;
		},
		
		frontpage: function(names, tableDIV, tableID, imageDIV, imageID, playerPage){
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
							$('#' + tableDIV).append("<tr id='"+ tableID + json.stream.channel.name + "_' style='display: none;'><td><a href='" + playerPage + "?streamer=" + json.stream.channel.name + "' title='Watch " + json.stream.channel.display_name + " Live!'>" + json.stream.channel.display_name + "</td><td>" + json.stream.channel.status + "</td><td>" + json.stream.channel.game + "</td></tr>");
							$('#'+ tableID + json.stream.channel.name + '_').fadeIn();
							$('#' + imageDIV).append("<div class='col-xs-12 col-sm-12 col-md-4 col-lg-4' id='"+ imageID + json.stream.channel.name + "_' style='text-align: center; display: none;'><div class='panel panel-default'><div class='panel-heading'><a href='" + playerPage + "?streamer=" + json.stream.channel.name + "'><h3 class='panel-title'>" + json.stream.channel.display_name + "</h3></a></div><div class='panel-body'><a href='./player.php?streamer=" + json.stream.channel.name + "'><img src='" + json.stream.preview.large + "' style='width: 100%; height: auto; text-align: center;'></a></div></div></div>");
							$('#'+ imageID + json.stream.channel.name + '_').fadeIn();
						}
						else{
							// the streamer is not live
							if(JojoLib.settings.debug){
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
				throw new JojoLib.error.undefinedError("twitch/player", "you need to specify a streamer in the URL (?streamer=Jojo_XD2)");
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
			var mode = JojoLib.mode.get().toLowerCase();
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
			var mode = JojoLib.mode.get().toLowerCase();
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
};