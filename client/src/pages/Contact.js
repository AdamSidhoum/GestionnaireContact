import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [creatingContact, setCreatingContact] = useState({ name: '', lastname: '', num: '', imageUrl: '' });
  const [token, setToken] = useState(localStorage.getItem("token")); 

  const apiUrl = "https://gestionnairecontact-2.onrender.com/contact";
  const navigate = useNavigate();


  const fetchContacts = () => {
    if (!token) return;
    axios.get(apiUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setContacts(res.data))
      .catch(err => console.log(err));
  };

  const handleDelete = (id) => {
    axios.delete(`${apiUrl}/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchContacts())
      .catch(err => console.log(err));
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setShowModal(true);
  };

  const handleModify = (e) => {
    e.preventDefault();
    axios.put(`${apiUrl}/${editingContact._id}`, editingContact, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        fetchContacts();
        setShowModal(false);
        setEditingContact(null);
      })
      .catch(err => console.log(err));
  };

  const handleCreateEdit = () => {
    setCreatingContact({ name: '', lastname: '', num: '', imageUrl: '' });
    setShowModal2(true);
  };

  const handleCreatingContact = (e) => {
    e.preventDefault();
    axios.post(apiUrl, creatingContact, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        fetchContacts();
        setShowModal2(false);
        setCreatingContact({ name: '', lastname: '', num: '', imageUrl: '' });
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    setToken(localStorage.getItem("token")); 
  }, []);

  useEffect(() => {
    if (token) fetchContacts();
  }, [token]);

  return (
    <div>
      <h2 style={{ margin: "10px" }}>Mes contacts</h2>
      <div>
        <button onClick={handleCreateEdit} style={{ margin: "10px" }}>Ajouter un contact</button>
        <button onClick={() => { localStorage.setItem("token", null); setToken(null); navigate('/'); }}>Se déconnecter</button>

        {contacts.length === 0 && <p>Aucun contact pour l'instant</p>}

        {contacts.map((contact) => (
          <div key={contact._id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
            <img src={contact.imageUrl} alt={contact.name} width="100" />
            <h3>{contact.name} {contact.lastname}</h3>
            <p>📞 {contact.num}</p>
            <button onClick={() => handleEdit(contact)}>Modifier le contact</button>
            <button onClick={() => handleDelete(contact._id)} style={{ margin: "10px" }}>Supprimer le contact</button>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <form style={{ background: "white", padding: "20px" }} onSubmit={handleModify}>
            <h3>Modifier le contact</h3>
            <input placeholder="Nom" value={editingContact.name} onChange={e => setEditingContact({ ...editingContact, name: e.target.value })} />
            <input placeholder="Prénom" value={editingContact.lastname} onChange={e => setEditingContact({ ...editingContact, lastname: e.target.value })} />
            <input placeholder="Numéro" value={editingContact.num} onChange={e => setEditingContact({ ...editingContact, num: e.target.value })} />
            <input placeholder="URL image" value={editingContact.imageUrl} onChange={e => setEditingContact({ ...editingContact, imageUrl: e.target.value })} />
            <button type="submit">Valider</button>
            <button type="button" onClick={() => setShowModal(false)}>Annuler</button>
          </form>
        </div>
      )}

      {showModal2 && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <form style={{ background: "white", padding: "20px" }} onSubmit={handleCreatingContact}>
            <h3>Ajouter un contact</h3>
            <input placeholder="Nom" value={creatingContact.name} onChange={e => setCreatingContact({ ...creatingContact, name: e.target.value })} />
            <input placeholder="Prénom" value={creatingContact.lastname} onChange={e => setCreatingContact({ ...creatingContact, lastname: e.target.value })} />
            <input placeholder="Numéro" value={creatingContact.num} onChange={e => setCreatingContact({ ...creatingContact, num: e.target.value })} />
            <input placeholder="URL image" value={creatingContact.imageUrl} onChange={e => setCreatingContact({ ...creatingContact, imageUrl: e.target.value })} />
            <button type="submit">Valider</button>
            <button type="button" onClick={() => setShowModal2(false)}>Annuler</button>
          </form>
        </div>
      )}
    </div>
  );
}
