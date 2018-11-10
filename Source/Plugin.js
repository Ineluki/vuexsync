const debug = require('debug')('vuesync');
const { Duplex } = require('stream');
const kSource = Symbol('source');

class PluginStream extends Duplex {

	constructor(store, { initSync = true, filter = {} }) {
		super({
			readableObjectMode: true,
			writableObjectMode: true
		});
		this[kSource] = store;
		this.remoteCommit = false;
		this.filter = filter;

		store.subscribe((mutation,state) => {
			if (this.remoteCommit === true) {
				//@TODO test if this is fool-proof
				this.remoteCommit = false;
				return;
			} else {
				if (!this.passesFilter(mutation.type)) return;
			}
			debug("sending",mutation,state);
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

	passesFilter(mutationName) {
		if (this.filter.namespace) {
			if (mutationName.substr(0,this.filter.namespace.length) !== this.filter.namespace) {
				return false;
			}
			mutationName = mutationName.substr(this.filter.namespace.length+1);
		}
		if (this.filter.whitelist) {
			return this.filter.whitelist.indexOf(mutationName) > -1;
		}
		if (this.filter.blacklist) {
			return this.filter.blacklist.indexOf(mutationName) === -1;
		}
		return true;
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