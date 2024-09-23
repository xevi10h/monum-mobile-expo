import IUser from './IUser';

export default interface IPlace {
  id: string;
  name: string;
  description: string;
  importance: number;
  address: {
    city: string;
    province: string;
    country: string;
    street: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  imagesUrl?: string[];
  createdBy: IUser;
}
