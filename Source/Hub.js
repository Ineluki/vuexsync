const { Duplex } = require('stream');
const { EventEmitter } = require('events');
const debug = require('debug')('vuesync');
const cloneDeep = require('lodash.clonedeep');
const TransportStream = require('./TransportStream');

class Hub extends EventEmitter {

	constructor() {
		super()
		this.syncAuthority = null;
		this.socketIndex = new Map();
	}

	write(data, encoding, callback) {
		if (data.action.special === 'sync') {
			debug("sync cmd intercepted");
			this.runSync(data);
		} else {
			this.emit('data',data);
		}
		//callback();
	}

	pipe(stream) {
		debug("hub adding new stream");
		const sender = (msg) => {
			if (msg.from !== stream) {
				stream.write(msg);
			}
		};
		let ws = stream.getSocket ? stream.getSocket() : null;
		this.on('data',sender);
		stream.on('close',() => {
			this.off('data',sender);
			if (ws) this.socketIndex.delete( ws );
			debug("socketIndex",this.socketIndex.size);
		})
		if (ws) this.socketIndex.set( ws, stream );
		debug("socketIndex",this.socketIndex.size);
	}

	setSyncAuthority(store) {
		this.syncAuthority = store;
	}
	
	getSyncState() {
		if (this.syncAuthority) {
			return cloneDeep(this.syncAuthority.state);
		}
		throw new Error("no sync authority set");
	}

	getStream(ws) {
		return this.socketIndex.get(ws);
	}

	runSync(request) {
		let stream = this.getStream(request.from);
		let state = this.getSyncState();
		stream.write({
			action: {
				special: 'sync',
				data: state
			}
		});
	}
}

module.exports = Hub;