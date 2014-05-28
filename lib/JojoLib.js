//          Licensed Under LGPL v3          //
// This Library requires Jquery & Bootstrap //
//              Untested in IE              //


// define modules == functions:
// Core  == log, todo, getUrlParameter, JojoLib_UndefinedError, getPageMode
// TTV   == TwitchTVReader, TwitchTVPlayer, TwitchTVChat, getStreamerFromUrl dependency: Core

function TwitchTVReader(names, tableDIV, tableID, imageDIV, imageID){
	var obj = jQuery.parseJSON('{"name": {"life": "{life}","logo": "{logo}","status": "{status}","preview": "{preview}","url": "{url}"}}');
	for ( index = 0; index < names.length; ++index ){
		$.getJSON("https://api.twitch.tv/kraken/streams/" + names[index] + "/?callback=?", function(json) {
			if(json.stream !== null){
				// The Streamer queried is life
				
				// null check
				if(json.stream.channel.game == "null"){
					json.stream.channel.game = "";
				}
				
				if(json.stream.channel.status == "null"){
					json.stream.channel.status = "";
				}
				
				$('#' + tableDIV).append("<tr id='"+ tableID + json.stream.channel.name + "_' style='display: none;'><td><a href='./player.php?streamer=" + json.stream.channel.name + "' title='Watch " + json.stream.channel.display_name + " Live!'>" + json.stream.channel.display_name + "</td><td>" + json.stream.channel.status + "</td><td>" + json.stream.channel.game + "</td></tr>");
				$('#'+ tableID + json.stream.channel.name + '_').fadeIn();
				//$('#imgdiv_').append("<div class='col-xs-12 col-sm-12 col-md-4 col-lg-4' style='text-align: center'><a href='./player.php?streamer=" + json.stream.channel.name + "'><br><img src='" + json.stream.preview.medium + "' style='width: 100%; height: auto; text-align: center;'><br>" + json.stream.channel.display_name + "</a></div>");
				$('#' + imageDIV).append("<div class='col-xs-12 col-sm-12 col-md-4 col-lg-4' id='"+ imageID + json.stream.channel.name + "_' style='text-align: center; display: none;'><div class='panel panel-default'><div class='panel-heading'><a href='./player.php?streamer=" + json.stream.channel.name + "'><h3 class='panel-title'>" + json.stream.channel.display_name + "</h3></a></div><div class='panel-body'><a href='./player.php?streamer=" + json.stream.channel.name + "'><img src='" + json.stream.preview.large + "' style='width: 100%; height: auto; text-align: center;'></a></div></div></div>");
				$('#'+ imageID + json.stream.channel.name + '_').fadeIn();
			}
			else{
				// The Streamer queried is offline
			}
			// every  time do:
			log("query for streamer complete [" + json.stream.channel.name + ", " + names[index] + " ]");
		});
	}
	// on completion do:
	log("TwitchTV query Complete.");
}

function todo(string){
	console.log("todo: " + string);
}

function log(string){
	console.log("log: " + string);
}

function getUrlParameter(ParmSearch){
    var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for(var i = 0; i < VariableArray.length; i++){
        var KeyValuePair = VariableArray[i].split('=');
        if(KeyValuePair[0] == ParmSearch){
            return KeyValuePair[1];
        }
    }
}

function getPageMode(){
	var mode = getUrlParameter('mode');
	if(mode !== "" || !mode ){
		log("[urlCheck] mode found: " + mode);
		return mode;
	}
	else{
		return "nomode";
	}
}

function getStreamerFromURL(){
	var streamer = getUrlParameter('streamer');
	if(streamer){
		log("[urlCheck] Streamer found");
		return streamer;
	}
	else{
		throw new JojoLib_Error("1", "Streamer not found in url");
		return false;
	}
}

// usage: throw new JojoLib_Error("Name", "Message");
function JojoLib_Error(name, message){
	this.name = "JojoLib_Error " + name;
	this.message = message || "no message given";     // Chrome, Firefox etc. (everything except IE because IE is shit #rantTimeWithJojoXD)
	this.description = message || "no message given"; // IE...
}
JojoLib_Error.prototype = new Error();
JojoLib_Error.prototype.constructor = JojoLib_Error;

function TwitchTVPlayer(streamer, where){
	var mode = getPageMode();
	var columns;
	if(streamer == false){
		return false;
	}
	
	if(mode == "playeronly"){
		// player only
		columns = "col-xs-12 col-sm-12 col-md-12 col-lg-12";
	}
	else if(mode =="chatonly"){
		//chat only
		log("[player] mode chat only, not adding player");
		return false;
	}
	else if(!mode || mode == "playerchat"){
		columns = "col-xs-12 col-sm-12 col-md-8 col-lg-8";
	}
	if(columns == ""){
		throw new JojoLib_Error("2", "something went wrong with the columns...");
		return;
	}
	
	// main jQuery code
	$('#' + where).append("<div id='playerChatRow' class='row'></div>");
	$('#playerChatRow').append("<div id='player' class='" + columns + "' style='display: none'></div>");
	$('#player').append('<object type="application/x-shockwave-flash" height="500px" width="100%" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel=' + streamer + '" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel=' + streamer + '&auto_play=true&start_volume=25" /></object>');
	$('#player').fadeIn(2000);
	$('#playerChatRow').append("<span id='TTVchat'></span>");
}

function TwitchTVChat(streamer, where){
	var mode = getPageMode();
	var columns;
	var chatOnly = false;
	
	if(mode == "chatonly"){
		// chat only
		columns = "col-xs-12 col-sm-12 col-md-12 col-lg-12";
		chatOnly = true;
	}
	else if(mode == "playeronly"){
		// player only
		log("[chat] mode player only, not adding chat");
		return false;
	}
	else if(!mode || mode == "playerchat"){
		columns = "col-xs-12 col-sm-12 col-md-4 col-lg-4";
		chatOnly = false;
	}
	// main jQuery code
	if(chatOnly == true){
		// chat Only
		$('#' + where).append('<div id="chatRow" class="row"></div>');
		log("1");
		$('#chatRow').append('<div id="chatCol" class="' + columns + '"></div>');
		$('#chatCol').append('<iframe frameborder="0" height="500px" width="100%" scrolling="no" id="chat_embed" src="http://twitch.tv/chat/embed?channel=' + streamer + '&popout_chat=true" style="min-width: 336px;"></iframe>');
	}
	else{
		log("2");
		// chat + player
		$('#TTVchat').append('<div id="chatCol" class="' + columns + '"  style="display: none"></div>');
		$('#chatCol').append('<iframe frameborder="0" height="500px" width="100%" scrolling="no" id="chat_embed" src="http://twitch.tv/chat/embed?channel=' + streamer + '&popout_chat=true" style="min-width: 336px;"></iframe>');
		$('#chatCol').fadeIn(5000);
	}
}

function TwitchTVRender(streamer, where){
	TwitchTVPlayer(streamer, where);
	TwitchTVChat(streamer, where);
}
