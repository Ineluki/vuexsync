const Hub = require('./Source/Hub')
const Plugin = require('./Source/Plugin')
const TransportStream = require('./Source/TransportStream')

function getBrowserPlugin(ws) {
	return Plugin( new TransportStream(ws), {} );
}

function getServerPlugin(hub) {
	return Plugin( hub, { initSync: false } );
}

module.exports = {
	Hub, Plugin, TransportStream,
	getBrowserPlugin,
	getServerPlugin
}