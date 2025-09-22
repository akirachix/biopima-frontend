const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${baseUrl}/api/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 201, 
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response((error as Error).message,{
       status: 500,
    });
  }
}
