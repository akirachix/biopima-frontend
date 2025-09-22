const baseUrl = process.env.BASE_URL;
export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return new Response(JSON.stringify({ detail: "Email is required." }), {
      status: 400,
    });
  }
  try {
    const response = await fetch(`${baseUrl}/forgot-password/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: response.status });
  } catch (error) {
    
    return new Response(JSON.stringify({
      detail: "An error occurred during the request.",
      error: (error as Error).message
    }), {
      status: 500,
    });
  }
}