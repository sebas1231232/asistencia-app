import React from 'react';
import { CheckCircle, Palmtree, School, Search, BarChart3 } from 'lucide-react';

const TEACHER_STATUS_DB = [
  { id: 1, name: 'Juan Profe', department: 'Matemáticas', status: 'active', activeCourses: 3 },
  { id: 2, name: 'Ana Maria', department: 'Ciencias', status: 'vacation', activeCourses: 4 },
  { id: 3, name: 'Carlos Gym', department: 'Deportes', status: 'active', activeCourses: 2 },
];

const AdminDashboard = () => {
  return (
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
};

export default AdminDashboard;