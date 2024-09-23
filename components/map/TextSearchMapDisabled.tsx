import {
	View,
	Image,
	StyleSheet,
	ViewStyle,
	Pressable,
	Text,
	ActivityIndicator,
} from 'react-native';
import { useTabMapStore } from '@/zustand/TabMapStore';
import { useTranslation } from '@/hooks/useTranslation';

interface TextSearchMapDisabledProps {
	onPress: () => void;
}

export default function TextSearchMapDisabled({
	onPress,
}: TextSearchMapDisabledProps & { style?: ViewStyle }) {
	const { t } = useTranslation();
	const textSearch = useTabMapStore((state) => state.tabMap.textSearch);
	const textSearchIsLoading = useTabMapStore(
		(state) => state.tabMap.textSearchIsLoading,
	);

	return (
		<View
			style={{
				width: '100%',
				top: 60,
				paddingHorizontal: 15,
				position: 'absolute',
				alignSelf: 'center',
			}}
		>
			<Pressable onPress={onPress} style={{ flex: 1 }}>
				<View style={styles.container}>
					<View
						style={{
							marginRight: 5,
							width: 30,
							height: '100%',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Image
							source={require('@/assets/images/routes_text_search.png')}
							style={styles.image}
							resizeMode="contain"
						/>
					</View>
					<View
						style={{
							width: '100%',
						}}
					>
						<Text style={styles.textInput} numberOfLines={1}>
							{textSearch || t('routes.search')}
						</Text>
					</View>
					{textSearchIsLoading && (
						<View
							style={{
								position: 'absolute',
								right: 15,
								width: 20,
								height: 20,
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<ActivityIndicator size="small" color="#3F713B" />
						</View>
					)}
				</View>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		borderRadius: 12,
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: 15,
		height: 42,
		width: '100%',
		zIndex: 999,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 5,
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
