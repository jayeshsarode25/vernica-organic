import ImageKit from "imagekit";
import config from "../config/config.js";
import { v4 as uuidv4 } from "uuid";

const imageKit = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL,
});


async function uploadImage({ buffer, folder = '/Varnika-products' }) {
    const res = await imageKit.upload({
        file: buffer,
        fileName: uuidv4(),
        folder,
    });
    return {
        url: res.url,
        thumbnail: res.thumbnailUrl || res.url,
        id: res.fileId,
    };
}

async function uploadVideo({buffer,originalname, folder = '/varnika-videos'}){
    const ext = originalname?.split(".").pop() || "mp4";

    const res = await imageKit.upload({
        file: buffer,
        fileName: `${uuidv4()}.${ext}`,
        folder,
        useUniqueFileName: false
    });
    return{
        url: res.url,
        thumbnail: `${res.thumbnailUrl || res.url}?tr=so-1`,
        id: res.fileId
    }
}


export {imageKit,uploadImage, uploadVideo};
