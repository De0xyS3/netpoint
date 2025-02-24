'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from "./ui/buttons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface MenuSheetProps {
  onAddPoint: () => void;
  onToggleDetails: () => void;
  showDetails: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMove: () => void;
  isMoving: boolean;
  onAddFloor: () => void;
  onDeleteFloor: () => void;
  onManualAddPoint: () => void;
}

export function MenuSheet({
  onAddPoint,
  onToggleDetails,
  showDetails,
  onFileChange,
  onToggleMove,
  isMoving,
  onAddFloor,
  onDeleteFloor,
  onManualAddPoint,
}: MenuSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Floor Management</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 mt-4">
          <Button onClick={() => handleOptionClick(onAddPoint)} className="w-full justify-start">
            Add Point
          </Button>
          <Button onClick={() => handleOptionClick(onManualAddPoint)} className="w-full justify-start">
            Add Point Manually
          </Button>
          <Button onClick={() => handleOptionClick(onToggleDetails)} className="w-full justify-start">
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
          <div className="relative">
            <Button className="w-full justify-start">
              Upload SVG
            </Button>
            <input
              type="file"
              accept=".svg"
              onChange={(e) => {
                onFileChange(e);
                setIsOpen(false);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <Button onClick={() => handleOptionClick(onToggleMove)} className="w-full justify-start">
            {isMoving ? 'Finish Moving' : 'Move Points'}
          </Button>
          <Button onClick={() => handleOptionClick(onAddFloor)} className="w-full justify-start">
            Add New Floor
          </Button>
          <Button onClick={() => handleOptionClick(onDeleteFloor)} variant="destructive" className="w-full justify-start">
            Delete Current Floor
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

