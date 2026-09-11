import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Pedido } from '../../interfaces/pedido';
import { ESTADOS_PEDIDO } from '../../interfaces/pedido';
import type { Pizza } from '../../interfaces/pizza';
import { getPedidoById, actualizarEstadoPedido, eliminarPedido } from '../../services/pedidoService';
import { getPizzas } from '../../services/pizzaService';
import {
  agregarItemAPedido,
  actualizarCantidadItem,
  eliminarItemDePedido,
} from '../../services/detallePedidoService';

export default function PedidoDetalle() {
  const { id } = useParams<{ id: string }>();
  const pedidoId = Number(id);
  const navigate = useNavigate();

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [pizzasDisponibles, setPizzasDisponibles] = useState<Pizza[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>('');
  const [guardandoEstado, setGuardandoEstado] = useState(false);

  const [editandoPizzaId, setEditandoPizzaId] = useState<number | null>(null);
  const [cantidadEditada, setCantidadEditada] = useState<number>(1);

  const [pizzaNueva, setPizzaNueva] = useState<number | ''>('');
  const [cantidadNueva, setCantidadNueva] = useState<number>(1);

  useEffect(() => {
    cargarDatos();
  }, [pedidoId]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [pedidoData, pizzasData] = await Promise.all([getPedidoById(pedidoId), getPizzas()]);
      setPedido(pedidoData);
      setEstadoSeleccionado(pedidoData.estado);
      setPizzasDisponibles(pizzasData.filter((p) => p.disponible));
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

    if (estadoSeleccionado === 'Cancelado') {
      const confirmar = window.confirm(
        '¿Confirmás que querés CANCELAR este pedido? Una vez cancelado, ya no vas a poder modificar sus ítems, solo eliminarlo.'
      );
      if (!confirmar) {
        setEstadoSeleccionado(pedido.estado);
        return;
      }
    }

    try {
      setGuardandoEstado(true);
      const actualizado = await actualizarEstadoPedido(pedido.id, estadoSeleccionado);
      setPedido(actualizado);
    } catch (err) {
      alert('No se pudo actualizar el estado del pedido.');
      console.error(err);
    } finally {
      setGuardandoEstado(false);
    }
  };

  const handleEliminarPedido = async () => {
    if (!pedido) return;
    if (!window.confirm(`¿Eliminar el pedido #${pedido.id}? Esta acción no se puede deshacer.`)) return;
    try {
      await eliminarPedido(pedido.id);
      navigate('/pedidos');
    } catch (err) {
      alert('No se pudo eliminar el pedido.');
      console.error(err);
    }
  };

  const handleIniciarEdicionItem = (pizzaId: number, cantidadActual: number) => {
    setEditandoPizzaId(pizzaId);
    setCantidadEditada(cantidadActual);
  };

  const handleGuardarCantidadItem = async (pizzaId: number) => {
    if (!pedido || cantidadEditada <= 0) {
      alert('La cantidad debe ser mayor a 0.');
      return;
    }
    try {
      const actualizado = await actualizarCantidadItem(pedido.id, pizzaId, cantidadEditada);
      if (actualizado) setPedido(actualizado);
      setEditandoPizzaId(null);
    } catch (err) {
      alert('No se pudo actualizar la cantidad.');
      console.error(err);
    }
  };

  const handleEliminarItem = async (pizzaId: number) => {
    if (!pedido) return;
    if (pedido.detalles.length === 1) {
      alert('No podés dejar el pedido sin ítems. Cancelá el pedido completo si ya no corresponde.');
      return;
    }
    if (!window.confirm('¿Quitar esta pizza del pedido?')) return;
    try {
      const actualizado = await eliminarItemDePedido(pedido.id, pizzaId);
      if (actualizado) setPedido(actualizado);
    } catch (err) {
      alert('No se pudo quitar el ítem.');
      console.error(err);
    }
  };

  const handleAgregarItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pedido || pizzaNueva === '' || cantidadNueva <= 0) {
      alert('Elegí una pizza y una cantidad mayor a 0.');
      return;
    }
    try {
      const actualizado = await agregarItemAPedido(pedido.id, Number(pizzaNueva), cantidadNueva);
      if (actualizado) setPedido(actualizado);
      setPizzaNueva('');
      setCantidadNueva(1);
    } catch (err) {
      alert('No se pudo agregar la pizza (puede que ya esté en el pedido).');
      console.error(err);
    }
  };

  if (cargando) return <p>Cargando pedido...</p>;
  if (error || !pedido) return <div className="error-message">⚠️ {error ?? 'Pedido no encontrado.'}</div>;

  const pedidoCancelado = pedido.estado === 'Cancelado';

  const pizzasNoAgregadas = pizzasDisponibles.filter(
    (p) => !pedido.detalles.some((d) => d.pizza.id === p.id)
  );

  return (
    <div className="ingredientes-container">
      <Link to="/pedidos" className="nav-link">
        ← Volver a Pedidos
      </Link>

      <h2> Pedido #{pedido.id}</h2>

      {pedidoCancelado && (
        <div className="error-message">
           Este pedido está <strong>Cancelado</strong> y no puede modificarse.
        </div>
      )}

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
              disabled={pedidoCancelado}
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
              disabled={guardandoEstado || pedidoCancelado || estadoSeleccionado === pedido.estado}
            >
              {guardandoEstado ? 'Guardando...' : 'Actualizar estado'}
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedido.detalles.map((d) => (
            <tr key={d.pizza.id}>
              <td>{d.pizza.nombre}</td>
              <td>
                {editandoPizzaId === d.pizza.id ? (
                  <input
                    type="number"
                    value={cantidadEditada}
                    onChange={(e) => setCantidadEditada(Number(e.target.value))}
                    min="1"
                    className="form-input"
                    autoFocus
                  />
                ) : (
                  d.cantidad
                )}
              </td>
              <td>${d.pizza.precio.toFixed(2)}</td>
              <td>${(d.cantidad * d.pizza.precio).toFixed(2)}</td>
              <td>
                {editandoPizzaId === d.pizza.id ? (
                  <>
                    <button className="btn-submit" onClick={() => handleGuardarCantidadItem(d.pizza.id)}>
                      Guardar
                    </button>
                    <button onClick={() => setEditandoPizzaId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleIniciarEdicionItem(d.pizza.id, d.cantidad)}
                      disabled={pedidoCancelado}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminarItem(d.pizza.id)}
                      className="btn-eliminar"
                      disabled={pedidoCancelado}
                    >
                      Quitar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!pedidoCancelado && pizzasNoAgregadas.length > 0 && (
        <div className="crear-ingrediente-form">
          <h3> Agregar otra pizza al pedido</h3>
          <form onSubmit={handleAgregarItem} className="form">
            <div className="form-group">
              <label>Pizza:</label>
              <select
                value={pizzaNueva}
                onChange={(e) => setPizzaNueva(e.target.value === '' ? '' : Number(e.target.value))}
                className="form-input"
              >
                <option value="">Seleccioná una pizza</option>
                {pizzasNoAgregadas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} — ${p.precio}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group-small">
              <label>Cantidad:</label>
              <input
                type="number"
                value={cantidadNueva}
                onChange={(e) => setCantidadNueva(Number(e.target.value))}
                min="1"
                className="form-input"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-submit">
                Agregar
              </button>
            </div>
          </form>
        </div>
      )}

      {pedidoCancelado && (
        <div className="crear-ingrediente-form">
          <h3>Zona de peligro</h3>
          <p>Este pedido está cancelado. Podés eliminarlo definitivamente si ya no lo necesitás.</p>
          <button onClick={handleEliminarPedido} className="btn-eliminar">
            Eliminar este pedido
          </button>
        </div>
      )}
    </div>
  );
}