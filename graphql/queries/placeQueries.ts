import {gql} from '@apollo/client';

export const GET_MARKERS = gql`
  query Places(
    $textSearch: String
    $centerCoordinates: [Float]
    $sortOrder: SortOrder
    $sortField: SortField
    $language: Language
  ) {
    places(
      textSearch: $textSearch
      centerCoordinates: $centerCoordinates
      sortOrder: $sortOrder
      sortField: $sortField
      language: $language
    ) {
      id
      address {
        coordinates {
          lat
          lng
        }
      }
      importance
    }
  }
`;

export const GET_ALL_MARKERS = gql`
  query Places(
    $sortOrder: SortOrder
    $sortField: SortField
    $language: Language
  ) {
    places(sortOrder: $sortOrder, sortField: $sortField, language: $language) {
      id
      address {
        coordinates {
          lat
          lng
        }
      }
      importance
    }
  }
`;

export const GET_PLACE_INFO = gql`
  query Place(
    $placeId: ID!
    $imageSize: ImageSize
    $language: Language
    $fromSupport: FromSupport
    $isMobile: Boolean
  ) {
    place(
      id: $placeId
      imageSize: $imageSize
      language: $language
      fromSupport: $fromSupport
      isMobile: $isMobile
    ) {
      id
      name
      address {
        coordinates {
          lat
          lng
        }
        street
        city
        postalCode
        province
        country
      }
      description
      importance
      imagesUrl
      createdBy {
        username
        organization {
          name
          description
        }
        photo
      }
    }
  }
`;

export const GET_MAP_SEARCHER_RESULTS = gql`
  query GetMapSearcherResults(
    $getMapSearcherResultsInput: GetMapSearcherResultsInput!
  ) {
    getMapSearcherResults(
      getMapSearcherResultsInput: $getMapSearcherResultsInput
    ) {
      id
      name
      city
      country
      coordinates {
        lat
        lng
      }
      distance
      importance
      hasMonums
      type
      region
    }
  }
`;
