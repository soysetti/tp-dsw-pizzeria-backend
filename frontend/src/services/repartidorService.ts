import type {
  Repartidor,
  NuevoRepartidor,
  ActualizarRepartidor,
} from '../interfaces/repartidor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  message?: string;
  data: T;
}

export async function getRepartidores(): Promise<Repartidor[]> {
  const response = await fetch(`${API_URL}/repartidores`);

  if (!response.ok) {
    throw new Error(`Error al obtener repartidores: ${response.status}`);
  }

  const body: ApiResponse<Repartidor[]> = await response.json();
  return body.data;
}

export async function crearRepartidor(
  nuevoRepartidor: NuevoRepartidor
): Promise<Repartidor> {
  const response = await fetch(`${API_URL}/repartidores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoRepartidor),
  });

  if (!response.ok) {
    throw new Error(`Error al crear repartidor: ${response.status}`);
  }

  const body: ApiResponse<Repartidor> = await response.json();
  return body.data;
}

export async function actualizarRepartidor(
  id: number,
  cambios: ActualizarRepartidor
): Promise<Repartidor> {
  const response = await fetch(`${API_URL}/repartidores/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cambios),
  });

  if (!response.ok) {
    throw new Error(`Error al actualizar repartidor ${id}: ${response.status}`);
  }

  const body: ApiResponse<Repartidor> = await response.json();
  return body.data;
}

export async function eliminarRepartidor(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/repartidores/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error al eliminar repartidor ${id}: ${response.status}`);
  }
}