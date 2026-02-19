import { createContext, useState, useEffect, type ReactNode } from 'react';
import { authStore } from '../auth';
import type { User, UserContextType } from '../types/user';

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (!authStore.accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/users/me', {
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>{children}</UserContext.Provider>
  );
}

export default UserContext;
