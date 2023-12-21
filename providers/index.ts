import {http} from './http';
import {Picture} from './picture';
import {User} from './user';

const IOC = {
    user: new User(http),
    picture: new Picture(http)
}

export default IOC;
