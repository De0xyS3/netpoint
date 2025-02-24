'use client';

import { useEffect, useState } from 'react';
import { useFloorManagement } from './hooks/useFloorManagement';
import { usePointManagement } from './hooks/usePointManagement';
import { PointDetails } from './components/point-details';
import { PointModal } from './components/point-modal';
import { Button } from './components/ui/buttons';
import { GridOverlay } from './components/grid-overlay';
import { MenuSheet } from './components/menu-sheet';
import { ManualPointForm } from './components/manual-point-form';
import io from 'socket.io-client';
import { ColorLegend } from './components/color-legend';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NavigationBar } from './components/floor-navigation';

// Usar la URL del backend desde las variables de entorno
const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://10.172.0.93:5000');


export default function FloorManagement() {
  const {
    floors,
    currentFloorIndex,
    error,
    mapPosition,
    zoomLevel,
    isCustomizing,
    isMapFixed,
    setCurrentFloorIndex,
    setMapPosition,
    setZoomLevel,
    setIsCustomizing,
    setIsMapFixed,
    fetchFloors,
    debouncedSave,
    addNewFloor,
    deleteCurrentFloor,
    saveCustomizations,
    setFloors,
    setError,
  } = useFloorManagement();

  const {
    isAddingPoint,
    showPointModal,
    isMovingPoints,
    draggedPoint,
    dragOffset,
    selectedPoint,
    switches,
    switchPorts,
    showAllDetails,
    newPointDetails,
    containerRef,
    imageRef,
    setIsAddingPoint,
    setShowPointModal,
    setIsMovingPoints,
    setDraggedPoint,
    setDragOffset,
    setSelectedPoint,
    setShowAllDetails,
    setNewPointDetails,
    fetchSwitches,
    handleSwitchChange,
    resetNewPointDetails,
  } = usePointManagement();

  const [showManualPointForm, setShowManualPointForm] = useState(false);

  useEffect(() => {
    fetchFloors();
    fetchSwitches();

    socket.on('floor-updates', (updatedFloors) => {
      setFloors(updatedFloors);
    });

    return () => {
      socket.off('floor-updates');
    };
  }, []);

  const updatePoint = (index: number, updatedData: Partial<Point>) => {
    setFloors((prevFloors) =>
      prevFloors.map((floor, floorIndex) =>
        floorIndex === currentFloorIndex
          ? {
              ...floor,
              points: floor.points.map((point, pointIndex) =>
                pointIndex === index ? { ...point, ...updatedData } : point
              ),
            }
          : floor
      )
    );
  
    const updatedPoints = floors[currentFloorIndex].points.map((point, pointIndex) =>
      pointIndex === index ? { ...point, ...updatedData } : point
    );
    debouncedSave(floors[currentFloorIndex]._id, updatedPoints);
  };

  const handleAddPoint = (e: React.MouseEvent) => {
    if (!isAddingPoint || !containerRef.current || floors.length === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const newPoint = {
      x,
      y,
      ...newPointDetails,
      vlan: switchPorts.find(
        (port) => port.port_number.toString() === newPointDetails.port
      )?.vlan,
      activo: switchPorts.find(
        (port) => port.port_number.toString() === newPointDetails.port
      )?.status,
    };

    const updatedPoints = [...floors[currentFloorIndex].points, newPoint];

    setFloors((prev) =>
      prev.map((floor, index) =>
        index === currentFloorIndex ? { ...floor, points: updatedPoints } : floor
      )
    );

    debouncedSave(floors[currentFloorIndex]._id, updatedPoints);

    setIsAddingPoint(false);
    setShowPointModal(false);
    resetNewPointDetails();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isCustomizing || !containerRef.current || !imageRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    if (!isMapFixed) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isCustomizing || !containerRef.current || !imageRef.current || isMapFixed)
      return;

    const rect = containerRef.current.getBoundingClientRect();
    const newLeft = (e.clientX - rect.left - dragOffset.x) / rect.width;
    const newTop = (e.clientY - rect.top - dragOffset.y) / rect.height;

    setMapPosition({ x: newLeft, y: newTop });
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleSVGUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || floors.length === 0) return;

    const reader = new FileReader();
    reader.onload = () => {
      const svgContent = reader.result as string;

      setIsCustomizing(true);
      setIsMapFixed(false);
      setMapPosition({ x: 0, y: 0 });
      setFloors((prev) =>
        prev.map((floor, index) =>
          index === currentFloorIndex ? { ...floor, svg: svgContent } : floor
        )
      );
    };
    reader.readAsText(file);
  };

  const handlePointMouseDown = (e: React.MouseEvent, index: number) => {
    if (!isMovingPoints) {
      setSelectedPoint(index);
      return;
    }
    e.stopPropagation();
    setDraggedPoint(index);

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    document.addEventListener('mousemove', handlePointMouseMove);
    document.addEventListener('mouseup', handlePointMouseUp);
  };
 
  const handlePointMouseMove = (e: MouseEvent) => {
    if (draggedPoint === null || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setFloors((prev) =>
      prev.map((floor, index) =>
        index === currentFloorIndex
          ? {
              ...floor,
              points: floor.points.map((point, i) =>
                i === draggedPoint ? { ...point, x, y } : point
              ),
            }
          : floor
      )
    );
  };

  const handlePointMouseUp = () => {
    if (draggedPoint === null) return;

    const updatedPoints = floors[currentFloorIndex].points;
    debouncedSave(floors[currentFloorIndex]._id, updatedPoints);

    setDraggedPoint(null);
    document.removeEventListener('mousemove', handlePointMouseMove);
    document.removeEventListener('mouseup', handlePointMouseUp);
  };

  const deletePoint = (index: number) => {
    const updatedPoints = floors[currentFloorIndex].points.filter((_, i) => i !== index);

    setFloors((prev) =>
      prev.map((floor, i) =>
        i === currentFloorIndex ? { ...floor, points: updatedPoints } : floor
      )
    );

    debouncedSave(floors[currentFloorIndex]._id, updatedPoints);
  };

  const handleManualAddPoint = (pointData: any) => {
    if (!containerRef.current || floors.length === 0) return;

    const x = 0.5;
    const y = 0.5;

    const newPoint = {
      x,
      y,
      ...pointData,
    };

    const updatedPoints = [...floors[currentFloorIndex].points, newPoint];

    setFloors((prev) =>
      prev.map((floor, index) =>
        index === currentFloorIndex ? { ...floor, points: updatedPoints } : floor
      )
    );

    debouncedSave(floors[currentFloorIndex]._id, updatedPoints);
    setShowManualPointForm(false);
  };

  return (
    <div className="min-h-screen w-full relative">
      <MenuSheet
        onAddPoint={() => {
          setIsAddingPoint((prev) => !prev);
          setShowPointModal(true);
        }}
        onToggleDetails={() => setShowAllDetails((prev) => !prev)}
        showDetails={showAllDetails}
        onFileChange={handleSVGUpload}
        onToggleMove={() => setIsMovingPoints((prev) => !prev)}
        isMoving={isMovingPoints}
        onAddFloor={addNewFloor}
        onDeleteFloor={deleteCurrentFloor}
        onManualAddPoint={() => setShowManualPointForm(true)}
      />

      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {floors.length > 0 && (
        <div className="h-screen w-full">
          <NavigationBar
            currentFloor={floors[currentFloorIndex].name}
            onPreviousFloor={() => setCurrentFloorIndex((prev) => Math.max(0, prev - 1))}
            onNextFloor={() => setCurrentFloorIndex((prev) => Math.min(floors.length - 1, prev + 1))}
            hasPreviousFloor={currentFloorIndex > 0}
            hasNextFloor={currentFloorIndex < floors.length - 1}
          />
          <div
            ref={containerRef}
            className="h-full w-full relative"
            onMouseDown={handleMouseDown}
            onDoubleClick={() => setIsMapFixed((prev) => !prev)}
          >
            <div
              ref={imageRef}
              className="h-full w-full"
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
                  floors[currentFloorIndex].svg || ''
                )}")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                transform: `translate(${mapPosition.x * 100}%, ${mapPosition.y * 100}%) scale(${zoomLevel})`,
                cursor: isCustomizing && !isMapFixed ? 'grab' : 'default',
              }}
            />

            <GridOverlay visible={isMovingPoints} />

            {floors[currentFloorIndex].points.map((point, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${point.x * 100}%`,
                  top: `${point.y * 100}%`,
                  cursor: isMovingPoints ? 'grab' : 'pointer',
                  transform: 'translate(-50%, -50%)',
                }}
                className={`transition-opacity duration-200 ${
                  // difuminar los modals
                  selectedPoint !== null && selectedPoint !== index ? 'opacity-40' : 'opacity-100'
                }`}
                onMouseDown={(e) => handlePointMouseDown(e, index)}
                onMouseEnter={() => !isMovingPoints && setSelectedPoint(index)}
                onMouseLeave={() => !isMovingPoints && setSelectedPoint(null)}
              >
                <svg width="16" height="16">
                  <circle 
                    cx="8" 
                    cy="8" 
                    r="6" 
                    fill={point.activo ? '#22c55e' : '#ef4444'} 
                    className="transition-colors duration-200"
                  />
                </svg>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs whitespace-nowrap">
                  {point.etiqueta}
                </div>
                {(showAllDetails || selectedPoint === index) && (
                  <PointDetails
                    point={point}
                    index={index}
                    totalPoints={floors[currentFloorIndex].points.length}
                    containerRef={containerRef}
                    pointRef={null}
                    onDelete={() => deletePoint(index)}
                    onUpdate={updatePoint}
                  />
                )}
              </div>
            ))}
          </div>

          {isCustomizing && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
              <Button
                onClick={() => setZoomLevel((prev) => Math.max(0.5, prev - 0.1))}
                variant="ghost"
              >
                -
              </Button>
              <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
              <Button
                onClick={() => setZoomLevel((prev) => Math.min(2, prev + 0.1))}
                variant="ghost"
              >
                +
              </Button>
              <Button onClick={saveCustomizations}>
                Save Customization
              </Button>
            </div>
          )}
        </div>
      )}

      <PointModal
        isOpen={showPointModal}
        onClose={() => {
          setShowPointModal(false);
          setIsAddingPoint(false);
          resetNewPointDetails();
        }}
        newPointDetails={newPointDetails}
        onDetailsChange={setNewPointDetails}
        switches={switches}
        switchPorts={switchPorts}
        onSwitchChange={handleSwitchChange}
        onConfirm={handleAddPoint}
      />
      {showManualPointForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add Point Manually</h2>
            <ManualPointForm
              onSubmit={handleManualAddPoint}
              onCancel={() => setShowManualPointForm(false)}
            />
          </div>
        </div>
      )}
      <ColorLegend />
    </div>
  );
}

