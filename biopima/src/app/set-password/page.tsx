"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useSetPassword from "../hooks/useFetchSetPassword";
import { FiEye, FiEyeOff } from "react-icons/fi";


function SetPasswordPage() {
 const router = useRouter();
 const {
   SetPassword,
   loading,
   error,
 } = useSetPassword();

 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [passwordError, setPasswordError] = useState("");
 const [confirmPasswordError, setConfirmPasswordError] = useState("");
 const [message, setMessage] = useState("");
 const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   setEmail(e.target.value);
 };

 const handlePasswordChange = (value: string) => {
   setPassword(value);
   if (value.length < 8) {
     setPasswordError("Password must be at least 8 characters.");
   } else {
     setPasswordError("");
   }
   if (confirmPassword && value !== confirmPassword) {
     setConfirmPasswordError("Passwords do not match.");
   } else {
     setConfirmPasswordError("");
   }
 };

 const handleConfirmPasswordChange = (value: string) => {
   setConfirmPassword(value);
   if (password !== value) {
     setConfirmPasswordError("Passwords do not match.");
   } else {
     setConfirmPasswordError("");
   }
 };

 const onSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setPasswordError("");
   setConfirmPasswordError("");
   setMessage("");

   if (password.length < 8) {
     setPasswordError("Password must be at least 8 characters.");
     return;
   }
   if (password !== confirmPassword) {
     setConfirmPasswordError("Passwords do not match.");
     return;
   }
   const result = await SetPassword(email, password);
   if (result && result.success) {
     setMessage("Password Set Successful!");
   } else if (result && result.message) {
     setMessage(result.message);
   }
 };

 const isSuccess = message && message.toLowerCase().includes("successful");

 return (
   <div
     className="min-h-screen w-full flex items-center justify-center"
     style={{
       backgroundImage: "url('/images/greenbg.png')",
       backgroundSize: "cover",
       backgroundPosition: "center",
     }}
   >
     <div className="bg-[#09770993] rounded-2xl px-8 w-[1000px] h-[700px] flex flex-col items-center">
       {isSuccess ? (
         <>
           <h2 className="text-white mb-6 font-semibold mt-[150px] text-3xl text-center">
             Password Set Successful!
           </h2>
           <p className="text-white mb-4 text-base text-center">
             Your password has been set successfully.
           </p>
        
           <button
             className="w-full max-w-xs py-3 bg-[#9EAF1B] text-white font-medium text-lg rounded-lg transition-colors duration-200 hover:bg-green-700 cursor-pointer"
             onClick={() => router.push("/login?role=institution")}
           >
             Go to Login
           </button>
         </>
       ) : (
         <>
           <h2 className="text-white mb-6 font-semibold text-4xl mt-[60px] text-center">
             Set Password
           </h2>
           <p className="text-white mb-4 text-base text-center">
             Do you want to reset your password?
           </p>
           <form
             className="w-full flex flex-col items-center"
             onSubmit={onSubmit}
             aria-label="Set password form"
           >
             <div className="w-[550px] mt-6">
               <label
                 htmlFor="email"
                 className="block text-white font-semibold text-lg"
               >
                 Email Address
               </label>
               <input
                 id="email"
                 type="email"
                 placeholder="Email Address"
                 value={email}
                 onChange={handleEmailChange}
                 required
                 className="w-full px-4 py-3 rounded-lg bg-white text-[#0b4906] placeholder:text-[#0b4906]/60 shadow-sm outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
               />
             </div>
            
             <div className="relative w-[550px] mt-6">
               <label
                 htmlFor="password"
                 className="block text-white font-semibold text-lg "
               >
                 New Password
               </label>
               <input
                 id="password"
                 name="password"
                 type={showPassword ? "text" : "password"}
                 value={password}
                 onChange={(e) => handlePasswordChange(e.target.value)}
                 placeholder="New Password"
                 required
                 className="w-full px-4 py-3 rounded-lg border-none text-base outline-none bg-white text-black"
               />
               <button
                 type="button"
                 className="absolute right-4 top-[52px] transform -translate-y-1/2 text-[#0b4906] z-10 cursor-pointer"
                 onClick={() => setShowPassword((prev) => !prev)}
                 aria-label={showPassword ? "Hide password" : "Show password"}
               >
                 {showPassword ? <FiEye size={22} /> : <FiEyeOff size={22} />}
               </button>
               {passwordError && (
                 <p className="text-red-500 mt-2">{passwordError}</p>
               )}
             </div>
            
             <div className="relative w-[550px] mt-6">
               <label
                 htmlFor="confirmPassword"
                 className="block text-white font-semibold text-lg "
               >
                 Confirm Password
               </label>
               <input
                 id="confirmPassword"
                 name="confirmPassword"
                 type={showConfirmPassword ? "text" : "password"}
                 value={confirmPassword}
                 onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                 placeholder="Confirm Password"
                 required
                 className="w-full px-4 py-3 rounded-lg border-none text-base outline-none bg-white text-black"
               />
               <button
                 type="button"
                 className="absolute right-4 top-[52px] transform -translate-y-1/2 text-[#0b4906] z-10 cursor-pointer"
                 onClick={() => setShowConfirmPassword((prev) => !prev)}
                 aria-label={
                   showConfirmPassword ? "Hide password" : "Show password"
                 }
               >
                 {showConfirmPassword ? (
                   <FiEye size={22} />
                 ) : (
                   <FiEyeOff size={22} />
                 )}
               </button>
               {confirmPasswordError && (
                 <p className="text-red-500 mt-2">{confirmPasswordError}</p>
               )}
             </div>
            
             <button
               type="submit"
               className="w-[550px] py-3 mt-11 bg-[#9EAF1B] hover:bg-green-700 text-white font-medium text-lg rounded-lg transition-colors duration-200 disabled:opacity-60 cursor-pointer"
               disabled={loading}
             >
               {loading ? "Sending..." : "Set Password"}
             </button>
             {error && <p className="text-red-500 mt-4">{error}</p>}
             {message && <p className="text-white mt-4">{message}</p>}
           </form>
         </>
       )}
     </div>
   </div>
 );
}

export default SetPasswordPage;



