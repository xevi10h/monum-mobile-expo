import { StyleSheet, Text, Pressable, View } from 'react-native';
import IRouteOfCity from '@/shared/interfaces/IRouteOfCity';
import RatingPill from './RatingPill';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface ListRoutePillProps {
	route: IRouteOfCity;
	onPress?: () => void;
}

export default function ListRoutePill({ route, onPress }: ListRoutePillProps) {
	const [globalPressed, setGlobalPressed] = useState<boolean>(false);
	const { t } = useTranslation();
	return (
		<Pressable
			onPress={onPress}
			onPressIn={() => setGlobalPressed(true)}
			onPressOut={() => setGlobalPressed(false)}
			style={({ pressed }) => [
				{
					paddingHorizontal: 12,
					opacity: pressed ? 0.2 : 1,
				},
			]}
		>
			<View style={styles.placeMediaPillContainer}>
				<View
					style={[styles.placeMediaPill, { opacity: globalPressed ? 0.2 : 1 }]}
				>
					<Text style={styles.placeMediaPillTitle}>{route.title}</Text>
					<Text style={styles.placeMediaPillDuration}>
						{`${route.stopsCount} ${t('routes.stops')}`}
					</Text>
				</View>
				{route.rating && (
					<RatingPill
						number={route.rating || 0}
						additionalStyle={{
							position: 'absolute',
							top: 0,
							left: 10,
							opacity: globalPressed ? 0.2 : 1,
						}}
					/>
				)}
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	placeMediaPillContainer: {
		width: '100%',
		height: 70,
	},
	placeMediaPill: {
		height: 50,
		borderRadius: 12,
		backgroundColor: 'white',
		marginVertical: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
	},
	placeMediaPillTitle: {
		fontSize: 14,
		color: '#032000',
		fontFamily: 'Montserrat-Regular',
		backgroundColor: 'white',
	},
	placeMediaPillDuration: {
		fontSize: 10,
		color: '#032000',
		fontFamily: 'Montserrat-Regular',
	},
});
