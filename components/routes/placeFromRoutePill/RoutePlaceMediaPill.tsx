import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import IMedia from '@/shared/interfaces/IMedia';
import IPlace from '@/shared/interfaces/IPlace';
import { Image } from 'react-native';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import { useMainStore } from '@/zustand/MainStore';
import { Language } from '@/shared/types/Language';
import { useUserStore } from '@/zustand/UserStore';

interface RoutePlaceMediaPillProps {
	mediasOfStop: IMedia[];
	media: IMedia;
	place: IPlace;
	index: number;
}

function durationToString(duration: number | undefined, language: Language) {
	if (!duration) {
		return '';
	}
	const minutes = Math.floor(duration / 60);
	const seconds = Math.floor(duration % 60);

	switch (language) {
		case 'es_ES':
			return `${minutes} min ${seconds} seg`;
		case 'en_US':
			return `${minutes} min ${seconds} sec`;
		case 'ca_ES':
			return `${minutes} min ${seconds} seg`;
		case 'fr_FR':
			return `${minutes} min ${seconds} seg`;
		default:
			return `${minutes} min ${seconds} seg`;
	}
}

export default function RoutePlaceMediaPill({
	mediasOfStop,
	media,
	place,
	style,
	index,
}: RoutePlaceMediaPillProps & { style?: ViewStyle }) {
	const language = useUserStore((state) => state.user.language);
	const setPlaceOfMedia = useMainStore((state) => state.setPlaceOfMedia);
	const setVideoPlayer = useMainStore((state) => state.setVideoPlayer);
	const setVideoUrl = useMainStore((state) => state.setVideoUrl);
	if (!mediasOfStop || !Array.isArray(mediasOfStop)) {
		return null;
	}
	const mediaTypeIcon =
		media.type === 'audio'
			? require('@/assets/images/place_detail_audio_media.png')
			: media.type === 'video'
			? require('@/assets/images/place_detail_video_media.png')
			: require('@/assets/images/place_detail_text_media.png');

	const onPressAudio = async () => {
		try {
			const audios = mediasOfStop.filter(
				(mediaOfStop) =>
					mediaOfStop.type === 'audio' || mediaOfStop.type === 'text',
			);
			setPlaceOfMedia(place);
			await TrackPlayer.reset();
			await TrackPlayer.add(
				audios.map((audio) => ({
					id: audio.id,
					url: audio.url,
					title: audio.title,
					artist: 'Monum',
					rating: audio.rating,
					text: audio.text,
					mediaType: audio.type,
					alreadyReviewed: audio.userReviewId ? true : false,
				})),
			);
			await TrackPlayer.skip(index);
			await TrackPlayer.setRepeatMode(RepeatMode.Queue);
			mediasOfStop[index].type !== 'text' && (await TrackPlayer.play());
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
			onPress={
				media.type === 'audio'
					? onPressAudio
					: media.type === 'video'
					? onPressVideo
					: undefined
			}
			style={style}
		>
			<View style={styles.placeMediaPillContainer}>
				<View style={styles.placeMediaPill}>
					<View style={{ maxWidth: '85%' }}>
						<Text numberOfLines={1} style={styles.placeMediaPillTitle}>
							{media.title}
						</Text>
						<Text style={styles.placeMediaPillDuration}>
							{durationToString(media.duration, language)}
						</Text>
					</View>
					<View>
						<Image
							source={mediaTypeIcon}
							style={styles.placeMediaPillPlayIcon}
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
		paddingHorizontal: 8,
	},
	placeMediaPill: {
		height: 50,
		borderRadius: 12,
		marginVertical: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingBottom: 5,
		paddingTop: 10,
		backgroundColor: 'white',
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
	placeMediaPillPlayIcon: { width: 24, height: 24 },
	mediaPillRatingContainer: {
		position: 'absolute',
		top: 0,
		left: 18,
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
