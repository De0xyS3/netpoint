import { useState, useEffect, useRef } from 'react';
import { X, Edit2, Save } from 'lucide-react';
import { Input } from "./ui/input";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "./ui/alert-dialog";

interface Point {
  etiqueta: string;
  usuario: string;
  proyecto: string;
  switchIP: string;
  port: number | null;
  vlan: string | null;
  activo: boolean;
}

interface PointDetailsProps {
  point: Point;
  index: number;
  totalPoints: number;
  containerRef: React.RefObject<HTMLDivElement>;
  pointRef: React.RefObject<HTMLDivElement> | null;
  onDelete: (index: number) => void;
  onUpdate: (index: number, updatedPoint: Partial<Point>) => void;
}

export function PointDetails({ 
  point, 
  index, 
  totalPoints, 
  containerRef, 
  pointRef, 
  onDelete,
  onUpdate
}: PointDetailsProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editedPoint, setEditedPoint] = useState<Partial<Point>>({
    usuario: point.usuario,
    proyecto: point.proyecto
  });
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && pointRef?.current && detailsRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const pointRect = pointRef.current.getBoundingClientRect();
      const detailsRect = detailsRef.current.getBoundingClientRect();

      let top = pointRect.top - containerRect.top + pointRect.height;
      let left = pointRect.left - containerRect.left;

      if (top + detailsRect.height > containerRect.height) {
        top = pointRect.top - containerRect.top - detailsRect.height;
      }

      if (left + detailsRect.width > containerRect.width) {
        left = containerRect.width - detailsRect.width;
      }

      setPosition({ top, left });
    }
  }, [containerRef, pointRef]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(index, editedPoint);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPoint(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    onDelete(index);
    setShowDeleteConfirmation(false);
  };

  return (
    <>
      <div
        ref={detailsRef}
        className="absolute z-50 rounded-lg shadow-lg p-1.5 w-44"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          backgroundColor: 'white',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div className="absolute -top-1 -right-1 flex gap-1 mb-6">
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors mr-1"
            >
              <Edit2 className="w-3 h-3 text-blue-600" />
            </button>
          )}
          {isEditing ? (
            <button
              onClick={handleSave}
              className="p-1 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
            >
              <Save className="w-3 h-3 text-green-600" />
            </button>
          ) : (
            <button
              onClick={handleDeleteClick}
              className="p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
            >
              <X className="w-3 h-3 text-red-600" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 mb-1 flex-wrap mt-3">
          <span
            className={`inline-block px-1.4 py-0.5 rounded text-xs font-medium ${
              point.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {point.activo ? 'Active' : 'Inactive'}
          </span>
          <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
            {point.vlan || 'N/A'}
          </span>
          <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {point.etiqueta}
          </span>
          <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            {point.port}
          </span>
        </div>

        <div className="space-y-0.5 text-xs">
          <div className="flex justify-between">
            <span className="font-semibold">Switch:</span>
            <span>{point.switchIP}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Nombre:</span>
            {isEditing ? (
              <Input
                type="text"
                name="usuario"
                value={editedPoint.usuario}
                onChange={handleInputChange}
                className="w-24 h-6 text-xs"
              />
            ) : (
              <span>{point.usuario || 'N/A'}</span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Proyecto:</span>
            {isEditing ? (
              <Input
                type="text"
                name="proyecto"
                value={editedPoint.proyecto}
                onChange={handleInputChange}
                className="w-24 h-6 text-xs"
              />
            ) : (
              <span>{point.proyecto || 'N/A'}</span>
            )}
          </div>
        </div>
      </div>

      <AlertDialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente el punto."
        onConfirm={handleConfirmDelete}
        confirmText="Sí, eliminar"
        cancelText="No"
      />
    </>
  );
}

