import { api } from './axios';

export interface Dispute {
  id: string;
  transactionId: string;
  status: string;
  reason: string;
}

export async function getDispute(id: string) {
  const { data } = await api.get<Dispute>(`/disputes/${id}`);
  return data;
}

export async function submitDispute(payload: Omit<Dispute, 'id' | 'status'>) {
  const { data } = await api.post<Dispute>('/disputes', payload);
  return data;
}

export async function updateDisputeStatus(id: string, status: string) {
  const { data } = await api.patch<Dispute>(`/disputes/${id}`, { status });
  return data;
}

