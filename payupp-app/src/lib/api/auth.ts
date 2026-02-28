import { api } from './axios';

export type Role = 'public' | 'user' | 'agent' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export async function loginWithEmail(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function signupWithEmail(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/signup', { name, email, password });
  return data;
}

export async function refreshToken(): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/refresh');
  return data;
}

export async function logoutOnServer(): Promise<void> {
  await api.post('/auth/logout');
}

