/* eslint-disable react-hooks/exhaustive-deps */
import {
	View,
	Image,
	TextInput,
	StyleSheet,
	Pressable,
	TouchableOpacity,
} from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';
import { useTabMapStore } from '@/zustand/TabMapStore';
import { router } from 'expo-router';

export default function TextSearchMap() {
	const { t } = useTranslation();
	const textSearch = useTabMapStore((state) => state.tabMap.textSearch);
	const setTextSearch = useTabMapStore((state) => state.setTextSearch);

	return (
		<View
			style={{
				width: '100%',
				marginTop: 60,
				paddingHorizontal: 15,
				alignSelf: 'center',
				marginBottom: 5,
			}}
		>
			<View style={[styles.container]}>
				<LinearGradient
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 0.3 }}
					colors={['#3C6AF62E', '#3F713B14']}
					style={styles.linearGradient}
				/>
				<TouchableOpacity onPress={() => router.back()}>
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
							source={require('@/assets/images/text_search_back.png')}
							style={styles.image}
						/>
					</View>
				</TouchableOpacity>
				<View
					style={{ width: '100%', height: '100%', justifyContent: 'center' }}
				>
					<TextInput
						ref={(input) => input && input.focus()}
						placeholder={t('routes.search') || 'Search'}
						placeholderTextColor="#3F713B"
						value={textSearch}
						onChangeText={setTextSearch}
						style={styles.textInput}
						numberOfLines={1}
					/>
				</View>
				{textSearch && textSearch.length > 0 && (
					<View
						style={{
							position: 'absolute',
							right: 5,
							width: 30,
							height: 40,
						}}
					>
						<Pressable
							onPress={() => setTextSearch('')}
							style={{
								width: '100%',
								height: '100%',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Image
								source={require('@/assets/images/text_search_delete.png')}
								style={{ width: 10, height: 10 }}
								resizeMode="contain"
							/>
						</Pressable>
					</View>
				)}
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
	image: { width: 14, height: 14, marginRight: 10 },
	textInput: {
		color: '#3F713B',
		marginRight: 50,
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: 16,
		fontFamily: 'Montserrat-Regular',
	},
});
