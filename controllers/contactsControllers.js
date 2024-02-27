import HttpError from "../helpers/HttpError.js";
import * as contactsServices from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsServices.listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsServices.getContactById(id);

    if (!contact) throw HttpError(404);

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsServices.removeContact(id);

    if (!contact) throw HttpError(404);

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;

  try {
    const contact = await contactsServices.addContact(name, email, phone);

    if (!contact) throw HttpError(404);

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsServices.updateById(id, req.body);

    if (!contact) throw HttpError(404);

    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};
