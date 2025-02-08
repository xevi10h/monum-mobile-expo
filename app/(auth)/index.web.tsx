import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';
import {
	View,
	Text,
	TouchableOpacity,
	Linking,
	ImageBackground,
	Platform,
} from 'react-native';

import BouncyLogo from '../../components/auth/BouncyLogo';
import SecondaryButton from '../../components/auth/SecondaryButton';
import SeparatorComponent from '../../components/auth/SeparatorComponent';
import GoogleAuthService from '../../services/auth/GoogleAuthService';
import { styles } from '../../styles/auth/LoginStyles';
import { useUserStore } from '../../zustand/UserStore';
import AuthServices from '../../services/auth/AuthServices';
import { useTranslation } from '@/hooks/useTranslation';
import { changeLanguage } from '@/i18n';
import { useEffect } from 'react';
import ButtonWithLogo from '@/components/auth/ButtonWithLogo';

export default function Login() {
	WebBrowser.maybeCompleteAuthSession();
	const setUser = useUserStore((state) => state.setUser);
	const { t } = useTranslation();

	const [request, response, promptAsync] = Google.useAuthRequest({
		webClientId:
			'716205684564-fuirar3iu7t1ko699quc98bc55dbmbd9.apps.googleusercontent.com',
		redirectUri: 'https://mobile.monum.es',
	});

	useEffect(() => {
		const signIn = async () => {
			const user = await GoogleAuthService.signInWithGoogle(response);
			if (user) {
				setUser(user);
				changeLanguage(user.language || 'ca_ES');
			}
		};
		signIn();
	}, [response]);

	return (
		<View style={styles.backgroundContainer}>
			<View style={styles.backgroundColor} />
			<ImageBackground
				source={require('../../assets/images/background_monuments.png')}
				style={{ flex: 1, width: '100%', height: '100%' }}
				resizeMode="cover"
			>
				<View style={styles.container}>
					<View style={styles.logoContainer}>
						<BouncyLogo />
					</View>
					<View style={styles.buttonContainer}>
						<ButtonWithLogo
							imageSource={require('../../assets/images/google_sign_in_logo.png')}
							text={t('authScreens.loginWithGoogle')}
							style={{ backgroundColor: 'white' }}
							textColor="black"
							onPress={() => {
								promptAsync();
							}}
						/>

						{Platform.OS === 'ios' && (
							<ButtonWithLogo
								imageSource={require('../../assets/images/apple_sign_in_logo.png')}
								text={t('authScreens.loginWithApple')}
								style={{ marginTop: 30, backgroundColor: 'black' }}
								onPress={async () => {
									try {
										const credential = await AppleAuthentication.signInAsync({
											requestedScopes: [
												AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
												AppleAuthentication.AppleAuthenticationScope.EMAIL,
											],
										});
										const user = await AuthServices.loginWithApple(credential);
										if (user) {
											setUser(user);
										} else {
											throw new Error('Error logging in with Apple');
										}
									} catch (e: any) {
										if (e.code === 'ERR_REQUEST_CANCELED') {
											console.log('Apple login was cancelled');
										} else {
											console.error('Error logging in with Apple:', e);
										}
									}
								}}
							/>
						)}

						<SeparatorComponent />
						<SecondaryButton
							text={t('authScreens.loginWithCredentials')}
							onPress={() => {
								router.push('/login-with-credentials');
							}}
						/>
						<SecondaryButton
							text={t('authScreens.loginAsGuest')}
							onPress={async () => {
								try {
									const user = await AuthServices.loginAsGuest();
									if (user) {
										setUser(user);
										changeLanguage(user.language || 'en_US');
									} else {
										console.error('ERROR WHEN LOGGING AS GUEST');
									}
								} catch (error) {
									console.error('ERROR WHEN LOGGING AS GUEST', error);
								}
							}}
							style={{ marginTop: 30 }}
						/>
					</View>
					<View style={styles.bottomContainer}>
						<View style={styles.registerContainer}>
							<Text style={styles.registerText}>
								{t('authScreens.notRegistered')}{' '}
							</Text>

							<TouchableOpacity
								activeOpacity={0.2}
								onPress={() => router.push('/register')}
							>
								<Text style={styles.registerButtonText}>
									{t('authScreens.register')}
								</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.companyContainer}>
							<Text style={styles.companyText}>
								{t('authScreens.footerText')}
							</Text>
						</View>
						<View style={styles.privacyContainer}>
							<Text style={styles.privacyText}>
								{t('authScreens.pressToObtainInfoAbout')}{' '}
							</Text>

							<TouchableOpacity
								onPress={() => {
									Linking.openURL(
										process.env.EXPO_PUBLIC_MONUM_PRIVACY_URL ||
											'https://app.monum.es/ca/privacy',
									);
								}}
							>
								<Text style={styles.privacyButtonText}>
									{t('authScreens.privacyPolicy')}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
}
