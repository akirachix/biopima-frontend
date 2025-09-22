const baseUrl = process.env.BASE_URL;
console.log(baseUrl);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ detail: "Email is required." }), {
        status: 400,
      });
    }

    const response = await fetch(`${baseUrl}/forgot-password/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      return new Response(
        JSON.stringify({ detail: "Invalid response from server", raw: text }),
        {
          status: response.status,
        }
      );
    }

    return new Response(JSON.stringify(data), { status: response.status });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}
