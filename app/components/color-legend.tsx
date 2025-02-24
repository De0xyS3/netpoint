import React, { useState } from 'react';
import { Info } from 'lucide-react';

export function ColorLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Mostrar leyenda"
      >
        <Info className="w-5 h-5 text-gray-600" />
      </button>
      
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-lg w-44 p-3">
          <h3 className="text-sm font-medium mb-2">Leyenda de Colores</h3>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-800"></div>
              <span>Estado Activo</span>
            </li>
            <li className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-800"></div>
              <span>Estado Inactivo</span>
            </li>
            <li className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-gray-200 border border-gray-400"></div>
              <span>ID VLAN</span>
            </li>
            <li className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-blue-100 border border-blue-800"></div>
              <span>ID de Roseta</span>
            </li>
            <li className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-800"></div>
              <span>Puerto de Switch</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

