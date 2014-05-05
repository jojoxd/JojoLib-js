<?
	header("Content-type: application/x-javascript")
	
	$modules = explode("," $_GET['modules']);
	
	if(preg_match("debug", $_GET['modules'])){
		// set debug to true and considering debug mode
		$debug = true;
	}
	else{
		// set debug to false, and not considering debug
		$debug = false;
	}
	
	foreach($modules as $module){
		$moduleLowerCase = strtolower($module);
		if($moduleLowerCase == "twitchplayer"){
			// Load all twitch player dependencies;
			if($debug){
				// load debugged twitch player dependencies
				echo file_get_contents("./modules/twitchPlayer_dbg.js");
			}
			else{
				// load all twitch player dependencies, non-debugged
				echo file_get_contents("./modules/twitchPlayer.js");
			}
		}
		if($moduleLowerCase == "twitchindex"){
			// load all twitch index dependencies;
			if($debug){
				// load debugged twitch index dependencies
				echo file_get_contents("./modules/twitchIndex_dbg.js");
			}
			else{
				// load all twitch index dependencies, non-debugged
				echo file_get_contents("./modules/twitchIndex.js");
			}
			
		}
	}