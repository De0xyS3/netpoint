export interface Point {
    _id?: string;
    x: number;
    y: number;
    etiqueta: string;
    usuario: string;
    proyecto: string;
    switchIP: string;
    port: string | number;
    vlan?: string;
    activo?: boolean;
  }
  
  export interface Floor {
    _id: string;
    name: string;
    svg: string;
    points: Point[];
  }
  
  export interface Switch {
    ip: string;
    name: string;
    ports: SwitchPort[];
  }
  
  export interface SwitchPort {
    port_number: number;
    status: boolean;
    vlan?: string;
  }
  
  export interface MapPosition {
    x: number;
    y: number;
  }
  
  export interface NewPointDetails {
    etiqueta: string;
    usuario: string;
    proyecto: string;
    switchIP: string;
    port: string;
  }
  
  