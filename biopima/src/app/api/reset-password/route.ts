const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, otp } = body;

  if (!email || !password || !otp) {
    return new Response("Missing required fields: email, password, otp", {
      status: 400,
      statusText: "Bad Request",
    });
  }
  try {
    const response = await fetch(`${baseUrl}/api/reset-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        confirm_password: password,
        otp,
      }),
    });
    const result = await response.json();

    if (response.ok) {
      return new Response(JSON.stringify(result), {
        status: 200,
        statusText: "Password reset successful",
      });
    } else {
      return new Response(JSON.stringify(result), {
        status: response.status,
        statusText: "Error resetting password",
      });
    }
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}