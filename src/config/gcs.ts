import { Storage } from '@google-cloud/storage'
import path from 'path'
import { GCP_PROJECT_ID } from './env'

const storage = new Storage({
    keyFilename: path.join(__dirname, '../gcs-key.json'),
    projectId: GCP_PROJECT_ID,
})

const bucket = storage.bucket('anton-product-images')

export default bucket
