import React from 'react';
import { Clock, Users, ChevronLeft } from 'lucide-react';

const TeacherDashboard = ({ courses, handleCourseSelect }) => {
  return (
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
                <span>{course.student_count} Alumnos</span>
                <span className="flex items-center gap-1 text-indigo-600 font-medium group-hover:underline">
                  Tomar lista <ChevronLeft className="rotate-180" size={16} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;