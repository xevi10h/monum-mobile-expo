import { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	Linking,
	View,
	TextInput,
} from 'react-native';
import {
	CameraView,
	BarcodeScanningResult,
	useCameraPermissions,
} from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabMapStore } from '../../../zustand/TabMapStore';
import MapServices from '@/services/map/MapServices';
import QRSpinner from '@/components/map/QRSpinner';
import QRSuccess from '@/components/map/QRSuccess';
import QRError from '@/components/map/QRError';
import { router } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';

export default function ScanScreen({ navigation }: any) {
	const { t } = useTranslation();
	const setMarkerSelected = useTabMapStore((state) => state.setMarkerSelected);
	const setPlace = useTabMapStore((state) => state.setPlace);
	const setShowPlaceDetailExpanded = useTabMapStore(
		(state) => state.setShowPlaceDetailExpanded,
	);
	const setMediasOfPlace = useTabMapStore((state) => state.setMediasOfPlace);
	const setCamera = useTabMapStore((state) => state.setCamera);

	// const device = useCameraDevice('back');

	const [manualCode, setManualCode] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isManualSuccess, setIsManualSuccess] = useState(false);
	const [isManualError, setIsManualError] = useState(false);
	const [manualErrorMessage, setManualErrorMessage] = useState('');

	const [isScanSuccess, setIsScanSuccess] = useState(false);
	const [isScanError, setIsScanError] = useState(false);
	const [scanErrorMessage, setScanErrorMessage] = useState('');

	const [isCameraReady, setIsCameraReady] = useState(false);
	const [status, requestPermission] = useCameraPermissions();
	console.log('status', status);

	useEffect(() => {
		let timer: any;
		if (isScanError) {
			timer = setTimeout(() => {
				setIsScanError(false);
			}, 2000);
		}
		return () => clearTimeout(timer);
	}, [isScanError]);

	useEffect(() => {
		let timer: any;
		if (isManualError) {
			timer = setTimeout(() => {
				setIsManualError(false);
			}, 2000);
		}
		return () => clearTimeout(timer);
	}, [isManualError]);

	const searchForCode = async (placeId: string, isScanner: boolean) => {
		try {
			const fromSupport = isScanner ? 'insideQRScanned' : 'insideQRTexted';
			const placeData = await MapServices.getPlaceInfo(placeId, fromSupport);
			if (!placeData) {
				setTimeout(() => {
					isScanner ? setIsScanError(true) : setIsManualError(true);
					isScanner
						? setScanErrorMessage(t('qrScannerScreen.errorInvalidQR'))
						: setManualErrorMessage(t('qrScannerScreen.manualError'));
				}, 2000);
				return;
			}
			const mediasFetched = await MapServices.getPlaceMedia(placeId);
			isScanner ? setIsScanSuccess(true) : setIsManualSuccess(true);
			setTimeout(() => {
				navigation.navigate('MapScreen');
				setCamera({
					zoomLevel: 17,
					pitch: 0,
					centerCoordinate: [
						placeData.address.coordinates.lng,
						placeData.address.coordinates.lat,
					],
					animationDuration: 2000,
				});
				setPlace(placeData);
				setMarkerSelected(placeId);
				setMediasOfPlace(mediasFetched);
				setShowPlaceDetailExpanded(false);
			}, 1000);
		} catch (error) {
			console.log(error);
			setTimeout(() => {
				isScanner ? setIsScanError(true) : setIsManualError(true);
				isScanner
					? setScanErrorMessage(t('qrScannerScreen.errorRandom'))
					: setManualErrorMessage(t('qrScannerScreen.manualError'));
			}, 2000);
		}
	};

	const codeScanner = async (barcodeScanningResult: BarcodeScanningResult) => {
		setIsLoading(true);
		const [, placeId] =
			barcodeScanningResult?.data?.match(/place\/([^?]+)/) || [];
		if (placeId) {
			searchForCode(placeId, true);
		} else {
			setTimeout(() => {
				setIsScanError(true);
				setScanErrorMessage(t('qrScannerScreen.errorInvalidQR'));
			}, 2000);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		if (status?.canAskAgain && !status?.granted) {
			requestPermission();
		}
	}, [status]);
	return (
		<View
			style={[
				styles.qrScreenContainer,
				{
					paddingBottom: useSafeAreaInsets().bottom + 100,
					paddingTop: useSafeAreaInsets().top + 50,
				},
			]}
		>
			<View style={styles.qrIntroContainer}>
				<Text style={styles.qrIntroText}>
					{t('qrScannerScreen.scanQRText')}
				</Text>
				<View style={styles.qrSearchContainer}>
					<TextInput
						placeholder={t('qrScannerScreen.writeItManually')}
						placeholderTextColor="grey"
						style={styles.qrTextInput}
						value={manualCode}
						onChangeText={setManualCode}
						autoCapitalize="characters"
						numberOfLines={1}
					/>
					<TouchableOpacity
						style={styles.qrSearchButton}
						onPress={async () => {
							try {
								await searchForCode(manualCode.toLowerCase(), false);
								setIsLoading(false);
							} catch (error) {
								console.log(error);
							}
						}}
					>
						<Text style={styles.qrSearchButtonText}>
							{t('qrScannerScreen.search')}
						</Text>
					</TouchableOpacity>
				</View>
				<View>
					<Text
						numberOfLines={1}
						style={{
							color: isManualError
								? '#BF1C39'
								: isManualSuccess
								? '#3F713B'
								: 'transparent',
							fontSize: 14,
							marginTop: 10,
							fontFamily: 'Montserrat-SemiBold',
							height: 20,
						}}
					>
						{isManualError
							? t(manualErrorMessage)
							: t('qrScannerScreen.manualSuccess')}
					</Text>
				</View>
			</View>
			<View
				style={{
					width: '100%',
					position: 'relative',
				}}
			>
				{!status?.granted ? (
					<View
						style={{
							width: '100%',
							padding: 20,
							height: 350,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Text
							style={{
								color: 'white',
								fontSize: 16,
								textAlign: 'center',
								fontFamily: 'Montserrat-SemiBold',
							}}
						>
							{t('qrScannerScreen.noCamera')}
						</Text>
					</View>
				) : (
					<View
						style={{
							width: '100%',
							padding: 5,
							height: 350,
							justifyContent: 'center',
							alignItems: 'center',
							position: 'relative',
						}}
					>
						<CameraView
							barcodeScannerSettings={{
								barcodeTypes: ['qr'],
							}}
							style={{
								width: '100%',
								height: '100%',
								position: 'relative',
							}}
							onBarcodeScanned={codeScanner}
							onCameraReady={() => setIsCameraReady(true)}
						/>
						{isLoading || !isCameraReady ? (
							<QRSpinner />
						) : isScanSuccess ? (
							<QRSuccess />
						) : (
							isScanError && <QRError text={scanErrorMessage} />
						)}
					</View>
				)}
				<View style={[styles.corner, styles.topLeftCorner]} />
				<View style={[styles.corner, styles.topRightCorner]} />
				<View style={[styles.corner, styles.bottomLeftCorner]} />
				<View style={[styles.corner, styles.bottomRightCorner]} />
			</View>
			<TouchableOpacity
				style={styles.qrCancelButton}
				onPress={() => router.back()}
			>
				<Text style={styles.qrCancelButtonText}>
					{t('qrScannerScreen.cancel')}
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	qrScreenContainer: {
		flex: 1,
		paddingHorizontal: 20,
		width: '100%',
		height: '100%',
		backgroundColor: '#202533',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	qrIntroContainer: { width: '100%', alignItems: 'center' },
	qrIntroText: {
		fontFamily: 'Montserrat-SemiBold',
		fontSize: 24,
		color: 'white',
		marginBottom: 20,
	},
	qrSearchContainer: {
		flexDirection: 'row',
		height: 48,
		width: '100%',
		justifyContent: 'space-between',
	},
	qrTextInput: {
		width: '70%',
		backgroundColor: 'white',
		borderRadius: 12,
		shadowColor: '#3F713B',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
		fontFamily: 'Montserrat-SemiBold',
		alignItems: 'center',
		paddingHorizontal: 20,
		fontSize: 12,
		color: 'grey',
	},
	qrSearchButton: {
		width: '28%',
		backgroundColor: '#3F713B',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 4,
		elevation: 5,
	},
	qrSearchButtonText: {
		color: 'white',
		fontFamily: 'Montserrat-SemiBold',
		fontSize: 14,
	},
	qrCancelButton: {
		width: '100%',
		backgroundColor: '#BF1C39',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 24,
		height: 48,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 4,
		elevation: 5,
	},
	qrCancelButtonText: {
		color: 'white',
		fontFamily: 'Montserrat-Regular',
		fontSize: 18,
	},
	corner: {
		position: 'absolute',
		width: 20,
		height: 20,
		borderColor: 'white',
	},
	topLeftCorner: {
		borderTopWidth: 5,
		borderLeftWidth: 5,
		left: 0,
		top: 0,
	},
	topRightCorner: {
		borderTopWidth: 5,
		borderRightWidth: 5,
		right: 0,
		top: 0,
	},
	bottomLeftCorner: {
		borderBottomWidth: 5,
		borderLeftWidth: 5,
		left: 0,
		bottom: 0,
	},
	bottomRightCorner: {
		borderBottomWidth: 5,
		borderRightWidth: 5,
		right: 0,
		bottom: 0,
	},
});
