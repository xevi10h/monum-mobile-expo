import { SMALL_SCREEN } from '@/shared/variables/constants';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PrimaryButtonProps {
	text: string;
	onPress: () => void;
}

export default function PrimaryButton({ text, onPress }: PrimaryButtonProps) {
	return (
		<TouchableOpacity
			activeOpacity={0.2}
			style={styles.button}
			onPress={onPress}
		>
			<Text style={styles.buttonText}>{text}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		borderRadius: 24,
		height: SMALL_SCREEN ? 36 : 48,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: '#3F713B',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 4,
		elevation: 10,
		marginVertical: '5%',
	},
	buttonText: {
		fontSize: SMALL_SCREEN ? 14 : 18,
		color: 'white',
		fontFamily: 'Montserrat-Regular',
	},
});
