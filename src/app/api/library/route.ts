export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const content_id = searchParams.get("content_id");

  if (!content_id) {
    return new Response(JSON.stringify({ message: "Missing content_id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = {
    id: content_id,
    title: "Sample Document",
    description: "This is a mock content document for approval purposes.",
    status: "pending",
  };

  return new Response(
    JSON.stringify({ message: "Content fetched successfully", data }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
