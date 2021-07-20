import { InMemoryCache } from 'apollo-cache-inmemory';

export default () => {
  const cache = new InMemoryCache();
  return {
    httpEndpoint: 'http://localhost:3000/mockServer',
    cache,
  };
};
