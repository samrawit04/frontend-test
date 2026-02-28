import { api } from './axios';

export interface AgentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
}

export interface ExchangeRate {
  pair: string;
  rate: number;
  updatedAt: string;
}

export interface TransferRequest {
  id: string;
  amount: number;
  currency: string;
  senderName: string;
  createdAt: string;
}

export async function getAgentProfile() {
  const { data } = await api.get<AgentProfile>('/agent/profile');
  return data;
}

export async function updateAgentProfile(payload: Partial<AgentProfile>) {
  const { data } = await api.put<AgentProfile>('/agent/profile', payload);
  return data;
}

export async function getExchangeRates() {
  const { data } = await api.get<ExchangeRate[]>('/agent/exchange-rates');
  return data;
}

export async function getTransferRequests() {
  const { data } = await api.get<TransferRequest[]>('/agent/transfer-requests');
  return data;
}

