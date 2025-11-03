import { useEffect, useState } from "react";
import axios from "axios";
import { UserPlus, Users, Edit, Trash2, Loader2, AlertTriangle, Inbox, Mail, Phone, UserCircle } from 'lucide-react';

const useSweetAlert2 = () => {
  useEffect(() => {
    const scriptId = 'sweetalert2-cdn';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      // Usamos el CDN de SweetAlert2
      script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11'; 
      script.onload = () => {
        if (window.Swal) {
          window.Swal.fire({
            toast: true,
            position: 'bottom-left',
            icon: 'info',
            title: 'SweetAlert2 cargado',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            customClass: { popup: 'swal2-dark-mode-toast' } // Clase personalizada para el modo oscuro
          }).then(() => {
          });
        }
      };
      document.head.appendChild(script);
    }

    // Estilos CSS para el modo oscuro de SweetAlert2 
    style.innerHTML = `
      .swal2-popup {
        background-color: #1f2937 !important; /* bg-gray-800 */
        color: #f3f4f6 !important; /* text-gray-100 */
        border-radius: 0.75rem !important;
        border: 1px solid #374151; /* Borde sutil */
      }
      .swal2-title, .swal2-html-container, .swal2-content {
        color: #f3f4f6 !important;
      }
      .swal2-input, .swal2-textarea {
        background-color: #374151 !important; /* bg-gray-700 */
        color: #f3f4f6 !important;
        border: 1px solid #4b5563 !important;
        border-radius: 0.5rem !important;
      }
      /* Estilo para el toast de modo oscuro */
      .swal2-dark-mode-toast {
        background-color: #1f2937 !important;
        color: #f3f4f6 !important;
      }
    `;
    document.head.appendChild(style);
    
  }, []);

  return window.Swal;
};


export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const Swal = useSweetAlert2();

 
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
      setError("No se pudieron cargar los usuarios. Revisa la conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Crear usuario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Swal) return;

    if (!form.name || !form.email || !form.phone) {
      await Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos.",
        customClass: { popup: 'swal2-dark-mode' }
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
        title: "Usuario agregado con éxito",
        showConfirmButton: false,
        timer: 1400,
        customClass: { popup: 'swal2-dark-mode-toast' }
      });
    } catch (err) {
      console.error("Error al crear usuario:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el usuario.",
        customClass: { popup: 'swal2-dark-mode' }
      });
    }
  };

  // --- Editar usuario ---
  const handleEdit = async (user) => {
    if (!Swal) return; // Esperar a que Swal esté cargado
    
    const { value: formValues } = await Swal.fire({
      title: "Editar Usuario",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Nombre" value="${user.name}">
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${user.email}">
        <input id="swal-phone" class="swal2-input" placeholder="Teléfono" value="${user.phone}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar Cambios",
      cancelButtonText: "Cancelar",
      customClass: { popup: 'swal2-dark-mode' },
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
          customClass: { popup: 'swal2-dark-mode-toast' }
        });
      } catch (err) {
        console.error("Error al actualizar usuario:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el usuario.",
          customClass: { popup: 'swal2-dark-mode' }
        });
      }
    }
  };

  // --- Eliminar usuario ---
  const handleDelete = async (id) => {
    if (!Swal) return;
    
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer. ¿Estás seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: { popup: 'swal2-dark-mode' }
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
        customClass: { popup: 'swal2-dark-mode-toast' }
      });
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el usuario.",
        customClass: { popup: 'swal2-dark-mode' }
      });
    }
  };

  const formatPhone = (p) => (p ? p.toString() : "-");

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans antialiased pb-20">
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md shadow-2xl shadow-gray-950/70">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-teal-400 tracking-wider">
              <UserCircle className="inline-block w-8 h-8 mr-3 mb-1" />
              Gestión de Usuarios
            </h1>
            <p className="text-lg text-gray-400 mt-2">
              Plataforma de administración de datos moderna y eficiente. 🚀
            </p>
          </div>
        </div>
      </header>

      {/* Contenido Principal con Layout Responsivo */}
      <main className="container mx-auto px-4 pt-40 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna 1: Formulario de Creación */}
          <div className="lg:col-span-1">
            <section className="bg-gray-800 p-8 rounded-2xl shadow-3xl h-full border border-teal-600/30 transition hover:shadow-teal-500/10 duration-300">
              <h2 className="text-2xl font-semibold mb-6 text-teal-400 flex items-center gap-3">
                <UserPlus className="w-6 h-6" /> Nuevo Usuario
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nameInput" className="block text-sm font-medium text-gray-300 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    id="nameInput"
                    placeholder="Escribe el nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 transition shadow-inner"
                  />
                </div>
                <div>
                  <label htmlFor="emailInput" className="block text-sm font-medium text-gray-300 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    id="emailInput"
                    placeholder="ejemplo@correo.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 transition shadow-inner"
                  />
                </div>
                <div>
                  <label htmlFor="phoneInput" className="block text-sm font-medium text-gray-300 mb-1">Número de teléfono</label>
                  <input
                    type="tel"
                    id="phoneInput"
                    placeholder="55 1234 5678"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 transition shadow-inner"
                  />
                </div>

                <div className="pt-4">
                  <button
                    className="w-full flex items-center justify-center bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition duration-300 shadow-lg shadow-teal-500/50 transform hover:scale-[1.01]"
                    type="submit"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Agregar Usuario
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Columna 2: Tabla de Usuarios */}
          <div className="lg:col-span-2">
            <section className="bg-gray-800 p-8 rounded-2xl shadow-3xl border border-teal-600/30">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-teal-400 flex items-center gap-3">
                  <Users className="w-6 h-6" /> Lista de Usuarios
                </h2>
                <span className="bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-md">
                  {loading ? "Cargando..." : `${users.length} Usuarios`}
                </span>
              </div>

              {error && (
                <div className="flex items-center bg-red-800 border border-red-700 text-red-100 p-4 rounded-xl mb-6">
                  <AlertTriangle className="w-5 h-5 mr-3" />
                  <span className="font-medium">{error}</span>
                </div>
              )}
              
              {/* Spinner de Carga */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 text-teal-400 animate-spin mr-3" />
                  <span className="text-lg text-teal-400">Cargando datos...</span>
                </div>
              )}

              {/* Tabla de Datos */}
              {!loading && (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto text-left divide-y divide-gray-700">
                    <thead>
                      <tr className="bg-gray-700 text-gray-300 uppercase text-xs leading-normal">
                        <th className="py-3 px-4 font-bold rounded-tl-xl">Usuario</th>
                        <th className="py-3 px-4 font-bold hidden sm:table-cell">Correo</th>
                        <th className="py-3 px-4 font-bold hidden md:table-cell">Teléfono</th>
                        <th className="py-3 px-4 font-bold text-right rounded-tr-xl">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-200 text-sm font-light divide-y divide-gray-700">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-10 text-gray-400">
                            <Inbox className="w-10 h-10 mx-auto mb-3" />
                            No hay usuarios registrados. ¡Sé el primero en agregar uno!
                          </td>
                        </tr>
                      ) : (
                        users.map((u, index) => (
                          <tr 
                            key={u.id} 
                            className={`border-b border-gray-700/50 transition duration-150 ${index % 2 === 0 ? 'bg-gray-800/80' : 'bg-gray-800/60'} hover:bg-gray-700/50`}
                          >
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold text-lg flex-shrink-0 shadow-md">
                                  {(u.name || "?").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-base text-white">{u.name}</div>
                                  <div className="text-xs text-gray-400 mt-0.5">ID: {u.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 hidden sm:table-cell">
                              <div className="flex items-center gap-2 text-gray-300">
                                <Mail className="w-4 h-4 text-teal-400" />
                                {u.email}
                              </div>
                            </td>
                            <td className="py-4 px-4 hidden md:table-cell">
                              <div className="flex items-center gap-2 text-gray-300">
                                <Phone className="w-4 h-4 text-teal-400" />
                                {formatPhone(u.phone)}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex gap-3 justify-end">
                                <button
                                  className="bg-sky-600 hover:bg-sky-500 text-white p-2 rounded-full transition duration-150 transform hover:scale-105 shadow-md shadow-sky-500/30"
                                  onClick={() => handleEdit(u)}
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-full transition duration-150 transform hover:scale-105 shadow-md shadow-red-500/30"
                                  onClick={() => handleDelete(u.id)}
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 w-full text-center py-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm text-gray-500 text-sm z-40">
        Hecho con <span className="text-red-500">❤️</span> — <strong className="text-gray-300">SGU v2.0</strong>
      </footer>
    </div>
  );
}
