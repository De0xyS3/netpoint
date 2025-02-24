const queryApi = require('../influxdb');

const SWITCH_IPS = [
  "10.172.0.13", "10.172.0.251", "10.172.0.252", "10.172.0.253", "10.172.0.250", "10.172.0.208",
  "10.172.1.243", "10.172.0.211", "10.172.1.238", "10.172.1.242", "10.172.1.253", "10.172.1.248",
  "10.172.1.249", "10.172.1.252", "10.172.1.240", "10.172.1.241", "10.172.1.239", "10.172.1.216",
  "10.172.1.237", "10.172.1.236", "10.172.1.235", "10.172.1.245", "10.172.0.203", "10.172.0.204",
  "10.172.0.205", "10.172.0.206", "10.172.0.233", "10.172.1.234", "10.172.0.234", "10.172.0.202"
];

const HP_SWITCH_IPS = [
  "10.172.1.243", "10.172.0.208", "10.172.0.211", "10.172.1.238", "10.172.1.242", "10.172.1.253",
  "10.172.1.248", "10.172.1.249", "10.172.1.252", "10.172.1.240", "10.172.1.241", "10.172.1.239",
  "10.172.1.216", "10.172.1.237", "10.172.1.236", "10.172.1.235", "10.172.1.245", "10.172.0.203",
  "10.172.0.204", "10.172.0.205", "10.172.0.206", "10.172.0.233", "10.172.1.234", "10.172.0.234",
  "10.172.0.202"
];

const getSwitchData = async (ip) => {
  const isHPSwitch = HP_SWITCH_IPS.includes(ip);
  const bucket = 'snmp_bucket';
  const measurement = isHPSwitch ? 'hp1920s_status' : 'snmp';

  let query;
  if (isHPSwitch) {
    query = `
      from(bucket: "${bucket}")
        |> range(start: -1h)
        |> filter(fn: (r) => r["_measurement"] == "${measurement}")
        |> filter(fn: (r) => r["agent_host"] == "${ip}")
        |> filter(fn: (r) => r["_field"] =~ /ifOperStatus_hp_|vlan_id_hp_/)
        |> group(columns: ["_field", "port"])
        |> last()
    `;
  } else {
    query = `
      from(bucket: "${bucket}")
        |> range(start: -1h)
        |> filter(fn: (r) => r["_measurement"] == "${measurement}")
        |> filter(fn: (r) => r["agent_host"] == "${ip}")
        |> filter(fn: (r) => r["_field"] =~ /interface_status|vlan_id/)
        |> group(columns: ["_field", "port"])
        |> last()
    `;
  }

  const ports = [];

  return new Promise((resolve, reject) => {
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const data = tableMeta.toObject(row);

        let port, type;
        if (isHPSwitch) {
          const match = data._field.match(/(ifOperStatus|vlan_id)_hp_(\d+)/);
          if (match) {
            type = match[1] === 'ifOperStatus' ? 'status' : 'vlan';
            port = match[2];
          }
        } else {
          port = data._field.match(/\d+/)[0];
          type = data._field.includes('interface_status') ? 'status' : 'vlan';
        }

        if (port) {
          let portData = ports.find((p) => p.port_number === parseInt(port));
          if (!portData) {
            portData = { port_number: parseInt(port), status: null, vlan: null };
            ports.push(portData);
          }

          if (type === 'status') {
            portData.status = data._value === 1;
          } else if (type === 'vlan') {
            portData.vlan = data._value;
          }
        }
      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve({ ip, ports });
      },
    });
  });
};

const getAllSwitchesData = async () => {
  const promises = SWITCH_IPS.map((ip) => getSwitchData(ip));
  return Promise.all(promises);
};

module.exports = { getSwitchData, getAllSwitchesData };
