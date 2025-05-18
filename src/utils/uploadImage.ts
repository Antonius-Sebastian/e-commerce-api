import bucket from '../config/gcs'
import { v4 as uuidv4 } from 'uuid'

export const uploadImageToGCS = async (file: Express.Multer.File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const filename = `${uuidv4()}-${file.originalname}`
        const blob = bucket.file(filename)

        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: file.mimetype,
            metadata: {
                cacheControl: 'public, max-age=31536000',
            },
        })

        blobStream.on('error', (err) => reject(err))

        blobStream.on('finish', async () => {
            try {
                await blob.makePublic()
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`
                resolve(publicUrl)
            } catch (error) {
                reject(error)
            }
        })

        blobStream.end(file.buffer)
    })
}
