import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Palmtree, School, Search, Bell, XCircle, Check, FileText, 
  Edit2, Plus, User, Mail, Trash2, Clock, MapPin, GraduationCap, Download
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('teachers'); // 'teachers' | 'courses' | 'students'
  const [loading, setLoading] = useState(true);
  
  // Datos
  const [stats, setStats] = useState({ total_teachers: 0, on_vacation: 0, active_workshops: 0, teachers: [] });
  const [requests, setRequests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  // Modales
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  
  // Formularios
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [courseForm, setCourseForm] = useState({ id: null, title: '', location: '', time: '', type: 'school', teacher_id: '' });
  const [studentForm, setStudentForm] = useState({ id: null, name: '', course_id: '' });
  
  const [editingUser, setEditingUser] = useState(null);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isEditingStudent, setIsEditingStudent] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resStats, resRequests, resCourses, resStudents] = await Promise.all([
        fetch('/api/get_admin_stats.php'),
        fetch('/api/get_pending_requests.php'),
        fetch('/api/get_courses_admin.php'),
        fetch('/api/get_students_admin.php')
      ]);
      
      setStats(await resStats.json());
      setRequests(await resRequests.json());
      setCourses(await resCourses.json());
      setStudents(await resStudents.json());
      setLoading(false);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setLoading(false);
    }
  };

  // --- NUEVA FUNCIÓN: DESCARGAR REPORTE ---
  const handleDownloadReport = () => {
    // Redirige al navegador al script PHP, lo que fuerza la descarga del archivo
    window.location.href = '/api/export_report.php';
  };

  // --- LÓGICA DOCENTES ---
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch('/api/create_user.php', { method: 'POST', body: JSON.stringify({ ...newUser, role: 'teacher' }) });
        const data = await res.json();
        if (res.ok) { alert(`Profesor creado!\nPass: ${data.temp_password}`); setShowTeacherModal(false); setNewUser({name:'', email:''}); fetchData(); }
        else { alert("Error: " + data.message); }
    } catch(e) {}
  };
  
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    await fetch('/api/update_user.php', { method: 'POST', body: JSON.stringify(editingUser) });
    setEditingUser(null); fetchData();
  };

  const handleDeleteUser = async (id) => {
      if(!confirm("¿Eliminar profesor?")) return;
      await fetch('/api/delete_user.php', { method: 'POST', body: JSON.stringify({ id }) });
      fetchData();
  };

  const handleRequestAction = async (requestId, action) => {
    if (!confirm("¿Confirmar?")) return;
    await fetch('/api/handle_request.php', { method: 'POST', body: JSON.stringify({ request_id: requestId, action }) });
    fetchData();
  };

  // --- LÓGICA CURSOS ---
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const action = isEditingCourse ? 'update' : 'create';
    await fetch('/api/manage_course.php', { method: 'POST', body: JSON.stringify({ action, ...courseForm }) });
    setShowCourseModal(false); fetchData();
  };

  const handleDeleteCourse = async (id) => {
    if(!confirm("¿Eliminar curso?")) return;
    await fetch('/api/manage_course.php', { method: 'POST', body: JSON.stringify({ action: 'delete', id }) });
    fetchData();
  };

  const openCourseModal = (course = null) => {
    setCourseForm(course || { id: null, title: '', location: '', time: '', type: 'school', teacher_id: '' });
    setIsEditingCourse(!!course);
    setShowCourseModal(true);
  };

  // --- LÓGICA ALUMNOS ---
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    const action = isEditingStudent ? 'update' : 'create';
    try {
      const res = await fetch('/api/manage_student.php', {
        method: 'POST',
        body: JSON.stringify({ action, ...studentForm })
      });
      if (res.ok) {
        alert(isEditingStudent ? "Alumno actualizado" : "Alumno matriculado");
        setShowStudentModal(false);
        fetchData();
      } else {
        alert("Error al guardar alumno");
      }
    } catch (e) { alert("Error de conexión"); }
  };

  const handleDeleteStudent = async (id) => {
    if(!confirm("¿Dar de baja al alumno? Se borrará su historial de asistencia.")) return;
    await fetch('/api/manage_student.php', { method: 'POST', body: JSON.stringify({ action: 'delete', id }) });
    fetchData();
  };

  const openStudentModal = (student = null) => {
    setStudentForm(student || { id: null, name: '', course_id: '' });
    setIsEditingStudent(!!student);
    setShowStudentModal(true);
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Cargando sistema...</div>;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Panel de Administración</h2>
          <p className="text-slate-500">Centro de control</p>
        </div>
        
        <div className="flex items-center gap-4">
            {/* BOTÓN DESCARGAR REPORTE CONECTADO */}
            <button 
                onClick={handleDownloadReport}
                className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
            >
                <Download size={16} /> Descargar Reporte
            </button>

            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                {['teachers', 'courses', 'students'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize ${activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                    >
                        {tab === 'teachers' ? 'Docentes' : tab === 'courses' ? 'Cursos' : 'Alumnos'}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* --- PESTAÑA: DOCENTES --- */}
      {activeTab === 'teachers' && (
        <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
                    <div><p className="text-sm font-medium text-slate-500">Profesores</p><h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.total_teachers}</h3></div>
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle size={24}/></div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
                    <div><p className="text-sm font-medium text-slate-500">En Vacaciones</p><h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.on_vacation}</h3></div>
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Palmtree size={24}/></div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
                    <div><p className="text-sm font-medium text-slate-500">Cursos Activos</p><h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.active_workshops}</h3></div>
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><School size={24}/></div>
                </div>
            </div>

            {/* Solicitudes */}
            {requests.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Bell className="text-rose-500 animate-pulse" /> Solicitudes ({requests.length})</h3>
                    <div className="grid gap-3">
                        {requests.map(req => (
                            <div key={req.id} className="bg-white p-4 rounded-xl border-l-4 border-rose-500 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                        {req.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{req.teacher_name}</h4>
                                        <p className="text-sm text-slate-500 flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${req.type === 'medical' ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                                {req.type === 'medical' ? 'Licencia' : 'Vacaciones'}
                                            </span>
                                            <span className="text-xs">Del {req.start_date} al {req.end_date}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {req.file_url && <a href={`/${req.file_url}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 border border-blue-200"><FileText size={14}/> Ver</a>}
                                    <button onClick={() => handleRequestAction(req.id, 'reject')} className="p-2 text-rose-600 hover:bg-rose-50 rounded"><XCircle size={20}/></button>
                                    <button onClick={() => handleRequestAction(req.id, 'approve')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={20}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tabla Docentes */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-700">Listado Docente</h3>
                    <button onClick={() => setShowTeacherModal(true)} className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-1"><Plus size={16}/> Nuevo</button>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="text-slate-500 border-b"><tr><th className="px-6 py-3">Nombre</th><th className="px-6 py-3">Email</th><th className="px-6 py-3 text-right">Acciones</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        {stats.teachers.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50">
                                <td className="px-6 py-3 font-medium flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">{t.avatar}</div>
                                    {t.name}
                                </td>
                                <td className="px-6 py-3 text-slate-500">{t.email}</td>
                                <td className="px-6 py-3 text-right flex justify-end gap-2">
                                    <button onClick={() => setEditingUser(t)} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded"><Edit2 size={16}/></button>
                                    <button onClick={() => handleDeleteUser(t.id)} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
      )}

      {/* --- PESTAÑA: CURSOS --- */}
      {activeTab === 'courses' && (
        <div className="animate-in fade-in">
            <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-700">Gestión de Clases</h3>
                <button onClick={() => openCourseModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm flex items-center gap-2"><Plus size={18} /> Nuevo Curso</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(course => (
                    <div key={course.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
                        <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${course.type === 'school' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                        <div className="flex justify-between items-start mb-2 pl-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{course.type === 'school' ? 'Asignatura' : 'Taller'}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openCourseModal(course)} className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"><Edit2 size={16}/></button>
                                <button onClick={() => handleDeleteCourse(course.id)} className="p-1 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16}/></button>
                            </div>
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 pl-2 mb-1">{course.title}</h4>
                        <div className="pl-2 space-y-1 text-sm text-slate-500">
                            <div className="flex items-center gap-2"><Clock size={14}/> {course.time}</div>
                            <div className="flex items-center gap-2"><MapPin size={14}/> {course.location}</div>
                            <div className="flex items-center gap-2 text-indigo-600 font-medium bg-indigo-50 w-fit px-2 py-0.5 rounded mt-2"><User size={14}/> {course.teacher_name || "Sin asignar"}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* --- PESTAÑA: ALUMNOS --- */}
      {activeTab === 'students' && (
        <div className="animate-in fade-in bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-700">Matrícula de Alumnos</h3>
                <button onClick={() => openStudentModal()} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm flex items-center gap-2"><Plus size={18} /> Matricular Alumno</button>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b">
                    <tr>
                        <th className="px-6 py-3">Nombre del Alumno</th>
                        <th className="px-6 py-3">Curso Asignado</th>
                        <th className="px-6 py-3 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {students.length > 0 ? students.map(student => (
                        <tr key={student.id} className="hover:bg-slate-50">
                            <td className="px-6 py-3 font-medium text-slate-800 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs"><GraduationCap size={16}/></div>
                                {student.name}
                            </td>
                            <td className="px-6 py-3 text-slate-500">
                                {student.course_name ? (
                                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium border border-slate-200">{student.course_name}</span>
                                ) : (
                                    <span className="text-xs text-orange-500 italic">Sin curso</span>
                                )}
                            </td>
                            <td className="px-6 py-3 text-right flex justify-end gap-2">
                                <button onClick={() => openStudentModal(student)} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded transition-colors"><Edit2 size={16}/></button>
                                <button onClick={() => handleDeleteStudent(student.id)} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded transition-colors"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="3" className="px-6 py-8 text-center text-slate-400 italic">No hay alumnos registrados aún.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      )}

      {/* --- MODALES --- */}
      
      {/* 1. Modal Profesor */}
      {showTeacherModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
             <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
                 <h3 className="font-bold mb-4 text-lg">Nuevo Profesor</h3>
                 <form onSubmit={handleCreateUser} className="space-y-4">
                     <input type="text" placeholder="Nombre" required className="w-full border p-2 rounded-lg" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                     <input type="email" placeholder="Email" required className="w-full border p-2 rounded-lg" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                     <div className="flex justify-end gap-2 pt-2">
                         <button type="button" onClick={() => setShowTeacherModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                         <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-lg">Crear</button>
                     </div>
                 </form>
             </div>
          </div>
      )}

      {/* 2. Modal Editar Profesor */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-indigo-500">
            <h3 className="text-xl font-bold mb-4">Editar Profesor</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
                <input type="text" required className="w-full border p-2 rounded-lg" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                <input type="email" required className="w-full border p-2 rounded-lg" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal Cursos */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-100"><h3 className="font-bold text-lg">{isEditingCourse ? 'Editar Curso' : 'Nuevo Curso'}</h3></div>
                <form onSubmit={handleCourseSubmit} className="p-6 space-y-4">
                    <input type="text" placeholder="Nombre Curso" required className="w-full border p-2 rounded-lg" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Ubicación" required className="w-full border p-2 rounded-lg" value={courseForm.location} onChange={e => setCourseForm({...courseForm, location: e.target.value})} />
                        <input type="time" required className="w-full border p-2 rounded-lg" value={courseForm.time} onChange={e => setCourseForm({...courseForm, time: e.target.value})} />
                    </div>
                    <select className="w-full border p-2 rounded-lg bg-white" value={courseForm.teacher_id} onChange={e => setCourseForm({...courseForm, teacher_id: e.target.value})}>
                        <option value="">-- Sin Asignar --</option>
                        {stats.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2"><input type="radio" name="type" value="school" checked={courseForm.type === 'school'} onChange={() => setCourseForm({...courseForm, type: 'school'})} /> Colegio</label>
                        <label className="flex items-center gap-2"><input type="radio" name="type" value="workshop" checked={courseForm.type === 'workshop'} onChange={() => setCourseForm({...courseForm, type: 'workshop'})} /> Taller</label>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-50 mt-4">
                        <button type="button" onClick={() => setShowCourseModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* 4. Modal Alumnos */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-emerald-50 p-4 border-b border-emerald-100 text-emerald-800">
                    <h3 className="font-bold text-lg flex items-center gap-2"><GraduationCap size={20}/> {isEditingStudent ? 'Editar Alumno' : 'Matricular Alumno'}</h3>
                </div>
                <form onSubmit={handleStudentSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                        <input type="text" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ej. Juanito Pérez" value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Asignar a Curso</label>
                        <select className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none" value={studentForm.course_id} onChange={e => setStudentForm({...studentForm, course_id: e.target.value})}>
                            <option value="">-- Sin Asignar --</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.title} ({c.type === 'school' ? 'Colegio' : 'Taller'})</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-50 mt-4">
                        <button type="button" onClick={() => setShowStudentModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-sm transition-transform active:scale-95">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;