import { UserSettings } from "./types/profile";

async function fetchUser(baseUrl: string, userId: string, token: string) {
  const response = await fetch(`${baseUrl}/api/user/${userId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response from server: " + text);
  }
  if (!response.ok) {
    throw new Error(data.error || data.detail || "Failed to fetch user");
  }
  return data;
}

async function updateUser(
  baseUrl: string,
  userId: string,
  settings: UserSettings,
  imageFile?: File | null,
  token?: string
) {
  const formData = new FormData();
  formData.append("id", userId);
  formData.append("name", `${settings.fullName} ${settings.lastName}`);
  formData.append("email", settings.email);
  formData.append("phone_number", settings.phone);
  if (imageFile) formData.append("image", imageFile);

  const response = await fetch(`${baseUrl}/api/user/${userId}/`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response from server: " + text);
  }
  if (!response.ok) {
    throw new Error(
      data.error || data.detail || "Failed to update user profile"
    );
  }
  return data;
}

export { fetchUser, updateUser };
