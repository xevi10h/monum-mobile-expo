import { Platform, Text } from 'react-native';
import { View } from 'react-native';

interface ErrorComponentProps {
	text: string;
}

export default function ErrorComponent({ text }: ErrorComponentProps) {
	return (
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
					color: '#FFF172',
					fontFamily: 'Montserrat-Regular',
					fontSize: 16,
					textAlign: 'center',
				}}
			>
				{text}
			</Text>
		</View>
	);
}
