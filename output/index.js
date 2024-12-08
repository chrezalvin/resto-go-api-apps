#!/usr/bin/env node
"use strict";
/**
 * Module dependencies.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expressConfig_1 = __importDefault(require("./expressConfig"));
const _config_1 = require("./serverConfig");
// var app = require('../app');
var debug = require('debug')('node:server');
var http = require('http');
/**
 * Get port from environment and store in Express.
 */
expressConfig_1.default.set('port', _config_1.port);
console.log(`Server running on port ${_config_1.port}`);
/**
 * Create HTTP server.
 */
var server = http.createServer(expressConfig_1.default);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(_config_1.port);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof _config_1.port === 'string'
        ? 'Pipe ' + _config_1.port
        : 'Port ' + _config_1.port;
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
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
