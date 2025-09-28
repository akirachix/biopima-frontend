// import { useState } from "react";
// import { updateUser } from "../utils/fetchProfile";
// import { UserSettings } from "../utils/types/profile";

// export function useUserSettings() {
//   const [updating, setUpdating] = useState(false);
//   const [updateError, setUpdateError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);

//   const updateSettings = async (
//     baseUrl: string,
//     userId: string,
//     settings: UserSettings,
//     imageFile?: File | null,
//     token?: string
//   ) => {
//     setUpdating(true);
//     setUpdateError(null);
//     setSuccess(false);

//     try {
//       await updateUser(baseUrl, userId, settings, imageFile, token);
//       setSuccess(true);
//       return true;
//     } catch (error) {
//       setUpdateError((error as Error).message);
//       return false;
//     } finally {
//       setUpdating(false);
//     }
//   };

//   return { updateSettings, updating, updateError, success };
// }






import { useState } from "react";
import { updateUser } from "../utils/fetchProfile";
import { UserSettings } from "../utils/types/profile";

export function useUserSettings() {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateSettings = async (
    baseUrl: string,
    userId: string,
    settings: UserSettings,
    imageFile?: File | null,
    token?: string
  ) => {
    setUpdating(true);
    setUpdateError(null);
    setSuccess(false);

    try {
      await updateUser(baseUrl, userId, settings, imageFile, token);
      setSuccess(true);
      return true;
    } catch (error) {
      setUpdateError((error as Error).message);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return { updateSettings, updating, updateError, success };
}
