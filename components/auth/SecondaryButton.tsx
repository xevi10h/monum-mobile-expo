import {
	Text,
	// Image,
	TouchableOpacity,
	ImageSourcePropType,
	GestureResponderEvent,
	View,
	ViewStyle,
	Image,
} from 'react-native';

import { styles } from '../../styles/auth/LoginStyles';

interface SecondaryButtonProps {
	imageSource?: ImageSourcePropType;
	text: string;
	onPress: (event: GestureResponderEvent) => void;
	style?: ViewStyle;
}

export default function SecondaryButton({
	imageSource,
	text,
	onPress,
	style,
}: SecondaryButtonProps) {
	return (
		<TouchableOpacity
			activeOpacity={0.2}
			style={[styles.secondaryButton, style]}
			onPress={onPress}
		>
			{imageSource && (
				<View
					style={{
						position: 'absolute',
						left: 9,
						width: 30,
						height: 30,
						backgroundColor: 'white',
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: 15,
					}}
				>
					<Image
						source={imageSource}
						style={styles.secondaryButtonLogo}
						resizeMode="contain"
					/>
				</View>
			)}
			<Text style={styles.secondaryButtonText}>{text}</Text>
		</TouchableOpacity>
	);
}
