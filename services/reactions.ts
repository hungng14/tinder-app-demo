import { connectToDB } from "../libs/mongodb";
import ReactionsModel from "../models/reactions";
import TotalReactionsModel from "../models/totalReactions";

export const handleLike = async (data: {
  userId: string;
  profileId: string;
}) => {
  try {
    await connectToDB();
    const hasReaction = await ReactionsModel.findOne({
      userId: data.userId,
      profileId: data.profileId,
    });
    const hasTotalReactions = await TotalReactionsModel.findOne({profileId: data.profileId})
    if (hasReaction) {
      const result = await hasReaction.remove();
      hasTotalReactions.total -= 1;
      await hasTotalReactions.save();
    } else {
      await ReactionsModel.create({
        userId: data.userId,
        profileId: data.profileId,
      });
      if(hasTotalReactions) {
        hasTotalReactions.total += 1;
        await hasTotalReactions.save()
      } else {
        await TotalReactionsModel.create({profileId: data.profileId, total: 1})
      }
    }
    return { ok: true };
  } catch (error: any) {
      throw new Error(error)
  }
};
export const getReactions = async () => {
  await connectToDB()
  const reactions = await ReactionsModel.find();
  let totalReactions = await TotalReactionsModel.find();
  totalReactions = totalReactions.reduce((obj,item) => {
    if(!obj[item.profileId]) {
      obj[item.profileId] = {total: item.total}
    }
    reactions.forEach((r) => {
      if(r.profileId === item.profileId) {
        obj[item.profileId][r.userId] = true
      }
    })
    return obj
  }, {})
  return {totalReactions}
}