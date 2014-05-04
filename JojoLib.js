// Licensed Under LGPL v3 //

function TwitchTVReader(names){
	var obj = jQuery.parseJSON('{"name": {"life": "{life}","logo": "{logo}","status": "{status}","preview": "{preview}","url": "{url}"}}');
	for ( index = 0; index < names.length; ++index ){
		$.getJSON("https://api.twitch.tv/kraken/streams/" + names[index] + "/?callback=?", function(json) {
			if(json.stream !== null){
				// The Streamer queried is life
				todo('add processing');
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