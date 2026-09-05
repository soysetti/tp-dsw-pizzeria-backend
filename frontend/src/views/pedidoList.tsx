import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Pedido } from '../interfaces/pedido';
import { ESTADOS_PEDIDO } from '../interfaces/pedido';
import { getPedidos } from '../services/pedidoService';

export default function PedidoList() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('');

  useEffect(() => {
    cargarPedidos();
  }, [filtroEstado]);

  const cargarPedidos = async () => {
    try {
      setCargando(true);
      const data = await getPedidos(filtroEstado || undefined);
      setPedidos(data);
      setError(null);
    } catch (err) {
      setError('No se pudo conectar con el servidor para obtener los pedidos.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const calcularTotalItems = (pedido: Pedido) =>
    pedido.detalles.reduce((acc, d) => acc + d.cantidad, 0);

  return (
    <div className="ingredientes-container">
      <h2>📋 Pedidos</h2>

      <div className="form-group filtro-container">
        <label>Filtrar por estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="form-input"
        >
          <option value="">Todos los estados</option>
          {ESTADOS_PEDIDO.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      {cargando ? (
        <p>Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p>No hay pedidos {filtroEstado ? `en estado "${filtroEstado}"` : 'registrados'}.</p>
      ) : (
        <table className="ingredientes-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Ítems</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{new Date(p.dia).toLocaleDateString()}</td>
                <td>{calcularTotalItems(p)}</td>
                <td>${p.total.toFixed(2)}</td>
                <td>{p.estado}</td>
                <td>
                  <Link to={`/pedidos/${p.id}`} className="nav-link">
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}