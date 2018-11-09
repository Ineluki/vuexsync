const Koa = require('koa');
const serve = require('koa-static');
const websockify = require('koa-websocket');
const debug = require('debug')('vuexsync');
const path = require('path');
const Store = require('../Source/Store');
const Plugin = require('../Source/Plugin');
const Pool = require('../Source/Pool');

Error.stackTraceLimit = Infinity;

const app = websockify(new Koa());

//serve static pages, must come first of content
app.use( serve( path.normalize(__dirname+'/../Web/'),{
	maxage : 0,
	hidden : false,
	index : "index.html",
	defer : true
}) );


const propagate = (from,action) => {
	Pool.forEach(client => {
		if (client === from) return;
		console.log("@TODO propagating to client",client);
		client.websocket.send(JSON.stringify(action));
	})
}


app.ws.use(async function(ctx,nxt) {

	let stream = Pool.add(ctx.websocket);

});


app.listen(8080);