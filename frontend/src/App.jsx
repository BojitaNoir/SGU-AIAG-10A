import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css"; // puedes dejar tu CSS aquí

export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_BASE}/users`;

  // --- Obtener usuarios ---
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Crear usuario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      await Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos.",
      });
      return;
    }
    try {
      await axios.post(API_URL, form);
      setForm({ name: "", email: "", phone: "" });
      fetchUsers();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Usuario agregado",
        showConfirmButton: false,
        timer: 1400,
      });
    } catch (err) {
      console.error("Error al crear usuario:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el usuario.",
      });
    }
  };

  // --- Editar usuario ---
  const handleEdit = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Usuario",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Nombre" value="${user.name}">
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${user.email}">
        <input id="swal-phone" class="swal2-input" placeholder="Teléfono" value="${user.phone}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => ({
        name: document.getElementById("swal-name").value,
        email: document.getElementById("swal-email").value,
        phone: document.getElementById("swal-phone").value,
      }),
    });

    if (formValues) {
      try {
        await axios.put(`${API_URL}/${user.id}`, formValues);
        fetchUsers();
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Usuario actualizado",
          showConfirmButton: false,
          timer: 1400,
        });
      } catch (err) {
        console.error("Error al actualizar usuario:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el usuario.",
        });
      }
    }
  };

  // --- Eliminar usuario ---
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Usuario eliminado",
        showConfirmButton: false,
        timer: 1200,
      });
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el usuario.",
      });
    }
  };

  const formatPhone = (p) => (p ? p.toString() : "-");

  // --- Renderizado ---
  return (
    <div className="app-root">
      {/* Header */}
      <header className="hero text-center py-5 bg-primary text-white shadow-sm">
        <div className="hero-inner">
          <h1 className="fw-bold mb-2">
            <i className="bi bi-person-lines-fill me-2"></i>Gestión de Usuarios
          </h1>
          <p className="lead mb-0">Agrega, consulta y administra tus usuarios con estilo ✨</p>
        </div>
      </header>

      {/* Main */}
      <main className="container py-5">
        <div className="row gy-4">
          {/* Formulario */}
          <div className="col-lg-4">
            <section className="card border-0 shadow-lg h-100">
              <div className="card-body">
                <h2 className="card-title h5 d-flex align-items-center gap-2 mb-4 text-primary">
                  <i className="bi bi-person-plus-fill"></i> Nuevo Usuario
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control bg-light"
                      id="nameInput"
                      placeholder="Nombre completo"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <label htmlFor="nameInput">Nombre completo</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control bg-light"
                      id="emailInput"
                      placeholder="Correo electrónico"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <label htmlFor="emailInput">Correo electrónico</label>
                  </div>
                  <div className="form-floating mb-4">
                    <input
                      type="tel"
                      className="form-control bg-light"
                      id="phoneInput"
                      placeholder="Número de teléfono"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    <label htmlFor="phoneInput">Número de teléfono</label>
                  </div>

                  <div className="d-grid">
                    <button className="btn btn-primary btn-lg" type="submit">
                      <i className="bi bi-plus-circle me-2"></i>Agregar usuario
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>

          {/* Lista de usuarios */}
          <div className="col-lg-8">
            <section className="card border-0 shadow-lg">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="card-title h5 d-flex align-items-center gap-2 text-primary mb-0">
                    <i className="bi bi-people-fill"></i> Usuarios
                  </h2>
                  <span className="badge bg-primary-subtle text-primary px-3 py-2">
                    {loading ? "Cargando..." : `${users.length} usuarios`}
                  </span>
                </div>

                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Usuario</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 && !loading ? (
                        <tr>
                          <td colSpan="4" className="text-center py-4 text-muted">
                            <i className="bi bi-inbox display-6 d-block mb-3"></i>
                            No hay usuarios registrados
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div className="avatar-circle bg-primary text-white fw-bold">
                                  {(u.name || "?").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="fw-semibold">{u.name}</div>
                                  <div className="text-muted small">ID: {u.id}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-envelope text-muted"></i>
                                {u.email}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <i className="bi bi-telephone text-muted"></i>
                                {formatPhone(u.phone)}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex gap-2 justify-content-end">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleEdit(u)}
                                  title="Editar usuario"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDelete(u.id)}
                                  title="Eliminar usuario"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="footer text-center py-4 mt-4 bg-light text-muted">
        Hecho con ❤️ — <strong>SGU</strong>
      </footer>
    </div>
  );
}
