import {Language} from '../types/Language';
import IPermission from './IPermission';

export default interface IUser {
  id?: string;
  email?: string;
  username?: string;
  createdAt: string;
  name?: string;
  photo?: string;
  hashedPassword?: string;
  googleId?: string;
  token?: string;
  language: Language;
  hasPassword?: boolean;
  permissions?: IPermission[];
  deviceId?: string;
  thirdPartyAccount?: 'google' | 'apple';
  thirdPartyEmail?: string;
}
