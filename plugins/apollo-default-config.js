import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
// New Imports
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import * as ws from 'ws';

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:3020/graphql',
});

ws.on('open', function open() {
  ws.send('something');
});


const wsLink = new WebSocketLink({
  uri: `ws://localhost:3003/graphql`,
  options: {
    reconnect: true,
  },
  webSocketImpl: ws
});


// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

export default () => {
  const cache = new InMemoryCache();
  return {
    httpEndpoint: '/api/public',
    wsEndpoint: 'ws://localhost:3000/',
    cache,
    link,
  };
};
