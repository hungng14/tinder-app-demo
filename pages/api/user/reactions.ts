import type { NextApiRequest, NextApiResponse } from "next";
import { getReactions } from "../../../services/reactions";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      return res.status(404).json({ message: "Not found" });
    }

    const result = await getReactions();
    res.status(200).send(result);
  } catch (error: any) {
    console.log("error", error);
    throw new Error(error)
  }
}

export default handler;
