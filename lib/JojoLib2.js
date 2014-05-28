// JojoLib
// 		postInit
//		out
//			log
//			warn
//			todo
//			documentAppend
//			documentOverwrite
//
//		core
//			getURLParam
//			getPageMode
//
//		error
//			UndefinedError
//
//		twitch
//			getStreamerFromURL
//			player
//			chat
//			render

var JojoLib = {
	postInit: function(){
		// Define Errors
		JojoLib.error.undefinedError.prototype = new Error();
		JojoLib.error.undefinedError.prototype.constructor = JojoLib.error.undefinedError;
		
		// postinit variables
		JojoLib.vars.mode = JojoLib.core.getPageMode();
	},
	
	// new helper
	out: {
		log: function(prefix, text){
			console.log("[JojoLib] [" + prefix + "] :" + text);
		},
		
		warn: function(prefix, text){
			console.warn("[JojoLib] [" + prefix + "] :" + text);
		},
		
		todo: function(text){
			console.log("[JojoLib] [TODO]: " + text);
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
			return JojoLib.core.getURLParameter('streamer');
		},
		
		player: function(who, where){
			JojoLib.out.todo("add player code here");
		},
		
		chat: function(who, where){
			JojoLib.out.todo("add chat code here");
		},
		
		render: function(who, where){
			JojoLib.twitch.player(who, where);
			JojoLib.twitch.chat(who, where);
		},
		
		setChatCol: function(){
			JojoLib.out.todo("setchatcol: add column select using mode");
		},
		
		setPlayerCol: function(){
			JojoLib.out.todo("setplayercol: add column select using mode");
		},
	},
	
	// variables:
	vars: {
		core: {
			getPageModeHasRun: false,
		},
		mode: null,
	},
};

JojoLib.postInit();
JojoLib.out.log("This code runs :)");