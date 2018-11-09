const debug = require('debug')('vuesync');
const { Duplex } = require('stream');
const kSource = Symbol('source');

class PluginStream extends Duplex {

	constructor(store) {
		super({
			readableObjectMode: true,
			writableObjectMode: true
		});
		this[kSource] = store;

		store.subscribe(mutation => {
			if (this.remoteCommit) {
				this.remoteCommit = false;
				return;
			}
			debug("sending",mutation);
			this.push({
				from: store,
				action: mutation
			});
		})
		this.remoteCommit = false;
	}

	_write(data, encoding, callback) {
		if (data.from !== this[kSource]) {
			this.remoteCommit = true;
			store.commit(data.action.type,data.action.payload)
		}
		callback();
	}

	_read(size) {
		// this[kSource].fetchSomeData(size, (data, encoding) => {
		// this.push(Buffer.from(data, encoding));
		// });
	}
}

function myPlugin (stream) {
	return (store) => {
		let ps = new PluginStream(store);
		ps.pipe(stream).pipe(ps);
	}
}

module.exports = myPlugin;