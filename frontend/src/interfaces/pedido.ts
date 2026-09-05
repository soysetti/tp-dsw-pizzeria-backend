import type { Pizza } from './pizza';
import type { Cliente } from './cliente';

export interface ItemPedido {
  pizzaId: number;
  cantidad: number;
}

export interface NuevoPedido {
  retiro: boolean;
  clienteId: number;
  items: ItemPedido[];
}

export interface DetallePedidoItem {
  pizza: Pizza;
  cantidad: number;
}

export interface Pedido {
  id: number;
  dia: string;
  total: number;
  retiro: boolean;
  estado: string;
  detalles: DetallePedidoItem[];
  cliente?: Cliente;
}

export const ESTADOS_PEDIDO = ['Pendiente', 'En preparación', 'En camino', 'Entregado', 'Cancelado'] as const;
export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];