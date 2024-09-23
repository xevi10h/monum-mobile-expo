import React, { useEffect, useRef, useState } from 'react';
import { styles } from '@/styles/auth/LoginStyles';
import {
	View,
	Text,
	ImageBackground,
	TextInput,
	Image,
	Animated,
	TouchableOpacity,
} from 'react-native';
import PrimaryButton from '@/components/auth/PrimaryButton';
import AuthServices from '@/services/auth/AuthServices';
import ErrorComponent from '@/components/auth/ErrorComponent';
import { useTranslation } from '@/hooks/useTranslation';
import { router, useLocalSearchParams } from 'expo-router';

export default function CodeVerificationScreen() {
	const { t } = useTranslation();
	const { email } = useLocalSearchParams();
	const [code, setCode] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [counter, setCounter] = useState(0);
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const startCounter = () => {
		setCounter(60);
		setIsButtonDisabled(true);
	};

	useEffect(() => {
		let intervalId: ReturnType<typeof setInterval>;

		if (counter > 0) {
			intervalId = setInterval(() => {
				setCounter((prevCounter) => prevCounter - 1);
			}, 1000);
		} else {
			setIsButtonDisabled(false);
		}

		return () => clearInterval(intervalId);
	}, [counter]);

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
								{t('authScreens.verification') || ''}
							</Text>
							<Text style={styles.passwordRecoveryText}>
								{t('authScreens.emailSent') || ''}
								<Text
									style={{
										fontFamily: 'Montserrat-SemiBold',
									}}
								>{` ${email}`}</Text>
								{`. ${t('authScreens.emailSentCheck') || ''}`}
							</Text>
						</View>
						<TextInput
							placeholder={
								t('authScreens.verificationCode') || 'Verification code'
							}
							placeholderTextColor="#FFFFFF"
							keyboardType="numeric"
							style={[
								styles.inputButton,
								{
									borderColor: error ? 'rgb(208, 54, 60)' : 'white',
								},
							]}
							value={code}
							onChangeText={(text) => {
								if (text.length <= 6) {
									setCode(text);
								}
							}}
							maxLength={6}
						/>
						<View style={styles.resendCodeButtonContainer}>
							<TouchableOpacity
								activeOpacity={0.2}
								disabled={isButtonDisabled}
								style={[
									styles.resendButton,
									{ opacity: isButtonDisabled ? 0.5 : 1 },
								]}
								onPress={async () => {
									startCounter();
									try {
										await AuthServices.resetPassword(email as string, true);
									} catch (error: string | any) {
										startShake();
										setError(error instanceof Error ? error.message : 'RANDOM');
									}
								}}
							>
								<Text style={styles.passwordRecoveryText}>
									{isButtonDisabled
										? `${counter} s`
										: t('authScreens.resendCode')}
								</Text>
							</TouchableOpacity>
						</View>
						<Text style={styles.codeResentText}>
							{isButtonDisabled ? t('authScreens.codeResent') : ' '}
						</Text>

						<PrimaryButton
							text={t('authScreens.verify')}
							onPress={async () => {
								try {
									const response = await AuthServices.verificateCode(
										email as string,
										code,
									);
									if (response) {
										setError(null);
										router.push({
											pathname: '/new-password',
											params: {
												email,
												token: response,
											},
										});
									}
								} catch (error: string | any) {
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
