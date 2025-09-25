"use client";
import { Bell, User } from "lucide-react";
import { useState, ChangeEvent, FormEvent } from "react";
import useFetchUsers from "../hooks/useFetchUsers";
import ConsultantLayout from "../shared-components/Sidebar/ConsultantLayout";
import { NewUserType } from "../utils/types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddUser() {
 
  const { addUser, error, successMessage, resetMessages } = useFetchUsers();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    username: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone_number: '',
    username: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    resetMessages();    
    const { name, value } = e.target;
    
    if (name === "phone_number") {
      const onlyDigits = value.replace(/\D/g, "");
      if (onlyDigits.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: onlyDigits }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({ name: '', email: '', phone_number: '', username: '' }); 

 
    const newErrors = {
      name: '',
      email: '',
      phone_number: '',
      username: '',
    };
    let hasError = false;

    if (!formData.name) {
      newErrors.name = "Institutional Name is required.";
      hasError = true;
    }
    if (!formData.username) {
      newErrors.username = "User Name is required.";
      hasError = true;
    }
    if (!formData.email) {
      newErrors.email = "Email is required.";
      hasError = true;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }
    if (!formData.phone_number) {
      newErrors.phone_number = "Phone number is required.";
      hasError = true;
    } else if (formData.phone_number.length < 10) { 
      newErrors.phone_number = "Phone number is too short.";
      hasError = true;
    }
    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const bodyData: NewUserType = {
      username: formData.username,
      email: formData.email,
      name: formData.name,
      phone_number: formData.phone_number,
      user_type: "Institutional operator",
      password: "bioPima123",
    };
    
    try {
  
      await addUser(bodyData); 
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        username: '',
      });
    } catch  {
  
    }
  };

  return (
    <ConsultantLayout>
      <div className="flex h-screen w-full">
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="flex justify-end items-center p-4 space-x-4">
            <Bell className="text-green-600 w-6 h-6" />
            <User className="text-green-600 w-6 h-6" />
          </div>
          <div className="p-6 space-y-15">
            <div>
              <h1 className="text-3xl font-semibold text-green-900">Add User</h1>
              <p className="text-s text-black">
                Manage your plant details, alert threshold and user access
              </p>
            </div>
            <div className="bg-[#255723] rounded-2xl p-20 pl-50 h-170">
              {successMessage && (
                <div className="relative text-center bottom-[140]">
                  <div className="text-green-600 text-lg">{successMessage}</div>
                </div>
              )}
              
              {error && (
                <div className="relative text-center bottom-[140]">
                  <div className="text-red-500">{error}</div>
                </div>
              )}
              <h2 className="text-white text-2xl font-semibold mb-5 mt-[-15px]">
                Plant Information
              </h2>
              <p className="text-gray-200 text-lg mb-10">
                Upload your plant details
              </p>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-20 mt-18">
                <div className="w-[70%]">
                  <label htmlFor="institutional-name" className="text-white text-s mb-1">Institutional Name</label>
                  <input
                    id="institutional-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md bg-white text-black outline-none"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div className="w-[70%] relative">
                  <label htmlFor="user-name" className="text-white text-s mb-1">User Name</label>
                  <input
                    id="user-name"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md bg-white text-black outline-none"
                  />
                  {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                </div>
                <div className="w-[70%]">
                  <label htmlFor="email" className="text-white text-s mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md bg-white text-black outline-none"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="w-[70%] relative">
                  <label htmlFor="phone-number" className="text-white text-s mb-1">Phone Number</label>
                  <input
                    id="phone-number"
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md bg-white text-black outline-none"
                  />
                  {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                </div>
                <div className="col-span-2 flex justify-end mt-2 mr-[27%]">
                  <button
                    type="submit"
                    className="bg-[#9EAF1B] text-white px-6 py-2 w-40 rounded-lg cursor-pointer font-semibold hover:bg-green-700"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ConsultantLayout>
  );
}