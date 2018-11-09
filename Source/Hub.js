const { Duplex } = require('stream');
const { EventEmitter } = require('events');
const debug = require('debug')('vuesync');

class Hub extends EventEmitter {

	constructor() {
		super()
	}

	write(data, encoding, callback) {
		this.emit('data',data);
	}

	pipe(stream) {
		const sender = (msg) => {
			if (msg.from !== stream) {
				stream.write(msg);
			}
		};
		this.on('data',sender);
		stream.on('close',() => {
			this.off('data',sender);
		})
	}
}

module.exports = Hub;