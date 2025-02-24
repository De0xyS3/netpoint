import { useState, useRef } from 'react';
import { Point, NewPointDetails, Switch, SwitchPort } from '../types/floor-management';
import { switchService } from '../services/api';

export function usePointManagement() {
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [showPointModal, setShowPointModal] = useState(false);
  const [isMovingPoints, setIsMovingPoints] = useState(false);
  const [draggedPoint, setDraggedPoint] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [switches, setSwitches] = useState<Switch[]>([]);
  const [selectedSwitch, setSelectedSwitch] = useState<string | null>(null);
  const [switchPorts, setSwitchPorts] = useState<SwitchPort[]>([]);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [newPointDetails, setNewPointDetails] = useState<NewPointDetails>({
    etiqueta: '',
    usuario: 'admin',
    proyecto: '',
    switchIP: '',
    port: '',
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const fetchSwitches = async () => {
    try {
      const data = await switchService.getSwitches();
      setSwitches(data);
    } catch (error) {
      console.error('Error loading switches:', error);
    }
  };

  const fetchSwitchPorts = async (switchIP: string) => {
    try {
      const data = await switchService.getSwitchPorts(switchIP);
      setSwitchPorts(data.ports);
    } catch (error) {
      console.error('Error fetching switch ports:', error);
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const switchIP = e.target.value;
    setNewPointDetails(prev => ({ ...prev, switchIP }));
    setSelectedSwitch(switchIP);
    if (switchIP) {
      fetchSwitchPorts(switchIP);
    }
  };

  const resetNewPointDetails = () => {
    setNewPointDetails({
      etiqueta: '',
      usuario: 'admin',
      proyecto: '',
      switchIP: '',
      port: '',
    });
  };

  return {
    isAddingPoint,
    showPointModal,
    isMovingPoints,
    draggedPoint,
    dragOffset,
    selectedPoint,
    switches,
    selectedSwitch,
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
    setSwitches,
    setSelectedSwitch,
    setSwitchPorts,
    setShowAllDetails,
    setNewPointDetails,
    fetchSwitches,
    fetchSwitchPorts,
    handleSwitchChange,
    resetNewPointDetails,
  };
}

