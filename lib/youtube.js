var youtube = {
	init: function(){
		JojoLib.out.log("INIT", "Started", "Youtube");
		JojoLib.youtube = youtube._youtube;
		youtube._postinit();
	},
	
	_postinit: function(){
		JojoLib.out.log("INIT", "Done", "Youtube");
		JojoLib.out.log("POSTINIT", "Started", "Youtube");
		
		var evt = document.createEvent('CustomEvent');
		evt.initCustomEvent('youtubeLoaded', true, false, null);
		JojoLib.out.log("POSTINIT", "Event created", "Youtube");
		document.dispatchEvent(evt);
		
		JojoLib.out.log("POSTINIT", "Done", "Youtube");
	},
	
	_youtube: {
		// whatArr = JSON = {width: xxx||"auto", height: xxx||"auto", UvID||UpID: "unique video or playlist id", options:{autoplay: true||false, loop: true||false, modestBranding: true||false,},}
		player: function(whatArr, where){
			if(whatArr.options){
				JojoLib.out.debug("YT - Options Found");
				var options = "";
				// decide if the link needs ? or &
				if(whatArr.UvID){
					// link is video
					options += "?";
				}
				
				else if(whatArr.UpID){
					// link is playlist
					options += "&";
				}
				
				if(whatArr.options.autoplay){
					options += "autoplay=1";
				}
				if(whatArr.options.loop){
					if(whatArr.options.autoplay){options += "&";} // if autoplay add &
					options += "loop=1";
				}
				if(whatArr.options.modestBranding){
					if(whatArr.options.autoplay || whatArr.options.loop){options += "&";} // if autoplay or loop add &
					options += "modestbranding=1";
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
};