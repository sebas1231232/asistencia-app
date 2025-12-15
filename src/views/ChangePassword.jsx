import React, { useState } from 'react';
import { Lock, Save, AlertTriangle } from 'lucide-react';

const ChangePassword = ({ currentUser, onPasswordChanged, isForced = false }) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPass.length < 4) {
      setError("La nueva contraseña es muy corta.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    try {
      const payload = {
        user_id: currentUser.id,
        new_password: newPass
      };
      
      // Si no es forzado (es voluntario), pedimos la actual por seguridad
      if (!isForced) {
        payload.current_password = currentPass;
      }

      const response = await fetch('/api/change_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Contraseña actualizada con éxito.");
        onPasswordChanged(); // Notificar al padre para quitar esta pantalla
      } else {
        setError(data.message || "Error al cambiar contraseña.");
      }
    } catch (err) {
      setError("Error de conexión.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-orange-600 p-6 text-white text-center">
          <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
            <Lock size={24} />
          </div>
          <h2 className="text-xl font-bold">
            {isForced ? "Cambio de Contraseña Requerido" : "Cambiar Contraseña"}
          </h2>
          <p className="text-orange-100 text-sm mt-1">
            {isForced 
              ? "Por seguridad, debes cambiar tu contraseña temporal antes de continuar." 
              : "Actualiza tus credenciales de acceso."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {!isForced && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña Actual</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                value={currentPass}
                onChange={e => setCurrentPass(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Contraseña</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              placeholder="Mínimo 4 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Nueva</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          <button type="submit" className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors flex justify-center items-center gap-2">
            <Save size={18} /> Guardar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;