const Ticket = require('../models/Ticket.model');
const User = require('../models/User.model');

// Create Ticket (auth)
const createTicket = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      user_id,
      ticket_query,
      ticket_query_image,
      ticket_status,
      asignBy_id,
      Rrply
    } = req.body;

    const item = new Ticket({
      user_id: user_id ?? null,
      ticket_query: ticket_query ?? null,
      ticket_query_image: ticket_query_image ?? null,
      ticket_status: ticket_status ?? 'Pending',
      asignBy_id: asignBy_id ?? null,
      Rrply: Rrply ?? null,
      CreateBy: userId
    });

    const saved = await item.save();

    const [createByUser, ticketUser, assignedUser] = await Promise.all([
      saved.CreateBy ? User.findOne({ user_id: saved.CreateBy }) : null,
      saved.user_id ? User.findOne({ user_id: saved.user_id }) : null,
      saved.asignBy_id ? User.findOne({ user_id: saved.asignBy_id }) : null
    ]);

    const response = saved.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.user_id = ticketUser ? { user_id: ticketUser.user_id, Name: ticketUser.Name, email: ticketUser.email } : null;
    response.asignBy_id = assignedUser ? { user_id: assignedUser.user_id, Name: assignedUser.Name, email: assignedUser.email } : null;

    res.status(201).json({ success: true, message: 'Ticket created successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating ticket', error: error.message });
  }
};

// Get all (public)
const getAllTickets = async (req, res) => {
  try {
    const items = await Ticket.find({ Status: true }).sort({ CreateAt: -1 });
    const response = await Promise.all(items.map(async (item) => {
      const [createByUser, updatedByUser, ticketUser, assignedUser] = await Promise.all([
        item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
        item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
        item.user_id ? User.findOne({ user_id: item.user_id }) : null,
        item.asignBy_id ? User.findOne({ user_id: item.asignBy_id }) : null
      ]);
      const obj = item.toObject();
      obj.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
      obj.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
      obj.user_id = ticketUser ? { user_id: ticketUser.user_id, Name: ticketUser.Name, email: ticketUser.email } : null;
      obj.asignBy_id = assignedUser ? { user_id: assignedUser.user_id, Name: assignedUser.Name, email: assignedUser.email } : null;
      return obj;
    }));
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching tickets', error: error.message });
  }
};

// Get by id (auth)
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Ticket.findOne({ ticket_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    const [createByUser, updatedByUser, ticketUser, assignedUser] = await Promise.all([
      item.CreateBy ? User.findOne({ user_id: item.CreateBy }) : null,
      item.UpdatedBy ? User.findOne({ user_id: item.UpdatedBy }) : null,
      item.user_id ? User.findOne({ user_id: item.user_id }) : null,
      item.asignBy_id ? User.findOne({ user_id: item.asignBy_id }) : null
    ]);
    const response = item.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = ticketUser ? { user_id: ticketUser.user_id, Name: ticketUser.Name, email: ticketUser.email } : null;
    response.asignBy_id = assignedUser ? { user_id: assignedUser.user_id, Name: assignedUser.Name, email: assignedUser.email } : null;
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching ticket', error: error.message });
  }
};

// Update (auth)
const updateTicket = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id, ...updateData } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'ticket_id is required in request body' });
    }
    const item = await Ticket.findOne({ ticket_id: parseInt(id) });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    Object.keys(updateData).forEach((key) => {
      if (key !== 'ticket_id') {
        item[key] = updateData[key];
      }
    });

    item.UpdatedBy = userId;
    item.UpdatedAt = new Date();
    const updated = await item.save();

    const [createByUser, updatedByUser, ticketUser, assignedUser] = await Promise.all([
      updated.CreateBy ? User.findOne({ user_id: updated.CreateBy }) : null,
      updated.UpdatedBy ? User.findOne({ user_id: updated.UpdatedBy }) : null,
      updated.user_id ? User.findOne({ user_id: updated.user_id }) : null,
      updated.asignBy_id ? User.findOne({ user_id: updated.asignBy_id }) : null
    ]);

    const response = updated.toObject();
    response.CreateBy = createByUser ? { user_id: createByUser.user_id, Name: createByUser.Name, email: createByUser.email } : null;
    response.UpdatedBy = updatedByUser ? { user_id: updatedByUser.user_id, Name: updatedByUser.Name, email: updatedByUser.email } : null;
    response.user_id = ticketUser ? { user_id: ticketUser.user_id, Name: ticketUser.Name, email: ticketUser.email } : null;
    response.asignBy_id = assignedUser ? { user_id: assignedUser.user_id, Name: assignedUser.Name, email: assignedUser.email } : null;

    res.status(200).json({ success: true, message: 'Ticket updated successfully', data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating ticket', error: error.message });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket
};
