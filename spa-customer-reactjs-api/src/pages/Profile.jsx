import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { customerApi } from '../api/customerApi';
import ErrorBox from '../components/ErrorBox';
import { useAuth } from '../context/AuthContext';
import { Camera, Key, LogOut } from 'lucide-react';

export default function Profile() {
  const { user, logout, updateLocalUser } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    gender: '',
    birthday: '',
    address: '',
    note: '',
    imageUrl: ''
  });
  
  const [customerId, setCustomerId] = useState(null);
  const [customerType, setCustomerType] = useState('THUONG');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Password change modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirm: '' });
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  // Default avatar portrait placeholder
  const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  useEffect(() => {
    if (!user) return navigate('/login');
    setForm((prev) => ({
      ...prev,
      fullName: user.fullName || '',
      phone: user.phone || '',
      email: user.email || '',
      imageUrl: user.imageUrl || ''
    }));
    
    const keyword = user.phone || user.email || user.fullName;
    if (keyword) {
      customerApi.search(keyword).then((list) => {
        const found = Array.isArray(list) ? list[0] : null;
        if (found) {
          setCustomerId(found.id);
          setCustomerType(found.customerType || 'THUONG');
          setForm({
            fullName: found.fullName || user.fullName || '',
            phone: found.phone || user.phone || '',
            email: found.email || user.email || '',
            gender: found.gender || '',
            birthday: found.birthday || '',
            address: found.address || '',
            note: found.note || '',
            imageUrl: found.imageUrl || user.imageUrl || ''
          });
        }
      }).catch(() => {});
    }
  }, [user, navigate]);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    setError('');
    try {
      const res = await axiosClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const host = apiURL.replace('/api', '');
      const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${host}${fileUrl}`;
      update('imageUrl', fullUrl);
    } catch (err) {
      setError('Tải ảnh lên thất bại: ' + (err.message || err));
    } finally {
      setUploading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (customerId) {
        await customerApi.update(customerId, { ...form, customerType });
      } else {
        const created = await customerApi.create({ ...form, customerType });
        setCustomerId(created.id);
      }
      if (user?.id) {
        const { role, ...payload } = { ...user, ...form };
        const updatedUser = await axiosClient.put(`/users/${user.id}`, payload);
        updateLocalUser({ ...user, ...updatedUser });
      } else {
        updateLocalUser({ ...user, ...form });
      }
      setSuccess('Cập nhật thông tin thành công.');
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại.');
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');
    
    if (!pwdForm.oldPassword || !pwdForm.newPassword || !pwdForm.confirm) {
      return setPwdError('Vui lòng điền đầy đủ thông tin.');
    }
    if (pwdForm.newPassword !== pwdForm.confirm) {
      return setPwdError('Mật khẩu xác nhận không khớp.');
    }
    
    try {
      await axiosClient.put(`/users/${user.id}/change-password`, {
        oldPassword: pwdForm.oldPassword,
        newPassword: pwdForm.newPassword
      });
      setPwdSuccess('Đổi mật khẩu thành công.');
      setPwdForm({ oldPassword: '', newPassword: '', confirm: '' });
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (err) {
      setPwdError(err.message || 'Đổi mật khẩu thất bại.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Convert customerType to Vietnamese user-friendly tier
  const getMembershipTier = (type) => {
    switch (type) {
      case 'VIP': return 'KHÁCH HÀNG V.I.P';
      case 'THAN_THIET': return 'KHÁCH HÀNG THÂN THIẾT';
      default: return 'KHÁCH HÀNG THƯỜNG';
    }
  };

  return (
    <div className="profile-container">
      <section className="section-head center">
        <span className="eyebrow">Hồ sơ cá nhân</span>
        <h1>Hồ sơ cá nhân</h1>
        <p>Quản lý thông tin cá nhân và cài đặt bảo mật để chúng tôi có thể phục vụ bạn tốt nhất.</p>
      </section>

      <ErrorBox message={error} />
      {success && <div className="success-box">{success}</div>}

      <div className="profile-layout">
        {/* Left Column - Avatar & Actions */}
        <div className="profile-sidebar">
          <div className="avatar-wrapper">
            <img src={form.imageUrl || defaultAvatar} className="avatar-img" alt="User Avatar" />
            <label className="avatar-upload-btn">
              <Camera size={18} />
              <input type="file" onChange={handleAvatarChange} style={{ display: 'none' }} accept="image/*" />
            </label>
          </div>
          <h3>{form.fullName || user?.fullName || 'Khách hàng'}</h3>
          <span className="membership-badge">{getMembershipTier(customerType)}</span>
          
          <div className="profile-actions">
            <button className="btn ghost" onClick={() => { setShowPasswordModal(true); setPwdError(''); setPwdSuccess(''); }}>
              <Key size={16} /> Đổi mật khẩu
            </button>
            <button className="btn logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> Đăng xuất
            </button>
          </div>
        </div>

        {/* Right Column - Info form */}
        <div className="profile-form-card">
          <form onSubmit={save}>
            <div className="form-grid">
              <label>Họ và tên
                <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
              </label>
              <label>Số điện thoại
                <input value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </label>
              <label>Email
                <input value={form.email} onChange={(e) => update('email', e.target.value)} />
              </label>
              <label>Giới tính
                <select value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                  <option value="">Chọn</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </label>
              <label>Ngày sinh
                <input type="date" value={form.birthday || ''} onChange={(e) => update('birthday', e.target.value)} />
              </label>
              <label>Địa chỉ
                <input value={form.address} onChange={(e) => update('address', e.target.value)} />
              </label>
            </div>
            <div style={{ marginTop: '18px' }}>
              <label>Ghi chú cá nhân / Sở thích
                <textarea value={form.note} onChange={(e) => update('note', e.target.value)} placeholder="Nhập sở thích, ghi chú sức khỏe, dị ứng..." />
              </label>
            </div>
            <div className="form-submit-row">
              <button className="btn solid big" type="submit">Cập nhật thông tin</button>
            </div>
          </form>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <form className="modal-card" onSubmit={handlePasswordChangeSubmit}>
            <h2>Đổi mật khẩu</h2>
            <p>Nhập mật khẩu cũ và mới của bạn để thay đổi bảo mật.</p>
            <ErrorBox message={pwdError} />
            {pwdSuccess && <div className="success-box" style={{ margin: '0 0 16px' }}>{pwdSuccess}</div>}
            
            <div style={{ display: 'grid', gap: '14px' }}>
              <label>Mật khẩu cũ
                <input type="password" value={pwdForm.oldPassword} onChange={(e) => setPwdForm({ ...pwdForm, oldPassword: e.target.value })} />
              </label>
              <label>Mật khẩu mới
                <input type="password" value={pwdForm.newPassword} onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })} />
              </label>
              <label>Xác nhận mật khẩu mới
                <input type="password" value={pwdForm.confirm} onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })} />
              </label>
            </div>
            
            <div className="modal-actions">
              <button type="button" className="btn ghost" onClick={() => setShowPasswordModal(false)}>Hủy</button>
              <button type="submit" className="btn solid">Xác nhận</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
