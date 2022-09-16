import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import * as transaction from './transaction'
const client = new ApolloClient({
    uri: TICKETING_GRAPHQL,
    cache: new InMemoryCache(),
    headers: {
        'X-IBM-Client-Id': IBM_CLIENT_ID,
        'X-IBM-Client-Secret': IBM_CLIENT_SECRET
    }
});

export default { client, transaction }