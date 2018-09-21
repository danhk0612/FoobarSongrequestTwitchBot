var request = require('request');
var fs = require('fs');

fs.readFile('twitchbot-data.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
        console.log(err);
    } else {
        var obj = JSON.parse(data);
        var twitchbot = require('./twitchbot.js');
    }
});


const http = require('http');
const url = require('url');
const fs2 = require('fs');
http.createServer((request, response) => {
    const path = url.parse(request.url, true).pathname; // url에서 path 추출
    if (request.method === 'GET') { // GET 요청이면
        if (path === '/') { // 주소가 /이면
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            fs2.readFile(__dirname + '/html/list.html', (err, data) => {
                if (err) {
                    return console.error(err);
                }
                response.end(data, 'utf-8');
            });
        } else { // 매칭되는 주소가 없으면
            response.statusCode = 404; // 404 상태 코드
            response.end('주소가 없습니다');
        }
    }
}).listen(8080);