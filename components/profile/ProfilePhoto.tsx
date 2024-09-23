import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from '@/zustand/UserStore';

interface ProfilePhotoComponentProps {
	url: string | undefined;
	username?: string;
	setNewPhoto: (photoBase64: string) => void;
}
export default function ProfilePhotoComponent({
	url,
	username,
	setNewPhoto,
}: ProfilePhotoComponentProps) {
	const pickImage = async () => {
		try {
			const image = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 1,
				base64: true,
				allowsMultipleSelection: false,
				selectionLimit: 1,
			});
			// Ahora, la imagen en base64 estará en image.data
			if (image?.assets) {
				const uri = image.assets[0].uri;
				const extension = uri.split('.').pop();

				let mimeType = '';
				if (extension === 'jpg' || extension === 'jpeg') {
					mimeType = 'image/jpeg';
				} else if (extension === 'png') {
					mimeType = 'image/png';
				} else {
					mimeType = 'application/octet-stream';
				}

				const base64Image = `data:${mimeType};base64,${image.assets[0].base64}`;
				setNewPhoto(base64Image);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const user = useUserStore((state) => state.user);
	const { permissions } = user;
	const hasPermissionToUpdateUser = permissions?.some(
		(permission) =>
			permission.action.includes('update') && permission.entity === 'user',
	);

	return (
		<TouchableOpacity onPress={pickImage} disabled={!hasPermissionToUpdateUser}>
			<View style={styles.container}>
				{url ? (
					<Image source={{ uri: url }} style={styles.profilePhoto} />
				) : username ? (
					<Text style={styles.profileInitialPhotoSubstitute}>
						{username?.slice(0, 1).toUpperCase()}
					</Text>
				) : (
					<Image
						source={require('@/assets/images/default_user_avatar.png')}
						style={styles.profilePhoto}
					/>
				)}
				{hasPermissionToUpdateUser && (
					<View style={styles.addButtonContainer}>
						<View style={styles.backgroundButton}>
							<View style={styles.horizontalLine} />
							<View style={styles.verticalLine} />
						</View>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		width: 105,
		height: 105,
		borderRadius: 100,
		borderWidth: 3,
		borderColor: '#3F713B',
		alignItems: 'center',
		justifyContent: 'center',
	},
	profilePhoto: {
		width: 100,
		height: 100,
		borderRadius: 100,
	},
	profileInitialPhotoSubstitute: {
		fontSize: 55,
		alignSelf: 'center',
		color: '#3F713B',
		fontFamily: 'Montserrat-Regular',
		fontWeight: '400',
	},
	addButtonContainer: {
		width: 30,
		height: 30,
		borderRadius: 30,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		top: -5,
		right: -5,
	},
	backgroundButton: {
		width: 25,
		height: 25,
		borderRadius: 30,
		backgroundColor: 'black',
		alignItems: 'center',
		justifyContent: 'center',
	},
	horizontalLine: {
		width: 15,
		height: 3,
		backgroundColor: 'white',
		borderRadius: 10,
		top: 7.5,
	},
	verticalLine: {
		width: 3,
		height: 15,
		backgroundColor: 'white',
		borderRadius: 10,
		top: -1.5,
	},
});
