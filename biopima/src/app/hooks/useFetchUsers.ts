// hooks/useFetchUsers.ts
import { useEffect, useState } from "react";
import { fetchUsers, createUser } from "../utils/fetchUsers";
import { UserType, NewUserType } from "../utils/types";

const useFetchUsers = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await fetchUsers();
      setUsers(userData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load users';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const addUser = async (userData: NewUserType) => {
    setSuccessMessage(null);
    setError(null);
    try {
      const newUser = await createUser(userData);
      setSuccessMessage('User created successfully!');
      
      await loadUsers();
      return newUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create user';
      setError(message);
      throw err; 
    }
  };

  const resetMessages = () => {
    setSuccessMessage(null);
    setError(null);
  };

  return {
    users,
    loading,
    error,
    addUser,
    successMessage,
    resetMessages,
  };
};

export default useFetchUsers;