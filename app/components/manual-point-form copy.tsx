import { useState } from 'react';
import { Button } from "./ui/buttons";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface ManualPointFormProps {
  onSubmit: (pointData: any) => void;
  onCancel: () => void;
}

export function ManualPointForm({ onSubmit, onCancel }: ManualPointFormProps) {
  const [pointData, setPointData] = useState({
    etiqueta: '',
    usuario: '',
    proyecto: '',
    switchIP: '',
    port: '',
    vlan: '',
    activo: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPointData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(pointData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="etiqueta">Label</Label>
        <Input id="etiqueta" name="etiqueta" value={pointData.etiqueta} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="usuario">User</Label>
        <Input id="usuario" name="usuario" value={pointData.usuario} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="proyecto">Project</Label>
        <Input id="proyecto" name="proyecto" value={pointData.proyecto} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="switchIP">Switch IP</Label>
        <Input id="switchIP" name="switchIP" value={pointData.switchIP} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="port">Port</Label>
        <Input id="port" name="port" value={pointData.port} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="vlan">VLAN</Label>
        <Input id="vlan" name="vlan" value={pointData.vlan} onChange={handleChange} required />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="activo"
          name="activo"
          checked={pointData.activo}
          onCheckedChange={(checked) => setPointData(prev => ({ ...prev, activo: checked }))}
        />
        <Label htmlFor="activo">Active</Label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Add Point</Button>
      </div>
    </form>
  );
}

