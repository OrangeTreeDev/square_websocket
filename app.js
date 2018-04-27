const http = require('http');
const Koa = require('koa');
const ws = require('ws');

const app = new Koa();

const httpServer = http.createServer(app.callback()).listen(3000);

// 创建websocket服务器, 依赖于http协议
const webSocketServer = new ws.Server({ server: httpServer });
webSocketServer.on('listening', function() {
  console.log('server listening at port: 3000');
});
let connectionId = 0;
let socketMap = {};

// 每个连接都对应一个新的socket对象
webSocketServer.on('connection', (ws, req) => {
  connectionId++;
  socketMap[connectionId] = ws;
  // 模拟restful api风格
  ws.addEventListener('message', (event) => {
    const {url, data} = JSON.parse(event.data);
    let responseData = null;
    if (url === '/api/getConnectionId') {
      responseData = JSON.stringify({
        url: '/api/getConnectionId',
        data: { connectionId }
      });
      ws.send(responseData);
    } else if (url === '/api/control') {
      let {receiverId, index} = data;
      responseData = JSON.stringify({
        url: '/api/control',
        data: { index }
      });
      socketMap[receiverId].send(responseData);
    }
  });
});