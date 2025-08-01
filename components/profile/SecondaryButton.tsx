import { SMALL_SCREEN } from '@/shared/variables/constants';
import {
	Text,
	TouchableOpacity,
	GestureResponderEvent,
	StyleSheet,
	ViewStyle,
} from 'react-native';

interface SecondaryButtonProps {
	text: string;
	onPress: (event: GestureResponderEvent) => void;
	style?: ViewStyle;
	disabled?: boolean;
}

export default function SecondaryButton({
	text,
	onPress,
	style,
	disabled,
}: SecondaryButtonProps) {
	return (
		<TouchableOpacity
			activeOpacity={0.2}
			style={[styles.button, style, { opacity: disabled ? 0.5 : 1 }]}
			onPress={onPress}
			disabled={disabled}
		>
			<Text style={[styles.buttonText]}>{text}</Text>
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
		backgroundColor: '#FFF172',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 4,
		elevation: 10,
	},
	buttonText: {
		fontSize: SMALL_SCREEN ? 14 : 18,
		color: '#032000',
		fontFamily: 'Montserrat-Regular',
	},
});
