# Foobar Songrequest Twitch Bot
A Twitch bot that lets people from Twitch chat request songs from your Foobar2000 playlist.

For the YouTube version of this bot go [here](https://github.com/MichielP1807/FoobarSongrequestYouTubeBot).

## Needed for this bot:

* [foobar2000](http://www.foobar2000.org/download "Download foobar2000")

* [node.js](https://nodejs.org/ "Download node.js")
  
* [foo_httpcontrol](https://bitbucket.org/oblikoamorale/foo_httpcontrol/downloads/ "Download foo_httpcontrol")
  
* [The two folders in this repository](https://github.com/danhk0612/FoobarSongrequestTwitchBot/archive/master.zip "Download this repository")

## Commands:

* !노래신청 [노래제목] - 푸바2000의 음악 리스트중 노래 신청

* !제목 - 현재 재생 노래 제목 출력

* !이전곡 - 이전 재생 노래 제목 출력

* !핑 - 봇 작동여부 확인

* !등급확인 - 본인의 VIP 여부 출력

## Features:

* 각각 곡과 유저의 신청 쿨타임 기능

* 신청받은 곡이 없는 경우 파일로 리스트 자동 저장

* 채팅 기록 저장

* VIP 기능 (쿨타임 따로 관리 가능)

* 관리자는 쿨타임 적용 안됨

* 플레이리스트 외부 접속 주소 HTML 페이지 제공 (http://localhost:8080/)

* 다음 예약곡 텍스트 파일 출력 기능

## How to setup: 

####  1. Setting up foobar2000
  
1.	Install Foobar2000
  
2.	Open Foobar2000
  
3.	Create a playlist with your music
  
4.	Close Foobar2000
  
####  2. Setting up foo_httpcontrol
  
1.	Install foo_httpcontrol
  
2.	Open Foobar2000
  
3.	Allow Foobar2000 access to the internet
  
4.	Go to http://127.0.0.1:8888/ in your browser to make sure it’s installed, you should see some installed templates, we'll now install some more
 
5.  Copy the foo_httpcontrol_data from this repository
  
6.	Navigate to *foo_httpcontrol home folder*

7.  Paste the foo_httpcontrol_data folder here
  
8.	Go to http://127.0.0.1:8888/playlistviewer/ in your browser, see the name of the currently playing song there
  
####  3. Setting up node.js
  
1.	Install node.js
  
2.	To test if node.js is installed correctly:
    1. Open cmd
    2. Type node and hit enter
    3. You're now in javascript land!
  
####  4. Setting up twitch account for the bot
  
1.	Go to https://www.twitch.tv/ and log out if you’re logged in
  
2.	Sign up for a new account
  
3.	Log in to twitch with your bot account
  
4.	Go to https://twitchapps.com/tmi/ 
  
5.	Click on connect with twitch
  
6.	Make sure you’re using your bot account
  
7.	Copy the oauth code which looks like *oauth:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx* with a bunch of random characters instead of x’s, you’ll need this code in the next step
  
####  5. Setting up the twitchbot
  
1.	Open the TwitchBot folder from this repository
  
2.	Open twitchbot-data.json in a text editor (notepad, atom, notepad++ etc.)
  
3.	Put the username of your twitchbot account you’ve created in between the quotation marks after the *"username": *
  
4.	Put your oauth code in between the quotation marks after *"password":*
  
5.	Put the channel name of the channel you would like your bot to join in between the quotation marks after *"joinChannel":*

6.  You can also change the cooldown time for either songs or users, these values are in seconds

7.	Save the file and close the text editor
  
8.	Run twitchbot-starter.bat, it should be showing some of the songs in your playlist
  
9.	It now should be working, go to the twitch channel you added the bot to and write *!ping* in chat, it should respond with *pong!*, you can also see the chat in the twitchbot window

10.  Try requesting a song from your playlist, it now should be working
  
####  6. Trouble shooting
  
1.	If it’s adding the wrong song to the queue, make sure you’ve got the correct playlist active when you launch the bot, try restarting the bot
  
2.	If it’s not adding any song at all please first try to restart the bot, if it still doesn’t work ask for help

If you have any other problems please make an issue at [here](https://github.com/danhk0612/FoobarSongrequestTwitchBot/issues/new "New GitHub Issue")
