import {
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	Image,
} from 'react-native';
import { useState } from 'react';

interface ChangePasswordInputProps {
	value: string;
	setValue: (string: string) => void;
	defaultText?: string;
	isError?: boolean;
}

export default function ChangePasswordInput({
	value,
	setValue,
	defaultText,
	isError,
}: ChangePasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	return (
		<View style={styles.container}>
			<View style={styles.inputContainer}>
				<TextInput
					value={value}
					style={[styles.inputText, isError && { borderColor: 'red' }]}
					onChangeText={setValue}
					placeholder={defaultText || ''}
					placeholderTextColor="#3F713B"
					secureTextEntry={!showPassword}
				/>
				<TouchableOpacity
					style={styles.hidePasswordButton}
					onPress={togglePasswordVisibility}
				>
					{showPassword ? (
						<Image
							source={require('@/assets/images/password_eye_green.png')}
							style={styles.hidePasswordButtonIcon}
							resizeMode="contain"
						/>
					) : (
						<Image
							source={require('@/assets/images/password_eye_crossed_green.png')}
							style={styles.hidePasswordButtonIcon}
							resizeMode="contain"
						/>
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputContainer: { alignItems: 'center', width: '100%' },
	inputText: {
		paddingHorizontal: 15,
		borderColor: '#3F713B3D',
		color: '#3F713B',
		borderWidth: 2,
		borderRadius: 12,
		height: 48,
		width: '100%',
		marginVertical: 10,
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: 16,
		fontFamily: 'Montserrat-Regular',
	},
	hidePasswordButton: {
		position: 'absolute',
		right: 15,
		top: 18,
	},
	hidePasswordButtonIcon: {
		width: 24,
	},
});
