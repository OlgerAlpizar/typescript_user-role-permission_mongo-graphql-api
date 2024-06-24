import mongoose from 'mongoose'
import { Logger } from './logger-middleware'

export const mongooseConnectDB = async () => {
    mongoose.set('strictQuery', true)

    const connectionString = process.env.MONGO_DB_CONNECTION ?? ''

    await mongoose
        .connect(connectionString)
        .then(() => {
            Logger.info('Mongoose connected!')
        })
        .catch((err: Error) => {
            Logger.error('Error connecting to mongoose', err)
        })
}
