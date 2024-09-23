import IPlace from './IPlace';

export default interface IMedia {
  id: string;
  duration?: number;
  position?: number;
  title: string;
  text?: string;
  rating?: number;
  url: string;
  type: string;
  place?: IPlace;
}
