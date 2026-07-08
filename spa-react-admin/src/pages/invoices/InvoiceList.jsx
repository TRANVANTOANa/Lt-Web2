import React, { useEffect, useMemo, useState } from 'react';
import axiosClient, { crudApi } from '../../api/axiosClient.js';
import { money } from '../../utils/constants.js';
import { mapApiToUi, mapUiToApi } from '../../utils/mappers.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import InvoiceForm from './InvoiceForm.jsx';
import InvoiceDelete from './InvoiceDelete.jsx';

export default function InvoiceList({ config }) {
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

  async function handlePayment(row) {
    try {
      const method = prompt("Nhập phương thức thanh toán (TIEN_MAT, CHUYEN_KHOAN, THE):", "TIEN_MAT");
      if (!method) return;
      await axiosClient.put(`/invoices/${row.id}/payment`, { paymentMethod: method });
      alert("Thanh toán hóa đơn thành công!");
      loadData();
    } catch (e) {
      alert("Lỗi thanh toán: " + e.message);
    }
  }

  return (
    <div>
      <div className="page-header"><div><h1>{config.title}</h1><p>{config.desc}</p></div></div>
      <div className="toolbar"><input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Tìm kiếm..." /></div>
      <div className="table-card"><table className="data-table"><thead><tr>{config.columns.map(c => <th key={c[0]}>{c[1]}</th>)}<th>Hành động</th></tr></thead><tbody>{filtered.map(row => <tr key={row.id}>{config.columns.map(c => <td key={c[0]}>{c[2] === 'status' ? <StatusBadge status={row[c[0]]} /> : c[2] === 'money' ? money(row[c[0]]) : row[c[0]]}</td>)}<td><div className="action-group"><button className="btn-mini view" onClick={() => alert(JSON.stringify(row, null, 2))}>Xem</button>{row.paymentStatus === 'PENDING' && <button className="btn-mini edit" onClick={() => handlePayment(row)}>Thanh toán</button>}</div></td></tr>)}</tbody></table></div>
    </div>
  );
}
