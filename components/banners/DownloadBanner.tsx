import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { Image, View } from 'react-native';
import * as Device from 'expo-device';
import { useTranslation } from '@/hooks/useTranslation';

const DownloadBanner = () => {
	const { t } = useTranslation();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (Platform.OS !== 'web') {
			return;
		}
		const hasVisited = localStorage.getItem('hasVisited');
		if (!hasVisited) {
			setVisible(true);
			localStorage.setItem('hasVisited', 'true');
		}
	}, []);

	if (!visible) {
		return null;
	}

	const handleOpenApp = () => {
		const os = Device.osName;

		if (os === 'iOS') {
			window.location.href =
				'https://apps.apple.com/es/app/monum/id6474858222?l=ca';
		} else if (os === 'Android') {
			window.location.href =
				'https://play.google.com/store/apps/details?id=es.monum.mobile';
		} else {
			window.location.href = 'https://monum.es';
		}
	};

	const handleClose = () => {
		setVisible(false);
	};

	return (
		<View style={styles.banner}>
			<Image source={require('@/assets/images/icon.png')} style={styles.logo} />
			<Text style={styles.text}>{t('downloadBanner.text')}</Text>
			<TouchableOpacity onPress={handleOpenApp} style={styles.openButton}>
				<Text style={styles.openButtonText}>{t('downloadBanner.button')}</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={handleClose} style={styles.closeButton}>
				<Image
					source={require('@/assets/images/delete.png')}
					style={styles.closeButtonText}
				/>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	banner: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		position: 'absolute',
		top: 0,
		width: '100%',
		zIndex: 1000,
		height: 80,
		backgroundColor: '#ECF3EC',
	},
	logo: {
		width: 40,
		height: 40,
		marginRight: 10,
		borderRadius: 20,
	},
	text: {
		flex: 1,
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
		color: '#032000',
	},
	openButton: {
		backgroundColor: '#032000',
		padding: 10,
		borderRadius: 5,
		marginRight: 10,
		marginLeft: 10,
	},
	openButtonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
	closeButton: {
		padding: 10,
	},
	closeButtonText: {
		width: 16,
		height: 16,
	},
});

export default DownloadBanner;
