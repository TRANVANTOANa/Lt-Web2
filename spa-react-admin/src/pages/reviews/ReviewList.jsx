import React, { useEffect, useMemo, useState } from 'react';
import axiosClient, { crudApi } from '../../api/axiosClient.js';
import { money } from '../../utils/constants.js';
import { mapApiToUi, mapUiToApi } from '../../utils/mappers.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import ReviewForm from './ReviewForm.jsx';
import ReviewDelete from './ReviewDelete.jsx';
import ViewDetailModal from '../../components/ViewDetailModal.jsx';

export default function ReviewList({ config }) {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [viewing, setViewing] = useState(null);
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

  async function handleDelete(row) { try { await api.remove(row.id); setItems(items.filter(x => x.id !== row.id)); } catch (e) { alert('Lỗi khi xóa: ' + e.message); } setDeleting(null); }

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  const imageHost = apiBase.replace('/api', '');

  return (
    <div>
      <div className="page-header"><div><h1>{config.title}</h1><p>{config.desc}</p></div></div>
      <div className="toolbar"><input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Tìm kiếm..." /></div>
      <div className="table-card"><table className="data-table"><thead><tr>{config.columns.map(c => <th key={c[0]}>{c[1]}</th>)}<th>Hành động</th></tr></thead><tbody>{filtered.map(row => <tr key={row.id}>{config.columns.map(c => <td key={c[0]}>{c[2] === 'status' ? <StatusBadge status={row[c[0]]} /> : c[2] === 'money' ? money(row[c[0]]) : c[2] === 'image' ? (row[c[0]] ? <img src={row[c[0]].startsWith('http') ? row[c[0]] : `${imageHost}${row[c[0]]}`} alt="Review" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eaeaea' }} /> : <span className="muted" style={{ fontSize: '12px', fontStyle: 'italic' }}>Không có ảnh</span>) : row[c[0]]}</td>)}<td><div className="action-group"><button className="btn-mini view" onClick={() => setViewing(row)}>Xem</button><button className="btn-mini delete" onClick={() => setDeleting(row)}>Xóa</button></div></td></tr>)}</tbody></table></div>
      {deleting && <ReviewDelete item={deleting} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
      {viewing && (
        <ViewDetailModal
          title={`Chi tiết ${config.title.toLowerCase().replace('quản lý ', '')}`}
          row={viewing}
          columns={config.columns}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
