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

app.ws.use(async function(ctx,nxt) {
	Sync.Pool.addSocket(ctx.websocket);
});

const plugin = Sync.getServerPlugin();
const store = Store([plugin]);
Sync.Pool.getHub().setSyncAuthority(store);

app.listen(8080);