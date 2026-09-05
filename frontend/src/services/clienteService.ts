import type { Cliente } from '../interfaces/cliente';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  message?: string;
  data: T;
}

export async function getClientes(): Promise<Cliente[]> {
  const response = await fetch(`${API_URL}/clientes`);
  if (!response.ok) throw new Error(`Error al obtener clientes: ${response.status}`);
  const body: ApiResponse<Cliente[]> = await response.json();
  return body.data;
}