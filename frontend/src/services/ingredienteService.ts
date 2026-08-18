// src/services/ingredienteService.ts

import type {
  Ingrediente,
  NuevoIngrediente,
  ActualizarIngrediente,
} from '../interfaces/ingrediente';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  message?: string;
  data: T;
}

export async function getIngredientes(): Promise<Ingrediente[]> {
  const response = await fetch(`${API_URL}/ingredientes`);

  if (!response.ok) {
    throw new Error(`Error al obtener ingredientes: ${response.status}`);
  }

  const body: ApiResponse<Ingrediente[]> = await response.json();
  return body.data;
}

export async function getIngredienteById(id: number): Promise<Ingrediente> {
  const response = await fetch(`${API_URL}/ingredientes/${id}`);

  if (!response.ok) {
    throw new Error(`Error al obtener el ingrediente ${id}: ${response.status}`);
  }

  const body: ApiResponse<Ingrediente> = await response.json();
  return body.data;
}

export async function crearIngrediente(
  nuevoIngrediente: NuevoIngrediente
): Promise<Ingrediente> {
  const response = await fetch(`${API_URL}/ingredientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoIngrediente),
  });

  if (!response.ok) {
    throw new Error(`Error al crear ingrediente: ${response.status}`);
  }

  const body: ApiResponse<Ingrediente> = await response.json();
  return body.data;
}

export async function actualizarIngrediente(
  id: number,
  cambios: ActualizarIngrediente
): Promise<Ingrediente> {
  const response = await fetch(`${API_URL}/ingredientes/${id}`, {
    method: 'PUT', // tu backend registra ingredienteRouter.put('/:id', ...)
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cambios),
  });

  if (!response.ok) {
    throw new Error(`Error al actualizar ingrediente ${id}: ${response.status}`);
  }

  const body: ApiResponse<Ingrediente> = await response.json();
  return body.data;
}

export async function eliminarIngrediente(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/ingredientes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error al eliminar ingrediente ${id}: ${response.status}`);
  }
}