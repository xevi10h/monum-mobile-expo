/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
	Dimensions,
	Modal,
	Platform,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import IUser from '../../../shared/interfaces/IUser';
import { useMutation, useQuery } from '@apollo/client';
import {
	DELETE_HARD_MY_USER,
	GET_USER_BY_ID,
	UPDATE_USER,
} from '../../../graphql/queries/userQueries';
import ProfilePhotoComponent from '@/components/profile/ProfilePhoto';
import LanguageSelector from '@/components/profile/LanguageSelector';
import NameInput from '@/components/profile/NameInput';
import PrimaryButton from '@/components/profile/PrimaryButton';
import SecondaryButton from '@/components/profile/SecondaryButton';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import ErrorComponent from '../../../shared/components/ErrorComponent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Language } from '../../../shared/types/Language';
import client from '../../../graphql/connection';
import { useUserStore } from '../../../zustand/UserStore';
import { useMainStore } from '../../../zustand/MainStore';
import { useTabMapStore } from '../../../zustand/TabMapStore';
import { useTabRouteStore } from '../../../zustand/TabRouteStore';
import { BOTTOM_TAB_NAVIGATOR_HEIGHT } from '@/app/(main)/_layout';
import { useTranslation } from '@/hooks/useTranslation';
import DeleteButton from '@/components/profile/DeleteButton';
import ConfirmDeleteAccountButton from '@/components/profile/ConfirmDeleteAccountButton';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceLanguage } from '@/shared/functions/utils';
import { changeLanguage } from '@/i18n';

const height = Dimensions.get('window').height;

export default function ProfileScreen() {
	const { t } = useTranslation();
	const height = Dimensions.get('window').height;
	const onRetry = useQuery(GET_USER_BY_ID);
	const safeArea = useSafeAreaInsets();
	const user = useUserStore((state) => state.user);
	const { permissions } = user;
	const hasPermissionToUpdateUser = permissions?.some(
		(permission) =>
			permission.action.includes('update') && permission.entity === 'user',
	);
	const applicationLanguage = useUserStore((state) => state.user.language);
	const setLanguage = useUserStore((state) => state.setLanguage);
	const updatePhoto = useUserStore((state) => state.updatePhoto);
	const updateUsername = useUserStore((state) => state.updateUsername);
	const setUser = useUserStore((state) => state.setUser);

	const [provisionalUser, setProvisionalUser] = useState<IUser>(user);
	const [provisionalLanguage, setProvisionalLanguage] =
		useState<Language>(applicationLanguage);

	const setDefaultUser = useUserStore((state) => state.setDefaultUser);
	const setDefaultMain = useMainStore((state) => state.setDefaultMain);
	const setDefaultTabMap = useTabMapStore((state) => state.setDefaultTabMap);

	const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

	const isGuest =
		user.username && (user.email || user.thirdPartyEmail) ? false : true;

	const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);

	const { data, loading, error } = useQuery(GET_USER_BY_ID, {
		skip: !!user?.token,
	});

	const [
		updateUser,
		{ data: dataUpdated, loading: loadingUpdated, error: errorUpdated },
	] = useMutation(UPDATE_USER);

	const [
		deleteHardMyUser,
		{
			data: deleteHardMyUserData,
			loading: loadingDeleted,
			error: errorDeleted,
		},
	] = useMutation(DELETE_HARD_MY_USER);

	// Actualizar el usuario si cambia la foto de perfil
	useEffect(() => {
		if (photoBase64) {
			updateUser({
				variables: {
					updateUserInput: {
						id: provisionalUser.id,
						photoBase64,
					},
				},
			});
		}
	}, [photoBase64]);

	useEffect(() => {
		if (user) {
			setProvisionalUser(user);
		}
	}, [user]);

	useEffect(() => {
		if (data && data.user) {
			setUser(data.user);
		}
	}, [data]);

	useEffect(() => {
		if (dataUpdated?.updateUser?.photo) {
			updatePhoto(dataUpdated.updateUser.photo);
		}
	}, [dataUpdated]);

	const handleUpdatePress = async () => {
		try {
			if (
				hasPermissionToUpdateUser &&
				provisionalUser.username !== user.username
			) {
				await updateUser({
					variables: {
						updateUserInput: {
							id: provisionalUser.id,
							username: provisionalUser.username,
						},
					},
				});
				provisionalUser.username && updateUsername(provisionalUser.username);
			}

			await updateUser({
				variables: {
					updateUserInput: {
						id: provisionalUser.id,
						language: provisionalLanguage,
					},
				},
			});
			await client.clearStore();
			const deviceLanguage = getDeviceLanguage();
			setLanguage(provisionalLanguage || deviceLanguage);
		} catch (error) {
			console.error('Error al actualizar el usuario:', error);
		}
	};

	const labelText = (userParam: string) => {
		switch (userParam) {
			case 'username':
				return t('authScreens.username');
			case 'language':
				return t('profile.language');
			default:
				return t('authScreens.username');
		}
	};

	if (loading) {
		return <LoadingSpinner />;
	}
	if (error) {
		return (
			<ErrorComponent
				errorMessage={t('profile.errorGetting')}
				onRetry={() => onRetry}
			/>
		);
	}

	if (loadingUpdated) {
		return <LoadingSpinner />;
	}
	if (errorUpdated) {
		return (
			<ErrorComponent
				errorMessage={t('profile.errorUpdating')}
				onRetry={async () => {
					try {
						await updateUser({
							variables: {
								updateUserInput: {
									id: provisionalUser.id,
									username: provisionalUser.username,
								},
							},
						});
					} catch (error) {
						console.error('Error al actualizar el usuario:', error);
					}
				}}
			/>
		);
	}
	return (
		<View
			style={[
				styles.page,
				{
					paddingTop: safeArea.top,
					paddingBottom: safeArea.bottom + BOTTOM_TAB_NAVIGATOR_HEIGHT - 10,
				},
			]}
		>
			<Modal
				animationType="fade"
				hardwareAccelerated={true}
				transparent={true}
				style={{ flex: 1 }}
				visible={showDeleteAccountModal}
				onRequestClose={() => {
					setShowDeleteAccountModal(!showDeleteAccountModal);
				}}
			>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
					}}
				>
					<View
						style={{
							margin: 20,
							backgroundColor: 'white',
							borderRadius: 20,
							padding: 35,
							alignItems: 'center',
							shadowColor: '#000',
							shadowOffset: {
								width: 0,
								height: 2,
							},
							shadowOpacity: 0.25,
							shadowRadius: 4,
							elevation: 5,
						}}
					>
						<Text
							style={{
								marginBottom: 30,
								textAlign: 'center',
								fontFamily: 'Montserrat-Regular',
								fontSize: 18,
							}}
						>
							{t('profile.deleteMyAccountConfirmation')}
						</Text>
						<View
							style={{
								flexDirection: 'row',
								width: '100%',
							}}
						>
							<View style={{ flex: 1, paddingHorizontal: 10 }}>
								<DeleteButton
									text={t('profile.cancel')}
									onPress={() =>
										setShowDeleteAccountModal(!showDeleteAccountModal)
									}
								/>
							</View>
							<View style={{ flex: 1, paddingHorizontal: 10 }}>
								<ConfirmDeleteAccountButton
									text={t('profile.confirm')}
									onPress={async () => {
										try {
											await deleteHardMyUser();
											useUserStore.persist.clearStorage();
											if (Platform.OS === 'web') {
												localStorage.removeItem('user-storage');
												localStorage.removeItem('google-user');
											} else {
												await AsyncStorage.removeItem('user-storage');
												await AsyncStorage.removeItem('google-user');
												await AsyncStorage.removeItem('apple-storage');
											}
											setDefaultUser();
											setDefaultMain();
											setDefaultTabMap();
											changeLanguage(getDeviceLanguage());
										} catch (error) {
											console.error('Error al cerrar sesión:', error);
										}
									}}
								/>
							</View>
						</View>
					</View>
				</View>
			</Modal>
			<View
				style={{
					flex: 1,
					justifyContent: 'space-between',
					height: '100%',
					width: '100%',
				}}
			>
				<View>
					<View style={styles.profilePhotoContainer}>
						<ProfilePhotoComponent
							url={user.photo}
							username={provisionalUser.username}
							setNewPhoto={(newPhoto) => setPhotoBase64(newPhoto)}
						/>
					</View>
					<View style={styles.inputsContainer}>
						{(provisionalUser.username !== null ||
							provisionalUser.username !== undefined) && (
							<NameInput
								labelText={labelText('username')}
								value={provisionalUser.username || ('' as string)}
								setValue={(newUsername: string) => {
									setProvisionalUser((prevUser) => ({
										...prevUser,
										username: newUsername,
									}));
								}}
							/>
						)}
						<LanguageSelector
							provisionalLanguage={provisionalLanguage}
							setProvisionalLanguage={setProvisionalLanguage}
						/>
					</View>
					<View style={styles.updateButtonContainer}>
						{user.hasPassword && hasPermissionToUpdateUser && (
							<SecondaryButton
								text={t('profile.changePassword')}
								onPress={() => {
									router.push('/profile/profile-change-password');
								}}
								style={{ marginTop: height < 700 ? 10 : 20 }}
							/>
						)}
						<PrimaryButton
							text={t('profile.update')}
							onPress={handleUpdatePress}
						/>

						{!isGuest && (
							<Text style={styles.textCreatedAt}>{`${t(
								'profile.createdAt',
							)} ${new Date(provisionalUser.createdAt).toLocaleDateString(
								applicationLanguage?.replace('_', '-') || 'en-US',
								{
									day: 'numeric',
									month: 'short',
									year: 'numeric',
								},
							)}`}</Text>
						)}
					</View>
				</View>
				<View>
					<View style={[styles.logoutButtonContainer]}>
						<SecondaryButton
							text={
								isGuest ? t('profile.createMyAccount') : t('profile.logout')
							}
							onPress={async () => {
								try {
									// Clear persisted storage
									useUserStore.persist.clearStorage();

									if (Platform.OS === 'web') {
										localStorage.removeItem('user-storage');
										localStorage.removeItem('google-user');
										window.location.reload();
									} else {
										await AsyncStorage.removeItem('user-storage');
										await AsyncStorage.removeItem('google-user');
										await AsyncStorage.removeItem('apple-storage');
										setDefaultUser();
										setDefaultMain();
										setDefaultTabMap();
										changeLanguage(getDeviceLanguage());
									}
								} catch (error) {
									console.error('Error al cerrar sesión:', error);
								}
							}}
						/>
					</View>
					{!isGuest && (
						<View style={[styles.deleteAccountButtonContainer]}>
							<DeleteButton
								text={t('profile.deleteMyAccount')}
								onPress={async () => {
									try {
										setShowDeleteAccountModal(!showDeleteAccountModal);
									} catch (error) {
										console.error(
											'Error al mostrar el popup de confirmación:',
											error,
										);
									}
								}}
							/>
						</View>
					)}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		alignItems: 'center',
		elevation: 0,
		backgroundColor: 'white',
	},
	profilePhotoContainer: {
		paddingVertical: '8%',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputsContainer: {
		width: '100%',
		paddingHorizontal: 10,
		zIndex: 10,
	},
	updateButtonContainer: {
		width: '100%',
		paddingHorizontal: 30,
		marginBottom: 30,
	},
	textCreatedAt: {
		fontSize: height < 700 ? 12 : 16,
		color: '#3F713B',
		fontFamily: 'Montserrat-Regular',
		textAlign: 'center',
	},
	logoutButtonContainer: {
		width: '100%',
		paddingHorizontal: 30,
	},
	deleteAccountButtonContainer: {
		marginTop: height < 700 ? 10 : 20,
		width: '100%',
		paddingHorizontal: 30,
	},
});
