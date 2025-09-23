
const baseUrl = process.env.BASE_URL;

export async function GET() {
  try {
    
    const response = await fetch(`${baseUrl}/sensor-readings/`);
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      statusText: "Successfully fetched sensor readings",
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}
