import React from 'react';
import { Text, TouchableOpacity, GestureResponderEvent } from 'react-native';

import { styles } from '../../styles/auth/LoginStyles';

interface PrimaryButtonProps {
	text: string;
	onPress: (event: GestureResponderEvent) => void;
	disabled?: boolean;
}

export default function PrimaryButton({
	text,
	onPress,
	disabled,
}: PrimaryButtonProps) {
	return (
		<TouchableOpacity
			disabled={disabled}
			activeOpacity={0.2}
			style={[styles.primaryButton, disabled && { opacity: 0.5 }]}
			onPress={onPress}
		>
			<Text style={styles.primaryButtonText}>{text}</Text>
		</TouchableOpacity>
	);
}
