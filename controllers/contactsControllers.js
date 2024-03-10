import HttpError from "../helpers/HttpError.js";
// import * as contactsServices from "../services/contactsServices.js";

import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { Contact } from "../models/contacts.js";

const getAllContacts = async (req, res, next) => {
  const contacts = await Contact.find();
  res.json(contacts);
};

const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);

  if (!contact) throw HttpError(404);

  res.json(contact);
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) throw HttpError(404);

  res.json(contact);
};

const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;

  const contact = await Contact.create({ name, email, phone, favorite });

  if (!contact) throw HttpError(404);

  res.status(201).json(contact);
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const emptyBody = Object.keys(req.body).length === 0;

  if (emptyBody) throw HttpError(400, "Body must have at least one field");

  const contact = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  if (!contact) throw HttpError(404);

  res.json(contact);
};

const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;

  const contact = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  if (!contact) throw HttpError(404);

  res.json(contact);
};

export const ctrl = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
