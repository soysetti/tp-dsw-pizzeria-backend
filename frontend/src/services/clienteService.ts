import type { Cliente, NuevoCliente, ActualizarCliente } from '../interfaces/cliente';
import { getAuthHeaders } from './httpCliente.ts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  message?: string;
  data: T;
}

export async function getClientes(): Promise<Cliente[]> {
  const response = await fetch(`${API_URL}/clientes`, {
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) throw new Error(`Error al obtener clientes: ${response.status}`);
  const body: ApiResponse<Cliente[]> = await response.json();
  return body.data;
}

export async function crearCliente(nuevo: NuevoCliente): Promise<Cliente> {
  const response = await fetch(`${API_URL}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(nuevo),
  });
  if (!response.ok) throw new Error(`Error al crear cliente: ${response.status}`);
  const body: ApiResponse<Cliente> = await response.json();
  return body.data;
}

export async function actualizarCliente(id: number, cambios: ActualizarCliente): Promise<Cliente> {
  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(cambios),
  });
  if (!response.ok) throw new Error(`Error al actualizar cliente ${id}: ${response.status}`);
  const body: ApiResponse<Cliente> = await response.json();
  return body.data;
}

export async function eliminarCliente(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) throw new Error(`Error al eliminar cliente ${id}: ${response.status}`);
}