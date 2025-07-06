import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("🔑 Cloudinary config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "loaded ✅" : "missing ❌"
});


const uploadCouldinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("🚫 Local file path not provided");
      return null;
    }

    console.log("🟡 Uploading file:", localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("✅ Cloudinary upload success:", response.secure_url);

    // Delete the file after upload
    fs.unlink(localFilePath, (err) => {
      if (err) console.error("⚠️ Failed to delete local file:", err);
    });

    return response;
  } catch (err) {
    console.error("❌ Cloudinary upload failed:", err.message || err);

    // Try deleting local file if it exists
    if (fs.existsSync(localFilePath)) {
      fs.unlink(localFilePath, (unlinkErr) => {
        if (unlinkErr) console.error("⚠️ Failed to delete local file:", unlinkErr);
      });
    }

    return null;
  }
};

export { uploadCouldinary };
