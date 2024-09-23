import { useRef, useState } from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ImageBackground,
	TextInput,
	Animated,
	Linking,
} from 'react-native';
import PrimaryButton from '@/components/auth/PrimaryButton';
import { styles } from '@/styles/auth/LoginStyles';
import AuthServices from '@/services/auth/AuthServices';
import { useUserStore } from '@/zustand/UserStore';
import ErrorComponent from '@/components/auth/ErrorComponent';
import { useTranslation } from '@/hooks/useTranslation';
import { router } from 'expo-router';

export default function LoginWithCredentialsScreen() {
	const { t } = useTranslation();
	const setAuthToken = useUserStore((state) => state.setAuthToken);
	const setUser = useUserStore((state) => state.setUser);
	const setLanguage = useUserStore((state) => state.setLanguage);
	const [emailOrUsername, setEmailOrUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const shakeAnimation = useRef(new Animated.Value(0)).current;

	const startShake = () => {
		Animated.sequence([
			Animated.timing(shakeAnimation, {
				toValue: 10,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(shakeAnimation, {
				toValue: -10,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(shakeAnimation, {
				toValue: 10,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(shakeAnimation, {
				toValue: 0,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start();
	};

	return (
		<View style={styles.backgroundContainer}>
			<View style={styles.backgroundColor} />
			<ImageBackground
				source={require('../../assets/images/background_monuments.png')}
				style={{ flex: 1, width: '100%', height: '100%' }}
				resizeMode="cover"
			>
				<Animated.View
					style={[
						styles.container,
						{
							transform: [{ translateX: shakeAnimation }],
						},
					]}
				>
					<View style={styles.logoContainer}>
						<Image
							source={require('../../assets/images/logo_white.png')}
							style={styles.logo}
							resizeMode="contain"
						/>
					</View>
					<View style={styles.buttonContainer}>
						<TextInput
							placeholder={
								t('authScreens.emailOrUsername') || 'Email or username'
							}
							placeholderTextColor="#FFFFFF"
							style={[
								styles.inputButton,
								{
									borderColor: error ? 'rgb(208, 54, 60)' : 'white',
								},
							]}
							value={emailOrUsername}
							onChangeText={setEmailOrUsername}
							autoCapitalize="none"
						/>
						<View style={styles.passwordContainer}>
							<TextInput
								placeholder={t('authScreens.password') || 'Password'}
								placeholderTextColor="#FFFFFF"
								style={[
									styles.inputButton,
									{
										borderColor: error ? 'rgb(208, 54, 60)' : 'white',
									},
								]}
								secureTextEntry={!showPassword} // Mostrar o ocultar la contraseña según el estado
								value={password}
								onChangeText={setPassword}
							/>
							<TouchableOpacity
								style={styles.hidePasswordButton}
								onPress={togglePasswordVisibility}
							>
								{showPassword ? (
									<Image
										source={require('../../assets/images/password_eye.png')}
										style={styles.hidePasswordButtonIcon}
										resizeMode="contain"
									/>
								) : (
									<Image
										source={require('../../assets/images/password_eye_crossed.png')}
										style={styles.hidePasswordButtonIcon}
										resizeMode="contain"
									/>
								)}
							</TouchableOpacity>
						</View>
						<TouchableOpacity
							style={styles.forgotPasswordButton}
							onPress={() => router.push('/password-recovery')}
						>
							<Text style={styles.forgotPasswordText}>
								{t('authScreens.forgotPassword') || 'Forgot password?'}
							</Text>
						</TouchableOpacity>
						<PrimaryButton
							text={t('authScreens.access')}
							onPress={async () => {
								try {
									console.log('emailOrUsername', emailOrUsername);
									console.log('password', password);
									const user = await AuthServices.login(
										emailOrUsername,
										password,
									);
									console.log('user', user);
									if (user) {
										await setAuthToken(user.token || '');
										setUser(user);
										setLanguage(user.language || 'ca_ES');
									}
								} catch (error: string | any) {
									startShake();
									setError(error instanceof Error ? error.message : 'RANDOM');
								}
							}}
						/>
						{error && <ErrorComponent text={t(`errors.auth.${error}`)} />}
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
									Linking.openURL('https://www.monum.es/privacy');
								}}
							>
								<Text style={styles.privacyButtonText}>
									{t('authScreens.privacyPolicy')}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Animated.View>
			</ImageBackground>
		</View>
	);
}
