import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from './buttons';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}: AlertDialogProps) {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{description}</p>
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </Button>
          <Button 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Mantenemos estas exportaciones para compatibilidad
export const AlertDialogContent = ({ children }: { children: React.ReactNode }) => children;
export const AlertDialogHeader = ({ children }: { children: React.ReactNode }) => <div className="mb-4">{children}</div>;
export const AlertDialogFooter = ({ children }: { children: React.ReactNode }) => <div className="flex justify-end space-x-2">{children}</div>;
export const AlertDialogTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-semibold mb-4">{children}</h2>;
export const AlertDialogDescription = ({ children }: { children: React.ReactNode }) => <p className="text-sm text-gray-600 mb-6">{children}</p>;
export const AlertDialogAction = Button;
export const AlertDialogCancel = ({ children, ...props }: React.ComponentProps<typeof Button>) => (
  <Button variant="outline" {...props}>{children}</Button>
);

