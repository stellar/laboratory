This file contains information about the laboratory itself and design choices inside.

## Simple Router
The laboratory uses a simple routing system with no outside dependencies. The simple router is stateless. Components do not need to know about the router since everything is handled.

### Dataflow: Two possible events
#### Outbound changes: Changes from updated redux store
When the redux state changes, we can then serialize it and save it in the url. This is handled by a middleware called `routerMiddleware`.

This is reactive and won't change the redux store.

#### Inbound changes: Changes from url hash updates
The a component uses the `routerListener` to provide access to dispatching actions. It will perform a diff to see if an the store needs to be updated. If so, it will dispatch an event.

If save data is not specified, the redux store should not be cleared.

### User navigation via clicks on plain hash links
User navigation should always occur through hash links. This is so that users can open links in new tabs as well as right clicking to copy the link.

Although these events are user initiated, these are considered "inbound" changes since it is changing the hash which is outside of redux.

### Routing actions and reducer
The only code creating actions for routing.js should be the routerListener.
