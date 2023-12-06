import { UserModel } from '@/interface/model/user';
import {atom} from 'jotai';

export const profile = atom<null | UserModel>(null);