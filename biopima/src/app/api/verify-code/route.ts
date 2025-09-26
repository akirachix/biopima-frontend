const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ message: "Email and OTP required" }),
        { status: 400 }
      );
    }

    const response = await fetch(`${baseUrl}/verify-code/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(
        JSON.stringify({ message: data.message || "Invalid OTP" }),
        { status: response.status }
      );
    }
    return new Response(
      JSON.stringify({ success: true, message: "OTP verified" }),
      { status: 200 }
    );
  } catch {
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
