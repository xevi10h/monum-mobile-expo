import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import IMedia from '@/shared/interfaces/IMedia';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import { useTabMapStore } from '@/zustand/TabMapStore';
import { useMainStore } from '@/zustand/MainStore';

interface MediaOfPlacePillProps {
	index: number;
	media: IMedia;
}

export default function MediaOfPlacePill({
	index,
	media,
}: MediaOfPlacePillProps) {
	const place = useTabMapStore((state) => state.tabMap.place);
	const setPlaceOfMedia = useMainStore((state) => state.setPlaceOfMedia);
	const mediasOfPlace = useTabMapStore((state) => state.tabMap.mediasOfPlace);
	const setVideoPlayer = useMainStore((state) => state.setVideoPlayer);
	const setVideoUrl = useMainStore((state) => state.setVideoUrl);
	if (!mediasOfPlace || !Array.isArray(mediasOfPlace)) {
		return null;
	}
	const isLastPill =
		Array.isArray(mediasOfPlace) && index === mediasOfPlace.length - 1;

	const mediaTypeIcon =
		media.type === 'audio'
			? require('@/assets/images/place_detail_audio_media.png')
			: media.type === 'video'
			? require('@/assets/images/place_detail_video_media.png')
			: require('@/assets/images/place_detail_text_media.png');

	const onPressAudioAndText = async () => {
		try {
			const audios = mediasOfPlace.filter(
				(mediaOfPlace) =>
					mediaOfPlace.type === 'audio' || mediaOfPlace.type === 'text',
			);
			setPlaceOfMedia(place);
			await TrackPlayer.reset();
			await TrackPlayer.add(
				audios.map((audio) => ({
					id: audio.id,
					url: audio.url || '',
					title: audio.title,
					artist: 'Monum',
					rating: audio.rating,
					text: audio.text,
					mediaType: audio.type,
				})),
			);
			await TrackPlayer.skip(index);
			await TrackPlayer.setRepeatMode(RepeatMode.Queue);
			mediasOfPlace[index].type !== 'text' && (await TrackPlayer.play());
		} catch (e) {
			console.log(e);
		}
	};

	const onPressVideo = async () => {
		try {
			await TrackPlayer.pause();
			setVideoPlayer(true);
			setVideoUrl(media.url);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<TouchableOpacity
			onPress={media.type === 'video' ? onPressVideo : onPressAudioAndText}
		>
			<View
				style={[
					styles.placeMediaPillContainer,
					{ marginBottom: isLastPill ? 100 : 0 },
				]}
			>
				<View style={styles.placeMediaPill}>
					<View style={{ width: '90%' }}>
						<Text style={styles.placeMediaPillTitle} numberOfLines={1}>
							{media.title}
						</Text>
						<Text style={styles.placeMediaPillDuration}>
							{`${(media.duration ? media.duration / 60 : 0).toFixed(0)} min`}
						</Text>
					</View>
					<View>
						<Image
							source={mediaTypeIcon}
							style={styles.placeMediaPillIcon}
							resizeMode="contain"
						/>
					</View>
				</View>
				{media.rating && (
					<View style={styles.mediaPillRatingContainer}>
						<Text style={styles.mediaPillRatingText}>
							{`${media.rating.toFixed(1)}`}
						</Text>
						<View>
							<Image
								source={require('@/assets/images/place_detail_media_rating_star.png')}
								style={styles.mediaPillRatingImage}
								resizeMode="contain"
							/>
						</View>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	placeMediaPillContainer: {
		width: '100%',
		height: 70,
		paddingHorizontal: 15,
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
		paddingBottom: 5,
		paddingTop: 10,
		shadowColor: '#C0DCBE',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 1,
		shadowRadius: 4,
		elevation: 5,
	},
	placeMediaPillTitle: {
		fontSize: 12,
		color: '#3F713B',
		fontFamily: 'Montserrat-Regular',
	},
	placeMediaPillDuration: {
		fontSize: 10,
		color: '#3F713B',
		fontFamily: 'Montserrat-Regular',
	},
	placeMediaPillIcon: { width: 20, height: 20 },
	mediaPillRatingContainer: {
		position: 'absolute',
		top: 0,
		left: 25,
		height: 20,
		width: 30,
		backgroundColor: '#3F713B',
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'space-evenly',
		flexDirection: 'row',
	},
	mediaPillRatingText: {
		fontSize: 8,
		color: 'white',
		fontFamily: 'Montserrat-Regular',
	},
	mediaPillRatingImage: { width: 8, height: 8 },
});
