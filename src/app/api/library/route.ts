// pages/api/library/index.ts
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { content_id } = req.query;

  if (!content_id) {
    return res.status(400).json({ message: "Missing content_id" });
  }

  // Simulated data response
  const data = {
    id: content_id,
    title: "Sample Document",
    description: "This is a mock content document for approval purposes.",
    status: "pending",
  };

  res.status(200).json({
    message: "Content fetched successfully",
    data,
  });
}
