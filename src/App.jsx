import React, { useState, useEffect } from 'react';

// Importación de Componentes
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Importación de Vistas
import AdminDashboard from './views/AdminDashboard';
import TeacherDashboard from './views/TeacherDashboard';
import CourseDetail from './views/CourseDetail';
import CalendarView from './views/CalendarView';
import VacationView from './views/VacationView';

const AttendanceApp = () => {
  // --- ESTADOS DE AUTENTICACIÓN ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  const [loginError, setLoginError] = useState('');
  
  // --- ESTADOS DE DATOS ---
  const [courses, setCourses] = useState([]); 
  const [calendarEvents, setCalendarEvents] = useState([]); 
  const [studentsList, setStudentsList] = useState([]); 
  
  // --- ESTADOS DE LA INTERFAZ ---
  const [view, setView] = useState('dashboard'); 
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [teacherStatus, setTeacherStatus] = useState('active'); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- ESTADOS DEL FORMULARIO ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- EFECTOS ---
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/get_dashboard.php')
        .then(res => res.json())
        .then(data => {
          setCourses(data.courses || []);
          setCalendarEvents(data.calendar || []);
        })
        .catch(err => console.error("Error cargando dashboard:", err));
    }
  }, [isAuthenticated]);

  // --- LÓGICA ---
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
    setCourses([]);
  };

  const handleCourseSelect = (course) => {
    if (teacherStatus === 'vacation') return;
    
    setSelectedCourse(course);
    setView('course');
    setMobileMenuOpen(false); 

    fetch(`/api/get_students.php?course_id=${course.id}`)
      .then(res => res.json())
      .then(data => setStudentsList(data))
      .catch(err => console.error("Error cargando alumnos:", err));
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
    // NOTA: Aquí deberías agregar el FETCH para guardar en la BD real
  };

  // --- RENDER PRINCIPAL ---
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
          
          {view === 'calendar' && <CalendarView calendarEvents={calendarEvents} teacherStatus={teacherStatus} />}

          {(view === 'dashboard' || view === 'course') && (
            <>
              {teacherStatus === 'vacation' ? (
                <VacationView handleStatusChange={handleStatusChange} />
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