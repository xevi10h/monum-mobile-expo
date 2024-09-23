import IPlace from '@/shared/interfaces/IPlace';
import { MarkerResponse } from './MapServicesInterfaces';
import client from '@/graphql/connection';
import {
	GET_MARKERS,
	GET_PLACE_INFO,
	GET_MAP_SEARCHER_RESULTS,
	GET_ALL_MARKERS,
} from '@/graphql/queries/placeQueries';
import { GET_PLACE_MEDIA } from '@/graphql/queries/mediaQueries';
import { Language } from '@/shared/types/Language';
import { FromSupport } from '@/shared/types/FromSupport';

class MapServices {
	public async getMarkers(
		textSearch: string | undefined,
		centerCoordinates: [number, number],
		sortField: 'importance' | 'name',
		sortOrder: 'asc' | 'desc',
		language?: Language,
	): Promise<MarkerResponse[]> {
		try {
			const response = await client.query({
				query: GET_MARKERS,
				variables: {
					textSearch: textSearch,
					centerCoordinates,
					sortField,
					sortOrder,
					language,
				},
			});
			return response.data.places || [];
		} catch (error) {
			console.error('Error trying to get markers:', error);
			return [];
		}
	}

	public async getAllMarkers(
		sortField: 'importance' | 'name',
		sortOrder: 'asc' | 'desc',
		language?: Language,
	): Promise<MarkerResponse[]> {
		try {
			const response = await client.query({
				query: GET_ALL_MARKERS,
				variables: {
					sortField,
					sortOrder,
					language,
				},
			});
			return response.data.places || [];
		} catch (error) {
			console.error('Error trying to get markers:', error);
			return [];
		}
	}

	public async getPlaceInfo(
		placeId: string,
		fromSupport?: FromSupport,
		language?: Language,
	): Promise<IPlace | null> {
		try {
			const response = await client.query({
				query: GET_PLACE_INFO,
				variables: {
					placeId,
					imageSize: 'medium',
					language,
					fromSupport,
					isMobile: true,
				},
			});
			return response.data?.place;
		} catch (error) {
			console.error('Error trying to get place info:', error);
			return null;
		}
	}

	public async getPlaceMedia(placeId: string, language?: Language) {
		try {
			const response = await client.query({
				query: GET_PLACE_MEDIA,
				variables: { placeId, language },
			});
			return response.data?.medias || [];
		} catch (error) {
			console.error('Error trying to get place media:', error);
			return [];
		}
	}

	public async getMapSearcherResults(
		coordinates: { lat: number; lng: number },
		textSearch?: string,
	) {
		try {
			const response = await client.query({
				query: GET_MAP_SEARCHER_RESULTS,
				variables: { getMapSearcherResultsInput: { textSearch, coordinates } },
			});
			return response.data?.getMapSearcherResults || [];
		} catch (error) {
			console.error('Error trying to get place searcher suggestions:', error);
			return [];
		}
	}
}

export default new MapServices();
