## Usage

This library uses JSON to set the functions, so it's really easy to use.
This Library uses jQuery!

logging using library:
```javascript
JojoLib.out.log("prefix", "message");
```
same goes for warn and todo.

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

just call render to add to screen:
```javascript
JojoLib.twitch.render("who", "where(id)");
```

==========
### Youtube

if you want to add a youtube player to your website, you can do this: 
```javascript
JojoLib.youtube.player({width: "auto", height: 360, UvID: "unique video ID"}, "the ID where it needs to be placed");
```

for a playlist, you add an entry for it in the JSON, like so: 
```javascript
JojoLib.youtube.player({width: "auto", height: 360, UvID: "unique video ID", UpID: "the playlist ID"}, "the ID where it needs to be placed");
```

playlist might be broken because it is untedted.  
width or height can be auto. NOT BOTH!  
you can also add an autoplay entry (not required).  

==========
### Debug Mode

to get in debug mode, set JojoLib.vars.debug to true at the beginning of your code:
```javascript
JojoLib.vars.debug = true;
```
debug mode will view a lot of variables, so it can slow down the page loading a bit.  
please use only for setsion purposes

==========
### version check

version check runs automatically, you can disable it with:
```javascript
JojoLib.vars.version.versionCheck = false;
```

you can do the same for the changelog:
```javascript
JojoLib.vars.version.showChangelog = false;
```

