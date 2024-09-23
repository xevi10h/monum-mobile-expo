import React, { useRef, useState } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';

export default function NewPassword() {
	const { t } = useTranslation();
	const { token } = useLocalSearchParams();
	const [newPassword, setNewPassword] = useState('');
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [confirmedNewPassword, setConfirmedNewPassword] = useState('');
	const [showNewConfirmedPassword, setShowNewConfirmedPassword] =
		useState(false);
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

	const isDisabled = () => {
		return (
			newPassword !== confirmedNewPassword ||
			newPassword.length < 8 ||
			confirmedNewPassword.length < 8
		);
	};

	const toggleNewPasswordVisibility = () => {
		setShowNewPassword(!showNewPassword);
	};

	const toggleNewConfirmedPasswordVisibility = () => {
		setShowNewConfirmedPassword(!showNewConfirmedPassword);
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
								{t('authScreens.newPassword') || ''}
							</Text>
							<Text style={styles.passwordRecoveryText}>
								{t('authScreens.newPasswordText') || ''}
							</Text>
						</View>
						<View style={styles.passwordContainer}>
							<TextInput
								placeholder={t('authScreens.newPassword') || 'New password'}
								placeholderTextColor="#FFFFFF"
								style={[
									styles.inputButton,
									{
										borderColor: error ? 'rgb(208, 54, 60)' : 'white',
									},
								]}
								secureTextEntry={!showNewPassword} // Mostrar o ocultar la contraseña según el estado
								value={newPassword}
								onChangeText={setNewPassword}
							/>
							<TouchableOpacity
								style={styles.hidePasswordButton}
								onPress={toggleNewPasswordVisibility}
							>
								{showNewPassword ? (
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
						<View style={styles.passwordContainer}>
							<TextInput
								placeholder={
									t('authScreens.confirmedNewPassword') ||
									'Confirm new password'
								}
								placeholderTextColor="#FFFFFF"
								style={[
									styles.inputButton,
									{
										borderColor: error ? 'rgb(208, 54, 60)' : 'white',
									},
								]}
								secureTextEntry={!showNewConfirmedPassword} // Mostrar o ocultar la contraseña según el estado
								value={confirmedNewPassword}
								onChangeText={setConfirmedNewPassword}
							/>
							<TouchableOpacity
								style={styles.hidePasswordButton}
								onPress={toggleNewConfirmedPasswordVisibility}
							>
								{showNewConfirmedPassword ? (
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
						<PrimaryButton
							text={t('authScreens.changePassword')}
							disabled={isDisabled()}
							onPress={async () => {
								try {
									const response = await AuthServices.updatePassword(
										newPassword,
										token as string,
									);
									if (response) {
										setError(null);
										router.push('/');
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
