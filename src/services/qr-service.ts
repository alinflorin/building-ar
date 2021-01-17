import * as qr from '@cheprasov/qrcode';
import { hiroBase64 } from '../assets/hiro';

class QrService {
    constructor() {

    }

    async getMarkerQrForUrlAsBase64(url: string): Promise<string> {
        const module = qr.__moduleExports != null ? qr.__moduleExports : qr.default;
        url = url.replace('localhost', '192.168.1.100');
        const instance = new module.QRCodeCanvas(url, {
            level: 'Q',
            scale: 20,
            image: {
                source: hiroBase64,
                width: '30%',
                height: '30%',
                x: 'center',
                y: 'center'
            },
        });
        return await instance.toDataUrl();
    }
}

const qrServiceInstance = new QrService();

export default qrServiceInstance;