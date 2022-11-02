import * as crypto from 'crypto-js';
import { environment } from 'src/environments/environment';

export const crytoData = (payload): Promise<string> => {
    return new Promise((resolve) => {
        const data: string = JSON.stringify(payload);
        const key: string = environment.jwt_key;
        const hash = crypto.AES.encrypt(data, key).toString();
        resolve(hash);
    });
};



