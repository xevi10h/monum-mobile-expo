import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { secondsToMinutes } from '@/shared/functions/utils';
import TrackPlayer, { State, useProgress } from 'react-native-track-player';
import { Slider } from '@rneui/themed';
import { useMainStore } from '@/zustand/MainStore';

export default function MediaPlayer() {
	const progress = useProgress();
	const currentTrackIndex = useMainStore(
		(state) => state.main.currentTrackIndex,
	);
	const statePlayer = useMainStore((state) => state.main.statePlayer);
	const currentTrack = useMainStore((state) => state.main.currentTrack);
	const placeOfMedia = useMainStore((state) => state.main.placeOfMedia);
	return (
		<View style={{ height: 150, width: '100%' }}>
			<View style={styles.basicInfoContainer}>
				<Text style={[styles.mediaTitle]}>{currentTrack?.title}</Text>
				<Text style={styles.placeName}>{placeOfMedia?.name}</Text>
			</View>
			<View style={styles.mediaPlayerContainer}>
				<Slider
					onSlidingComplete={(value) => {
						TrackPlayer.seekTo(value * progress.duration);
					}}
					value={
						progress.duration === 0 ? 0 : progress.position / progress.duration
					}
					style={{
						height: 16,
						width: '100%',
						display: currentTrack?.mediaType === 'text' ? 'none' : 'flex',
					}}
					minimumValue={0}
					maximumTrackTintColor="grey"
					minimumTrackTintColor="#3F713B"
					thumbStyle={{ width: 16, height: 16 }}
					trackStyle={{ height: 8 }}
					thumbTintColor="#3F713B"
				/>
				<View style={styles.mediaPlayerButtonsContainer}>
					<TouchableOpacity
						style={styles.mediaPlayerButtons}
						onPress={async () => {
							try {
								if (
									currentTrackIndex !== null &&
									currentTrackIndex !== undefined
								) {
									if (currentTrackIndex === 0) {
										await TrackPlayer.seekTo(0);
									} else {
										await TrackPlayer.skipToPrevious();
									}
									const previousTrackIndex = Math.max(0, currentTrackIndex - 1);
									const previousTrack = await TrackPlayer.getTrack(
										previousTrackIndex,
									);
									previousTrack?.mediaType === 'text'
										? await TrackPlayer.pause()
										: await TrackPlayer.play();
								}
							} catch (e) {
								console.log(e);
							}
						}}
					>
						<Image
							source={require('@/assets/images/media_expanded_back.png')}
							style={styles.mediaPlayerButtonsImage}
							resizeMode="contain"
						/>
					</TouchableOpacity>
					{currentTrack?.mediaType !== 'text' ? (
						<TouchableOpacity
							style={styles.mediaPlayerButtons}
							onPress={async () => {
								try {
									if (currentTrack?.mediaType !== 'text') {
										statePlayer === State.Paused
											? await TrackPlayer.play()
											: await TrackPlayer.pause();
									}
								} catch (e) {
									console.log(e);
								}
							}}
						>
							<Image
								source={
									statePlayer === State.Paused
										? require('@/assets/images/media_expanded_play.png')
										: require('@/assets/images/media_expanded_pause.png')
								}
								style={styles.mediaPlayerButtonsPlayImage}
								resizeMode="contain"
							/>
						</TouchableOpacity>
					) : (
						<View style={{ width: 30, height: 30, flex: 1 }} />
					)}
					<TouchableOpacity
						style={styles.mediaPlayerButtons}
						onPress={async () => {
							try {
								if (
									currentTrackIndex !== null &&
									currentTrackIndex !== undefined
								) {
									await TrackPlayer.skipToNext();
									const nextTrack = await TrackPlayer.getTrack(
										currentTrackIndex + 1,
									);
									if (nextTrack) {
										nextTrack.mediaType === 'text'
											? await TrackPlayer.pause()
											: await TrackPlayer.play();
									} else {
										await TrackPlayer.pause();
									}
								}
							} catch (e) {
								console.log(e);
							}
						}}
					>
						<Image
							source={require('@/assets/images/media_expanded_forward.png')}
							style={styles.mediaPlayerButtonsImage}
							resizeMode="contain"
						/>
					</TouchableOpacity>
				</View>
				<View
					style={[
						styles.durationMediaContainer,
						{ display: currentTrack?.mediaType === 'text' ? 'none' : 'flex' },
					]}
				>
					<Text style={styles.durationMediaText}>
						{secondsToMinutes(progress.position)}
					</Text>
					<Text style={styles.durationMediaText}>
						-{secondsToMinutes(progress.duration - progress.position)}
					</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	basicInfoContainer: {
		paddingVertical: 10,
		height: 70,
	},
	mediaTitle: {
		fontSize: 16,
		color: '#032000',
		fontFamily: 'Montserrat-SemiBold',
	},
	placeName: {
		fontSize: 14,
		color: '#032000',
		fontFamily: 'Montserrat-Regular',
	},
	mediaPlayerContainer: {
		marginVertical: 15,
		justifyContent: 'space-between',
		height: 60,
		alignItems: 'center',
	},
	mediaPlayerButtonsContainer: { flexDirection: 'row', width: 140 },
	mediaPlayerButtons: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	mediaPlayerButtonsImage: { width: 10, height: 14 },
	mediaPlayerButtonsPlayImage: { width: 30, height: 30 },
	durationMediaContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
	},
	durationMediaText: {
		fontSize: 12,
		color: '#032000',
		fontFamily: 'Montserrat-Regular',
	},
});
