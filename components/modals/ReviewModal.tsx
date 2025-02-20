import { useMainStore } from '@/zustand/MainStore';
import {
	Pressable,
	Text,
	TextInput,
	View,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import { Rating } from '@kolking/react-native-rating';
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_REVIEW } from '@/graphql/queries/reviewQueries';
import { useTranslation } from '@/hooks/useTranslation';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';

// Importa tus consultas
import { GET_ROUTE_DETAIL } from '@/graphql/queries/routeQueries'; // Asegúrate de que la ruta sea correcta
import { useTabRouteStore } from '@/zustand/TabRouteStore';
import { useTabMapStore } from '@/zustand/TabMapStore';

export default function ReviewModal() {
	const route = useTabRouteStore((state) => state.route);
	const setRoute = useTabRouteStore((state) => state.setRoute);
	const reviewModal = useMainStore((state) => state.main.reviewModal);
	const setReviewModal = useMainStore((state) => state.setReviewModal);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState('');
	const [createReview, { loading, error: mutationError }] =
		useMutation(CREATE_REVIEW);
	const { t } = useTranslation();
	const [feedbackVisible, setFeedbackVisible] = useState(false);
	const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(
		null,
	);
	const mediasOfPlace = useTabMapStore((state) => state.tabMap.mediasOfPlace);
	const setMediasOfPlace = useTabMapStore((state) => state.setMediasOfPlace);
	const currentTrack = useMainStore((state) => state.main.currentTrack);
	const setCurrentTrack = useMainStore((state) => state.setCurrentTrack);

	const { refetch: refetchRoute } = useQuery(GET_ROUTE_DETAIL, {
		variables: {
			routeId: reviewModal?.entityId,
		},
		skip: reviewModal?.entityType !== 'route',
	});

	let question = '';

	if (reviewModal?.entityType === 'place') {
		question = t('reviewModal.ratePlace');
	} else if (reviewModal?.entityType === 'route') {
		question = t('reviewModal.rateRoute');
	} else if (reviewModal?.entityType === 'media') {
		if (reviewModal?.mediaType === 'video') {
			question = t('reviewModal.rateVideo');
		}
		if (reviewModal?.mediaType === 'text') {
			question = t('reviewModal.rateText');
		}
		if (reviewModal?.mediaType === 'audio') {
			question = t('reviewModal.rateAudio');
		}
	}

	useEffect(() => {
		if (feedbackVisible) {
			setTimeout(() => {
				setFeedbackVisible(false);
				setReviewModal(null);
			}, 2000);
		}
	}, [feedbackVisible, setReviewModal]);

	const handleSendReview = async () => {
		try {
			const { data } = await createReview({
				variables: {
					review: {
						comment,
						entityType: reviewModal?.entityType,
						entityId: reviewModal?.entityId,
						rating,
					},
				},
			});

			if (reviewModal?.entityType === 'media') {
				currentTrack && setCurrentTrack({ ...currentTrack, alredyRated: true });
				if (mediasOfPlace) {
					const mediaIndex = mediasOfPlace.findIndex(
						(media) => media.id === reviewModal?.entityId,
					);
					if (mediaIndex !== -1) {
						const newMediasOfPlace = [...mediasOfPlace];
						newMediasOfPlace[mediaIndex] = {
							...newMediasOfPlace[mediaIndex],
							userReviewId: data?.createReview?.id,
						};
						setMediasOfPlace(newMediasOfPlace);
					}
				}
			} else if (reviewModal?.entityType === 'route') {
				await refetchRoute();
				route && setRoute({ ...route, userReviewId: data?.createReview?.id });
			}

			setFeedbackType('success');
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		} catch (error) {
			setFeedbackType('error');
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
		} finally {
			setFeedbackVisible(true);
		}
	};

	return (
		<View style={styles.modalContainer}>
			<View style={styles.modalOverlay} />
			<View style={styles.modalContent}>
				{!feedbackVisible && (
					<>
						<View style={styles.questionContainer}>
							<Text style={styles.questionText}>
								<Text style={styles.questionBoldText}>{question} </Text>
							</Text>
						</View>
						<Rating
							rating={rating}
							baseColor="#3F713B"
							fillColor="#3F713B"
							touchColor="#3F713B"
							onChange={setRating}
							variant="stars-outline"
							size={35}
						/>
						<View style={styles.commentInputContainer}>
							<TextInput
								style={styles.commentInput}
								placeholder={t('reviewModal.comment')}
								placeholderTextColor={'#3F713B'}
								multiline={true}
								value={comment}
								onChangeText={setComment}
							/>
						</View>
						<View style={styles.buttonContainer}>
							<Pressable
								style={({ pressed }) => [
									styles.sendButton,
									pressed && styles.sendButtonPressed,
								]}
								onPress={handleSendReview}
							>
								<Text style={styles.sendButtonText}>
									{t('reviewModal.send')}
								</Text>
							</Pressable>
						</View>

						<View style={styles.closeButtonContainer}>
							<Pressable
								style={({ pressed }) => [
									styles.closePressable,
									pressed && styles.closePressablePressed,
								]}
								onPress={() => {
									setReviewModal(null);
								}}
							>
								<Text style={styles.closeButtonText}>✕ </Text>
							</Pressable>
						</View>
					</>
				)}
				{feedbackVisible && feedbackType === 'success' && (
					<View style={styles.feedbackContainer}>
						<Icon name="check-circle" size={60} color="#4CAF50" />
						<Text style={styles.feedbackText}>{t('reviewModal.success')}</Text>
					</View>
				)}
				{feedbackVisible && feedbackType === 'error' && (
					<View style={styles.feedbackContainer}>
						<Icon name="times-circle" size={60} color="#F44336" />
						<Text style={styles.feedbackText}>{t('reviewModal.error')}</Text>
					</View>
				)}
				{loading && feedbackVisible && feedbackType === null && (
					<View style={styles.feedbackContainer}>
						<ActivityIndicator size="large" color="#3F713B" />
						<Text style={styles.feedbackText}>{t('reviewModal.loading')}</Text>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	modalContainer: {
		height: '100%',
		width: '100%',
		position: 'absolute',
		alignItems: 'center',
	},
	modalOverlay: {
		height: '100%',
		width: '100%',
		backgroundColor: 'black',
		opacity: 0.5,
		position: 'absolute',
	},
	modalContent: {
		width: '90%',
		backgroundColor: 'white',
		borderRadius: 12,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		marginTop: '20%',
		alignItems: 'center',
		paddingBottom: 20, // Add padding to the bottom to ensure feedback is visible
	},
	questionContainer: {
		paddingHorizontal: 20,
		marginTop: 40,
		marginBottom: 20,
	},
	questionText: {
		fontSize: 16,
		fontFamily: 'Montserrat-Regular',
		textAlign: 'center',
		color: '#032000',
	},
	questionBoldText: {
		fontFamily: 'Montserrat-SemiBold',
	},
	ratingContainer: {
		marginBottom: 40,
	},
	commentInputContainer: {
		marginTop: 40,
		width: '90%',
		height: 220,
		backgroundColor: '#ECF3EC',
		borderRadius: 12,
		paddingTop: 20,
		paddingHorizontal: 15,
	},
	commentInput: {
		fontSize: 16,
		fontFamily: 'Montserrat-SemiBold',
		color: '#3F713B',
		textAlignVertical: 'top', // Align text to the top in multiline TextInput
	},
	buttonContainer: {
		height: 40,
		marginVertical: 20,
	},
	sendButton: {
		backgroundColor: '#3F713B',
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 20,
		height: 40,
	},
	sendButtonPressed: {
		opacity: 0.7,
	},
	sendButtonText: {
		color: 'white',
		fontFamily: 'Montserrat-SemiBold',
	},
	closeButtonContainer: {
		position: 'absolute',
		top: 12,
		right: 12,
	},
	closePressable: {
		// Styles for the pressable area around the X if needed
	},
	closePressablePressed: {
		opacity: 0.7,
	},
	closeButtonText: {
		fontSize: 24,
		fontFamily: 'Montserrat-SemiBold',
		color: '#032000',
	},
	feedbackContainer: {
		alignItems: 'center',
		marginTop: 20,
	},
	feedbackText: {
		marginTop: 10,
		fontFamily: 'Montserrat-SemiBold',
		fontSize: 16,
		color: '#032000',
		textAlign: 'center',
	},
});
