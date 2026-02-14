export const authStore = { accessToken: null as string | null };

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
    const refreshRes = await fetch('http://localhost:3000/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      authStore.accessToken = refreshData.accessToken;
      return fetchWithAuth(url, options); // réessaye la requête
    } else {
      throw new Error('Session expirée');
    }
  }

  return res;
}
