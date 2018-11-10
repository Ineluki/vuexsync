const debug = require('debug')('vuexsync');
import ReconnectingWebSocket from 'reconnecting-websocket';
import createLogger from 'vuex/dist/logger'
import Store from './Store.js';
import Sync from '../index';

const socket = new ReconnectingWebSocket('ws://'+document.location.host+'/');

//socket.on = socket.addEventListener;

const plugin = Sync.getBrowserPlugin(socket);
const store = Store([plugin,createLogger()]);

window.store = store;

console.log("initialized",store);