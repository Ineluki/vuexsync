# vuex2vuex sync util

Sync different vuex stores with streams and websockets.

Use an authoritative store on the server for authoritative sync setup.

For an example app see: https://github.com/Ineluki/vuexsync-example

## Basic usage

```javascript
const stream = new Sync.TransportStream(websocket);
const plugin = Sync.Plugin( stream, {} );
const store = Store([plugin]);
```

## API

### Sync.TransportStream

A duplex stream for connecting to a websocket. Has a buffer for events that get pushed before the socket is open.

### Sync.Plugin

Creates a duplex stream as a vuex plugin. Will listen to any commits and pushes them over the stream.
Will take any incoming packets and commit them. Can employ a filter to only listen to certain commits.

#### Options

Options are given as the second argument.

 * initSync - request a full synchronisation of the store on start. Requires a Hub somewhere up the stream with an authoritative store set
 * filter - object, to limit the commit names listened to
  * whitelist - array or names to listen to
  * blacklist - array of names not to listen to
  * namespace - string, only listen to commits in that namespace, can be used with other filters

### Sync.Hub

A pseudo stream that can connect multiple streams, useful for rooms of websockets. Not a real stream but you can pipe to and from it. The hub will do the unpiping for you when one stream closes.

Usage:

```javascript
const stream = new Sync.TransportStream(ctx.websocket);
stream.pipe(hub).pipe(stream);
```
