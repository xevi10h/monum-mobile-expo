import { useTranslation } from '@/hooks/useTranslation';
import { useMainStore } from '@/zustand/MainStore';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface RateRouteButtonProps {
	mediaId: string;
	mediaTitle?: string;
	mediaType?: 'video' | 'text' | 'audio';
	alredyRated?: boolean;
}

export default function RateMediaButton({
	mediaId,
	mediaTitle,
	mediaType,
	alredyRated,
}: RateRouteButtonProps) {
	const { t } = useTranslation();
	let rateText = '';
	if (mediaType === 'video') {
		rateText = alredyRated
			? t('mediaDetailExpanded.videoAlreadyRated')
			: t('mediaDetailExpanded.rateVideo');
	}
	if (mediaType === 'text') {
		rateText = alredyRated
			? t('mediaDetailExpanded.textAlreadyRated')
			: t('mediaDetailExpanded.rateText');
	}
	if (mediaType === 'audio') {
		rateText = alredyRated
			? (rateText = t('mediaDetailExpanded.audioAlreadyRated'))
			: (rateText = t('mediaDetailExpanded.rateAudio'));
	}
	const setReviewModal = useMainStore((state) => state.setReviewModal);

	return (
		<View style={styles.rateMediaContainer}>
			{alredyRated ? (
				<Text style={styles.mediaAlreadyRatedText}>{rateText}</Text>
			) : (
				<Pressable
					style={({ pressed }) => [
						pressed && {
							opacity: 0.7,
						},
					]}
					onPress={() => {
						setReviewModal({
							entityType: 'media',
							mediaType: mediaType,
							entityId: mediaId,
							entityTitle: mediaTitle || '',
						});
					}}
				>
					<Text style={styles.rateMediaText}>{rateText}</Text>
				</Pressable>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	rateMediaContainer: {
		width: '100%',
		height: 15,
		alignItems: 'flex-end',
		paddingRight: 20,
	},
	rateMediaButton: {
		width: '100%',
	},
	rateMediaText: {
		fontSize: 10,
		color: '#032000',
		fontFamily: 'Montserrat-Regular',
		textDecorationLine: 'underline',
	},
	mediaAlreadyRatedText: {
		fontSize: 10,
		color: 'grey',
		fontFamily: 'Montserrat-Regular',
	},
});
