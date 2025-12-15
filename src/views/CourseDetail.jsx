import React from 'react';
import { ChevronLeft, CheckCircle, XCircle, Clock } from 'lucide-react';

const CourseDetail = ({ selectedCourse, studentsList, handleBack, updateAttendance, handleSaveAttendance }) => {
  return (
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
              Total: {studentsList.length}
            </div>
            <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-100 text-sm font-medium shadow-sm flex items-center gap-2">
              <CheckCircle size={16} />
              Presentes: {studentsList.filter(s => s.status === 'present').length}
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {studentsList.map(student => (
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
          <button 
            onClick={handleBack} // El botón cancelar simplemente vuelve atrás sin guardar
            className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSaveAttendance} // <--- Conectado aquí
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
              <CheckCircle size={18} />
            Guardar Asistencia
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;