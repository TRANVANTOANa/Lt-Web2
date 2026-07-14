import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient.js';
import { money } from '../../utils/constants.js';
import StatusBadge from '../../components/StatusBadge.jsx';

const fieldLabels = {
  code: 'Mã KM', name: 'Tên chương trình', discountType: 'Loại giảm',
  discountValue: 'Giá trị giảm', startDate: 'Ngày bắt đầu', endDate: 'Ngày kết thúc', status: 'Trạng thái'
};

function PromotionFormModal({ initial, onClose, onSubmit, services }) {
  const [form, setForm] = useState(initial ? {
    ...initial,
    serviceIds: (initial.applicableServices || []).map(s => s.id)
  } : {
    code: '', name: '', discountType: 'PERCENT', discountValue: '',
    startDate: '', endDate: '', status: 'ACTIVE', serviceIds: []
  });

  const toggle = (id) => {
    setForm(f => ({
      ...f,
      serviceIds: f.serviceIds.includes(id)
        ? f.serviceIds.filter(x => x !== id)
        : [...f.serviceIds, id]
    }));
  };

  return (
    <div className="modal-backdrop">
      <form className="modal-box" style={{ maxWidth: 600 }} onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
        <div className="modal-header">
          <h2>{initial ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi mới'}</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>
        <div className="form-grid">
          <label><span>{fieldLabels.code}</span>
            <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required />
          </label>
          <label><span>{fieldLabels.name}</span>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label><span>{fieldLabels.discountType}</span>
            <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}>
              <option value="PERCENT">Phần trăm (%)</option>
              <option value="AMOUNT">Số tiền (VNĐ)</option>
            </select>
          </label>
          <label><span>{fieldLabels.discountValue}</span>
            <input type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} required />
          </label>
          <label><span>{fieldLabels.startDate}</span>
            <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required />
          </label>
          <label><span>{fieldLabels.endDate}</span>
            <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required />
          </label>
          <label><span>{fieldLabels.status}</span>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Tạm tắt</option>
            </select>
          </label>
        </div>

        {/* Multi-select dịch vụ */}
        <div style={{ marginTop: 20 }}>
          <p style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: 10, fontSize: 14 }}>
            🎯 Dịch vụ áp dụng ({form.serviceIds.length} đã chọn)
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
            maxHeight: 240, overflowY: 'auto', padding: 4
          }}>
            {services.map(svc => (
              <label key={svc.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', borderRadius: 10,
                border: `1.5px solid ${form.serviceIds.includes(svc.id) ? 'var(--primary)' : 'var(--line)'}`,
                background: form.serviceIds.includes(svc.id) ? 'var(--pink)' : 'var(--card)',
                cursor: 'pointer', fontSize: 13, transition: 'all 0.2s'
              }}>
                <input
                  type="checkbox"
                  checked={form.serviceIds.includes(svc.id)}
                  onChange={() => toggle(svc.id)}
                  style={{ accentColor: 'var(--primary)', width: 15, height: 15 }}
                />
                <span style={{ flex: 1, fontWeight: form.serviceIds.includes(svc.id) ? 700 : 400 }}>
                  {svc.name}
                </span>
                <span style={{ color: 'var(--primary-2)', fontSize: 11, fontWeight: 700 }}>
                  {money(svc.price)}
                </span>
              </label>
            ))}
          </div>
          {services.length === 0 && (
            <p style={{ color: '#aaa', fontSize: 13 }}>Không tải được danh sách dịch vụ.</p>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-light" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary">Lưu</button>
        </div>
      </form>
    </div>
  );
}

function DeleteModal({ item, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-box" style={{ maxWidth: 440, textAlign: 'center' }}>
        <div className="modal-header"><h2>Xác nhận xóa</h2><button onClick={onCancel}>×</button></div>
        <p style={{ margin: '18px 0', color: '#6b5c70' }}>
          Xóa khuyến mãi <b>{item.name}</b> ({item.code})?
        </p>
        <div className="modal-actions" style={{ justifyContent: 'center' }}>
          <button className="btn btn-light" onClick={onCancel}>Hủy</button>
          <button className="btn btn-primary" style={{ background: '#d93025' }} onClick={() => onConfirm(item)}>Xóa</button>
        </div>
      </div>
    </div>
  );
}

export default function PromotionList({ config }) {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [services, setServices] = useState([]);

  const loadData = () => {
    setLoading(true);
    axiosClient.get('/promotions')
      .then(data => setItems(Array.isArray(data) ? data : data?.content || config.mock || []))
      .catch(() => setItems(config.mock || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    axiosClient.get('/spa-services')
      .then(data => setServices(Array.isArray(data) ? data : data?.content || []))
      .catch(() => setServices([]));
  }, []);

  const filtered = items.filter(x =>
    !keyword || [x.code, x.name, x.status].some(v => String(v ?? '').toLowerCase().includes(keyword.toLowerCase()))
  );

  async function handleDelete(row) {
    try { await axiosClient.delete(`/promotions/${row.id}`); setItems(items.filter(x => x.id !== row.id)); }
    catch (e) { alert('Lỗi xóa: ' + e.message); }
    setDeleting(null);
  }

  async function save(form) {
    const { serviceIds, ...rest } = form;
    const payload = { ...rest, discountValue: Number(rest.discountValue) };
    try {
      let saved;
      if (form.id) {
        saved = await axiosClient.put(`/promotions/${form.id}`, payload);
      } else {
        saved = await axiosClient.post('/promotions', payload);
      }
      // Gán danh sách dịch vụ
      if (serviceIds && serviceIds.length > 0) {
        await axiosClient.put(`/promotions/${saved.id}/services`, serviceIds);
      } else if (saved.id) {
        await axiosClient.put(`/promotions/${saved.id}/services`, []);
      }
      loadData();
    } catch (e) { alert('Lỗi lưu: ' + e.message); }
    setModal(false);
  }

  const getServiceNames = (promo) => {
    const svcs = promo.applicableServices || [];
    if (!svcs.length) return <span style={{ color: '#ccc', fontSize: 12 }}>Tất cả</span>;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {svcs.map(s => (
          <span key={s.id} style={{
            background: 'var(--pink)', color: 'var(--primary)', borderRadius: 999,
            padding: '2px 8px', fontSize: 11, fontWeight: 700
          }}>{s.name}</span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>{config.title}</h1><p>{config.desc}</p></div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setModal(true); }}>+ Thêm mới</button>
      </div>
      <div className="toolbar">
        <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Tìm kiếm mã, tên, trạng thái..." />
      </div>
      <div className="table-card">
        {loading ? (
          <p style={{ textAlign: 'center', padding: 32, color: '#aaa' }}>Đang tải...</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 32, color: '#aaa' }}>Chưa có khuyến mãi nào.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th><th>Mã KM</th><th>Tên chương trình</th>
                <th>Loại giảm</th><th>Giá trị</th>
                <th>Bắt đầu</th><th>Kết thúc</th>
                <th>Dịch vụ áp dụng</th>
                <th>Trạng thái</th><th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td><b>{row.code}</b></td>
                  <td>{row.name}</td>
                  <td>{row.discountType === 'PERCENT' ? 'Phần trăm' : 'Số tiền'}</td>
                  <td>{row.discountType === 'PERCENT' ? `${row.discountValue}%` : money(row.discountValue)}</td>
                  <td>{row.startDate}</td>
                  <td>{row.endDate}</td>
                  <td style={{ maxWidth: 220 }}>{getServiceNames(row)}</td>
                  <td><StatusBadge status={row.status} /></td>
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
      {modal && <PromotionFormModal initial={editing} onClose={() => setModal(false)} onSubmit={save} services={services} />}
      {deleting && <DeleteModal item={deleting} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  );
}
