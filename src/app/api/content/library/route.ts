import LibraryContent from "@/features/content/model/library.model";
import { connect } from "@/lib/db";
import mongoose from "mongoose";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import { Readable } from "stream";
import { promisify } from "util";
import { NextRequest, NextResponse } from "next/server";

// types/api-response.ts

interface ApiResponseType<T = any> {
  success: boolean;
  message: string;
  data?: T;
  hasNext?: boolean;
  limit?: number;
  total?: number;
  currentPage?: number;
}

// ---------- S3 Setup ----------
const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT!,
  region: process.env.DO_SPACES_REGION!,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: process.env.DO_SPACES_BUCKET!,
    Key: `cultural-content/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ACL: "public-read",
    ContentType: file.mimetype,
  };
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com/${params.Key}`;
};

// ---------- Multer Setup ----------
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const multerUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "media", maxCount: 1 }, // only for audio or video
]);

const runMiddleware = promisify(multerUpload);

// ---------- POST Handler ----------
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponseType>> {
  try {
    await connect();

    const formData = await new Promise<any>((resolve, reject) => {
      runMiddleware(req as any, {} as any, (err: any) => {
        if (err) return reject(err);
        resolve((req as any).files);
      });
    });

    const body = Object.fromEntries((await req.formData()).entries());
    const {
      title,
      category,
      description,
      type,
      publishedDate,
      authorId,
      message,
    } = body;

    if (!formData.thumbnail?.[0]) {
      return NextResponse.json({
        success: false,
        message: "Thumbnail is required.",
      });
    }

    const thumbnailUrl = await uploadFileToS3(formData.thumbnail[0]);

    let mediaUrl;
    if (["audio", "video"].includes(type) && formData.media?.[0]) {
      mediaUrl = await uploadFileToS3(formData.media[0]);
    }

    const newContent = await LibraryContent.create({
      title,
      category: Array.isArray(category) ? category : [category],
      description,
      type,
      url: mediaUrl,
      text: type === "article" ? body.text : undefined,
      publishedDate,
      authorId,
      message,
      thumbnail: thumbnailUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Library content created successfully.",
      data: newContent,
    });
  } catch (error: any) {
    console.error("Error creating library content:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong.",
    });
  }
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
