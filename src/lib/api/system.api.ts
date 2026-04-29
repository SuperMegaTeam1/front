import axios from 'axios';
import { API_ORIGIN } from './axios';
import type { BackendStatusResponse } from './types';

export function getBackendStatus() {
  return axios.get<BackendStatusResponse>(`${API_ORIGIN}/`);
}

export function getBackendHealth() {
  return axios.get<string>(`${API_ORIGIN}/health`);
}
