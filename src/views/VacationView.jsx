import React, { useState } from 'react';
import { Calendar as CalendarIcon, Upload, Send, AlertCircle } from 'lucide-react';

const VacationView = ({ currentUser, handleStatusChange }) => {
  const [type, setType] = useState('vacation'); // 'vacation' | 'medical'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [comments, setComments] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener fecha de hoy en formato YYYY-MM-DD
  const getToday = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación extra de seguridad
    if (startDate < getToday()) {
      alert("No puedes seleccionar una fecha en el pasado.");
      return;
    }
    
    if (endDate < startDate) {
      alert("La fecha de término no puede ser anterior a la de inicio.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('user_id', currentUser.id);
    formData.append('type', type);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    formData.append('comments', comments);
    
    if (file && type === 'medical') {
      formData.append('file', file);
    }

    try {
      const response = await fetch('/api/request_leave.php', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Solicitud enviada con éxito al administrador.');
        handleStatusChange('active'); 
      } else {
        const errorData = await response.json();
        alert('Error: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error enviando solicitud:', error);
      alert('Error de conexión al enviar la solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
        <div className={`p-6 text-white ${type === 'vacation' ? 'bg-indigo-600' : 'bg-rose-600'} transition-colors duration-300`}>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon />
            Solicitud de Ausencia
          </h2>
          <p className="opacity-90 mt-1">Completa los datos para notificar a la administración.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setType('vacation')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'vacation' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Vacaciones
            </button>
            <button
              type="button"
              onClick={() => setType('medical')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'medical' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Licencia Médica
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Desde</label>
              <input 
                type="date" 
                required
                min={getToday()} // Bloquea fechas pasadas
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  // Si cambian el inicio y el fin quedó antes, reseteamos el fin o lo igualamos
                  if (endDate && e.target.value > endDate) {
                    setEndDate(e.target.value);
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hasta</label>
              <input 
                type="date" 
                required
                min={startDate || getToday()} // El fin no puede ser antes del inicio (o de hoy)
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {type === 'medical' && (
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 animate-in slide-in-from-top-2">
              <label className="block text-sm font-medium text-rose-800 mb-2 flex items-center gap-2">
                <Upload size={16} /> Adjuntar Licencia Médica (PDF/IMG)
              </label>
              <input 
                type="file" 
                accept="image/*,.pdf"
                required
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-rose-100 file:text-rose-700
                  hover:file:bg-rose-200
                "
              />
              <p className="text-xs text-rose-600 mt-2 flex items-center gap-1">
                <AlertCircle size={12} />
                Este documento es obligatorio para validar la licencia.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Comentarios Adicionales</label>
            <textarea 
              rows="3"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Detalles adicionales para el administrador..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => handleStatusChange('active')}
              className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white shadow-md transition-all active:scale-95 ${
                type === 'vacation' 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-rose-600 hover:bg-rose-700'
              } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Enviando...' : (
                <>
                  <Send size={18} /> Enviar Solicitud
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default VacationView;