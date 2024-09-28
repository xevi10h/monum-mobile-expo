import { styles } from '@/styles/auth/LoginStyles';
import { View, Text, ImageBackground, Image } from 'react-native';
import PrimaryButton from '@/components/auth/PrimaryButton';
import { router } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';

export default function PasswordChanged() {
	const { t } = useTranslation();
	return (
		<View style={styles.backgroundContainer}>
			<View style={styles.backgroundColor} />
			<ImageBackground
				source={require('@/assets/images/background_monuments.png')}
				style={{ flex: 1, width: '100%', height: '100%' }}
				resizeMode="cover"
			>
				<View style={[styles.container]}>
					<View style={styles.logoContainer}>
						<Image
							source={require('@/assets/images/logo_white.png')}
							style={styles.logo}
							resizeMode="contain"
						/>
					</View>
					<View style={styles.buttonContainer}>
						<View style={styles.passwordRecoveryTextContainer}>
							<Text style={styles.passwordRecoveryTitle}>
								{t('authScreens.passwordChangedTitle')}
							</Text>
							<Text style={styles.passwordRecoveryText}>
								{t('authScreens.passwordChangedMessage')}
							</Text>
							<PrimaryButton
								text={t('authScreens.passwordChangedButton')}
								onPress={() => router.push('/login-with-credentials')}
							/>
						</View>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
}
