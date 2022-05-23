import type { NextApiRequest, NextApiResponse } from "next";
import { ObjType } from "../../../libs/types";
const DUMMY_APP_ID = process.env.NEXT_PUBLIC_DUMMY_APP_ID;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(404).send({ message: "Not Found" });
  }
  const query = new URLSearchParams(req.query as ObjType).toString();
  const data = await fetch(`https://dummyapi.io/data/v1/user?${query}`, {
    headers: {
      "app-id": DUMMY_APP_ID as string,
    },
  });
  const result = await data.json();

  res.status(200).json({ data: result.data });
}
