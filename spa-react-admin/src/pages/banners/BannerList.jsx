import React, { useEffect, useMemo, useState } from 'react';
import axiosClient from '../../api/axiosClient.js';
import { money } from '../../utils/constants.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import BannerForm from './BannerForm.jsx';
import BannerDelete from './BannerDelete.jsx';

export default function BannerList({ config }) {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const loadData = () => {
    setLoading(true);
    axiosClient.get(config.endpoint)
      .then(data => {
        const raw = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.data)
          ? data.data
          : null;
        setItems(raw ?? config.mock ?? []);
      })
      .catch(() => {
        setItems(config.mock ?? []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [config.endpoint]);

  const filtered = items.filter(x =>
    !keyword ||
    Object.values(x).some(v => String(v ?? '').toLowerCase().includes(keyword.toLowerCase()))
  );

  async function handleDelete(row) {
    try {
      await axiosClient.delete(`${config.endpoint}/${row.id}`);
      setItems(prev => prev.filter(x => x.id !== row.id));
    } catch (e) {
      alert('Lỗi khi xóa: ' + e.message);
    }
    setDeleting(null);
  }

  async function save(form) {
    try {
      if (form.id) {
        await axiosClient.put(`${config.endpoint}/${form.id}`, form);
      } else {
        await axiosClient.post(config.endpoint, form);
      }
      loadData();
    } catch (e) {
      alert('Lỗi lưu dữ liệu: ' + e.message);
    }
    setModal(false);
  }

  async function changeStatus(row, newStatus) {
    try {
      await axiosClient.put(`${config.endpoint}/${row.id}`, { ...row, status: newStatus });
      loadData();
    } catch (e) {
      alert('Lỗi cập nhật trạng thái: ' + e.message);
    }
  }

  const imageHost = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace('/api', '');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{config.title}</h1>
          <p>{config.desc}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setModal(true); }}>
          + Thêm mới
        </button>
      </div>

      <div className="toolbar">
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Tìm kiếm banner..."
        />
      </div>

      <div className="table-card">
        {loading ? (
          <p style={{ textAlign: 'center', padding: 32, color: '#aaa' }}>Đang tải dữ liệu...</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 32, color: '#aaa' }}>Chưa có banner nào.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Ảnh</th>
                <th>Tiêu đề</th>
                <th>Tiêu đề phụ</th>
                <th>Liên kết</th>
                <th>Thứ tự</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>
                    {row.imageUrl ? (
                      <img
                        src={row.imageUrl.startsWith('http') ? row.imageUrl : `${imageHost}${row.imageUrl}`}
                        alt={row.title}
                        style={{ width: 120, height: 64, objectFit: 'cover', borderRadius: 8, display: 'block' }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <span style={{ color: '#ccc', fontSize: 12 }}>Không có ảnh</span>
                    )}
                  </td>
                  <td style={{ maxWidth: 220, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{row.title}</td>
                  <td>{row.subtitle}</td>
                  <td>{row.linkUrl}</td>
                  <td style={{ textAlign: 'center' }}>{row.orderNo}</td>
                  <td>
                    <select
                      value={row.status}
                      onChange={(e) => changeStatus(row, e.target.value)}
                      className={`status-badge ${String(row.status || '').toLowerCase().replaceAll('_', '-')}`}
                    >
                      <option value="ACTIVE">Hoạt động</option>
                      <option value="INACTIVE">Tạm tắt</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-group">
                      <button className="btn-mini edit" onClick={() => { setEditing(row); setModal(true); }}>Sửa</button>
                      <button className="btn-mini delete" onClick={() => setDeleting(row)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <BannerForm
          fields={config.fields}
          initial={editing}
          onClose={() => setModal(false)}
          onSubmit={save}
        />
      )}
      {deleting && (
        <BannerDelete
          item={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
