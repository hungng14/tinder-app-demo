import mongoose, { Schema, model, Document } from 'mongoose'
const modelName = 'totalReactions';

export interface ITotalReactionsModel extends Document {
  profileId: string;
  total: number;
}

const schema = new Schema<ITotalReactionsModel>({
  profileId: {type: String, index: true},
  total: Number,
});

const collection = mongoose.models[modelName] || model<ITotalReactionsModel>(modelName, schema)

export default collection