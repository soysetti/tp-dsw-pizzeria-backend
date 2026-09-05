import type { NuevoPedido, Pedido } from '../interfaces/pedido';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  message?: string;
  data: T;
}

export async function getPedidos(estado?: string): Promise<Pedido[]> {
  const query = estado ? `?estado=${encodeURIComponent(estado)}` : '';
  const response = await fetch(`${API_URL}/pedidos${query}`);
  if (!response.ok) throw new Error(`Error al obtener pedidos: ${response.status}`);
  const body: ApiResponse<Pedido[]> = await response.json();
  return body.data;
}

export async function getPedidoById(id: number): Promise<Pedido> {
  const response = await fetch(`${API_URL}/pedidos/${id}`);
  if (!response.ok) throw new Error(`Error al obtener el pedido ${id}: ${response.status}`);
  const body: ApiResponse<Pedido> = await response.json();
  return body.data;
}

export async function crearPedido(nuevo: NuevoPedido): Promise<Pedido> {
  const response = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevo),
  });
  if (!response.ok) throw new Error(`Error al crear el pedido: ${response.status}`);
  const body: ApiResponse<Pedido> = await response.json();
  return body.data;
}

export async function actualizarEstadoPedido(id: number, estado: string): Promise<Pedido> {
  const response = await fetch(`${API_URL}/pedidos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado }),
  });
  if (!response.ok) throw new Error(`Error al actualizar el estado del pedido ${id}: ${response.status}`);
  const body: ApiResponse<Pedido> = await response.json();
  return body.data;
}