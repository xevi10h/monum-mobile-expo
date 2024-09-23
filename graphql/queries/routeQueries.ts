import {gql} from '@apollo/client';

export const GET_CITIES = gql`
  query Query($textSearch: String, $language: Language, $hasRoutes: Boolean) {
    cities(
      textSearch: $textSearch
      language: $language
      hasRoutes: $hasRoutes
    ) {
      id
      name
      imageUrl
    }
  }
`;

export const GET_ROUTES_OF_CITY = gql`
  query Routes($cityId: ID!, $textSearch: String) {
    routes(cityId: $cityId, textSearch: $textSearch) {
      id
      title
      description
      rating
      duration
      optimizedDuration
      distance
      optimizedDistance
      stopsCount
      cityId
    }
  }
`;

export const GET_ROUTE_DETAIL = gql`
  query Route($routeId: ID!) {
    route(id: $routeId) {
      id
      title
      description
      rating
      duration
      optimizedDuration
      distance
      optimizedDistance
      stops {
        place {
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
        }
        medias {
          id
          title
          text
          rating
          url
          type
          text
          voiceId
          duration
        }
        order
        optimizedOrder
      }
      stopsCount
      cityId
    }
  }
`;
