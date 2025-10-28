import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_BASE}/users`;

  // Obtener usuarios
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Crear usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos.'
      });
      return;
    }
    try {
      await axios.post(API_URL, form);
      setForm({ name: "", email: "", phone: "" });
      fetchUsers();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Usuario agregado',
        showConfirmButton: false,
        timer: 1400
      });
    } catch (err) {
      console.error("Error al crear usuario:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el usuario.'
      });
    }
  };

  // Editar usuario
  const handleEdit = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Usuario',
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Nombre" value="${user.name}">
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${user.email}">
        <input id="swal-phone" class="swal2-input" placeholder="Teléfono" value="${user.phone}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          name: document.getElementById('swal-name').value,
          email: document.getElementById('swal-email').value,
          phone: document.getElementById('swal-phone').value
        }
      }
    });

    if (formValues) {
      try {
        await axios.put(`${API_URL}/${user.id}`, formValues);
        fetchUsers();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Usuario actualizado',
          showConfirmButton: false,
          timer: 1400
        });
      } catch (err) {
        console.error("Error al actualizar usuario:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el usuario.'
        });
      }
    }
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Usuario eliminado',
        showConfirmButton: false,
        timer: 1200
      });
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el usuario.'
      });
    }
  };

  const formatPhone = (p) => {
    if (!p) return "-";
    return p.toString();
  };

  return (
    <div className="app-root">
      <header className="hero">
        <div className="hero-inner">
          <div className="logo">✨ SGU</div>
          <h1>Gestión de Usuarios</h1>
          <p className="subtitle">Agrega, consulta y administra tus usuarios con estilo.</p>
        </div>
      </header>

      <main className="container">
        <section className="card form-card">
          <h2>Nuevo usuario</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              placeholder="Nombre completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="input"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="input"
              type="tel"
              placeholder="Número de teléfono"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <div className="actions">
              <button className="btn primary" type="submit">Agregar usuario</button>
            </div>
          </form>
        </section>

        <section className="card list-card">
          <div className="list-header">
            <h2>Usuarios</h2>
            <div className="meta">{loading ? "Cargando..." : `${users.length} usuarios`}</div>
          </div>

          {error && <div className="alert">{error}</div>}

          {/* Responsive: grid of cards on small screens, table on wide screens */}
          <div className="users-grid">
            {users.length === 0 && !loading ? (
              <div className="empty">No hay usuarios registrados</div>
            ) : (
              users.map((u) => (
                <article className="user-card" key={u.id}>
                  <div className="user-top">
                    <div className="avatar">{(u.name || "").charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="user-name">{u.name}</div>
                      <div className="user-email">{u.email}</div>
                    </div>
                  </div>
                  <div className="user-bottom">
                    <div className="user-phone">{formatPhone(u.phone)}</div>
                    <div className="user-actions">
                      <button className="btn primary small" onClick={() => handleEdit(u)}>
                        Editar
                      </button>
                      <button className="btn danger small" onClick={() => handleDelete(u.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={`t-${u.id}`}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td className="actions-cell">
                      <button className="btn primary small" onClick={() => handleEdit(u)}>
                        Editar
                      </button>
                      <button className="btn danger small" onClick={() => handleDelete(u.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="footer">Hecho con ❤️ — SGU</footer>
    </div>
  );
}
