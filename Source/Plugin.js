const debug = require('debug')('vuesync');
const { Duplex } = require('stream');
const kSource = Symbol('source');

class PluginStream extends Duplex {

	constructor(store, { initSync = true }) {
		super({
			readableObjectMode: true,
			writableObjectMode: true
		});
		this[kSource] = store;
		this.remoteCommit = false;

		store.subscribe(mutation => {
			if (this.remoteCommit === true) {
				//@TODO test if this is fool-proof
				this.remoteCommit = false;
				return;
			}
			debug("sending",mutation);
			this.push({
				from: store,
				action: mutation
			});
		})

		if (initSync) {
			this.push({
				from: store,
				action: {
					special: 'sync'
				}
			})
		}
	}

	_write(data, encoding, callback) {
		if (data.from !== this[kSource]) {
			if (data.action.special === 'sync') {
				this[kSource].replaceState( data.action.data );
			} else {
				this.remoteCommit = true;
				this[kSource].commit(data.action.type,data.action.payload)
			}
		}
		callback();
	}

	_read(size) { }
}

function myPlugin (stream, opts) {
	return (store) => {
		let ps = new PluginStream(store, opts);
		ps.pipe(stream).pipe(ps);
	}
}

module.exports = myPlugin;