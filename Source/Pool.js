const TransportStream = require('./TransportStream');
const Hub = require('./Hub');
const connectedClients = new Set();

const hub = new Hub();

function add(ws) {
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


module.exports = {
	add,
	forEach
}