## Usage

This library uses Javascript literal notation (not JSON) to set the functions, so it's really easy to use.  
This Library requires jQuery!

logging using library:
```javascript
JojoLib.out.log("prefix", "text");
JojoLib.out.log("text"); // no prefix
```
same goes for warn and todo.

==========
### Debug Mode

to get in debug mode, set JojoLib.vars.debug to true at the beginning of your code:
```javascript
JojoLib.settings.debug = true;
```

then, wherever you want to debug:
```javascript
JojoLib.out.debug("prefix", "text");
JojoLib.out.debug("text"); // no prefix
```
debug mode will view a lot of variables, so it can slow down the page loading a bit.  
please use only for testing purposes

==========

### Error logging
There's also an error helper, which you can call with:
```javascript
throw new JojoLib.error.undefinedError("error name", "error message");
```

==========

### Parameters from url (DOES NOT NEED TO BE PHP!)
```javascript
JojoLib.core.getURLParam("parameter to get value from");
```
It's that easy :)

==========
### Twitch

first of all, load the twitch libs:
```javascript
JojoLib.twitch.load("optional:path/to/JojoLib/lib/twitch.js");
```
this will fire an event called "twitchLoaded",
subscribe to this if you want to call any twitch function!
```javascript
$(document).on("twitchLoaded", function(){
	// render player + chat:
	JojoLib.twitch.render("who", "where(id)");
	
	// render player: 
	JojoLib.twitch.renderPlayer("who, where(id)");
	
	// render chat (also bttv):
	JojoLib.twitch.renderChat("who", "where(id)");
	
	// render a frontpage with your friends (who are streaming):
	var names = ["friend1", "friend2", "friend3"]; // uncapitalized
	JojoLib.twitch.frontpage(names, "id of table to append to", "id the generated content needs to have (as in <this>names[x])", "the id of the div for images", "id the generated content needs to have(as in <this>names[x])", "the page to go to (as in <this>?streamer=names[x])");
});
```

DEPRECATED (pre 0.3-ish):
just call render to add to screen:
```javascript
JojoLib.twitch.render("who", "where(id)");
```

==========
### Youtube

first of all, load the module: 
```javascript
JojoLib.youtube.load("https://path/to/youtube.js");
// OR
JojoLib.youtube.load("../relative/path/to/youtube.js");
// OR (if your JojoLib.js, youtube.js etc are in http://sub.yoursite.com/js/) (if you have it in a different directory, adjust JojoLib.settings.javascriptFolder to /folder/fromSiteRoot/to/js/folder/)
JojoLib.youtube.load();
```
this will fire an event called "youtubeLoaded"
subscribe to this if you want to call any youtube functions!

to add a youtube player:
```javascript
$(document).on("youtubeLoaded", function(){
	JojoLib.youtube.player({width: "auto", height: 360, UvID: "unique video id"}, "the ID where it needs to be placed");
});
```
to add a youtube playlist you remove UvID and add UpID, with the corresponding Unique Playlist ID:
```javascript
$(document).on("youtubeLoaded", function(){
	JojoLib.youtube.player({width: "auto", height: 360, UpID: "unique playlist id"}, "the ID where it needs to be placed");
});
```

width or height can be auto. NOT BOTH!  
you can also add an autoplay entry (not required).

DEPRECATED (pre 0.3-ish):
if you want to add a youtube player to your website, you can do this: 
```javascript
JojoLib.youtube.player({width: "auto", height: 360, UvID: "unique video ID"}, "the ID where it needs to be placed");
```

for a playlist, you add an entry for it in the JSON, like so: 
```javascript
JojoLib.youtube.player({width: "auto", height: 360, UpID: "the playlist ID"}, "the ID where it needs to be placed");
```

==========
### version check

version check runs automatically, you can disable it with:
```javascript
JojoLib.settings.version.versionCheck = false;
```

you can do the same for the changelog:
```javascript
JojoLib.settings.version.showChangelog = false;
```

==========
### Third party fixes

These fixes will automatically run, but you can manipulate them by putting this line in your code: 
```javascript
JojoLib.vars.fixes = {fa: true, cse: true, cseToBootstrap: true, twitterWidth: true, bootstrapWidth: true,};
```

==========
### ExtraTools: 

load ExtraTools as if you load any other library