export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Wrapper de fetch que:
 * - añade automáticamente Content-Type: application/json
 * - añade el token JWT si existe en localStorage
 * - parsea el JSON y lanza error si la respuesta no es ok
 */
export async function apiFetch(
  path,
  { method = "GET", body, headers, ...options } = {}
) {
  const token = localStorage.getItem("token");

  const finalHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers || {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  if (!res.ok) {
    let message = `Error en la API (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}
