import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles.css";

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
      const { data } = await axios.get(API_URL);
      setUsers(data || []);
    } catch {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  // Validar campos
  const isFormValid = () =>
    form.name.trim() !== "" && form.email.trim() !== "" && form.phone.trim() !== "";

  // Crear usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
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
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el usuario.",
      });
    }
  };

  // Editar usuario
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
      preConfirm: () => {
        const name = document.getElementById("swal-name").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const phone = document.getElementById("swal-phone").value.trim();
        if (!name || !email || !phone) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return null;
        }
        return { name, email, phone };
      },
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
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el usuario.",
        });
      }
    }
  };

  // Eliminar usuario
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
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el usuario.",
      });
    }
  };

  // Mostrar teléfono format
  const formatPhone = (phone) => (phone ? phone.toString() : "-");

  return (
    <div className="app-root">
      <header className="hero text-center">
        <h1>
          <i className="bi bi-person-lines-fill"></i> Gestión de Usuarios
        </h1>
        <p className="lead">
          Agrega, consulta y administra tus usuarios con estilo ✨
        </p>
      </header>

      <main className="container">
        <div className="col-lg-4">
          <section className="card shadow-lg">
            <div className="card-body modern-form">
              <h2 className="card-title">
                <i className="bi bi-person-plus-fill"></i> Nuevo Usuario
              </h2>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    id="nameInput"
                    className="form-control"
                    placeholder="Nombre completo"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    aria-label="Nombre completo"
                  />
                  <label htmlFor="nameInput">Nombre completo</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    id="emailInput"
                    className="form-control"
                    placeholder="Correo electrónico"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    aria-label="Correo electrónico"
                  />
                  <label htmlFor="emailInput">Correo electrónico</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    type="tel"
                    id="phoneInput"
                    className="form-control"
                    placeholder="Número de teléfono"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    aria-label="Número de teléfono"
                  />
                  <label htmlFor="phoneInput">Número de teléfono</label>
                </div>
                <div className="d-grid">
                  <button className="btn btn-primary btn-lg" type="submit" aria-label="Agregar usuario">
                    <i className="bi bi-plus-circle me-2"></i> Agregar usuario
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>

        <div className="col-lg-8">
          <section className="user-table-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title text-primary d-flex align-items-center gap-2 mb-0">
                  <i className="bi bi-people-fill"></i> Usuarios
                </h2>
                <span className={`badge ${loading ? "bg-secondary" : "bg-primary-subtle text-primary"}`}>
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
                <table className="user-table align-middle mb-0">
                  <thead>
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
                              <div className="avatar-circle">
                                {(u.name || "?").charAt(0).toUpperCase()}
                              </div>
                              <div className="user-details">
                                <div className="user-name">{u.name}</div>
                                <div className="user-id">ID: {u.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="icon-text">
                              <i className="bi bi-envelope"></i>
                              {u.email}
                            </span>
                          </td>
                          <td>
                            <span className="icon-text">
                              <i className="bi bi-telephone"></i>
                              {formatPhone(u.phone)}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2 justify-content-end">
                              <button
                                className="action-btn edit-btn"
                                onClick={() => handleEdit(u)}
                                title="Editar usuario"
                                aria-label={`Editar usuario ${u.name}`}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="action-btn delete-btn"
                                onClick={() => handleDelete(u.id)}
                                title="Eliminar usuario"
                                aria-label={`Eliminar usuario ${u.name}`}
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
      </main>

      <footer className="footer text-center">
        Hecho con <span role="img" aria-label="amor">❤️</span> — <strong>SGU</strong>
      </footer>
    </div>
  );
}
