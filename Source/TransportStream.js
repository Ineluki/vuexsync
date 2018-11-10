const { Duplex } = require('stream');
const kSource = Symbol('source');
const debug = require('debug')('vuesync');

class TransportStream extends Duplex {

	constructor(source) {
		super({
			readableObjectMode: true,
			writableObjectMode: true
		});
		this[kSource] = source;

		if (source.addEventListener) {
			source.addEventListener('message',(msg) => {
				debug("on-message-event",msg.data);
				let d = JSON.parse(msg.data);
				this.push({
					from: source,
					action: d
				});
			})
			source.addEventListener('close',() => {
				this.destroy()
			})
		}

	}

	_write(data, encoding, callback) {
		if (data.from !== this[kSource]) {
			this[kSource].send(JSON.stringify(data.action));
		}
		callback();
	}

	_read(size) { }
}

module.exports = TransportStream;