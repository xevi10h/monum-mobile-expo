// GoogleAuthService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthServices from './AuthServices';
import { AuthSessionResult } from 'expo-auth-session';

class GoogleAuthService {
	config = {
		webClientId:
			'495065540860-dslpkch1rbhbvvcn0rf6h038llstup7t.apps.googleusercontent.com',
	};

	async getUserInfo(token: string) {
		if (!token) return null;
		try {
			const response = await fetch(
				'https://www.googleapis.com/userinfo/v2/me',
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			const user = await response.json();
			// Almacena la información del usuario en AsyncStorage
			await AsyncStorage.setItem('google-user', JSON.stringify(user));
			return user;
		} catch (error) {
			console.error('Error al obtener datos del usuario:', error);
			return null;
		}
	}

	async signInWithGoogle(response: AuthSessionResult | null) {
		try {
			// Intenta recuperar la información del usuario desde AsyncStorage
			const userJSON = await AsyncStorage.getItem('google-user');
			let user = null;
			if (userJSON) {
				// Si se encuentra la información, la devuelve
				user = JSON.parse(userJSON);
			} else if (
				response?.type === 'success' &&
				response?.authentication?.accessToken
			) {
				// Si no hay información y la respuesta es exitosa, obtiene la información del usuario
				user = await this.getUserInfo(response.authentication.accessToken);
			}
			if (user) {
				const { email, name, id, photo } = user;
				return AuthServices.loginWithGoogle({ email, name, id, photo });
			} else {
				return null;
			}
		} catch (error) {
			console.error('Error al iniciar sesión con Google:', error);
		}
		return null;
	}
}

export default new GoogleAuthService();
