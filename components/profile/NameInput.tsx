import { Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { useUserStore } from '@/zustand/UserStore';

interface NameInputProps {
	labelText: string;
	value: string;
	setValue: (string: string) => void;
}

export default function NameInput({
	labelText,
	value,
	setValue,
}: NameInputProps) {
	const user = useUserStore((state) => state.user);
	const { permissions } = user;
	const hasPermissionToUpdate = permissions?.some(
		(permission) =>
			permission.action.includes('update') && permission.entity === 'user',
	);
	return (
		<View style={styles.container}>
			<View style={styles.labelContainer}>
				<Text style={styles.labelText}>{labelText}</Text>
			</View>
			<View style={styles.inputContainer}>
				<TextInput
					editable={hasPermissionToUpdate}
					value={value}
					style={styles.inputText}
					onChangeText={setValue}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 15,
	},
	labelContainer: {
		width: '100%',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	labelText: {
		fontSize: 16,
		color: '#3F713B',
		fontFamily: 'Montserrat-Regular',
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
		marginVertical: 5,
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: 16,
		fontFamily: 'Montserrat-SemiBold',
		fontWeight: '600',
	},
});
