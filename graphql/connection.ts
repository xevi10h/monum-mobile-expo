import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.monum.es';
// Android http://10.0.2.2:4000
// IOS http://127.0.0.1:4000
// PROD https://api.monum.es

const httpLink = createHttpLink({
	uri: BASE_URL,
});

const authLink = setContext(async (_, { headers }) => {
	try {
		const asyncToken = await AsyncStorage.getItem('authToken');
		return {
			headers: {
				...headers,
				authorization: asyncToken || '',
			},
		};
	} catch (e) {
		console.log('Error al obtener el token de autenticación:', e);
	}
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});
export default client;
