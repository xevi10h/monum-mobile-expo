import { View } from 'react-native';
import TextSearchActive from '@/components/map/TextSearchActive';
import { useTabMapStore } from '@/zustand/TabMapStore';
import { useEffect } from 'react';
import MapServices from '@/services/map/MapServices';
import { ScrollView } from 'react-native';
import TextSearchResultPill from '@/components/map/TextSearchResultPill';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

export default function TextSearchScreen() {
	const textSearch = useTabMapStore((state) => state.tabMap.textSearch);

	const setSearcherResults = useTabMapStore(
		(state) => state.setSearcherResults,
	);
	const searcherResults = useTabMapStore(
		(state) => state.tabMap.searcherResults,
	);

	useEffect(() => {
		const fetchSuggestions = async () => {
			console.log('fetchSuggestions');
			try {
				const { coords } = await Location.getCurrentPositionAsync();

				const suggestionsData = await MapServices.getMapSearcherResults(
					{
						lat: coords.latitude || 0,
						lng: coords.longitude || 0,
					},
					textSearch,
				);
				console.log('suggestionsData', suggestionsData);
				setSearcherResults(suggestionsData || []);
			} catch (error) {
				console.log('error', error);
			}
		};
		fetchSuggestions();
	}, [textSearch]);

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: 'white',
				paddingBottom: 30,
			}}
		>
			<LinearGradient
				start={{ x: 0, y: 1 }}
				end={{ x: 0, y: 0 }}
				colors={['#0002', '#0000']}
				style={{
					position: 'absolute',
					bottom: 0,
					width: '100%',
					backgroundColor: 'white',
					height: 100,
				}}
			/>
			<TextSearchActive />
			<ScrollView
				style={{ paddingHorizontal: 10 }}
				keyboardDismissMode="on-drag"
			>
				{searcherResults.map((searcherResult, index) => (
					<TextSearchResultPill key={index} searcherResult={searcherResult} />
				))}
			</ScrollView>
		</View>
	);
}
