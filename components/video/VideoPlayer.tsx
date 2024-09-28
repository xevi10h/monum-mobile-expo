import { useEffect } from 'react';
import { useMainStore } from '../../zustand/MainStore';
import { BackHandler, Pressable, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function VideoPlayer() {
	const setVideoPlayer = useMainStore((state) => state.setVideoPlayer);
	const setVideoUrl = useMainStore((state) => state.setVideoUrl);
	const videoUrl = useMainStore((state) => state.main.videoUrl);

	const player = useVideoPlayer(videoUrl, (player) => {
		player.loop = true;
		player.play();
	});

	const closeVideoPlayerAction = () => {
		setVideoPlayer(false);
		setVideoUrl('');
		return true;
	};

	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			closeVideoPlayerAction,
		);
		return () => {
			backHandler.remove();
		};
	}, []);

	return (
		<Pressable
			style={styles.backgroundVideo}
			onPress={(event) => {
				if (event.target !== event.currentTarget) {
					return;
				}
				closeVideoPlayerAction();
			}}
		>
			<VideoView
				style={{ width: 350, height: 275 }}
				player={player}
				allowsFullscreen
				allowsPictureInPicture
			/>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	backgroundVideo: {
		position: 'absolute',
		bottom: 0,
		top: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	closeButton: {
		position: 'absolute',
		top: 120,
		left: 20,
		zIndex: 100,
	},
});
