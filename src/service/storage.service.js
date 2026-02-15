import ImageKit from "@imagekit/nodejs";

const client = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file) {
  try {
    const response = await client.files.upload({
      file,
      fileName: "music_" + Date.now(),
    });

    return response;
  } catch (err) {
    console.error(err);
    throw err; // important for controllers
  }
}

async function deleteFile(fileId){
  try{
    await client.files.delete(fileId);
  }catch(err){
    console.log(err)
    throw err;
  }
}

export { uploadFile , deleteFile};
