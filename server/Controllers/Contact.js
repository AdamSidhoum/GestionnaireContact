const Contact = require('../Models/Contact');

exports.createContact = (req, res, next) => {
  delete req.body._id;
  const contact = new Contact({
    ...req.body
  });
  contact.save()
    .then(() => res.status(201).json({ message: 'Contact enregistré !'}))
    .catch(error => res.status(400).json({ error }));
}

exports.deleteOneContact = (req, res, next) => {
    Contact.deleteOne({ _id: req.params.id}, {...req.body, _id: req.params.id})
    .then(() => res.status(200).json({message: 'Contact correctement supprimé !'}))
    .catch(error => res.status(400).json({ error }));
}

exports.modifyContact = (req, res, next) => {
    Contact.updateOne({ _id: req.params.id}, { ...req.body, _id: req.params.id})
    .then(() => res.status(200).json({message: 'Contact modifié !'}))
    .catch(error => res.status(400).json({ error }));
}

exports.getOneContact = (req, res, next) => {
  Contact.findOne({ _id: req.params.id })
    .then(Contact => res.status(200).json(Contact))
    .catch(error => res.status(404).json({ error }));
}

exports.getAllContact = (req, res, next) => {
  Contact.find()
  .then(Contact => res.status(200).json(Contact))
  .catch(error => res.status(400).json({ error }))
}
