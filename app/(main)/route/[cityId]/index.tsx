/* eslint-disable react-hooks/exhaustive-deps */
import { ScrollView, View, StyleSheet, Platform } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_ROUTES_OF_CITY } from '../../../../graphql/queries/routeQueries';
import { useEffect, useState } from 'react';
import IRouteOfCity from '../../../../shared/interfaces/IRouteOfCity';
import DetailCityPill from '@/components/routes/DetailCityPill';
import TextSearch from '@/components/routes/TextSearch';
import LoadingSpinner from '../../../../shared/components/LoadingSpinner';
import ErrorComponent from '../../../../shared/components/ErrorComponent';
import { SafeAreaView } from 'react-native-safe-area-context';
import ListRoutePill from '@/components/routes/ListRoutePill';
import { useTabRouteStore } from '../../../../zustand/TabRouteStore';
import { useUserStore } from '../../../../zustand/UserStore';
import { useTranslation } from '@/hooks/useTranslation';
import { router, useLocalSearchParams } from 'expo-router';
import ICity from '@/shared/interfaces/ICity';

export default function ListRoutesScreen() {
	const { cityId } = useLocalSearchParams();
	const { t } = useTranslation();
	const cities = useTabRouteStore((state) => state.cities);
	const [city, setCity] = useState<ICity | undefined>(
		cities.find((city) => city.id === cityId),
	);
	const language = useUserStore((state) => state.user.language);
	const [routes, setRoutes] = useState<IRouteOfCity[]>([]);
	const [textSearch, setTextSearch] = useState<string | undefined>(undefined);

	const { loading, error, data, refetch } = useQuery(GET_ROUTES_OF_CITY, {
		variables: {
			cityId: cityId,
			textSearch: textSearch || '',
		},
	});

	useEffect(() => {
		async function fetchRoutes() {
			try {
				const response = await refetch();
				if (response.data && response.data.routes) {
					setRoutes(response.data.routes);
				}
			} catch (error) {
				console.error('Error fetching routes:', error);
			}
		}
		fetchRoutes();
	}, [setRoutes, language, cityId]);

	useEffect(() => {
		setCity(cities.find((city) => city.id === cityId));
	}, [cityId]);

	return (
		<SafeAreaView style={styles.page}>
			<DetailCityPill
				cityName={city?.name || ''}
				imageUrl={city?.imageUrl || ''}
				onPress={() =>
					Platform.OS !== 'web' ? router.back() : router.push('/(main)/route')
				}
			/>
			<View style={styles.contentContainer}>
				<TextSearch
					setTextSearch={setTextSearch}
					textSearch={textSearch}
					style={{ marginTop: 15 }}
				/>
				{loading ? (
					<LoadingSpinner />
				) : error ? (
					<ErrorComponent
						errorMessage={t('routes.errorGettingAvailableCities')}
						onRetry={() => refetch()}
					/>
				) : (
					<View style={{ flex: 1, width: '100%' }}>
						<ScrollView
							scrollEventThrottle={16}
							style={{
								width: '100%',
								marginTop: 15,
								backgroundColor: 'white',
							}}
							showsVerticalScrollIndicator={false}
						>
							{routes.map((route, i) => (
								<ListRoutePill
									route={route}
									key={i}
									onPress={() => {
										router.push({
											pathname: `/route/[cityId]/[routeId]`,
											params: {
												cityId: cityId as string,
												routeId: route.id,
											},
										});
									}}
								/>
							))}
							<View style={{ height: 40, width: '100%' }} />
						</ScrollView>
					</View>
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		backgroundColor: 'white',
	},
	contentContainer: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: 'white',
		width: '100%',
	},
});
