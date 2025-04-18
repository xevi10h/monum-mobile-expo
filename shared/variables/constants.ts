import { Dimensions } from 'react-native';

const height = Dimensions.get('window').height;
export const SMALL_SCREEN = height < 800;
