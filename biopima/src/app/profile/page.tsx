"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiEdit, FiUser, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";

import Sidebar from "../shared-components/Sidebar/Institution";
import { UserSettings } from "../utils/types/profile";
import { useUserSettings } from "../hooks/useFetchSettings";
import { fetchUser } from "../utils/fetchProfile";

function Profile() {
  const [form, setForm] = useState<UserSettings>({
    fullName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateSettings, updating, updateError } = useUserSettings();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("userId");
      const storedToken = localStorage.getItem("token");
      const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
      if (!storedId || !storedToken) {
        setError("No user session found. Please sign in again.");
        setLoading(false);
        return;
      }
      setUserId(storedId);
      setToken(storedToken);
      setBaseUrl(apiBaseUrl);
    }
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId || !token || !baseUrl) return;
      try {
        setLoading(true);
        setError(null);
        const userData = await fetchUser(baseUrl, userId, token);
        const nameParts = (userData.name || "").trim().split(/\s+/);
        const first = nameParts.length ? nameParts[0] : "";
        const last = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
        setForm({
          fullName: first,
          lastName: last,
          email: userData.email || userData.username || "",
          phone: userData.phone_number || "",
        });
        if (userData.image) setImageUrl(userData.image);
      } catch {
        setError("Could not load user. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [userId, token, baseUrl]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value } as UserSettings));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    if (!userId || !token || !baseUrl) {
      setError("No user session found.");
      return;
    }
    try {
      setError(null);
      setSuccessMessage(null);
      const success = await updateSettings(
        baseUrl,
        userId,
        form,
        imageFile,
        token
      );
      if (success) {
        setSuccessMessage("Profile updated successfully!");
      } else {
        setError(
          "Failed to update profile. Please check your inputs and try again."
        );
      }
    } catch {
      setError(
        "Failed to update profile. Please check your inputs and try again."
      );
    }
  };

  const selectFile = () => {
    fileInputRef.current?.click();
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    router.push("/login");
  };

  if (loading)
    return <div className="p-8 text-center">Loading your profile...</div>;

  return (
    <div className="flex min-h-screen relative">
      <Sidebar />
      <button
        onClick={() => setShowLogoutModal(true)}
        className="absolute top-6 right-6 text-[#013A01] hover:text-red-800 p-2 rounded-full bg-white shadow-md z-50 cursor-pointer"
        title="Log Out"
      >
        <FiLogOut size={18} />
      </button>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-[#11250e94] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-96 text-center">
            <h2 className="text-2xl font-bold text-[#084B08] mb-4">
              Confirm Logout
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-around">
              <button
                onClick={handleLogoutConfirm}
                className="px-6 py-2 bg-[#dae2d7fa] rounded-lg text-[#0f2c03fa] hover:bg-green-400 transition cursor-pointer"
              >
                Log Out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-6 py-2 bg-[#1F661F] text-[white] rounded-lg hover:bg-green-950 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 bg-gray-50 pt-10 pb-8 px-4 md:px-16">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
        {updateError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            Failed to save changes. Please try again.
          </div>
        )}

        <div className="mb-8 flex flex-col items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 rounded-full border-4 mt-[80px] border-[#157015] overflow-hidden bg-white flex items-center justify-center text-gray-300">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser size={48} />
              )}
            </div>
            <button
              type="button"
              onClick={selectFile}
              className="absolute bottom-0 right-0 bg-green-700 text-white p-2 rounded-full shadow-md hover:bg-green-600 transition cursor-pointer"
            >
              <FiEdit size={18} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex-1 ml-1 mt-[10px]">
            <p className="text-[30px] font-semibold text-green-900">{`${form.fullName.toUpperCase()} ${form.lastName.toUpperCase()}`}</p>
          </div>
        </div>

        <div className="bg-white w-[1140px] ml-[350px] pl-[40px] rounded-lg p-6">
          <h2 className="text-green-900 font-bold text-xl mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 mb-4">
            <div>
              <label className="block text-sm font-medium text-green-900 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="border-2 border-green-600 rounded-md px-3 py-2 outline-none w-[370px] focus:border-green-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium ml-[-150px] text-green-900 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="border-2 border-green-600 rounded-md px-3 py-2 outline-none ml-[-150px] w-[370px] focus:border-green-400"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-green-900 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-[757px] border-2 border-green-600 rounded-md px-3 py-2 outline-none focus:border-green-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-green-900 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-[757px] border-2 border-green-600 rounded-md px-3 py-2 outline-none focus:border-green-400"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="px-6 py-2 rounded-md bg-green-700 text-white font-bold hover:bg-green-800 cursor-pointer transition disabled:opacity-50"
            >
              {updating ? "Loading..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
