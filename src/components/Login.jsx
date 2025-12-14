import React from 'react';
import { BookOpen, AlertTriangle } from 'lucide-react';

const Login = ({ email, setEmail, password, setPassword, handleLogin, loginError }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-slate-900 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500 mb-4 shadow-lg">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Bienvenido a DocenteApp</h1>
          <p className="text-slate-400 mt-2">Plataforma de Gestión Escolar y Talleres</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="ej. juan@colegio.cl"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                <AlertTriangle size={16} />
                {loginError}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Botones de prueba rápida */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-center text-slate-400 uppercase font-semibold mb-3">Credenciales de Prueba</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-2 rounded border text-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-200" onClick={() => {setEmail('juan@colegio.cl'); setPassword('1234')}}>
                <span className="block font-bold text-slate-700">Profesor</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border text-center cursor-pointer hover:bg-purple-50 hover:border-purple-200" onClick={() => {setEmail('admin@colegio.cl'); setPassword('admin')}}>
                <span className="block font-bold text-slate-700">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;