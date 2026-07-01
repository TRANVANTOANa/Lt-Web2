import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerApi } from '../api/customerApi';
import { invoiceApi } from '../api/invoiceApi';
import ErrorBox from '../components/ErrorBox';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { dateText, money, statusClass, statusText } from '../utils/format';

export default function MyInvoices() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return navigate('/login');
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const keyword = user.phone || user.email || user.fullName;
        const customers = keyword ? await customerApi.search(keyword) : [];
        const customer = Array.isArray(customers) ? customers[0] : null;
        if (!customer?.id) {
          setInvoices([]);
          return;
        }
        const data = await invoiceApi.getByCustomer(customer.id);
        setInvoices(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Không tải được hóa đơn.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate]);

  const pay = async (id) => {
    try {
      const updated = await invoiceApi.pay(id, 'TIEN_MAT');
      setInvoices((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError(err.message || 'Thanh toán thất bại.');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page">
      <section className="section-head center">
        <span className="eyebrow">Hóa đơn của tôi</span>
        <h1>Theo dõi hóa đơn và thanh toán</h1>
        <p>Trang này gọi API: <b>GET /api/invoices/customer/{'{customerId}'}</b> và <b>POST /api/invoices/{'{id}'}/payment</b>.</p>
      </section>
      <ErrorBox message={error} />
      <div className="table-card">
        <table>
          <thead>
            <tr><th>Mã</th><th>Ngày tạo</th><th>Khách hàng</th><th>Tổng tiền</th><th>Giảm giá</th><th>Thành tiền</th><th>Trạng thái</th><th>Hành động</th></tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? <tr><td colSpan="8" className="empty">Chưa có hóa đơn nào.</td></tr> : invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>#{invoice.id}</td>
                <td>{dateText(invoice.createdAt)}</td>
                <td>{invoice.customer?.fullName || 'Khách hàng'}</td>
                <td>{money(invoice.totalAmount)}</td>
                <td>{money(invoice.discountAmount)}</td>
                <td><b>{money(invoice.finalAmount)}</b></td>
                <td><span className={`badge ${statusClass(invoice.paymentStatus)}`}>{statusText(invoice.paymentStatus)}</span></td>
                <td>{invoice.paymentStatus !== 'DA_THANH_TOAN' && <button className="btn solid small" onClick={() => pay(invoice.id)}>Thanh toán</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
