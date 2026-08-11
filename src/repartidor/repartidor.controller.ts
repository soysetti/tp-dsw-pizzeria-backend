import { Request, Response, NextFunction } from 'express';
import { RepartidorRepository } from './repartidor.repository.js';

const repository = new RepartidorRepository();

export function sanitizeRepartidorInput(req: Request, res: Response, next: NextFunction) {
  req.body.repartidorInput = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    contrasenia: req.body.contrasenia,
    nivel_permisos: req.body.nivel_permisos,
    estado: req.body.estado,
    matricula: req.body.matricula,
    monto_propina_total: req.body.monto_propina_total,
  };

  Object.keys(req.body.repartidorInput).forEach((key) => {
    if (req.body.repartidorInput[key] === undefined) {
      delete req.body.repartidorInput[key];
    }
  });

  next();
}

export async function findAll(req: Request, res: Response) {
  try {
    const repartidores = await repository.findAll();
    return res.status(200).json({ message: 'Todos los repartidores recuperados', data: repartidores });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const repartidor = await repository.findOne(id);
    if (!repartidor) {
      return res.status(404).json({ message: 'Repartidor no encontrado' });
    }
    return res.status(200).json({ data: repartidor });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function add(req: Request, res: Response) {
  try {
    const { nombre, apellido, email, contrasenia, nivel_permisos, estado, matricula, monto_propina_total } =
      req.body.repartidorInput;

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({ message: 'El nombre es requerido y debe ser un texto válido' });
    }
    if (!apellido || typeof apellido !== 'string' || apellido.trim() === '') {
      return res.status(400).json({ message: 'El apellido es requerido y debe ser un texto válido' });
    }
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({ message: 'El email es requerido y debe ser un texto válido' });
    }
    if (!contrasenia || typeof contrasenia !== 'string' || contrasenia.trim() === '') {
      return res.status(400).json({ message: 'La contraseña es requerida y debe ser un texto válido' });
    }
    if (nivel_permisos === undefined || typeof nivel_permisos !== 'number') {
      return res.status(400).json({ message: 'El nivel de permisos es requerido y debe ser un número' });
    }
    if (estado === undefined || typeof estado !== 'boolean') {
      return res.status(400).json({ message: 'El estado es requerido y debe ser un booleano' });
    }
    if (!matricula || typeof matricula !== 'string' || matricula.trim() === '') {
      return res.status(400).json({ message: 'La matrícula es requerida y debe ser un texto válido' });
    }
    if (monto_propina_total === undefined || typeof monto_propina_total !== 'number' || monto_propina_total < 0) {
      return res.status(400).json({ message: 'El monto de propina total es requerido y debe ser un número mayor o igual a 0' });
    }

    const nuevoRepartidor = await repository.add(req.body.repartidorInput);
    return res.status(201).json({ message: 'Repartidor creado con éxito', data: nuevoRepartidor });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { nombre, apellido, email, contrasenia, nivel_permisos, estado, matricula, monto_propina_total } =
      req.body.repartidorInput;

    if (Object.keys(req.body.repartidorInput).length === 0) {
      return res.status(400).json({ message: 'Debe enviar al menos un campo para actualizar' });
    }
    if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
      return res.status(400).json({ message: 'El nombre debe ser un texto válido' });
    }
    if (apellido !== undefined && (typeof apellido !== 'string' || apellido.trim() === '')) {
      return res.status(400).json({ message: 'El apellido debe ser un texto válido' });
    }
    if (email !== undefined && (typeof email !== 'string' || email.trim() === '')) {
      return res.status(400).json({ message: 'El email debe ser un texto válido' });
    }
    if (contrasenia !== undefined && (typeof contrasenia !== 'string' || contrasenia.trim() === '')) {
      return res.status(400).json({ message: 'La contraseña debe ser un texto válido' });
    }
    if (nivel_permisos !== undefined && typeof nivel_permisos !== 'number') {
      return res.status(400).json({ message: 'El nivel de permisos debe ser un número' });
    }
    if (estado !== undefined && typeof estado !== 'boolean') {
      return res.status(400).json({ message: 'El estado debe ser un booleano' });
    }
    if (matricula !== undefined && (typeof matricula !== 'string' || matricula.trim() === '')) {
      return res.status(400).json({ message: 'La matrícula debe ser un texto válido' });
    }
    if (monto_propina_total !== undefined && (typeof monto_propina_total !== 'number' || monto_propina_total < 0)) {
      return res.status(400).json({ message: 'El monto de propina total debe ser un número mayor o igual a 0' });
    }

    const repartidor = await repository.update(id, req.body.repartidorInput);
    if (!repartidor) {
      return res.status(404).json({ message: 'Repartidor no encontrado' });
    }
    return res.status(200).json({ message: 'Repartidor actualizado', data: repartidor });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const eliminado = await repository.delete(id);
    if (!eliminado) {
      return res.status(404).json({ message: 'Repartidor no encontrado' });
    }
    return res.status(200).json({ message: 'Repartidor eliminado exitosamente' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}