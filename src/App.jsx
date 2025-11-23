import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Menu, 
  LogOut, 
  BookOpen, 
  AlertTriangle,
  Palmtree,
  Briefcase,
  ChevronLeft,
  Lock,
  UserCog,
  BarChart3,
  Search,
  School,
  Sun,
  MapPin,
  MoreVertical,
  ChevronRight
} from 'lucide-react';


const AttendanceApp = () => {
  // --- ESTADO GLOBAL Y AUTH ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  const [loginError, setLoginError] = useState('');
  
  // --- ESTADO DE DATOS (Ya no usamos las constantes fijas) ---
  const [courses, setCourses] = useState([]); // Lista de cursos vacía al inicio
  const [calendarEvents, setCalendarEvents] = useState([]); // Calendario vacío
  const [studentsList, setStudentsList] = useState([]); // Alumnos del curso seleccionado
  
  // --- ESTADO DE LA UI ---
  const [view, setView] = useState('dashboard'); 
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [teacherStatus, setTeacherStatus] = useState('active'); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estado Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- 1. CARGAR DATOS INICIALES (Dashboard) ---
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/get_dashboard.php')
        .then(res => res.json())
        .then(data => {
          setCourses(data.courses);
          setCalendarEvents(data.calendar);
        })
        .catch(err => console.error("Error cargando dashboard:", err));
    }
  }, [isAuthenticated]);

  // --- 2. CARGAR ALUMNOS (Cuando seleccionas un curso) ---
  // --- FUNCIONES DE AUTENTICACIÓN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/login.php', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el servidor');
      }

      const data = await response.json();

      setCurrentUser(data);
      setIsAuthenticated(true);
      setView(data.role === 'admin' ? 'admin-dashboard' : 'dashboard');

    } catch (error) {
      console.error("Error de login:", error);
      setLoginError('Credenciales incorrectas o error de conexión.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setView('dashboard');
    setTeacherStatus('active'); 
  };

  // --- FUNCIONES DE LA APP ---
  const handleCourseSelect = (course) => {
    // Si está en vacaciones, bloqueamos la entrada al curso
    if (teacherStatus === 'vacation') return;
    
    setSelectedCourse(course);
    setView('course');
    setMobileMenuOpen(false);
  };

  const handleBack = () => {
    setSelectedCourse(null);
    setView('dashboard');
  };
  
  const handleStatusChange = (status) => {
    setTeacherStatus(status);
    // Si cambia a vacaciones y estaba en un curso, volver al dashboard
    if (status === 'vacation') {
      setView('dashboard');
      setSelectedCourse(null);
    }
  }

  const updateAttendance = (studentId, newStatus) => {
    if (teacherStatus === 'vacation') return;
    setAttendance(prev => ({
      ...prev,
      [selectedCourse.id]: prev[selectedCourse.id].map(student => 
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    }));
  };

  // --- VISTA DE LOGIN (RESTAURADA) ---
  // Este bloque faltaba y causaba el error de "role of null"
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="bg-slate-900 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500 mb-4 shadow-lg">
              <BookOpen size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Bienvenido a DocenteApp</h1>
            <p className="text-slate-400 mt-2">Plataforma de Gestión Escolar y Talleres</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="ej. juan@colegio.cl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                  <AlertTriangle size={16} />
                  {loginError}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                Iniciar Sesión
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs text-center text-slate-400 uppercase font-semibold mb-3">Credenciales de Prueba</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-2 rounded border text-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-200" onClick={() => {setEmail('juan@colegio.cl'); setPassword('1234')}}>
                  <span className="block font-bold text-slate-700">Profesor</span>
                  <span className="text-slate-500">juan@colegio.cl</span>
                  <span className="block text-indigo-500 mt-1">1234</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border text-center cursor-pointer hover:bg-purple-50 hover:border-purple-200" onClick={() => {setEmail('admin@colegio.cl'); setPassword('admin')}}>
                  <span className="block font-bold text-slate-700">Admin</span>
                  <span className="text-slate-500">admin@colegio.cl</span>
                  <span className="block text-purple-500 mt-1">admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- COMPONENTES VISUALES ---

  // 1. VISTA DE CALENDARIO
  const CalendarView = () => (
    <div className="max-w-5xl mx-auto animate-in fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Calendario Académico</h2>
        <div className="flex gap-2 text-sm">
          <button className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft size={20}/></button>
          <span className="font-medium self-center px-2">Noviembre 2024</span>
          <button className="p-2 hover:bg-slate-100 rounded-full"><ChevronRight size={20}/></button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Cabecera Dias */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
          {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-slate-500">{day}</div>
          ))}
        </div>
        {/* Grilla Dias */}
        <div className="grid grid-cols-7 auto-rows-fr bg-slate-100 gap-px border-b border-l border-slate-200">
          {Array.from({ length: 35 }).map((_, i) => {
            const dayNum = i - 3; // Ajuste simple para empezar el mes
            const isToday = dayNum === 24; // Simulamos que hoy es 24
            const event = dayNum > 0 && dayNum <= 30 ? CALENDAR_EVENTS.find(e => e.day === dayNum) : null;
            
            // Si está en vacaciones, marcamos los días futuros
            const isVacationDay = teacherStatus === 'vacation' && dayNum >= 24 && dayNum <= 30;

            return (
              <div key={i} className={`min-h-[100px] bg-white p-2 relative group hover:bg-slate-50 transition-colors ${dayNum <= 0 || dayNum > 30 ? 'bg-slate-50 text-slate-300' : ''} ${isVacationDay ? 'bg-amber-50/50' : ''}`}>
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'}`}>
                    {dayNum > 0 && dayNum <= 30 ? dayNum : ''}
                  </span>
                  {dayNum > 0 && dayNum <= 30 && (
                    <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600">
                      <MoreVertical size={14} />
                    </button>
                  )}
                </div>
                
                {/* Eventos */}
                <div className="mt-2 space-y-1">
                  {event && (
                    <div className={`text-xs px-1.5 py-0.5 rounded truncate ${
                      event.type === 'meeting' ? 'bg-blue-100 text-blue-700' :
                      event.type === 'holiday' ? 'bg-red-100 text-red-700' :
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      {event.title}
                    </div>
                  )}
                  {isVacationDay && (
                    <div className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 flex items-center gap-1">
                      <Palmtree size={10} /> Vacaciones
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // 2. VISTA DE VACACIONES (INTERFAZ ESPECIAL)
  const VacationDashboard = () => (
    <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
      {/* Tarjeta Principal de Vacaciones */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-400 rounded-2xl shadow-lg text-white overflow-hidden relative mb-8">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform origin-bottom-right"></div>
        <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="bg-white/20 p-6 rounded-full backdrop-blur-sm">
            <Sun size={64} className="text-yellow-100 animate-pulse" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">¡Modo Vacaciones Activo!</h2>
            <p className="text-amber-100 text-lg">
              Desconéctate y recarga energías. Tu acceso a las clases está pausado temporalmente.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info Tarjeta 1 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <CalendarIcon size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Fecha de Regreso</h3>
          <p className="text-slate-500 text-sm mt-1">Tu próxima actividad programada es:</p>
          <div className="mt-4 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 font-mono text-slate-700 font-bold">
            Lunes, 02 de Diciembre
          </div>
        </div>

        {/* Info Tarjeta 2 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <School size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Estado de Cursos</h3>
          <p className="text-slate-500 text-sm mt-1">Tus 3 cursos están pausados</p>
          <div className="mt-4 flex gap-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs">Matemáticas</span>
            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs">Talleres</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => handleStatusChange('active')}
          className="text-slate-400 hover:text-slate-600 text-sm underline decoration-slate-300 underline-offset-4 transition-colors"
        >
          ¿Terminaron tus vacaciones? Volver a activar cuenta
        </button>
      </div>
    </div>
  );

  // --- COMPONENTES INTERNOS ---

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="text-indigo-400" />
          DocenteApp
        </h1>
        <button onClick={() => setMobileMenuOpen(false)} className="md:hidden">
          <XCircle />
        </button>
      </div>
      
      <nav className="p-4 space-y-2 flex-1">
        {currentUser.role === 'admin' ? (
          <>
             <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Administración</div>
             <button onClick={() => setView('admin-dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'admin-dashboard' ? 'bg-purple-600' : 'hover:bg-slate-800'}`}>
              <BarChart3 size={20} />
              Panel General
            </button>
            <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-800 text-slate-400`}>
              <UserCog size={20} />
              Gestión Usuarios
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
              <Users size={20} />
              Mis Clases
            </button>
            <button onClick={() => setView('calendar')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'calendar' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}>
              <CalendarIcon size={20} /> 
              Calendario
            </button>
          </>
        )}

        {/* Sección de Estado del Profesor (Solo visible para Profesores) */}
        {currentUser.role === 'teacher' && (
          <>
            <div className="mt-8 px-4 text-xs font-semibold text-slate-500 uppercase">Mi Estado</div>
            <div className="mt-2 space-y-2 px-2">
              <button 
                onClick={() => handleStatusChange('active')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded border transition-colors ${teacherStatus === 'active' ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-500 hover:bg-slate-800'}`}
              >
                <Briefcase size={16} />
                Activo
              </button>
              <button 
                onClick={() => handleStatusChange('vacation')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded border transition-colors ${teacherStatus === 'vacation' ? 'bg-amber-900/30 border-amber-500 text-amber-400' : 'border-slate-700 text-slate-500 hover:bg-slate-800'}`}
              >
                <Palmtree size={16} />
                Vacaciones
              </button>
            </div>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${currentUser.role === 'admin' ? 'bg-purple-600' : 'bg-indigo-500'}`}>
            {currentUser.avatar}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-400 capitalize">{currentUser.role === 'admin' ? 'Administrador' : 'Profesor Titular'}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm"
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  // --- ADMIN DASHBOARD ---
  const AdminDashboard = () => (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Panel de Administración</h2>
          <p className="text-slate-500">Resumen de actividad docente</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
            Descargar Reporte
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 shadow-sm">
            + Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Profesores Activos</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">24</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">En Vacaciones</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">3</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <Palmtree size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Talleres Hoy</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">12</h3>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <School size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Estado de Docentes</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Buscar profesor..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500" />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Docente</th>
              <th className="px-6 py-4 font-medium">Departamento</th>
              <th className="px-6 py-4 font-medium">Cursos Activos</th>
              <th className="px-6 py-4 font-medium">Estado Actual</th>
              <th className="px-6 py-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {TEACHER_STATUS_DB.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">{teacher.name}</td>
                <td className="px-6 py-4 text-slate-500">{teacher.department}</td>
                <td className="px-6 py-4 text-slate-500">{teacher.activeCourses} cursos</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    teacher.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {teacher.status === 'active' ? <CheckCircle size={12}/> : <Palmtree size={12}/>}
                    {teacher.status === 'active' ? 'Activo' : 'Vacaciones'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header Mobile */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden">
          <button onClick={() => setMobileMenuOpen(true)} className="text-slate-600">
            <Menu />
          </button>
          <span className="font-bold text-slate-700">DocenteApp</span>
          {currentUser.role === 'teacher' && (
            <div className={`w-3 h-3 rounded-full ${teacherStatus === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
          )}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* LOGICA DE VISTAS (Aquí es donde ocurre la magia) */}
          
          {view === 'admin-dashboard' && <AdminDashboard />}
          
          {view === 'calendar' && <CalendarView />}

          {(view === 'dashboard' || view === 'course') && (
            <>
              {/* Si está en VACACIONES, mostramos la interfaz especial */}
              {teacherStatus === 'vacation' ? (
                <VacationDashboard />
              ) : (
                <>
                  {/* Si es DASHBOARD normal */}
                  {view === 'dashboard' && (
                    <div className="max-w-5xl mx-auto animate-in fade-in">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Mis Cursos y Talleres</h2>
                        <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                          {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                          <div 
                            key={course.id}
                            onClick={() => handleCourseSelect(course)}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-200 overflow-hidden group hover:-translate-y-1"
                          >
                            <div className={`h-2 w-full ${course.type === 'school' ? 'bg-indigo-500' : 'bg-orange-500'}`} />
                            <div className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${course.type === 'school' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>
                                  {course.type === 'school' ? 'Colegio' : 'Taller'}
                                </span>
                                <div className="flex items-center text-slate-400 text-xs gap-1">
                                  <Clock size={14} /> {course.time}
                                </div>
                              </div>
                              <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                                {course.title}
                              </h3>
                              <p className="text-slate-500 text-sm mb-4 flex items-center gap-1">
                                <Users size={14} /> {course.location}
                              </p>
                              <div className="flex items-center justify-between text-sm text-slate-500 border-t pt-4">
                                <span>{studentsList[course.id]?.length} Alumnos</span>
                                <span className="flex items-center gap-1 text-indigo-600 font-medium group-hover:underline">
                                  Tomar lista <ChevronLeft className="rotate-180" size={16} />
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Si es VISTA DE CURSO normal */}
                  {view === 'course' && (
                    <div className="max-w-4xl mx-auto animate-in slide-in-from-right-8 fade-in">
                      <button 
                        onClick={handleBack}
                        className="mb-6 flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                      >
                        <ChevronLeft size={20} />
                        Volver al Dashboard
                      </button>

                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                          <div>
                            <h2 className="text-2xl font-bold text-slate-800">{selectedCourse.title}</h2>
                            <p className="text-slate-500 flex items-center gap-2">
                              {selectedCourse.location} 
                              <span className="text-slate-300">|</span> 
                              {selectedCourse.time}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <div className="px-4 py-2 bg-white rounded-lg border text-sm font-medium shadow-sm text-slate-600">
                              Total: {attendance[selectedCourse.id].length}
                            </div>
                            <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-100 text-sm font-medium shadow-sm flex items-center gap-2">
                              <CheckCircle size={16} />
                              Presentes: {attendance[selectedCourse.id].filter(s => s.status === 'present').length}
                            </div>
                          </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {attendance[selectedCourse.id].map(student => (
                            <div key={student.id} className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-slate-500 text-sm ${student.status === 'present' ? 'bg-green-100 text-green-700' : student.status === 'absent' ? 'bg-red-100 text-red-700' : 'bg-slate-200'}`}>
                                  {student.name.charAt(0)}
                                </div>
                                <span className="font-medium text-slate-700">{student.name}</span>
                              </div>

                              <div className="flex items-center gap-2 w-full md:w-auto justify-center">
                                <button
                                  onClick={() => updateAttendance(student.id, 'present')}
                                  className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                    student.status === 'present' 
                                      ? 'bg-green-100 border-green-500 text-green-700 shadow-sm ring-1 ring-green-500' 
                                      : 'border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300'
                                  }`}
                                >
                                  <CheckCircle size={18} className={student.status === 'present' ? 'fill-current' : ''} />
                                  <span className="md:hidden lg:inline font-medium">Presente</span>
                                </button>

                                <button
                                  onClick={() => updateAttendance(student.id, 'absent')}
                                  className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                    student.status === 'absent' 
                                      ? 'bg-red-100 border-red-500 text-red-700 shadow-sm ring-1 ring-red-500' 
                                      : 'border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300'
                                  }`}
                                >
                                  <XCircle size={18} className={student.status === 'absent' ? 'fill-current' : ''} />
                                  <span className="md:hidden lg:inline font-medium">Ausente</span>
                                </button>

                                <button
                                  onClick={() => updateAttendance(student.id, 'late')}
                                  className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                    student.status === 'late' 
                                      ? 'bg-yellow-100 border-yellow-500 text-yellow-700 shadow-sm ring-1 ring-yellow-500' 
                                      : 'border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300'
                                  }`}
                                >
                                  <Clock size={18} className={student.status === 'late' ? 'fill-current' : ''} />
                                  <span className="md:hidden lg:inline font-medium">Atraso</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0">
                          <button className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">
                            Cancelar
                          </button>
                          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-all active:scale-95 flex items-center gap-2">
                             <CheckCircle size={18} />
                            Guardar Asistencia
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AttendanceApp;