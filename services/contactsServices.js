import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contactsPath = path.join(__dirname, "../db/contacts.json");

export async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contactId === contact.id);
  return result || null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contactId === contact.id);

  if (index === -1) return null;

  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}

export async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

export async function updateById(id, newData) {
  const contacts = await listContacts();

  const index = contacts.findIndex((contact) => id === contact.id);
  const currentContact = contacts[index];

  if (index === -1) return null;

  contacts[index] = { ...currentContact, ...newData };

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return contacts[index];
}
