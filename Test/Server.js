const Koa = require('koa');
const serve = require('koa-static');
const websockify = require('koa-websocket');
const debug = require('debug')('vuexsync');
const path = require('path');
const Store = require('./Store');
const Sync = require('../index');

Error.stackTraceLimit = Infinity;

const app = websockify(new Koa());

//serve static pages, must come first of content
app.use( serve( path.normalize(__dirname+'/../Web/'),{
	maxage : 0,
	hidden : false,
	index : "index.html",
	defer : true
}) );

const hub = new Sync.Hub();
const plugin = Sync.Plugin( hub, { initSync: false } );
const store = Store([plugin]);
hub.setSyncAuthority(store);

app.ws.use(async function(ctx,nxt) {
	const stream = new Sync.TransportStream(ctx.websocket);
	stream.pipe(hub).pipe(stream);
});

app.listen(8080);