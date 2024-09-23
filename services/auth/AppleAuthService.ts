import * as AppleAuthentication from 'expo-apple-authentication';
import AuthServices from './AuthServices';

class AppleAuthService {
	public async signInWithApple() {
		try {
			const credential = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL,
				],
			});
			return AuthServices.loginWithApple(credential);
		} catch (error) {
			console.error('ERROR WHEN LOGGING IN WITH APPLE', error);
		}
	}
}

export default new AppleAuthService();
