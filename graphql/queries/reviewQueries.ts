import { gql } from '@apollo/client';

export const CREATE_REVIEW = gql`
	mutation Mutation($review: ReviewInput) {
		createReview(review: $review) {
			id
			entityId
			entityType
			rating
			comment
			createdById
		}
	}
`;
