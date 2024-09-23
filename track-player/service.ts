import TrackPlayer, {
	AppKilledPlaybackBehavior,
	Capability,
	Event,
} from 'react-native-track-player';

export async function setupPlayerService() {
	let isSetup = false;
	try {
		await TrackPlayer.getCurrentTrack();
		isSetup = true;
	} catch {
		await TrackPlayer.setupPlayer();
		await TrackPlayer.updateOptions({
			android: {
				appKilledPlaybackBehavior:
					AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
			},
			capabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SkipToNext,
				Capability.SkipToPrevious,
				Capability.SeekTo,
			],
			compactCapabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SkipToNext,
				Capability.SkipToPrevious,
				Capability.SeekTo,
			],
			notificationCapabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SkipToNext,
				Capability.SkipToPrevious,
				Capability.SeekTo,
			],
			icon: require('../assets/images/logo_180.png'),
		});

		isSetup = true;
	} finally {
		return isSetup;
	}
}

export const PlaybackService = async function () {
	TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
	TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
	TrackPlayer.addEventListener(Event.RemoteNext, () => {
		TrackPlayer.skipToNext();
	});
	TrackPlayer.addEventListener(Event.RemotePrevious, () =>
		TrackPlayer.skipToPrevious(),
	);
	TrackPlayer.addEventListener(Event.RemoteSeek, (data) => {
		TrackPlayer.seekTo(data.position);
	});
};
