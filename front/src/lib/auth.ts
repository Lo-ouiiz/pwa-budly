export const authStore = {
  accessToken: null as string | null,
  isReady: false,
};

export async function initAuth() {
  try {
    const res = await fetch('http://localhost:3000/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      authStore.accessToken = data.accessToken;
    }
  } finally {
    authStore.isReady = true;
  }
}

export function isAuthenticated() {
  return !!authStore.accessToken;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: authStore.accessToken ? `Bearer ${authStore.accessToken}` : '',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (res.status === 401) {
    const refresh = await fetch('http://localhost:3000/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (refresh.ok) {
      const data = await refresh.json();
      authStore.accessToken = data.accessToken;
      return fetchWithAuth(url, options);
    }

    throw new Error('Session expirée');
  }

  return res;
}
