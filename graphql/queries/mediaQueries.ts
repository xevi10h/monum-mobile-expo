import {gql} from '@apollo/client';

export const GET_PLACE_MEDIA = gql`
  query Medias($placeId: ID!, $language: Language) {
    medias(placeId: $placeId, language: $language) {
      id
      title
      rating
      url
      duration
      type
      text
    }
  }
`;
