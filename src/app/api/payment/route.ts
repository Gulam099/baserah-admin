// /app/api/create-payment/route.ts
import { NextResponse } from "next/server";
import { connect } from "@/lib/db"; // Your MongoDB connection utility
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientId, doctorId, amount, currency, description } = body;

    await connect();
    const payments = global.db.collection("payments");

    const newPayment = {
      patientId,
      doctorId,
      amount,
      currency,
      description,
      status: "pending", // initial
      createdAt: new Date(),
    };

    const result = await payments.insertOne(newPayment);
    const paymentId = result.insertedId.toString();

    return NextResponse.json({ success: true, paymentId });
  } catch (err) {
    console.error("Create Payment Error:", err);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
