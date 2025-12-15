import React, { useState, useEffect } from 'react';

// Componentes
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Vistas
import AdminDashboard from './views/AdminDashboard';
import TeacherDashboard from './views/TeacherDashboard';
import CourseDetail from './views/CourseDetail';
import CalendarView from './views/CalendarView';
import VacationView from './views/VacationView';
import ChangePassword from './views/ChangePassword'; // <--- NUEVO: Importar Vista

const AttendanceApp = () => {
  // --- ESTADOS ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  const [loginError, setLoginError] = useState('');
  
  const [courses, setCourses] = useState([]); 
  const [calendarEvents, setCalendarEvents] = useState([]); 
  const [studentsList, setStudentsList] = useState([]); 
  
  const [view, setView] = useState('dashboard'); 
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [teacherStatus, setTeacherStatus] = useState('active'); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- EFECTO 1: CARGAR DATOS (Solo al entrar y si no es cambio forzado) ---
  useEffect(() => {
    if (isAuthenticated && currentUser?.force_pass_change == 0) {
      fetch(`/api/get_dashboard.php?user_id=${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          setCourses(data.courses || []);
          setCalendarEvents(data.calendar || []);
        })
        .catch(err => console.error("Error cargando dashboard:", err));
    }
  }, [isAuthenticated, currentUser]);

  // --- EFECTO 2: SEGURIDAD (Check continuo) ---
  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;

    const interval = setInterval(() => {
      fetch('/api/check_session.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentUser.id, token: currentUser.token })
      })
      .then(res => {
        if (res.status === 401) {
          alert("Tu sesión ha expirado o se ha iniciado sesión en otro dispositivo.");
          handleLogout();
        }
      })
      .catch(err => console.error("Error verificando sesión:", err));
    }, 5000); 

    return () => clearInterval(interval);
  }, [isAuthenticated, currentUser]);

  // --- FUNCIONES ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/login.php', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
      }

      // Login Exitoso
      setCurrentUser(data);
      setIsAuthenticated(true);
      
      // Chequeo de estado de vacaciones
      if (data.current_status === 'vacation') {
        setTeacherStatus('vacation');
      } else {
        setTeacherStatus('active');
      }

      setView(data.role === 'admin' ? 'admin-dashboard' : 'dashboard');

    } catch (error) {
      console.error("Error de login:", error);
      setLoginError(error.message);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setView('dashboard');
    setTeacherStatus('active'); 
    setCourses([]);
  };

  // --- NUEVA FUNCIÓN FASE 4: Actualizar estado tras cambio de pass ---
  const handlePasswordUpdated = () => {
    setCurrentUser(prev => ({ ...prev, force_pass_change: 0 }));
  };

  const handleCourseSelect = (course) => {
    if (teacherStatus === 'vacation') return;
    
    setSelectedCourse(course);
    setView('course');
    setMobileMenuOpen(false); 
    setStudentsList([]); 

    fetch(`/api/get_students.php?course_id=${course.id}`)
      .then(res => res.json())
      .then(data => setStudentsList(data))
      .catch(err => console.error("Error cargando alumnos:", err));
  };

  const handleSaveAttendance = async () => {
    try {
      const response = await fetch('/api/save_attendance.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          course_id: selectedCourse.id, 
          students: studentsList 
        }),
      });
      
      if(response.ok) {
        alert("¡Asistencia guardada exitosamente!");
        handleBack();
      } else {
        alert("Error al guardar.");
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleBack = () => {
    setSelectedCourse(null);
    setView('dashboard');
    setStudentsList([]); 
  };
  
  const handleStatusChange = (status) => {
    setTeacherStatus(status);
    if (status === 'vacation') {
      setView('dashboard');
      setSelectedCourse(null);
    }
  }

  const updateAttendance = (studentId, newStatus) => {
    if (teacherStatus === 'vacation') return;
    setStudentsList(prev => prev.map(student => 
      Number(student.id) === Number(studentId) ? { ...student, status: newStatus } : student
    ));
  };

  // --- RENDER ---
  
  // 1. Si no está logueado -> Login
  if (!isAuthenticated) {
    return (
      <Login 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        loginError={loginError}
      />
    );
  }

  // 2. Si está logueado pero DEBE cambiar contraseña -> ChangePassword
  if (currentUser?.force_pass_change == 1) {
    return (
      <ChangePassword 
        currentUser={currentUser} 
        onPasswordChanged={handlePasswordUpdated} 
        isForced={true} 
      />
    );
  }

  // 3. App Principal
  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden">
      <Sidebar 
        currentUser={currentUser}
        view={view}
        setView={setView}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleLogout={handleLogout}
        teacherStatus={teacherStatus}
        handleStatusChange={handleStatusChange}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Navbar 
          setMobileMenuOpen={setMobileMenuOpen}
          currentUser={currentUser}
          teacherStatus={teacherStatus}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {view === 'admin-dashboard' && <AdminDashboard />}
          
          {view === 'calendar' && (
            <CalendarView 
              calendarEvents={calendarEvents} 
              teacherStatus={teacherStatus} 
            />
          )}

          {(view === 'dashboard' || view === 'course') && (
            <>
              {teacherStatus === 'vacation' ? (
                <VacationView 
                  handleStatusChange={handleStatusChange} 
                  currentUser={currentUser} 
                />
              ) : (
                <>
                  {view === 'dashboard' && (
                    <TeacherDashboard 
                      courses={courses} 
                      handleCourseSelect={handleCourseSelect} 
                    />
                  )}

                  {view === 'course' && (
                    <CourseDetail 
                      selectedCourse={selectedCourse} 
                      studentsList={studentsList} 
                      handleBack={handleBack} 
                      updateAttendance={updateAttendance}
                      handleSaveAttendance={handleSaveAttendance} 
                    />
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