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
###[WIP]Twitch

just call render to add to screen:
```javascript
JojoLib.twitch.render();
```
