import { View, StyleSheet, Image, Text } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';

export default function QRSuccess() {
	const { t } = useTranslation();
	return (
		<View style={styles.container}>
			<Image
				source={require('@/assets/images/success.png')}
				style={styles.icon}
				resizeMode="contain"
			/>
			<Text
				style={{
					color: '#3F713B',
					fontSize: 20,
					marginTop: 20,
					fontFamily: 'Montserrat-SemiBold',
					textAlign: 'center',
				}}
			>
				{t('qrScannerScreen.success')}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.9)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	icon: {
		width: 50,
		height: 50,
	},
});
