import React from 'react';
import { BookOpen, BarChart3, UserCog, Users, Calendar as CalendarIcon, Briefcase, Palmtree, LogOut, XCircle } from 'lucide-react';

const Sidebar = ({ 
  currentUser, 
  view, 
  setView, 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  handleLogout, 
  teacherStatus, 
  handleStatusChange 
}) => {
  return (
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
};

export default Sidebar;