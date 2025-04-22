import LibraryContent from "@/features/content/model/library.model";
import { connect } from "@/lib/db";
import mongoose from "mongoose";

// types/api-response.ts

interface ApiResponseType<T = any> {
  success: boolean;
  message: string;
  data?: T;
  hasNext?: boolean;
  total?: number;
  currentPage?: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    await connect();

    const doctorId = searchParams.get("doctor_id");
    const isAdmin = searchParams.get("isAdmin") === "true";
    const isPending = searchParams.get("isPending") === "true";
    const contentId = searchParams.get("content_id");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // === Single Content ===
    if (contentId) {
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        const errorRes: ApiResponseType = {
          success: false,
          message: "Invalid content ID",
        };
        return Response.json(errorRes, { status: 400 });
      }

      const content = await LibraryContent.findById(contentId).populate(
        "author_id",
        "full_name specialization profile_picture"
      );
      if (!content) {
        const notFoundRes: ApiResponseType = {
          success: false,
          message: "Content not found",
        };
        return Response.json(notFoundRes, { status: 404 });
      }

      const isAuthor =
        doctorId && content.author_id?._id?.toString() === doctorId;

      if (content.isApproved || isAdmin || isAuthor) {
        const successRes: ApiResponseType = {
          success: true,
          message: "Content fetched successfully",
          data: content,
        };
        return Response.json(successRes, { status: 200 });
      }

      const unauthorizedRes: ApiResponseType = {
        success: false,
        message: "Not authorized to view this content",
      };
      return Response.json(unauthorizedRes, { status: 403 });
    }

    // === Paginated List ===
    const query: any = {};
    if (!isAdmin) query.isApproved = true;
    if (doctorId) {
      query.author_id = doctorId;
      if (!isAdmin || (isAdmin && !isPending)) {
        query.isApproved = true;
      }
    }
    if (isAdmin && isPending) {
      query.isApproved = false;
    }

    const total = await LibraryContent.countDocuments(query);
    const contents = await LibraryContent.find(query)
      .sort({ publishedDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author_id", "full_name specialization profile_picture");

    const hasNext = skip + contents.length < total;

    const paginatedRes: ApiResponseType = {
      success: true,
      message: "Contents fetched successfully",
      data: contents,
      total,
      currentPage: page,
      hasNext,
    };

    return Response.json(paginatedRes, { status: 200 });
  } catch (error) {
    console.error("Error fetching library content:", error);
    const errorRes: ApiResponseType = {
      success: false,
      message: "Internal server error while fetching content",
    };
    return Response.json(errorRes, { status: 500 });
  }
}
