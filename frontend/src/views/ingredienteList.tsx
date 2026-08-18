import { useEffect, useState } from 'react';
import type { Ingrediente } from '../interfaces/ingrediente';
import {
  getIngredientes,
  eliminarIngrediente,
  actualizarIngrediente,
} from '../services/ingredienteService';
import CrearIngredienteForm from './crearIngredienteForm';

export default function IngredientesList() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    cargarIngredientes();
  }, []);

  const cargarIngredientes = async () => {
    try {
      setCargando(true);
      const data = await getIngredientes();
      setIngredientes(data);
      setError(null);
    } catch (err) {
      setError('No se pudo conectar con el servidor para obtener los ingredientes.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que querés eliminar este ingrediente?')) return;

    try {
      await eliminarIngrediente(id);
      setIngredientes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Error al intentar eliminar el ingrediente.');
      console.error(err);
    }
  };

  const handleModificarStock = async (id: number, nuevoStock: number) => {
    if (nuevoStock < 0) return;
    try {
      const ingredienteActualizado = await actualizarIngrediente(id, { stock: nuevoStock });
      setIngredientes((prev) =>
        prev.map((item) => (item.id === id ? ingredienteActualizado : item))
      );
    } catch (err) {
      alert('No se pudo actualizar el stock.');
      console.error(err);
    }
  };

  const handleIngredienteCreado = (nuevo: Ingrediente) => {
    setIngredientes((prev) => [...prev, nuevo]);
  };

  if (cargando) return <p>Cargando ingredientes...</p>;

  return (
    <div className="ingredientes-container">
      <h2>📦 Gestión de Stock de Ingredientes</h2>

      <CrearIngredienteForm onIngredienteCreado={handleIngredienteCreado} />

      {error && (
        <div style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
          ⚠️ {error}
        </div>
      )}

      {ingredientes.length === 0 && !error ? (
        <p>No hay ingredientes registrados.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Nombre</th>
              <th style={{ padding: '8px' }}>Stock</th>
              <th style={{ padding: '8px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingredientes.map((ing) => (
              <tr key={ing.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px' }}>{ing.nombre}</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => handleModificarStock(ing.id, ing.stock - 1)}>-</button>
                  <span style={{ margin: '0 10px', fontWeight: 'bold' }}>{ing.stock}</span>
                  <button onClick={() => handleModificarStock(ing.id, ing.stock + 1)}>+</button>
                </td>
                <td style={{ padding: '8px' }}>
                  <button
                    onClick={() => handleEliminar(ing.id)}
                    style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}