 const baseUrl = "api/reset-password";

async function resetPasswordApi({ email, password, confirm_password, otp }: { email: string, password: string, confirm_password: string, otp: string }) {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, confirm_password, otp }),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error("Invalid JSON: " + text);
  }

  if (!response.ok) {
    throw new Error(data.detail || "Failed to reset password");
  }

  return data;
}
export default resetPasswordApi;