import {atomWithStorage} from 'jotai/utils';

export const token = atomWithStorage<string | null>('token', null);