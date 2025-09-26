import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.BASE_URL;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    const response = await fetch(`${baseUrl}/user/${userId}/`);
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch user" }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const userId = formData.get("id") as string;

      if (!userId) {
        return NextResponse.json({ error: "Missing id in form data" }, { status: 400 });
      }

      const apiFormData = new FormData();
      apiFormData.append("name", formData.get("name") as string);
      apiFormData.append("email", formData.get("email") as string);
      apiFormData.append("phone_number", formData.get("phone_number") as string);

      const imageFile = formData.get("image") as File | null;
      if (imageFile && imageFile.size > 0) {
        apiFormData.append("image", imageFile);
      }

      const response = await fetch(`${baseUrl}/api/user/${userId}/`, {
        method: "PUT",
        body: apiFormData,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "Upstream update failed");
        return NextResponse.json({ error: text }, { status: response.status });
      }

      const result = await response.json();
      return NextResponse.json(result, { status: 200 });
    } else {
      const body = await request.json();
      const userId = body.id;
      if (!userId) {
        return NextResponse.json({ error: "Missing id in body" }, { status: 400 });
      }

      const payload = {
        name: body.name,
        email: body.email,
        phone_number: body.phone_number,
      };

      const response = await fetch(`${baseUrl}/api/user/${userId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "Upstream update failed");
        return NextResponse.json({ error: text }, { status: response.status });
      }

      const result = await response.json();
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
