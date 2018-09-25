var TwitchbotUsername = "YOUR_BOT_NAME_HERE";
var TwitchbotPassword = "oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
var TwitchbotJoinChannel = "CHANNEL_NAME_TO_GO_TO";
var SongCooldown = 600;
var UserCooldown = 30;
var Managerid = "YOUR_ID";

var PingTxt = "!핑";
var CurrentSongTxt = "!지금노래";
var PrevSongTxt = "!이전곡";
var RequestTxt = "!노래신청";

var songIsInCoolDown = [];
var userIsInCoolDown = {};

var messageCounter = 0;
var maxMessagesPerSecond = 10;

var regExp = /[［.,\/#!！?？$%\^&\*;:{}｛｝=\-_`~～()（）\'\"］]/g;

var vipList = [
	"vipID1", "vipID2"
];

console.log(" > Running Server");
console.log(' ');

var http = require('http');
console.log(" > Loading User Data");
console.log(' ');
const fs = require('fs');
fs.readFile('twitchbot-data.json', 'utf8', function readFileCallback(err, data) {
	if (err) {
		console.log(err);
	} else {
		var obj = JSON.parse(data);
		TwitchbotUsername = obj.username;
		TwitchbotPassword = obj.password;
		TwitchbotJoinChannel = obj.joinChannel;
		SongCooldown = obj.songCooldown;
		UserCooldown = obj.userCooldown;
		Managerid = obj.managerId;
		PingTxt = obj.txtPing;
		CurrentSongTxt = obj.txtCurrentSong;
		PrevSongTxt = obj.txtPrevSong;
		RequestTxt = obj.txtRequest;
	}
});

console.log(" > Loading Foobar Playlist");
console.log(' ');
var songCurrent = ["", ""];
var songPrevious = ["", ""];
checkNowPlaying();
songPrevious = songCurrent;
var songs = [];
var playlistFromHttp;
var request = require("request");
request({
	url: "http://127.0.0.1:8888/playlistviewer/?param3=playlist.json",
	json: true
}, function (error, response, body) {
	if (!error && response.statusCode === 200) {
		playlistFromHttp = body;
	}
})

fs.unlink('./html/list.html', function (err) { });

function mainFunc() {
	setTimeout(function () {
		// format loaded songs	
		songs = songs.concat(playlistFromHttp.split("</br>"));
		for (var i = 0; i < songs.length; i++) {
			if (songs[i].indexOf('">') != -1) {
				songs[i] = songs[i].split('">')[1].replace(/[\'\"]/g, "");
				// console.log(songs[i]);
				fs.appendFile('./html/list.html', "\r\n <tr><th>" + i + " </th><td> " + songs[i] + "</td></tr>", 'utf8', function (err) { });
			}
		}

		// connect to twitch chat
		var tmi = require("tmi.js");
		var options = {
			options: {
				debug: true
			},
			connection: {
				cluster: "aws",
				reconnect: true
			},
			identity: {
				username: TwitchbotUsername,
				password: TwitchbotPassword
			},
			channels: [TwitchbotJoinChannel]
		}

		var client = new tmi.client(options);
		client.connect();
		client.on("chat", function (channel, user, message, self) { // on message
			if (self) return;
			var username = user["display-name"];
			var userid = user["username"];
			message = message.toLowerCase();

			var date = new Date();
			var year = date.getFullYear();
			var month = new String(date.getMonth() + 1);
			var day = new String(date.getDate());

			if (month.length == 1) {
				month = "0" + month;
			}
			if (day.length == 1) {
				day = "0" + day;
			}
			fs.appendFile('./chatlog/log_' + year + '' + month + '' + day + '.txt', "\r\n [" + userid + "(" + username + ")] " + message + " (" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ")", function (err) { });

			// COMMAND: !핑
			if (message.indexOf(PingTxt) == 0 && userid == Managerid) {
				sendMessage(client, channel, "퐁!");
				// COMMAND: !제목
			} else if (message.indexOf(CurrentSongTxt) == 0) {
				request({
					url: "http://127.0.0.1:8888/playlistviewer/?param3=nowPlaying.json",
					json: true
				}, function (error, response, body) {
					if (!error && response.statusCode === 200) {
						if (body.isPlaying == 1) {
							if (songCurrent[0] == "?") {
								sendMessage(client, channel, '현재 재생중: "' + songCurrent[1] + '"! @' + username);
							} else {
								sendMessage(client, channel, '현재 재생중: "' + songCurrent[1] + '" by ' + songCurrent[0] + '! @' + username);
							}
						} else {
							sendMessage(client, channel, "음악 재생중이 아닙니다. @" + username);
						}
					}
				})
				// COMMAND: !previoussong
			} else if (message.indexOf(PrevSongTxt) == 0) {
				if (songPrevious[0].length > 1 && songPrevious[1].length > 1) {
					if (songPrevious[0] == "?") {
						sendMessage(client, channel, '이전 곡: "' + songPrevious[1] + '"! @' + username);
					} else {
						sendMessage(client, channel, '이전 곡: "' + songPrevious[1] + '" by ' + songPrevious[0] + '! @' + username);
					}
				} else {
					sendMessage(client, channel, "이전 곡을 알 수 없습니다. @" + username);
				}
				// COMMAND: !VIP
			} else if (message.indexOf("!등급확인") == 0) {
				console.log("VIP 체크");
				if (vipList.indexOf(userid) != -1) {
					sendMessage(client, channel, username + "님은 VIP 입니다. @" + username);
				} else {
					sendMessage(client, channel, username + "님은 VIP가 아닙니다. @" + username);
				}
				// COMMAND: !노래신청	
			} else if (message.indexOf(RequestTxt) == 0) {
				var songWord = message.split(" ");
				songWord.shift(); // remove the command name
				for (i = 0; i < songWord.length; i++) {
					songWord[i] = songWord[i].replace(regExp, "").toLowerCase(); // remove interpunction
				}
				var songPossible = [];
				var songIndex = -1;
				if (songWord.length == 0 || message.substring(RequestTxt.length + 1) == false || message.substring(RequestTxt.length + 1) == "***" || message.indexOf("!노래신청 ") != 0) {
					sendMessage(client, channel, '노래를 신청하려면 !노래신청 + 노래제목 을 채팅해 주세요! @' + username);
				} else {
					for (i = 0; i < songs.length; i++) {
						var active = true;
						for (j = 0; j < songWord.length; j++) {
							if (songs[i].replace(regExp, "").toLowerCase().indexOf(songWord[j]) == -1 && songWord[j] != "***") {
								active = false;
							}
						}
						if (active) {
							songPossible.push(i);
							console.log(songs[i]);
						}
					}
					if (songPossible.length > 1) { //choose a possible song
						var songPossibleNoRemix = [];
						for (i = 0; i < songPossible.length; i++) { // prefer non remixes/acapellas
							if (songs[songPossible[i]].toLowerCase().indexOf("remix") == -1 && songs[songPossible[i]].toLowerCase().indexOf("acapella") == -1) {
								songPossibleNoRemix.push(songPossible[i]);
							}
						}
						if (songPossibleNoRemix.length > 1) {
							songIndex = songPossibleNoRemix[Math.floor(Math.random() * songPossibleNoRemix.length)];
						} else {
							songIndex = songPossible[Math.floor(Math.random() * songPossible.length)];
						}
						sendMessage(client, channel, songPossible.length + '개의 노래가 검색되어 랜덤 예약합니다.. @' + username);
					} else {
						songIndex = songPossible[0];
					}
					if (songPossible.length > 0) {
						if (songIsInCoolDown[songIndex] === true && userid != Managerid) {
							sendMessage(client, channel, '"' + songs[songIndex] + '"은(는) ' + SongCooldown / 60 + '분 안에 예약 기록이 있습니다... @' + username);
						} else if (userIsInCoolDown[username.toLowerCase()] === true && userid != Managerid) {
							if (vipList.indexOf(userid) != -1) {
								sendMessage(client, channel, 'VIP는 노래 신청을 ' + UserCooldown / 60 * 0.5 + '분 마다 할 수 있습니다... @' + username);
							} else {
								sendMessage(client, channel, '노래 신청은 ' + UserCooldown / 60 + '분 마다 가능합니다...(VIP는 ' + UserCooldown / 60 * 0.5 + ') @' + username);
							}

						} else {
							if (username.toLowerCase != channel) {
								songIsInCoolDown[songIndex] = true;
								userIsInCoolDown[username.toLowerCase()] = true;

								if (vipList.indexOf(userid) != -1) {
									setTimeout(resetUserCoolDown, UserCooldown * 1000 * 0.5, username);
								} else {
									setTimeout(resetUserCoolDown, UserCooldown * 1000, username);
								}

								setTimeout(resetSongCoolDown, SongCooldown * 1000, songIndex);
							}
							request({
								url: "http://127.0.0.1:8888/default/?cmd=QueueItems&param1=" + songIndex,
								json: true
							}, function (error, response, body) {
								sendMessage(client, channel, '노래 예약 완료: "' + songs[songIndex] + '" @' + username);
							})

						}
					} else {
						sendMessage(client, channel, "노래를 찾을 수 없습니다. 노래 추가 요청이 완료되었습니다. @" + username);
						sendMessage(client, channel, "노래 제목은 원어로 검색하셔야 합니다. 혹은 제목의 일부 단어만을 검색해 보세요. @" + username);
						fs.appendFile('failedSongs.txt', "\r\n [" + username + "] " + message.substring(RequestTxt.length + 1), function (err) { });
					}
				}
			}
		});

	}, 1000);
}

mainFunc();

function checkNowPlaying() {
	var request = require("request");
	request({
		url: "http://127.0.0.1:8888/playlistviewer/?param3=nowPlaying.json",
		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			var songCurrentP = songCurrent;
			songCurrent = [body.artist, body.title];
			if (songCurrent[0] != songCurrentP[0] || songCurrent[1] != songCurrentP[1]) {
				console.log(" ");
				console.log(" > Now song: " + songCurrent[0] + " - " + songCurrent[1]);
				console.log(" ");
				songPrevious = songCurrentP;
			}
		}
	})
	setTimeout(checkNowPlaying, 10000);
}

function resetSongCoolDown(songIndexToReset) {
	console.log(" ");
	console.log("Reset cooldown for " + songs[songIndexToReset]);
	console.log(" ");
	songIsInCoolDown[songIndexToReset] = false;
}

function resetUserCoolDown(username) {
	console.log(" ");
	console.log("Reset cooldown for " + username);
	console.log(" ");
	userIsInCoolDown[username.toLowerCase()] = false;
}

function sendMessage(client, channel, message) {
	if (messageCounter < maxMessagesPerSecond) {
		messageCounter++;
		client.say(channel, message);
		setTimeout(resetMessageCounter, 1000);
	} else {
		setTimeout(sendMessage, 100, client, channel, message);
	}
}

function resetMessageCounter() {
	messageCounter--;
}
