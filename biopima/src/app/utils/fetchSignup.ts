const baseUrl = "/api/signup";

export async function signupUser(
  name: string,
  companyName: string,
  companyEmail: string,
  phone: string,
  password: string,
) {

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        username: companyName,
        email: companyEmail,
        phone_number: phone,
        password,
      }), 
    });

    if (!response.ok) {
      throw new Error("Login failed: " + response.statusText);
    }

    return await response.json();
  } catch (error) {
   throw new Error('Failed to fetch: ' + (error as Error).message);
  }
}
