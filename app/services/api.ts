import { Floor, Point, Switch } from '../types/floor-management';

// Usar la URL base desde las variables de entorno
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://10.172.0.93:5000/api';



export const floorService = {
  async getFloors(): Promise<Floor[]> {
    const res = await fetch(`${API_BASE_URL}/floors`);
    if (!res.ok) throw new Error('Failed to fetch floors');
    return res.json();
  },

  async updateFloorPoints(floorId: string, points: Point[]): Promise<Floor> {
    const res = await fetch(`${API_BASE_URL}/floors/${floorId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points }),
    });
    if (!res.ok) throw new Error('Failed to update floor points');
    return res.json();
  },

  async updateFloorSVG(floorId: string, svg: string, mapPosition: { x: number; y: number }): Promise<Floor> {
    const res = await fetch(`${API_BASE_URL}/floors/${floorId}/svg`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ svg, mapPosition }),
    });
    if (!res.ok) throw new Error('Failed to update floor SVG');
    return res.json();
  },

  async addFloor(name: string): Promise<Floor> {
    const res = await fetch(`${API_BASE_URL}/floors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, svg: '', points: [] }),
    });
    if (!res.ok) throw new Error('Failed to add floor');
    return res.json();
  },

  async deleteFloor(floorId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/floors/${floorId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete floor');
  },
};

export const switchService = {
  async getSwitches(): Promise<Switch[]> {
    const res = await fetch(`${API_BASE_URL}/switches`);
    if (!res.ok) throw new Error('Failed to fetch switches');
    return res.json();
  },

  async getSwitchPorts(switchIP: string) {
    const res = await fetch(`${API_BASE_URL}/switches/live/${switchIP}`);
    if (!res.ok) throw new Error('Failed to fetch switch ports');
    return res.json();
  },

  async updatePointStatus(switchIP: string, port: number, floorId: string, pointId: string) {
    const switchData = await this.getSwitchPorts(switchIP);
    const portData = switchData.ports.find((p: any) => p.port_number === port);
    
    if (portData) {
      const updatedPoint = {
        activo: portData.status,
        vlan: portData.vlan?.toString() || 'N/A',
      };

      const res = await fetch(`${API_BASE_URL}/floors/${floorId}/points/${pointId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPoint),
      });

      if (!res.ok) throw new Error('Failed to update point status');
      return res.json();
    }
  },
};
