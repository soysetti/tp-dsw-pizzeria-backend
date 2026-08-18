import { useState } from 'react';
import type { NuevoIngrediente, Ingrediente } from '../interfaces/ingrediente';
import { crearIngrediente } from '../services/ingredienteService';

interface Props {
  onIngredienteCreado: (nuevo: Ingrediente) => void;
}

export default function CrearIngredienteForm({ onIngredienteCreado }: Props) {
  const [nombre, setNombre] = useState('');
  const [stock, setStock] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || stock < 0) {
      setError('Por favor, ingresá un nombre válido y un stock mayor o igual a 0.');
      return;
    }

    try {
      setError(null);
      setSubmitting(true);

      const nuevo: NuevoIngrediente = {
        nombre: nombre.trim(),
        stock: stock,
      };

      const ingredienteCreado = await crearIngrediente(nuevo);

      setNombre('');
      setStock(0);

      onIngredienteCreado(ingredienteCreado);
    } catch (err) {
      setError('No se pudo guardar el ingrediente. Intente nuevamente.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#f9f9f9',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #ddd',
    }}>
      <h3>➕ Agregar Nuevo Ingrediente</h3>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ {error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Jamón"
            disabled={submitting}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ flex: '1 1 100px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Stock Inicial:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            min="0"
            disabled={submitting}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ flex: '1 1 100%', marginTop: '10px' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {submitting ? 'Guardando...' : 'Guardar Ingrediente'}
          </button>
        </div>
      </form>
    </div>
  );
}