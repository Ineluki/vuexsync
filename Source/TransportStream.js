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
		} else {
			source.on('message',(msg) => {
				debug("on-message-on",msg);
				let d = msg;
				this.push({
					from: source,
					action: d
				});
			})
			source.on('close',() => {
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

	_read(size) {
		// this[kSource].fetchSomeData(size, (data, encoding) => {
		// this.push(Buffer.from(data, encoding));
		// });
	}
}

module.exports = TransportStream;