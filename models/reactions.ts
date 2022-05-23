import mongoose, { Schema, model, Document } from 'mongoose'
const modelName = 'reactions';

export interface IReactionsModel extends Document {
  
  profileId: string,
  userId: string
}

const schema = new Schema<IReactionsModel>({
  profileId: {type: String, index: true},
  userId: {type: String, index: true},
});

const collection = mongoose.models[modelName] || model<IReactionsModel>(modelName, schema)

export default collection