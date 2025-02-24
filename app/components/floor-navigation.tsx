import { useState } from 'react';
import { Button } from './ui/buttons';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

interface NavigationBarProps {
  currentFloor: string;
  onPreviousFloor: () => void;
  onNextFloor: () => void;
  hasPreviousFloor: boolean;
  hasNextFloor: boolean;
}

export function NavigationBar({
  currentFloor,
  onPreviousFloor,
  onNextFloor,
  hasPreviousFloor,
  hasNextFloor,
}: NavigationBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      {/* Floating toggle button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 right-4 z-50 rounded-full w-10 h-10 p-0 shadow-lg"
        variant="outline"
      >
        <ArrowUpDown className="h-4 w-4" />
      </Button>

      {/* Navigation bar */}
      <div
        className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-2 bg-white/95 px-4 py-2 rounded-b-lg shadow-md transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <Button
          onClick={onPreviousFloor}
          disabled={!hasPreviousFloor}
          variant="outline"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous Floor
        </Button>
        <span className="px-3 font-medium">
          Current Floor: {currentFloor}
        </span>
        <Button
          onClick={onNextFloor}
          disabled={!hasNextFloor}
          variant="outline"
        >
          Next Floor
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </>
  );
}

