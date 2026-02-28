import { api } from './axios';

export interface PlatformMetrics {
  totalUsers: number;
  totalAgents: number;
  totalVolume: number;
}

export async function getAllUsers() {
  const { data } = await api.get('/admin/users');
  return data;
}

export async function getAllAgents() {
  const { data } = await api.get('/admin/agents');
  return data;
}

export async function getPlatformMetrics() {
  const { data } = await api.get<PlatformMetrics>('/admin/metrics');
  return data;
}

