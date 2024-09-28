import { useRef, useState } from 'react';
import {
	View,
	Image,
	TouchableOpacity,
	ImageBackground,
	TextInput,
	Animated,
	Linking,
} from 'react-native';
import { styles } from '@/styles/auth/LoginStyles';
import PrimaryButton from '@/components/auth/PrimaryButton';
import AuthServices from '@/services/auth/AuthServices';
import { Text } from 'react-native';
import { useUserStore } from '../../zustand/UserStore';
import ErrorComponent from '@/components/auth/ErrorComponent';
import { useTranslation } from '@/hooks/useTranslation';

export default function RegisterScreen() {
	const { t } = useTranslation();
	const setUser = useUserStore((state) => state.setUser);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [confirmedPassword, setConfirmedPassword] = useState('');
	const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const toggleConfirmedPasswordVisibility = () => {
		setShowConfirmedPassword(!showConfirmedPassword);
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
				source={require('@/assets/images/background_monuments.png')}
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
							source={require('@/assets/images/logo_white.png')}
							style={styles.logo}
							resizeMode="contain"
						/>
					</View>
					<View style={styles.buttonContainer}>
						<TextInput
							placeholder={t('authScreens.email') || 'Email '}
							placeholderTextColor="#FFFFFF"
							style={[
								styles.inputButton,
								{
									borderColor:
										error === 'userAlreadyExists'
											? 'rgb(208, 54, 60)'
											: 'white',
								},
							]}
							value={email}
							onChangeText={setEmail}
							autoCapitalize="none"
						/>
						<View style={styles.passwordContainer}>
							<TextInput
								placeholder={t('authScreens.password') || 'Password'}
								placeholderTextColor="#FFFFFF"
								style={[
									styles.inputButton,
									{
										borderColor:
											error === 'passwordNotStrong'
												? 'rgb(208, 54, 60)'
												: 'white',
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
										source={require('@/assets/images/password_eye.png')}
										style={styles.hidePasswordButtonIcon}
										resizeMode="contain"
									/>
								) : (
									<Image
										source={require('@/assets/images/password_eye_crossed.png')}
										style={styles.hidePasswordButtonIcon}
										resizeMode="contain"
									/>
								)}
							</TouchableOpacity>
						</View>
						<View style={styles.passwordContainer}>
							<TextInput
								placeholder={
									t('authScreens.confirmedPassword') || 'Confirm password'
								}
								placeholderTextColor="#FFFFFF"
								style={[
									styles.inputButton,
									{
										borderColor:
											error === 'passwordNotStrong'
												? 'rgb(208, 54, 60)'
												: 'white',
									},
								]}
								secureTextEntry={!showConfirmedPassword} // Mostrar o ocultar la contraseña según el estado
								value={confirmedPassword}
								onChangeText={setConfirmedPassword}
							/>
							<TouchableOpacity
								style={styles.hidePasswordButton}
								onPress={toggleConfirmedPasswordVisibility}
							>
								{showPassword ? (
									<Image
										source={require('@/assets/images/password_eye.png')}
										style={styles.hidePasswordButtonIcon}
										resizeMode="contain"
									/>
								) : (
									<Image
										source={require('@/assets/images/password_eye_crossed.png')}
										style={styles.hidePasswordButtonIcon}
										resizeMode="contain"
									/>
								)}
							</TouchableOpacity>
						</View>
						<PrimaryButton
							disabled={password !== confirmedPassword}
							text={t('authScreens.signup')}
							onPress={async () => {
								try {
									const response = await AuthServices.signup(email, password);
									if (response) {
										setUser(response);
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
									Linking.openURL('https://www.app.monum.es/privacy');
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
