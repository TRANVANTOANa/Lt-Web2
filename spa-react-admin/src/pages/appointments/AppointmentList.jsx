import React, { useEffect, useMemo, useState } from 'react';
import axiosClient, { crudApi } from '../../api/axiosClient.js';
import { money } from '../../utils/constants.js';
import { mapApiToUi, mapUiToApi } from '../../utils/mappers.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import AppointmentForm from './AppointmentForm.jsx';
import AppointmentDelete from './AppointmentDelete.jsx';

export default function AppointmentList({ config }) {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [lookups, setLookups] = useState({ customers: [], employees: [], rooms: [], services: [], categories: [] });
  const api = useMemo(() => crudApi(config.endpoint), [config.endpoint]);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Tìm kiếm & Lọc
  const filtered = items.filter(x => !keyword || Object.values(x).some(v => String(v ?? '').toLowerCase().includes(keyword.toLowerCase())));

  // Tính toán dữ liệu trang hiện tại
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  // Tạo danh sách các số trang hiển thị (giới hạn 5 nút trang để tránh giao diện bị tràn)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      let start = Math.max(1, activePage - 2);
      let end = Math.min(totalPages, activePage + 2);
      if (start === 1) {
        end = maxVisiblePages;
      } else if (end === totalPages) {
        start = totalPages - maxVisiblePages + 1;
      }
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  async function handleDelete(row) { try { await api.remove(row.id); setItems(items.filter(x => x.id !== row.id)); } catch (e) { alert('Lỗi khi xóa: ' + e.message); } setDeleting(null); }
  async function save(form) { try { const payload = mapUiToApi(config.endpoint, form, lookups); if (form.id) await api.update(form.id, payload); else await api.create(payload); loadData(); } catch (e) { alert('Lỗi lưu dữ liệu: ' + e.message); } setModal(false); }

  return (
    <div>
      <div className="page-header"><div><h1>{config.title}</h1><p>{config.desc}</p></div><button className="btn btn-primary" onClick={() => { setEditing(null); setModal(true); }}>+ Thêm mới</button></div>
      <div className="toolbar"><input value={keyword} onChange={handleKeywordChange} placeholder="Tìm kiếm..." /></div>
      
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              {config.columns.map(c => <th key={c[0]}>{c[1]}</th>)}
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(row => (
              <tr key={row.id}>
                {config.columns.map(c => <td key={c[0]}>{c[2] === 'status' ? <StatusBadge status={row[c[0]]} /> : c[2] === 'money' ? money(row[c[0]]) : row[c[0]]}</td>)}
                <td>
                  <div className="action-group">
                    <button className="btn-mini view" onClick={() => alert(JSON.stringify(row, null, 2))}>Xem</button>
                    <button className="btn-mini edit" onClick={() => { setEditing(row); setModal(true); }}>Sửa</button>
                    <button className="btn-mini delete" onClick={() => setDeleting(row)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Thanh điều khiển phân trang */}
        <div className="pagination-container">
          <div className="pagination-info">
            Hiển thị {filtered.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filtered.length)} trên tổng số {filtered.length} lịch hẹn
          </div>
          
          <div className="pagination-controls">
            <div className="pagination-size">
              <span>Số dòng:</span>
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <button 
              className="pagination-btn" 
              disabled={activePage === 1} 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Trước
            </button>
            
            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                className={`pagination-btn ${activePage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            <button 
              className="pagination-btn" 
              disabled={activePage === totalPages} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {modal && <AppointmentForm fields={config.fields} initial={editing} onClose={() => setModal(false)} onSubmit={save} lookups={lookups} />}
      {deleting && <AppointmentDelete item={deleting} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  );
}
