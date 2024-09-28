import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useQuery } from '@apollo/client';
import TextSearch from '@/components/routes/TextSearch';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GET_CITIES } from '../../../graphql/queries/routeQueries';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import ErrorComponent from '../../../shared/components/ErrorComponent';
import ICity from '../../../shared/interfaces/ICity';
import ListCityPill from '@/components/routes/ListCityPill';
import { useTabRouteStore } from '../../../zustand/TabRouteStore';
import { useUserStore } from '../../../zustand/UserStore';
import { useTranslation } from '@/hooks/useTranslation';
import { router } from 'expo-router';

export default function ListCitiesScreen() {
	const { t } = useTranslation();
	const setCities = useTabRouteStore((state) => state.setCities);
	const cities = useTabRouteStore((state) => state.cities);
	const safeAreaInsets = useSafeAreaInsets();
	const [textSearch, setTextSearch] = useState<string | undefined>(undefined);
	const language = useUserStore((state) => state.user.language);

	const { loading, error, data, refetch } = useQuery(GET_CITIES, {
		variables: { textSearch: textSearch || '', language, hasRoutes: true },
	});

	useEffect(() => {
		async function fetchCities() {
			try {
				const response = await refetch();
				if (response.data && response.data.cities) {
					setCities(response.data?.cities || []);
				}
			} catch (error) {
				console.error('Error trying to get cities:', error);
			}
		}
		fetchCities();
	}, [textSearch, refetch, language]);

	return (
		<View style={styles.page}>
			<View style={styles.contentContainer}>
				<TextSearch
					setTextSearch={setTextSearch}
					textSearch={textSearch}
					style={{ marginTop: 60 }}
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
							keyboardDismissMode="on-drag"
							scrollEventThrottle={16}
							style={{
								width: '100%',
								marginBottom: safeAreaInsets.bottom + 30,
								marginTop: 15,
							}}
							showsVerticalScrollIndicator={false}
						>
							{cities.map((city, i) => (
								<ListCityPill
									key={i}
									onPress={() => {
										router.push({
											pathname: '/[cityId]',
											params: { cityId: city.id },
										});
									}}
									cityName={city.name}
									imageUrl={city.imageUrl}
								/>
							))}
						</ScrollView>
					</View>
				)}
			</View>
		</View>
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
	},
});
