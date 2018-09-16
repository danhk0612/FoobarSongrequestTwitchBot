var request = require('request');
var fs = require('fs');

fs.readFile('twitchbot-data.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
		var obj = JSON.parse(data);
		var twitchbot = require('./twitchbot.js');
	}
});