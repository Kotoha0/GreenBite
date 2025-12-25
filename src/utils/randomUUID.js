import { v4 as uuidv4 } from 'uuid';

const randomUUID = () => {
    if (crypto?.randomUUID) {
        return crypto.randomUUID();
    }
    return uuidv4();
};

export default randomUUID;