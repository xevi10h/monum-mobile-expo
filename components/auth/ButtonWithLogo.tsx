import React from 'react';
import {
	Text,
	TouchableOpacity,
	ImageSourcePropType,
	GestureResponderEvent,
	View,
	ViewStyle,
	Image,
} from 'react-native';

import { styles } from '../../styles/auth/LoginStyles';

interface ButtonWithLogoProps {
	imageSource?: ImageSourcePropType;
	text: string;
	onPress: (event: GestureResponderEvent) => void;
	style?: ViewStyle;
	textColor?: string;
}

export default function ButtonWithLogo({
	imageSource,
	text,
	onPress,
	style,
	textColor,
}: ButtonWithLogoProps) {
	return (
		<TouchableOpacity
			activeOpacity={0.2}
			style={[styles.buttonWithLogoContainer, style]}
			onPress={onPress}
		>
			{imageSource && (
				<View
					style={{
						position: 'absolute',
						height: 20,
						width: '100%',
					}}
				>
					<View
						style={{
							position: 'relative',
							left: 20,
							width: 20,
							height: '100%',
						}}
					>
						<Image
							source={imageSource}
							style={styles.buttonWithLogoImage}
							resizeMode="contain"
						/>
					</View>
				</View>
			)}
			<Text
				style={[styles.buttonWithLogoText, { color: textColor || 'white' }]}
			>
				{text}
			</Text>
		</TouchableOpacity>
	);
}
