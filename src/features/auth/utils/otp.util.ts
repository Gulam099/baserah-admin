import { toast } from "sonner";
import { ApiBaseUrl } from "../../../../const";
import axios from "axios";
import { UserType } from "@/features/user/types/user.type";

export async function sendOtp(phoneNumber: string): Promise<void> {
  try {
    const res = await axios.post(`${ApiBaseUrl}/api/admin/send-otp`, {
      mobile_number: phoneNumber,
    });

    // Expecting res.data.message = "OTP sent successfully"
    toast.success(res.data?.message || "OTP sent successfully");
  } catch (error: any) {
    console.error("Failed to send OTP:", error);
    // Try to parse any server message, fallback to a generic error
    const errMessage =
      error?.response?.data?.message || "Failed to send OTP. Please try again.";
    toast.error(errMessage);
    throw new Error(errMessage);
  }
}

export async function verifyOtp(
  phoneNumber: string,
  otp: string
): Promise<{data:UserType}> {
  try {
    const res = await axios.post(`${ApiBaseUrl}/api/admin/verify-otp`, {
      mobile_number: phoneNumber,
      otp: otp,
    });

    // Expecting res.data.message = "OTP sent successfully"
    toast.success(res.data?.message || "Login successfully");
    return {
      data:res.data?.admin
    }
  } catch (error: any) {
    console.error("Failed to verify OTP:", error);
    // Try to parse any server message, fallback to a generic error
    const errMessage =
      error?.response?.data?.message || "Failed to verify OTP. Please try again.";
    toast.error(errMessage);
    throw new Error(errMessage);
  }
}
