#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "./expressConfig";
import { createWebsocketConfig } from "webSocketConfig";
import { port } from "@config";

import {createServer} from "http";

var debug = require('debug')('node:server');

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

createWebsocketConfig(server);