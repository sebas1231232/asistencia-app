import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Ban, CheckCircle } from 'lucide-react';

const CalendarView = ({ calendarEvents, teacherStatus, vacationRanges, handleCourseSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helpers de fecha
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); 
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lunes
    return new Date(d.setDate(diff));
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Verificar si una fecha específica cae dentro de algún rango de vacaciones
  const isDateBlocked = (dateObj) => {
    const dateStr = dateObj.toISOString().split('T')[0];
    return vacationRanges.some(range => dateStr >= range.start && dateStr <= range.end);
  };

  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  
  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek, i));
  const monthName = startOfWeek.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });

  const handleEventClick = (event, dateObj) => {
    if (event.type === 'vacation' || event.type === 'medical') return;

    if (isDateBlocked(dateObj) || teacherStatus === 'vacation') {
      alert("⛔ ACCESO DENEGADO\n\nNo puedes gestionar clases durante tu periodo de vacaciones o licencia médica.");
      return;
    }
    const todayStr = new Date().toDateString();
    const eventDateStr = dateObj.toDateString();

    if (todayStr !== eventDateStr) {
      alert(`📅 ASISTENCIA RESTRINGIDA\n\nSolo puedes tomar asistencia el día de la clase.\n\nFecha seleccionada: ${dateObj.toLocaleDateString()}\nHoy es: ${new Date().toLocaleDateString()}`);
      return;
    }
    handleCourseSelect({
      id: event.course_id,
      title: event.title,
      type: event.course_type
    });
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in p-4">
      {/* Cabecera y Navegación */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 capitalize">{monthName}</h2>
           <p className="text-slate-500 text-sm">Calendario de Actividades</p>
        </div>
        
        <div className="flex gap-2 text-sm bg-white p-1 rounded-lg border shadow-sm">
          <button onClick={prevWeek} className="p-2 hover:bg-slate-100 rounded-md transition-colors"><ChevronLeft size={20}/></button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 font-medium text-slate-600 hover:text-indigo-600 border-x border-slate-100">Hoy</button>
          <button onClick={nextWeek} className="p-2 hover:bg-slate-100 rounded-md transition-colors"><ChevronRight size={20}/></button>
        </div>
      </div>

      {/* Grilla Semanal */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, i) => {
          const isToday = day.toDateString() === new Date().toDateString();
          const dateStr = day.toISOString().split('T')[0];
          const isBlocked = isDateBlocked(day); // ¿Es día de vacaciones?

          // Filtrar eventos de ESTE día específico (comparando string YYYY-MM-DD)
          const eventsToday = calendarEvents.filter(e => e.date === dateStr);

          return (
            <div key={i} className={`flex flex-col bg-white rounded-xl border transition-all ${isToday ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-lg scale-[1.02]' : 'border-slate-200 shadow-sm'} overflow-hidden min-h-[180px]`}>
              
              {/* Cabecera del Día */}
              <div className={`p-3 text-center border-b flex flex-col justify-center relative ${isToday ? 'bg-indigo-50' : (isBlocked ? 'bg-rose-50' : 'bg-slate-50')}`}>
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {day.toLocaleDateString('es-CL', { weekday: 'short' })}
                </span>
                <span className={`text-2xl font-bold ${isToday ? 'text-indigo-600' : (isBlocked ? 'text-rose-400' : 'text-slate-700')}`}>
                  {day.getDate()}
                </span>
                {isBlocked && <div className="absolute top-2 right-2 text-rose-400"><Ban size={14}/></div>}
              </div>
              
              {/* Lista de Eventos */}
              <div className="p-2 space-y-2 flex-1 relative">
                {eventsToday.length > 0 ? (
                  eventsToday.map((event, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleEventClick(event, day)}
                      className={`
                        p-2 rounded-lg text-xs border-l-4 cursor-pointer transition-transform hover:scale-[1.02] shadow-sm
                        ${event.type === 'class' 
                          ? (isBlocked ? 'bg-slate-100 border-slate-300 opacity-50 cursor-not-allowed' : 'bg-blue-50 border-blue-500 hover:bg-blue-100') 
                          : (event.type === 'medical' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-amber-50 border-amber-500 text-amber-700')
                        }
                      `}
                    >
                      <p className="font-bold truncate">{event.title}</p>
                      <div className="flex items-center gap-1 mt-1 opacity-80 font-medium">
                        <Clock size={10} /> {event.time} - {event.end_time || '?'}
                      </div>
                      
                      {/* Indicador visual de bloqueo */}
                      {event.type === 'class' && isBlocked && (
                        <div className="mt-1 text-[10px] text-rose-600 font-bold flex items-center gap-1">
                          <Ban size={10}/> Suspendido
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-slate-300 text-xs italic">--</span>
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