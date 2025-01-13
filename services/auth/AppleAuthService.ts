import * as AppleAuthentication from 'expo-apple-authentication';
import AuthServices from './AuthServices';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AppleAuthService {
	public async signInWithApple() {
		try {
			const credential = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL,
				],
			});
			await AsyncStorage.setItem('apple-user', JSON.stringify(credential));
			return AuthServices.loginWithApple(credential);
		} catch (error) {
			console.error('ERROR WHEN LOGGING IN WITH APPLE', error);
		}
	}
}

export default new AppleAuthService();
