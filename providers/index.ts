import { Certify } from './certify';
import {http} from './http';
import {Picture} from './picture';
import {User} from './user';

const IOC = {
    user: new User(http),
    picture: new Picture(http),
    certify: new Certify(http)
}

export default IOC;
