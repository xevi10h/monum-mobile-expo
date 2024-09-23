import IRouteOfCity from './IRouteOfCity.js';
import IStop from './IStop.js';

export default interface IRouteComplete extends IRouteOfCity {
  duration: number;
  optimizedDuration: number;
  distance: number;
  optimizedDistance: number;
  stops: IStop[];
}
