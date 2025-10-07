const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function create(req, res) {
  try {
    const { clienteId, data, hora, pessoas, status } = req.body;
    if (!clienteId || !data || !hora || !pessoas) {
      return res.status(400).json({ error: 'clienteId, data, hora e pessoas são obrigatórios' });
    }

    // Converte data e hora para formato ISO-8601
    const dateTime = new Date(`${data}T${hora}:00.000Z`).toISOString();

    // Validações adicionais
    const parsedClienteId = Number(clienteId);
    const parsedPessoas = Number(pessoas);
    if (isNaN(parsedClienteId) || isNaN(parsedPessoas)) {
      return res.status(400).json({ error: 'clienteId e pessoas devem ser números válidos' });
    }
    if (parsedPessoas <= 0) {
      return res.status(400).json({ error: 'pessoas deve ser maior que zero' });
    }

    // Valida existência do cliente
    const cliente = await prisma.cliente.findUnique({ where: { id: parsedClienteId } });
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const reserva = await prisma.reserva.create({
      data: {
        clienteId: parsedClienteId,
        data: dateTime,
        hora,
        pessoas: parsedPessoas,
        status: status || 'Pendente',
      },
    });
    res.status(201).json(reserva);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function read(req, res) {
  try {
    const reservas = await prisma.reserva.findMany({ include: { cliente: true } });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function readOne(req, res) {
  try {
    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(req.params.id) },
      include: { cliente: true },
    });
    if (!reserva) return res.status(404).json({ error: 'Reserva não encontrada' });
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
    const { clienteId, data, hora, pessoas, status } = req.body;
    const parsedId = Number(req.params.id);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    let dataToUpdate = {};
    if (clienteId !== undefined) {
      const parsedClienteId = Number(clienteId);
      const cliente = await prisma.cliente.findUnique({ where: { id: parsedClienteId } });
      if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
      dataToUpdate.clienteId = parsedClienteId;
    }
    if (data !== undefined) {
      const dateTime = new Date(`${data}T${hora || '00:00'}:00.000Z`).toISOString();
      dataToUpdate.data = dateTime;
    }
    if (hora !== undefined) {
      dataToUpdate.hora = hora;
    }
    if (pessoas !== undefined) {
      const parsedPessoas = Number(pessoas);
      if (isNaN(parsedPessoas) || parsedPessoas <= 0) {
        return res.status(400).json({ error: 'pessoas deve ser um número maior que zero' });
      }
      dataToUpdate.pessoas = parsedPessoas;
    }
    if (status !== undefined) {
      dataToUpdate.status = status;
    }

    const reserva = await prisma.reserva.update({
      where: { id: parsedId },
      data: dataToUpdate,
      include: { cliente: true },
    });
    res.status(200).json(reserva);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Reserva não encontrada' });
    res.status(500).json({ error: error.message });
  }
}

async function remove(req, res) {
  try {
    await prisma.reserva.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Reserva não encontrada' });
    res.status(500).json({ error: error.message });
  }
}

module.exports = { create, read, readOne, update, remove };