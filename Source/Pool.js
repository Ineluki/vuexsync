const TransportStream = require('./TransportStream');
const Hub = require('./Hub');
const connectedClients = new Set();

const hub = new Hub();

function addSocket(ws) {
	let stream = new TransportStream(ws);
	connectedClients.add(stream);
	ws.on('close',() => {
		connectedClients.delete(stream);
	});

	stream.pipe(hub).pipe(stream);

	return stream;
}

function forEach(cb) {
	connectedClients.forEach(cb);
}

function getHub() {
	return hub;
}

module.exports = {
	addSocket,
	forEach,
	getHub
}