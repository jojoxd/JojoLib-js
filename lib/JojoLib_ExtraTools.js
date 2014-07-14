var extraTools = {
	init: function(){
		// add Extra Tools to JojoLib.extraTools.
		JojoLib.extraTools = {
			changeTitle: function(title){
				if(JojoLib.settings.showTitleChange){
					JojoLib.out.debug("Title", "changed title to: " + title, "JojoLib ExtraTools");
				}
				$('head title').html(title);
			},
		};
		
		// add settings for Extra Tools
		JojoLib.settings.extraTools = {
			showTitleChange: false,
		};
		
		// load postinit
		extraTools._postInit();
	},
	
	_postInit: function(){
		JojoLib.out.log("Extra Tools", "Extra tools is now available!");
	},
};