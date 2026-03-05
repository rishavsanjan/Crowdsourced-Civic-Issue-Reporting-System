const CLOUDINARY_CLOUD_NAME = "diwmvqto3";
const CLOUDINARY_UPLOAD_PRESET = "crowd-app";
export const uploadToCloudinary = async (uri: string, type: 'image' | 'video') => {
    try {
        const formData = new FormData();
        formData.append('file', {
            uri,
            type: type === 'image' ? 'image/jpeg' : 'video/mp4',
            name: type === 'image' ? 'photo.jpg' : 'video.mp4',
        } as any);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('resource_type', type);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type}/upload`,
            {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        const data = await response.json();

        if (data.secure_url) {
            return data.secure_url;
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};