const baseUrl = `api/verify-code/`

export async function verifyCodeApi(email: string, code: string) {
  const response = await fetch(baseUrl,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: code }),
    }
  );

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error("Invalid JSON response from server: " + text);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Failed to verify OTP: " + errorText);
  }

  return data;
}
