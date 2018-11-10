const debug = require('debug')('vuexsync');
const ReconnectingWebSocket = require('reconnecting-websocket');
const createLogger = require('vuex/dist/logger');
const Store = require('./Store.js');
const Sync = require('../index');

const socket = new ReconnectingWebSocket('ws://'+document.location.host+'/');

//socket.on = socket.addEventListener;

const plugin = Sync.getBrowserPlugin(socket);
const store = Store([plugin,createLogger()]);

window.store = store;

console.log("initialized",store);