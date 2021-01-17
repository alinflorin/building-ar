import JSZip from 'jszip';
import { UnzippedFile } from '../models/unzipped-file';

class ZipService {
    constructor() {

    }

    async unzip(archive: ArrayBuffer): Promise<UnzippedFile[]> {
        const zip = await JSZip.loadAsync(archive);
        const result: UnzippedFile[] = [];
        for (const fileName of Object.keys(zip.files)) {
            result.push({
                contents: await zip.file(fileName).async('arraybuffer'),
                name: fileName
            });
        }
        return result;
    }

}

const zipServiceInstance = new ZipService();
export default zipServiceInstance;