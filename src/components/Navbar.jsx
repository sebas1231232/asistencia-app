import React from 'react';
import { Menu } from 'lucide-react';

const Navbar = ({ setMobileMenuOpen, currentUser, teacherStatus }) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden">
      <button onClick={() => setMobileMenuOpen(true)} className="text-slate-600">
        <Menu />
      </button>
      <span className="font-bold text-slate-700">DocenteApp</span>
      {currentUser.role === 'teacher' && (
        <div className={`w-3 h-3 rounded-full ${teacherStatus === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
      )}
    </header>
  );
};

export default Navbar;