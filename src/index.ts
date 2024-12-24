#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "./expressConfig";
import "webSocketConfig";
import { port } from "@config";

import ws from "ws";
import {createServer} from "http";

// var app = require('../app');
var debug = require('debug')('node:server');
const wsServer = new ws.Server({ noServer: true });
// var http = require('http');

/**
 * Get port from environment and store in Express.
 */

app.set('port', port);
console.log(`Server running on port ${port}`);

/**
 * Create HTTP server.
 */

var server = createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();

  if(addr === null || typeof addr === "string")
    return;

  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

wsServer.on("connection", (socket, req) => {
  console.log("WebSocket connection established");

  socket.on("message", (data) => {
    console.log(`Received message: ${data}`);
  });
});

/**
 * WebSocket server in case for the upgrade event
 */
server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (ws) => {
    wsServer.emit("connection", ws, request);
  });
});