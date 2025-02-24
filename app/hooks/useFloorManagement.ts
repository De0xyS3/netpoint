import { useState, useCallback } from 'react';
import { Floor, Point, MapPosition } from '../types/floor-management';
import { floorService } from '../services/api';
import debounce from 'lodash/debounce';

export function useFloorManagement() {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mapPosition, setMapPosition] = useState<MapPosition>({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isMapFixed, setIsMapFixed] = useState(false);

  const fetchFloors = async () => {
    try {
      const data = await floorService.getFloors();
      setFloors(data);
      setError(null);
    } catch (error) {
      console.error('Error loading floors:', error);
      setError('Failed to load floors');
    }
  };

  const debouncedSave = useCallback(
    debounce(async (floorId: string, points: Point[]) => {
      try {
        await floorService.updateFloorPoints(floorId, points);
        setError(null);
      } catch (error) {
        console.error('Error saving point positions:', error);
        setError('Failed to save point positions');
      }
    }, 500),
    []
  );

  const addNewFloor = async () => {
    try {
      const addedFloor = await floorService.addFloor(`Floor ${floors.length + 1}`);
      setFloors(prev => [...prev, addedFloor]);
      setCurrentFloorIndex(floors.length);
      setError(null);
    } catch (error) {
      console.error('Error adding floor:', error);
      setError('Failed to add new floor');
    }
  };

  const deleteCurrentFloor = async () => {
    const floorId = floors[currentFloorIndex]?._id;
    if (!floorId) {
      setError('Cannot delete floor. Invalid floor ID.');
      return;
    }

    try {
      await floorService.deleteFloor(floorId);
      const updatedFloors = floors.filter((_, index) => index !== currentFloorIndex);
      setFloors(updatedFloors);
      setCurrentFloorIndex(prev => Math.max(0, prev - 1));
      setError(null);
    } catch (error) {
      console.error('Error deleting floor:', error);
      setError('Failed to delete floor');
    }
  };

  const saveCustomizations = async () => {
    if (!floors[currentFloorIndex]) return;

    try {
      await floorService.updateFloorSVG(
        floors[currentFloorIndex]._id,
        floors[currentFloorIndex].svg,
        mapPosition
      );
      setIsCustomizing(false);
      setIsMapFixed(true);
      setError(null);
    } catch (error) {
      console.error('Error saving customization:', error);
      setError('Failed to save customization');
    }
  };

  const updatePoint = useCallback((floorId: string, pointId: string, updatedData: Partial<Point>) => {
    setFloors(prevFloors => prevFloors.map(floor => {
      if (floor._id === floorId) {
        return {
          ...floor,
          points: floor.points.map(point =>
            point._id === pointId ? { ...point, ...updatedData } : point
          )
        };
      }
      return floor;
    }));
  }, []);

  return {
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
    updatePoint,
  };
}

