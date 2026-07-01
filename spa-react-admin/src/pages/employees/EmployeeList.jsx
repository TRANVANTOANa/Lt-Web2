import React, { useEffect, useMemo, useState } from 'react';
import axiosClient, { crudApi } from '../../api/axiosClient.js';
import { money } from '../../utils/constants.js';
import { mapApiToUi, mapUiToApi } from '../../utils/mappers.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import EmployeeForm from './EmployeeForm.jsx';
import EmployeeDelete from './EmployeeDelete.jsx';

export default function EmployeeList({ config }) {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [lookups, setLookups] = useState({ customers: [], employees: [], rooms: [], services: [], categories: [] });
  const api = useMemo(() => crudApi(config.endpoint), [config.endpoint]);

  const loadLookups = () => {
    const endpoints = ['/customers', '/employees', '/rooms', '/spa-services', '/service-categories'];
    Promise.all(endpoints.map(ep => axiosClient.get(ep).catch(() => [])))
      .then(([cust, emp, rm, svc, cat]) => {
        setLookups({ customers: Array.isArray(cust) ? cust : [], employees: Array.isArray(emp) ? emp : [], rooms: Array.isArray(rm) ? rm : [], services: Array.isArray(svc) ? svc : [], categories: Array.isArray(cat) ? cat : [] });
      });
  };

  const loadData = () => {
    api.getAll()
      .then(data => {
        const rawItems = Array.isArray(data) ? data : (data?.content || data?.data || config.mock);
        setItems(rawItems.map(item => mapApiToUi(config.endpoint, item)));
      })
      .catch(() => setItems(config.mock.map(item => mapApiToUi(config.endpoint, item))));
  };

  useEffect(() => { loadData(); loadLookups(); }, [config.endpoint]);

  const filtered = items.filter(x => !keyword || Object.values(x).some(v => String(v ?? '').toLowerCase().includes(keyword.toLowerCase())));

  async function handleDelete(row) {
    try { await api.remove(row.id); setItems(items.filter(x => x.id !== row.id)); } catch (e) { alert('Lỗi khi xóa: ' + e.message); }
    setDeleting(null);
  }

  async function save(form) {
    try {
      const payload = mapUiToApi(config.endpoint, form, lookups);
      if (form.id) await api.update(form.id, payload); else await api.create(payload);
      loadData();
    } catch (e) { alert('Lỗi lưu dữ liệu: ' + e.message); }
    setModal(false);
  }

  return (
    <div>
      <div className="page-header"><div><h1>{config.title}</h1><p>{config.desc}</p></div><button className="btn btn-primary" onClick={() => { setEditing(null); setModal(true); }}>+ Thêm mới</button></div>
      <div className="toolbar"><input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Tìm kiếm..." /></div>
      <div className="table-card"><table className="data-table"><thead><tr>{config.columns.map(c => <th key={c[0]}>{c[1]}</th>)}<th>Hành động</th></tr></thead><tbody>{filtered.map(row => <tr key={row.id}>{config.columns.map(c => <td key={c[0]}>{c[2] === 'status' ? <StatusBadge status={row[c[0]]} /> : c[2] === 'money' ? money(row[c[0]]) : row[c[0]]}</td>)}<td><div className="action-group"><button className="btn-mini view" onClick={() => alert(JSON.stringify(row, null, 2))}>Xem</button><button className="btn-mini edit" onClick={() => { setEditing(row); setModal(true); }}>Sửa</button><button className="btn-mini delete" onClick={() => setDeleting(row)}>Xóa</button></div></td></tr>)}</tbody></table></div>
      {modal && <EmployeeForm fields={config.fields} initial={editing} onClose={() => setModal(false)} onSubmit={save} lookups={lookups} />}
      {deleting && <EmployeeDelete item={deleting} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  );
}
