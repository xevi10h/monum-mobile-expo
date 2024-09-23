import { Image, TouchableOpacity } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native';
import { useState } from 'react';
import ChangePasswordInput from '@/components/profile/ChangePasswordInput';
import SecondaryButton from '@/components/profile/SecondaryButton';
import { useMutation } from '@apollo/client';
import { UPDATE_PASSWORD } from '../../../graphql/queries/userQueries';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import { BOTTOM_TAB_NAVIGATOR_HEIGHT } from '@/app/(main)/_layout';
import { router } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';

export default function ProfileUpdatePasswordScreen() {
	const { t } = useTranslation();
	const safeArea = useSafeAreaInsets();
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');

	const [
		updatePassword,
		{
			data: dataUpdatedPassword,
			loading: loadingUpdatedPassword,
			error: error,
		},
	] = useMutation(UPDATE_PASSWORD);

	const isDisabled = () => {
		return (
			newPassword !== confirmNewPassword ||
			newPassword.length < 8 ||
			confirmNewPassword.length < 8
		);
	};

	if (loadingUpdatedPassword) return <LoadingSpinner />;

	return (
		<View style={[styles.page, { paddingTop: safeArea.top + 20 }]}>
			<View style={styles.container}>
				<View style={styles.profilePhotoContainer}>
					<TouchableOpacity
						style={{ padding: 10 }}
						onPress={() => router.back()}
					>
						<Image
							source={require('@/assets/images/media_bubble_back.png')}
							style={{ height: 14, width: 8 }}
						/>
					</TouchableOpacity>
					<Text style={styles.goBackText}>{t('profile.changePassword')}</Text>
				</View>
				<Text style={styles.introductionText}>
					{t('profile.introChangePassword')}
				</Text>
				<ChangePasswordInput
					isError={
						error?.graphQLErrors[0]?.extensions?.code === 'incorrectPassword1'
					}
					value={currentPassword}
					setValue={setCurrentPassword}
					defaultText={t('profile.currentPassword') || 'Current password'}
				/>
				<ChangePasswordInput
					isError={
						error?.graphQLErrors[0]?.extensions?.code === 'passwordNotStrong'
					}
					value={newPassword}
					setValue={setNewPassword}
					defaultText={t('profile.newPassword') || 'New password'}
				/>
				<ChangePasswordInput
					isError={
						error?.graphQLErrors[0]?.extensions?.code === 'passwordNotStrong'
					}
					value={confirmNewPassword}
					setValue={setConfirmNewPassword}
					defaultText={
						t('profile.confirmedNewPassword') || 'Confirm new password'
					}
				/>
				{error && (
					<View
						style={{
							width: '100%',
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: 10,
						}}
					>
						<Text
							style={{
								color: 'red',
								fontFamily: 'Montserrat-Regular',
								fontSize: 16,
								textAlign: 'center',
							}}
						>
							{t(`errors.profile.${error?.graphQLErrors[0]?.extensions?.code}`)}
						</Text>
					</View>
				)}
			</View>
			<View style={{ paddingHorizontal: 20 }}>
				<SecondaryButton
					text={t('profile.changePassword')}
					onPress={async () => {
						try {
							await updatePassword({
								variables: {
									oldPassword: currentPassword,
									newPassword: newPassword,
								},
							});
							router.back();
						} catch (error) {
							console.error('Error al cambiar la contraseña:', error);
						}
					}}
					style={{
						marginBottom: safeArea.bottom + BOTTOM_TAB_NAVIGATOR_HEIGHT,
					}}
					disabled={isDisabled()}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		elevation: 0,
		backgroundColor: 'white',
		justifyContent: 'space-between',
	},
	container: {
		paddingHorizontal: 20,
	},
	profilePhotoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	goBackText: {
		fontSize: 16,
		color: '#032000',
		fontFamily: 'Montserrat-SemiBold',
	},
	introductionText: {
		fontSize: 14,
		color: '#3F713B',
		fontFamily: 'Montserrat-Regular',
		paddingVertical: 10,
	},
});
