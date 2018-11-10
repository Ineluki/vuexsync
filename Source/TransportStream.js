const { Duplex } = require('stream');
const kSource = Symbol('source');
const debug = require('debug')('vuesync');

class TransportStream extends Duplex {

	constructor(ws) {
		super({
			readableObjectMode: true,
			writableObjectMode: true
		});
		this[kSource] = ws;

		ws.addEventListener('message',(msg) => {
			debug("on-message-event",msg.data);
			let d = JSON.parse(msg.data);
			this.push({
				from: ws,
				action: d
			});
		})
		ws.addEventListener('close',() => {
			this.destroy()
		})
		ws.addEventListener('open',() => {
			if (this.buffer.length) {
				this.buffer.forEach(action => {
					this._send(action);
				})
			}
		})

		this.buffer = [];

	}

	getSocket(){
		return this[kSource];
	}

	_send(action) {
		if (this[kSource].readyState === 1) {
			this[kSource].send(JSON.stringify(action));
		} else {
			this.buffer.push(action);
		}
	}

	_write(data, encoding, callback) {
		if (data.from !== this[kSource]) {
			this._send(data.action);
		}
		callback();
	}

	_read(size) { }
}

module.exports = TransportStream;