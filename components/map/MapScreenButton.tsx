import {
	Image,
	ImageSourcePropType,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BOTTOM_TAB_NAVIGATOR_HEIGHT } from '@/app/(main)/_layout';

interface MapScreenButtonProps {
	onPress: () => void;
	image: ImageSourcePropType;
	additionalBottom?: number;
}

export default function MapScreenButton({
	onPress,
	image,
	additionalBottom = 0,
}: MapScreenButtonProps) {
	const marginBottom = 0;
	return (
		<TouchableOpacity
			style={[
				styles.container,
				{
					bottom:
						useSafeAreaInsets().bottom +
						BOTTOM_TAB_NAVIGATOR_HEIGHT +
						additionalBottom -
						20,
					marginBottom,
				},
			]}
			onPress={onPress}
		>
			<Image source={image} style={styles.icon} resizeMode="contain" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		backgroundColor: 'white',
		width: 48,
		height: 48,
		borderRadius: 10,
		right: 20,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 4,
	},
	icon: {
		width: 32,
		height: 32,
	},
});
