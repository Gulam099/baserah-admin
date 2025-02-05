import { NextResponse } from "next/server";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";

const APP_ID = process.env.AGORA_APP_ID as string;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE as string;

if (!APP_ID || !APP_CERTIFICATE) {
  throw new Error("AGORA_APP_ID and AGORA_APP_CERTIFICATE must be set in the environment variables.");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { channelName, uid, role, expirationTime } = body;

    if (!channelName || uid === undefined) {
      return NextResponse.json({ error: "Channel name and UID are required." }, { status: 400 });
    }

    const rtcRole = role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const expireTime = expirationTime || 3600; // Default 1 hour
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      rtcRole,
      privilegeExpireTime
    );

    return NextResponse.json({
      token,
      channelName,
      uid,
      role: rtcRole,
      expiresIn: expireTime,
    });
  } catch (error: any) {
    console.error("Error generating token:", error);
    return NextResponse.json({ error: "Failed to generate token.", details: error.message }, { status: 500 });
  }
}
