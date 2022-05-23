import mongoose from 'mongoose'
const MONGODB_URI = process.env.MONGODB_URI || 'localhost:27017' as string

let cachedDb: any = null;
export async function connectToDB() {
  if (cachedDb) return cachedDb
  try {
    const db = await mongoose.connect(MONGODB_URI, {})
    cachedDb = db;
    console.log('connect db successfully')
    return cachedDb
  } catch (error: any) {
    console.error('Connect to db failed', error.message || error)
  }
}
