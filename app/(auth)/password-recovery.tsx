import { useRef, useState } from 'react';
import { styles } from '@/styles/auth/LoginStyles';
import {
	View,
	Text,
	ImageBackground,
	TextInput,
	Image,
	Animated,
} from 'react-native';
import PrimaryButton from '@/components/auth/PrimaryButton';
import AuthServices from '@/services/auth/AuthServices';
import ErrorComponent from '@/components/auth/ErrorComponent';
import { router } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';

export default function PasswordRecoveryScreen() {
	const { t } = useTranslation();
	const [email, setEmail] = useState('');
	const [error, setError] = useState<string | null>(null);

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
						<View style={styles.passwordRecoveryTextContainer}>
							<Text style={styles.passwordRecoveryTitle}>
								{t('authScreens.passwordRecoveryTitle') || ''}
							</Text>
							<Text style={styles.passwordRecoveryText}>
								{t('authScreens.passwordRecoveryText') || ''}
							</Text>
						</View>
						<TextInput
							placeholder={t('authScreens.email') || 'Email'}
							placeholderTextColor="#FFFFFF"
							style={[
								styles.inputButton,
								{
									borderColor: error ? 'rgb(208, 54, 60)' : 'white',
								},
							]}
							value={email}
							onChangeText={setEmail}
						/>
						<PrimaryButton
							text={t('authScreens.resetPassword')}
							disabled={!email || !AuthServices.validateEmail(email)}
							onPress={async () => {
								try {
									const emailToLower = email.toLowerCase();
									const response = await AuthServices.resetPassword(
										emailToLower,
									);
									if (response) {
										setError(null);
										router.push({
											pathname: '/code-verification',
											params: {
												email: emailToLower,
											},
										});
									}
								} catch (error: string | any) {
									console.log('error', error);
									startShake();
									setError(error instanceof Error ? error.message : 'RANDOM');
								}
							}}
						/>
						{error && <ErrorComponent text={t(`errors.auth.${error}`)} />}
					</View>
				</Animated.View>
			</ImageBackground>
		</View>
	);
}
