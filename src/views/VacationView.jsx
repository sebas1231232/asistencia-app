import React from 'react';
import { Sun, Calendar as CalendarIcon, School } from 'lucide-react';

const VacationView = ({ handleStatusChange }) => {
  return (
    <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
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

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <School size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Estado de Cursos</h3>
          <p className="text-slate-500 text-sm mt-1">Tus cursos están pausados</p>
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
};

export default VacationView;