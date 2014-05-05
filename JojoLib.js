//    Licensed Under LGPL v3    //
// This Library requires Jquery //

function TwitchTVReader(names, tableDIV, tableID, imageDIV, imageID){
	var obj = jQuery.parseJSON('{"name": {"life": "{life}","logo": "{logo}","status": "{status}","preview": "{preview}","url": "{url}"}}');
	for ( index = 0; index < names.length; ++index ){
		$.getJSON("https://api.twitch.tv/kraken/streams/" + names[index] + "/?callback=?", function(json) {
			if(json.stream !== null){
				// The Streamer queried is life
				
				$('#' + tableDIV).append("<tr id='"+ tableID + json.stream.channel.name + "_' style='display: none;'><td><a href='./player.php?streamer=" + json.stream.channel.name + "' title='Watch " + json.stream.channel.display_name + " Live!'>" + json.stream.channel.display_name + "</td><td>" + json.stream.channel.status + "</td><td>" + json.stream.channel.game + "</td></tr>");
				$('#'+ tableID + json.stream.channel.name + '_').fadeIn();
				//$('#imgdiv_').append("<div class='col-xs-12 col-sm-12 col-md-4 col-lg-4' style='text-align: center'><a href='./player.php?streamer=" + json.stream.channel.name + "'><br><img src='" + json.stream.preview.medium + "' style='width: 100%; height: auto; text-align: center;'><br>" + json.stream.channel.display_name + "</a></div>");
				$('#' + imageDIV).append("<div class='col-xs-12 col-sm-12 col-md-4 col-lg-4' id='"+ imageID + json.stream.channel.name + "_' style='text-align: center; display: none;'><div class='panel panel-default'><div class='panel-heading'><a href='./player.php?streamer=" + json.stream.channel.name + "'><h3 class='panel-title'>" + json.stream.channel.display_name + "</h3></a></div><div class='panel-body'><a href='./player.php?streamer=" + json.stream.channel.name + "'><img src='" + json.stream.preview.large + "' style='width: 100%; height: auto; text-align: center;'></a></div></div></div>");
				$('#'+ imageID + json.stream.channel.name + '_').fadeIn();
			}
			else{
				// The Streamer is offline
			}
		});
		// every time do:
	}
	// on completion do:
}

function todo(string){
	console.log("todo: " + string);
}

function log(string){
	console.log("log: " + string);
}

function GetUrlParameter(ParmSearch){
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
	var Parameter = GetUrlParameter('mode');
	log(Parameter);
	return Parameter;
	
}

function TwitchTVPlayer(streamer, where){
	var mode = getPageMode();
	$('#' + where).append("<div id='player_" + streamer.toLowerCase() + "' class='row'></div>");
	todo('add the player and chat options');
}