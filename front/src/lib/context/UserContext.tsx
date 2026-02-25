import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { API_BASE_URL } from '../constant';
import { authStore } from '../auth';
import type { User, UserContextType } from '../types/user';
import type { Trait } from '../interfaces';

const TRAITS_STORAGE_KEY = 'quiz_traits_pending';

const UserContext = createContext<UserContextType | undefined>(undefined);

async function saveTraitsToApi(traits: Trait[], accessToken: string) {
  await fetch(API_BASE_URL + '/users/me/traits', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ traits }),
  });
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [traits, setTraitsState] = useState<Trait[]>(() => {
    try {
      const stored = localStorage.getItem(TRAITS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const fetchUser = useCallback(async () => {
    if (!authStore.accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_BASE_URL + '/users/me', {
        headers: { Authorization: `Bearer ${authStore.accessToken}` },
      });

      if (!response.ok) throw new Error('Failed to fetch user');

      const userData = await response.json();
      setUser(userData);

      if (userData.traits?.length) {
        setTraitsState(userData.traits);
        localStorage.removeItem(TRAITS_STORAGE_KEY);
      } else {
        const pending = localStorage.getItem(TRAITS_STORAGE_KEY);
        if (pending) {
          const pendingTraits: Trait[] = JSON.parse(pending);
          if (pendingTraits.length > 0) {
            await saveTraitsToApi(pendingTraits, authStore.accessToken);
            setTraitsState(pendingTraits);
            localStorage.removeItem(TRAITS_STORAGE_KEY);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refreshUser = async () => {
    await fetchUser();
  };

  const saveTraits = async (newTraits: Trait[]) => {
    setTraitsState(newTraits);

    if (authStore.accessToken) {
      await saveTraitsToApi(newTraits, authStore.accessToken);
      localStorage.removeItem(TRAITS_STORAGE_KEY);
    } else {
      localStorage.setItem(TRAITS_STORAGE_KEY, JSON.stringify(newTraits));
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, traits, saveTraits }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
