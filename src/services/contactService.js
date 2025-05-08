const Contact = require('../models/Contact');

exports.createContact = async (userId, contactData) => {
  return await Contact.create({ ...contactData, userId });
};

exports.updateContact = async (contactId, userId, updateData) => {
    return await Contact.findOneAndUpdate(
      { _id: contactId, userId },
      updateData,
      { new: true }
    );
  };
  
  exports.deleteContact = async (contactId, userId) => {
    return await Contact.findOneAndDelete({ _id: contactId, userId });
  };

  exports.getContactsByUser = async (userId) => {
    return await Contact.find({ userId }).sort({ createdAt: -1 });
  };
  