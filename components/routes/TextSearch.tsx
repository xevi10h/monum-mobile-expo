import {
	View,
	Image,
	TextInput,
	StyleSheet,
	ViewStyle,
	Platform,
} from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface TextSearchProps {
	textSearch: string | undefined;
	setTextSearch: (string: string | undefined) => void;
}

export default function TextSearch({
	textSearch,
	setTextSearch,
	style,
}: TextSearchProps & { style?: ViewStyle }) {
	const { t } = useTranslation();
	return (
		<View
			style={[
				style,
				{
					width: '100%',
					paddingHorizontal: 15,
					alignSelf: 'center',
				},
			]}
		>
			<View style={styles.container}>
				<LinearGradient
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 0.3 }}
					colors={['#3C6AF62E', '#3F713B14']}
					style={styles.linearGradient}
				/>
				<TouchableOpacity>
					<View
						style={{
							marginRight: Platform.OS === 'ios' ? 5 : 2,
							width: 30,
							height: '100%',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Image
							source={require('@/assets/images/routes_text_search.png')}
							style={styles.image}
						/>
					</View>
				</TouchableOpacity>
				<View
					style={{ width: '100%', height: '100%', justifyContent: 'center' }}
				>
					<TextInput
						placeholder={t('routes.search') || 'Search'}
						placeholderTextColor="#3F713B"
						value={textSearch}
						onChangeText={setTextSearch}
						style={styles.textInput}
						numberOfLines={1}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#F4FFF4',
		borderRadius: 12,
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: 15,
		height: 42,
		opacity: 1,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 10,
		zIndex: 2,
		width: '100%',
	},
	linearGradient: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		borderRadius: 12,
	},
	image: { width: 22, height: 22, marginRight: 10 },
	textInput: {
		color: '#3F713B',
		marginRight: 50,
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: 16,
		fontFamily: 'Montserrat-Regular',
	},
});
