import { UserModel } from '../interface/model/user';
import {atom, PrimitiveAtom} from 'jotai';

export interface UploadProgressItem {
    label: string;
    value: number;
}

export interface NavItem {
    id:string;
    name:string;
}

export const profile = atom<null | UserModel>(null);
export const verify = atom<boolean>(true);
export const uploadStack = atom<UploadProgressItem[]>([]);
export const currentFolderId = atom<string>('1');
export const folderId = atom<NavItem[]>([{id: '1', name: 'root'}])