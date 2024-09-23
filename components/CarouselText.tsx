import { StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Easing } from 'react-native-reanimated';
import { useState } from 'react';

interface CarouselTextProps {
	text: string;
	textStyle?: any;
}

export default function CarouselText({ text, textStyle }: CarouselTextProps) {
	const [maxWidth, setMaxWidth] = useState(0);
	let textFontSize = 14;
	if (textStyle) {
		textFontSize = textStyle.textFontSize || 14;
	}
	const textWidth = text.length * textFontSize * 0.5;
	return (
		<View
			style={{ width: '100%' }}
			onLayout={(e) => {
				const { width: newWidth } = e.nativeEvent.layout;
				setMaxWidth(newWidth);
			}}
		>
			{textWidth <= maxWidth ? (
				<Text
					style={[styles.mediaBubbleTitleText, textStyle]}
					numberOfLines={1}
				>
					{text}
				</Text>
			) : (
				<Carousel
					loop
					autoPlay
					width={textWidth + 200}
					height={17}
					style={{
						width: '100%',
					}}
					snapEnabled={false}
					pagingEnabled={false}
					autoPlayInterval={0}
					enabled={false}
					data={[text]}
					withAnimation={{
						type: 'timing',
						config: {
							duration: 15000,
							easing: Easing.linear,
						},
					}}
					renderItem={() => (
						<Text style={[styles.mediaBubbleTitleText, textStyle]}>{text}</Text>
					)}
				/>
			)}
		</View>
	);
}
const styles = StyleSheet.create({
	mediaBubbleTitleText: {
		color: '#032000',
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
	},
});
