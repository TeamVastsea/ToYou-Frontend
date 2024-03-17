import { UserModel } from '../interface/model/user';
import {atom, PrimitiveAtom} from 'jotai';

export interface UploadProgressItem {
    label: string;
    value: number;
}

export const profile = atom<null | UserModel>(null);
export const verify = atom<boolean>(true);
export const uploadStack = atom<UploadProgressItem[]>([]);