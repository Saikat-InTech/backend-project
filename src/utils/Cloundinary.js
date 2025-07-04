import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadCouldinary= async (localfilepath)=>{
    try{

        if(!localfilepath) return null;
     const response=   await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"

        })
        //file has been upload succesfully
console.log("succesfully upload",response.url)
return response;

}catch(err){
    fs.unlinkSync(localfilepath)
    return null;

}


}
export {uploadCouldinary}