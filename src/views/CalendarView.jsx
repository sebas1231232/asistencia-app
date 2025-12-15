import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';

const CalendarView = ({ calendarEvents }) => {
  // Estado para controlar la fecha base (inicia hoy)
  const [currentDate, setCurrentDate] = useState(new Date());

  // Funciones auxiliares de fecha
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Domingo) - 6 (Sábado)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar al Lunes
    return new Date(d.setDate(diff));
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Navegación
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  
  // Generar los 7 días de la semana actual
  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek, i));

  const monthName = startOfWeek.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 capitalize">
          {monthName}
        </h2>
        <div className="flex gap-2 text-sm bg-white p-1 rounded-lg border shadow-sm">
          <button onClick={prevWeek} className="p-2 hover:bg-slate-100 rounded-md transition-colors"><ChevronLeft size={20}/></button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 font-medium text-slate-600 hover:text-indigo-600">Hoy</button>
          <button onClick={nextWeek} className="p-2 hover:bg-slate-100 rounded-md transition-colors"><ChevronRight size={20}/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, i) => {
          const isToday = day.toDateString() === new Date().toDateString();
          const dayNumber = day.getDate();
          
          // Buscar eventos para este día (Simple coincidencia por número de día por ahora)
          // NOTA: Para producción, deberías comparar fechas completas (YYYY-MM-DD)
          const eventsToday = calendarEvents.filter(e => parseInt(e.day) === dayNumber);

          return (
            <div key={i} className={`flex flex-col bg-white rounded-xl border ${isToday ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' : 'border-slate-200'} overflow-hidden min-h-[160px]`}>
              <div className={`p-3 text-center border-b ${isToday ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                <span className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {day.toLocaleDateString('es-CL', { weekday: 'short' })}
                </span>
                <span className={`text-xl font-bold ${isToday ? 'text-indigo-600' : 'text-slate-800'}`}>
                  {dayNumber}
                </span>
              </div>
              
              <div className="p-2 space-y-2 flex-1">
                {eventsToday.length > 0 ? (
                  eventsToday.map((event, idx) => (
                    <div key={idx} className={`p-2 rounded text-xs border-l-2 ${
                      event.type === 'meeting' ? 'bg-blue-50 border-blue-400 text-blue-700' :
                      event.type === 'holiday' ? 'bg-red-50 border-red-400 text-red-700' :
                      'bg-emerald-50 border-emerald-400 text-emerald-700'
                    }`}>
                      <p className="font-bold truncate">{event.title}</p>
                      <div className="flex items-center gap-1 mt-1 opacity-75">
                        <Clock size={10} /> 09:00 AM
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-slate-300 text-xs italic">Sin actividades</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;