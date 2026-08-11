import { Request, Response, NextFunction } from 'express';
import { ClienteRepository } from './cliente.repository.js';

const repository = new ClienteRepository();

export function sanitizeClienteInput(req: Request, res: Response, next: NextFunction) {
  req.body.clienteInput = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    contrasenia: req.body.contrasenia,
    nivel_permisos: req.body.nivel_permisos,
    estado: req.body.estado,
    domicilio: req.body.domicilio,
  };

  Object.keys(req.body.clienteInput).forEach((key) => {
    if (req.body.clienteInput[key] === undefined) {
      delete req.body.clienteInput[key];
    }
  });

  next();
}

export async function findAll(req: Request, res: Response) {
  try {
    const clientes = await repository.findAll();
    return res.status(200).json({ message: 'Todos los clientes recuperados', data: clientes });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const cliente = await repository.findOne(id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    return res.status(200).json({ data: cliente });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function add(req: Request, res: Response) {
  try {
    const { nombre, apellido, email, contrasenia, nivel_permisos, estado, domicilio } = req.body.clienteInput;

    if (!nombre || typeof nombre !== 'string') {
      return res.status(400).json({ message: 'El nombre es requerido y debe ser texto' });
    }
    if (!apellido || typeof apellido !== 'string') {
      return res.status(400).json({ message: 'El apellido es requerido y debe ser texto' });
    }
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'El email es requerido y debe ser texto' });
    }
    if (!contrasenia || typeof contrasenia !== 'string') {
      return res.status(400).json({ message: 'La contraseña es requerida y debe ser texto' });
    }
    if (nivel_permisos === undefined || typeof nivel_permisos !== 'number') {
      return res.status(400).json({ message: 'nivel_permisos es requerido y debe ser un número' });
    }
    if (estado === undefined || typeof estado !== 'boolean') {
      return res.status(400).json({ message: 'estado es requerido y debe ser booleano' });
    }
    if (!domicilio || typeof domicilio !== 'string') {
      return res.status(400).json({ message: 'El domicilio es requerido y debe ser texto' });
    }

    const nuevoCliente = await repository.add(req.body.clienteInput);
    return res.status(201).json({ message: 'Cliente creado con éxito', data: nuevoCliente });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Object.keys(req.body.clienteInput).length === 0) {
      return res.status(400).json({ message: 'Debe enviar al menos un campo para actualizar' });
    }

    const cliente = await repository.update(id, req.body.clienteInput);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    return res.status(200).json({ message: 'Cliente actualizado', data: cliente });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const eliminado = await repository.delete(id);
    if (!eliminado) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    return res.status(200).json({ message: 'Cliente eliminado exitosamente' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}