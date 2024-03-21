import { Certify } from './certify';
import { Folder } from './folder';
import {http} from './http';
import {Picture} from './picture';
import { Share } from './share';
import {User} from './user';

const IOC = {
    user: new User(http),
    picture: new Picture(http),
    certify: new Certify(http),
    share: new Share(http),
    fold: new Folder(http)
}

export default IOC;
