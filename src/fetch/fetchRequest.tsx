interface fetchRequestProps {
  URL: string;
  method: 'GET' | 'DELETE' | 'POST' | 'PUT';
  token: string;
  bodyParams?: { title: string; description?: string; userId?: string; order?: number };
}

export const fetchRequest = async ({ URL, method, token, bodyParams }: fetchRequestProps) => {
  const response = await fetch(URL, {
    method: method,
    headers:
      method === 'DELETE'
        ? {
            Accept: '*/*',
            Authorization: `Bearer ${token}`,
          }
        : {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
    body: JSON.stringify(bodyParams),
  });
  const data = method !== 'DELETE' && (await response.json());
  return data;
};
