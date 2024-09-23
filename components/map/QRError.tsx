import { View, StyleSheet, Image, Text } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';

export default function QRError({ text }: { text: string }) {
	const { t } = useTranslation();
	return (
		<View style={styles.container}>
			<Image
				source={require('@/assets/images/error.png')}
				style={styles.icon}
				resizeMode="contain"
			/>
			<Text
				style={{
					color: '#BF1C39',
					fontSize: 20,
					marginTop: 20,
					fontFamily: 'Montserrat-SemiBold',
					textAlign: 'center',
				}}
			>
				{t(text)}
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
		padding: 20,
	},
	icon: {
		width: 50,
		height: 50,
	},
});
