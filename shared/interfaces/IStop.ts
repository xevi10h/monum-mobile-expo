import IMedia from './IMedia';
import IPlace from './IPlace';

export default interface IStop {
  order: number;
  optimizedOrder: number;
  medias: IMedia[];
  place: IPlace;
}
