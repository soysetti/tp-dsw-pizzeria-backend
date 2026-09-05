import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Pedido } from '../interfaces/pedido';
import { ESTADOS_PEDIDO } from '../interfaces/pedido';
import { getPedidoById, actualizarEstadoPedido } from '../services/pedidoService';

export default function PedidoDetalle() {
  const { id } = useParams<{ id: string }>();
  const pedidoId = Number(id);

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarPedido();
  }, [pedidoId]);

  const cargarPedido = async () => {
    try {
      setCargando(true);
      const data = await getPedidoById(pedidoId);
      setPedido(data);
      setEstadoSeleccionado(data.estado);
      setError(null);
    } catch (err) {
      setError('No se pudo cargar el pedido.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardarEstado = async () => {
    if (!pedido) return;
    try {
      setGuardando(true);
      const actualizado = await actualizarEstadoPedido(pedido.id, estadoSeleccionado);
      setPedido(actualizado);
    } catch (err) {
      alert('No se pudo actualizar el estado del pedido.');
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p>Cargando pedido...</p>;
  if (error || !pedido) return <div className="error-message">⚠️ {error ?? 'Pedido no encontrado.'}</div>;

  return (
    <div className="ingredientes-container">
      <Link to="/pedidos" className="nav-link">
        ← Volver a Pedidos
      </Link>

      <h2>🧾 Pedido #{pedido.id}</h2>

      <div className="crear-ingrediente-form">
        <h3>Datos generales</h3>
        <p><strong>Fecha:</strong> {new Date(pedido.dia).toLocaleString()}</p>
        <p><strong>Retiro en el local:</strong> {pedido.retiro ? 'Sí' : 'No'}</p>
        {pedido.cliente && (
          <p>
            <strong>Cliente:</strong> {pedido.cliente.nombre} {pedido.cliente.apellido} — {pedido.cliente.domicilio}
          </p>
        )}
        <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>

        <div className="form">
          <div className="form-group-small">
            <label>Estado:</label>
            <select
              value={estadoSeleccionado}
              onChange={(e) => setEstadoSeleccionado(e.target.value)}
              className="form-input"
            >
              {ESTADOS_PEDIDO.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button
              className="btn-submit"
              onClick={handleGuardarEstado}
              disabled={guardando || estadoSeleccionado === pedido.estado}
            >
              {guardando ? 'Guardando...' : 'Actualizar estado'}
            </button>
          </div>
        </div>
      </div>

      <h3>Ítems del pedido</h3>
      <table className="ingredientes-table">
        <thead>
          <tr>
            <th>Pizza</th>
            <th>Cantidad</th>
            <th>Precio unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {pedido.detalles.map((d) => (
            <tr key={d.pizza.id}>
              <td>{d.pizza.nombre}</td>
              <td>{d.cantidad}</td>
              <td>${d.pizza.precio.toFixed(2)}</td>
              <td>${(d.cantidad * d.pizza.precio).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}