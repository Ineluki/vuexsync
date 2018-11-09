const debug = require('debug')('vuesync');
import ReconnectingWebSocket from 'reconnecting-websocket';
import createLogger from 'vuex/dist/logger'
import Store from '../Source/Store.js';
import TransportStream from '../Source/TransportStream';
import Plugin from '../Source/Plugin';

const socket = new ReconnectingWebSocket('ws://'+document.location.host+'/');

socket.on = socket.addEventListener;

let stream = new TransportStream(socket);

let plugin = Plugin(stream);

const store = Store([plugin,createLogger()]);

window.store = store;

console.log("initialized",store);