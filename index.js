const Hub = require('./Source/Hub')
const Plugin = require('./Source/Plugin')
const Pool = require('./Source/Pool')
const TransportStream = require('./Source/TransportStream')

function getBrowserPlugin(ws) {
	return Plugin( new TransportStream(ws), {} );
}

function getServerPlugin() {
	return Plugin( Pool.getHub(), { initSync: false } );
}

module.exports = {
	Hub, Plugin, Pool, TransportStream,
	getBrowserPlugin,
	getServerPlugin
}