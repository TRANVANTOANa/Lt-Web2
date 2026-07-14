import React, { useEffect, useMemo, useState } from 'react';
import axiosClient, { crudApi } from '../../api/axiosClient.js';
import { money } from '../../utils/constants.js';
import { mapApiToUi, mapUiToApi } from '../../utils/mappers.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import CustomerForm from './CustomerForm.jsx';
import CustomerDelete from './CustomerDelete.jsx';
import ViewDetailModal from '../../components/ViewDetailModal.jsx';

export default function CustomerList({ config }) {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all');
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
        setLookups({
          customers: Array.isArray(cust) ? cust : [],
          employees: Array.isArray(emp) ? emp : [],
          rooms: Array.isArray(rm) ? rm : [],
          services: Array.isArray(svc) ? svc : [],
          categories: Array.isArray(cat) ? cat : []
        });
      });
  };

  const loadData = () => {
    api.getAll()
      .then(data => {
        const rawItems = Array.isArray(data) ? data : (data?.content || data?.data || config.mock);
        setItems(rawItems.map(item => mapApiToUi(config.endpoint, item)));
      })
      .catch(() => {
        setItems(config.mock.map(item => mapApiToUi(config.endpoint, item)));
      });
  };

  useEffect(() => {
    loadData();
    loadLookups();
  }, [config.endpoint]);

  const filtered = items.filter(x => {
    const matchesKeyword = !keyword || Object.values(x).some(v => String(v ?? '').toLowerCase().includes(keyword.toLowerCase()));
    const matchesType = customerTypeFilter === 'all' || x.customerType === customerTypeFilter;
    return matchesKeyword && matchesType;
  });

  function openCreate() { setEditing(null); setModal(true); }
  function openEdit(row) { setEditing(row); setModal(true); }
  function openDelete(row) { setDeleting(row); }

  async function handleDelete(row) {
    try {
      await api.remove(row.id);
      setItems(items.filter(x => x.id !== row.id));
    } catch (e) {
      alert('Lỗi khi xóa: ' + e.message);
    }
    setDeleting(null);
  }

  async function save(form) {
    try {
      const payload = mapUiToApi(config.endpoint, form, lookups);
      if (form.id) {
        await api.update(form.id, payload);
      } else {
        await api.create(payload);
      }
      loadData();
    } catch (e) {
      alert('Lỗi lưu dữ liệu: ' + e.message);
    }
    setModal(false);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{config.title}</h1>
          <p>{config.desc}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Thêm mới</button>
      </div>
      <div className="toolbar" style={{ display: 'flex', gap: '12px' }}>
        <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Tìm kiếm..." />
        
        <select 
          value={customerTypeFilter} 
          onChange={e => setCustomerTypeFilter(e.target.value)}
          style={{
            height: '42px',
            border: '1px solid var(--line)',
            borderRadius: '14px',
            padding: '0 14px',
            outline: 'none',
            background: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
            color: '#6d5d74'
          }}
        >
          <option value="all">Loại khách hàng (Tất cả)</option>
          <option value="VIP">VIP</option>
          <option value="THAN_THIET">Thân thiết</option>
          <option value="THUONG">Thường (THUONG)</option>
        </select>
      </div>
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              {config.columns.map(c => <th key={c[0]}>{c[1]}</th>)}
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id}>
                {config.columns.map(c => (
                  <td key={c[0]}>
                    {c[2] === 'status' ? <StatusBadge status={row[c[0]]} /> : c[2] === 'money' ? money(row[c[0]]) : row[c[0]]}
                  </td>
                ))}
                <td>
                  <div className="action-group">
                    <button className="btn-mini view" onClick={() => setViewing(row)}>Xem</button>
                    <button className="btn-mini edit" onClick={() => openEdit(row)}>Sửa</button>
                    <button className="btn-mini delete" onClick={() => openDelete(row)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && <CustomerForm fields={config.fields} initial={editing} onClose={() => setModal(false)} onSubmit={save} lookups={lookups} />}
      {deleting && <CustomerDelete item={deleting} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
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
