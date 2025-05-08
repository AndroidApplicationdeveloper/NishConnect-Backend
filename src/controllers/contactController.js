const contactService = require('../services/contactService');

exports.createContact = async (req, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'User ID not found in token' });
      }
  
      const contact = await contactService.createContact(userId, req.body);
      res.status(201).json({ message: 'Contact created', contact });
    } catch (error) {
      res.status(500).json({ message: 'Error creating contact', error });
    }
  };  
  

  exports.updateContact = async (req, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: 'User ID not found in token' });
  
      const contactId = req.params.id;
      const updated = await contactService.updateContact(contactId, userId, req.body);
  
      if (!updated) return res.status(404).json({ message: 'Contact not found or not authorized' });
  
      res.status(200).json({ message: 'Contact updated', contact: updated });
    } catch (error) {
      res.status(500).json({ message: 'Error updating contact', error });
    }
  };
  
  exports.deleteContact = async (req, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: 'User ID not found in token' });
  
      const contactId = req.params.id;
      const deleted = await contactService.deleteContact(contactId, userId);
  
      if (!deleted) return res.status(404).json({ message: 'Contact not found or not authorized' });
  
      res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting contact', error });
    }
  };

  exports.getContacts = async (req, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: 'User ID not found in token' });
  
      const contacts = await contactService.getContactsByUser(userId);
      res.status(200).json({ message: 'Contacts fetched successfully', contacts });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching contacts', error });
    }
  };