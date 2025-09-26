import { useEffect, useState } from "react";
import { fetchUsers, createUser } from "../utils/fetchUsers";
import { UserType, NewUserType } from "../utils/types";

const useFetchUsers = () => {
  const [user, setUser] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await fetchUsers();
      setUser(userData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const AddUser = async (userData: NewUserType) => {
    setSuccessMessage(null); 
    setError(null); 
    try {
      const newUser = await createUser(userData);

      setSuccessMessage('User created successfully!'); 
      return newUser;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };
    const resetMessages = () => {
    setSuccessMessage(null);
    setError(null);
  };
  return { user, loading, error, AddUser, successMessage, setSuccessMessage, resetMessages };
};

export default useFetchUsers;
