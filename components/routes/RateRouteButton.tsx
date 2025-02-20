import { useTranslation } from '@/hooks/useTranslation';
import { useMainStore } from '@/zustand/MainStore';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, Modal } from 'react-native';

interface RateRouteButtonProps {
	routeId: string;
	routeTitle?: string;
	routeAlreadyRated?: boolean;
}

export default function RateRouteButton({
	routeId,
	routeTitle,
	routeAlreadyRated,
}: RateRouteButtonProps) {
	const setReviewModal = useMainStore((state) => state.setReviewModal);
	const { t } = useTranslation();
	return (
		<View style={styles.mediaPillRatingContainer}>
			{routeAlreadyRated ? (
				<Text style={styles.mediaAlreadyRatedText}>
					{t('routes.routeAlreadyRated') || ''}
				</Text>
			) : (
				<Pressable
					style={({ pressed }) => [
						styles.mediaPillRatingButton,
						pressed && styles.mediaPillRatingButtonPressed,
					]}
					onPress={() => {
						setReviewModal({
							entityType: 'route',
							entityId: routeId,
							entityTitle: routeTitle || '',
						});
					}}
				>
					<Text style={styles.mediaPillRatingText}>
						{t('routes.rateRoute') || ''}
					</Text>
				</Pressable>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	mediaPillRatingContainer: {
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
		height: 20,
		width: 70,
	},
	mediaPillRatingButton: {
		borderRadius: 6,
		paddingHorizontal: 6,
		paddingVertical: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	mediaPillRatingButtonPressed: {
		opacity: 0.7,
	},
	mediaPillRatingText: {
		fontSize: 8,
		color: '#032000',
		fontFamily: 'Montserrat-Regular',
		textDecorationLine: 'underline',
	},
	mediaAlreadyRatedText: {
		fontSize: 8,
		color: 'grey',
		fontFamily: 'Montserrat-Regular',
	},
});
