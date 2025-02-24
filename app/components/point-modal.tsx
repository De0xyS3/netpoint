import { Switch, SwitchPort, NewPointDetails } from '../types/floor-management';
import { Button } from './ui/buttons';

interface PointModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPointDetails: NewPointDetails;
  onDetailsChange: (details: NewPointDetails) => void;
  switches: Switch[];
  switchPorts: SwitchPort[];
  onSwitchChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onConfirm: (e: React.MouseEvent) => void;
}

export function PointModal({
  isOpen,
  onClose,
  newPointDetails,
  onDetailsChange,
  switches,
  switchPorts,
  onSwitchChange,
  onConfirm,
}: PointModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg w-64">
        <h2 className="text-lg font-bold mb-4">Add New Point</h2>
        <div className="space-y-2">
          <div>
            <label className="block font-bold text-sm">Label:</label>
            <input
              type="text"
              className="border p-1 w-full rounded"
              value={newPointDetails.etiqueta}
              onChange={(e) => onDetailsChange({ ...newPointDetails, etiqueta: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-bold text-sm">User:</label>
            <input
              type="text"
              className="border p-1 w-full rounded"
              value={newPointDetails.usuario}
              onChange={(e) => onDetailsChange({ ...newPointDetails, usuario: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-bold text-sm">Project:</label>
            <input
              type="text"
              className="border p-1 w-full rounded"
              value={newPointDetails.proyecto}
              onChange={(e) => onDetailsChange({ ...newPointDetails, proyecto: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-bold text-sm">Switch:</label>
            <select
              className="border p-1 w-full rounded"
              value={newPointDetails.switchIP}
              onChange={onSwitchChange}
            >
              <option value="">Select Switch</option>
              {switches.map((s) => (
                <option key={s.ip} value={s.ip}>{s.name} ({s.ip})</option>
              ))}
            </select>
          </div>
          {newPointDetails.switchIP && (
            <div>
              <label className="block font-bold text-sm">Port:</label>
              <select
                className="border p-1 w-full rounded"
                value={newPointDetails.port}
                onChange={(e) => onDetailsChange({ ...newPointDetails, port: e.target.value })}
              >
                <option value="">Select Port</option>
                {switchPorts.map((port) => (
                  <option key={port.port_number} value={port.port_number}>
                    Port {port.port_number} - VLAN {port.vlan} - {port.status ? 'Active' : 'Inactive'}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="ml-2"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

