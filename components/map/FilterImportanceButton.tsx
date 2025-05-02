import React, { useEffect, useRef } from 'react';
import {
	Image,
	StyleSheet,
	TouchableOpacity,
	Animated,
	Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BOTTOM_TAB_NAVIGATOR_HEIGHT } from '@/app/(main)/_layout';
import { useTabMapStore } from '@/zustand/TabMapStore';

interface ImportanceItem {
	importance: number;
	imageActive: any;
	imageInactive: any;
}

const possibleImportances: ImportanceItem[] = [
	{
		importance: 1,
		imageActive: require('@/assets/images/1_star_active.png'),
		imageInactive: require('@/assets/images/1_star_inactive.png'),
	},
	{
		importance: 2,
		imageActive: require('@/assets/images/2_star_active.png'),
		imageInactive: require('@/assets/images/2_star_inactive.png'),
	},
	{
		importance: 3,
		imageActive: require('@/assets/images/3_star_active.png'),
		imageInactive: require('@/assets/images/3_star_inactive.png'),
	},
];

export default function FullFilterImportanceButton() {
	const insets = useSafeAreaInsets();
	const isImportanceFilterActive = useTabMapStore(
		(state) => state.tabMap.isImportanceFilterActive,
	);
	const setIsImportanceFilterActive = useTabMapStore(
		(state) => state.setIsImportanceFilterActive,
	);
	const setImportancesSelected = useTabMapStore(
		(state) => state.setImportancesSelected,
	);
	const importancesSelected = useTabMapStore(
		(state) => state.tabMap.importancesSelected,
	);

	const animatedValues = useRef(
		possibleImportances.map(() => ({
			opacity: new Animated.Value(0),
			translateY: new Animated.Value(50),
		})),
	).current;

	const animationDuration = 200;
	const staggerDelay = 100;

	useEffect(() => {
		const toValue = isImportanceFilterActive ? 1 : 0;
		const translateYValue = isImportanceFilterActive ? 0 : 50;

		const animations = possibleImportances.map((_, index) => {
			const animationIndex = isImportanceFilterActive
				? index
				: possibleImportances.length - 1 - index;

			return Animated.parallel([
				Animated.timing(animatedValues[animationIndex].opacity, {
					toValue: toValue,
					duration: animationDuration,
					easing: Easing.out(Easing.ease),
					useNativeDriver: true,
				}),
				Animated.timing(animatedValues[animationIndex].translateY, {
					toValue: translateYValue,
					duration: animationDuration,
					easing: Easing.out(Easing.ease),
					useNativeDriver: true,
				}),
			]);
		});

		Animated.stagger(staggerDelay, animations).start();
	}, [isImportanceFilterActive, animatedValues]);

	const baseBottomPosition = insets.bottom + BOTTOM_TAB_NAVIGATOR_HEIGHT + 100;

	return (
		<>
			{possibleImportances.map(
				({ importance, imageActive, imageInactive }, index) => {
					const isActive = importancesSelected?.includes(importance);
					const finalBottom = baseBottomPosition + 60 * importance;

					return (
						<Animated.View
							key={`importance-filter-animated-${importance}`}
							style={[
								styles.container,
								{
									bottom: finalBottom,
									opacity: animatedValues[index].opacity,
									transform: [{ translateY: animatedValues[index].translateY }],
								},
								isActive && styles.activeButton,
								!isImportanceFilterActive && styles.hiddenPointerEvents,
							]}
							pointerEvents={isImportanceFilterActive ? 'auto' : 'none'}
						>
							<TouchableOpacity
								style={styles.touchableArea}
								onPress={() => {
									setImportancesSelected(
										isActive
											? importancesSelected?.filter(
													(importanceSelected) =>
														importanceSelected !== importance,
											  ) ?? []
											: [...(importancesSelected ?? []), importance],
									);
								}}
							>
								<Image
									source={isActive ? imageActive : imageInactive}
									style={styles.icon}
									resizeMode="contain"
								/>
							</TouchableOpacity>
						</Animated.View>
					);
				},
			)}

			<TouchableOpacity
				style={[
					styles.container,
					{
						bottom: baseBottomPosition,
					},
				]}
				onPress={() => setIsImportanceFilterActive(!isImportanceFilterActive)}
				activeOpacity={0.7}
			>
				<Image
					source={require('@/assets/images/monum_logo_green.png')}
					style={styles.icon}
					resizeMode="contain"
				/>
			</TouchableOpacity>
		</>
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
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
	},
	activeButton: {
		backgroundColor: '#3F713B',
	},
	icon: {
		width: 32,
		height: 32,
	},
	touchableArea: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	hiddenPointerEvents: {},
});
