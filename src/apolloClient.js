// import ApolloClient from "apollo-boost";
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {ApolloLink, split } from 'apollo-link';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error';
import {setContext} from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';


const GQL_URI = process.env.GQL_URL || 'twittotitiz-graphql.herokuapp.com/graphql';

const cache = new InMemoryCache();

const errorLink = onError( ({graphQLErrors, networkError, operation}) => {
    if(graphQLErrors){
        graphQLErrors.forEach( ({message, path}) => {
            console.log(`[GraphQL Error] Message: ${message}, Path: ${path}`)
        })
    }

    if(networkError){
        console.log(`[Network Error] ${networkError.message}, Operation: ${operation.operationName}`)
    }
});

const authLink = setContext(( _, {headers, ...rest}) => {
    const context = {
        ...rest,
        headers: {
            ...headers,
            Authorisation: `bearer ffsdfsfsfdsfsfdsdfsfsfsd`
        }
    };
    return context;
});

const wsLink = new WebSocketLink({
    uri: `wss://${GQL_URI}`,
    options: {
        timeout: 60000,
        reconnect: true
    }
});

const httpLink = new HttpLink({
    uri: `https://${GQL_URI}`
});

const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);


const client = new ApolloClient({
    cache,
    link: ApolloLink.from([errorLink, authLink, link]),

});

export default client;