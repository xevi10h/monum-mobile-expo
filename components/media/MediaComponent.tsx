import MediaExpanded from './MediaExpanded/MediaExpanded';
import MediaBubble from './MediaBubble';
import { useTabMapStore } from '@/zustand/TabMapStore';
import { useMainStore } from '@/zustand/MainStore';

export default function MediaComponent() {
	const expandedMediaDetail = useTabMapStore(
		(state) => state.tabMap.expandedMediaDetail,
	);
	const currentTrack = useMainStore((state) => state.main.currentTrack);

	return currentTrack?.title && expandedMediaDetail ? (
		<MediaExpanded />
	) : (
		<MediaBubble />
	);
}
