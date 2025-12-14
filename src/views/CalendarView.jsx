import React from 'react';
import { ChevronLeft, ChevronRight, MoreVertical, Palmtree } from 'lucide-react';

const CalendarView = ({ calendarEvents, teacherStatus }) => {
  return (
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
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
          {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-slate-500">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr bg-slate-100 gap-px border-b border-l border-slate-200">
          {Array.from({ length: 35 }).map((_, i) => {
            const dayNum = i - 3; 
            const isToday = dayNum === 24; 
            const event = dayNum > 0 && dayNum <= 30 ? calendarEvents.find(e => parseInt(e.day) === dayNum) : null;
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
};

export default CalendarView;