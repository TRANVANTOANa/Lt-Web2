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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!user) return navigate('/login');
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const keyword = user.phone || user.email || user.fullName;
        const customers = keyword ? await customerApi.search(keyword) : [];
        if (!customers || customers.length === 0) {
          setInvoices([]);
          return;
        }
        const invoicePromises = customers.map(c => invoiceApi.getByCustomer(c.id).catch(() => []));
        const results = await Promise.all(invoicePromises);
        const mergedInvoices = results.flat().sort((a, b) => b.id - a.id);
        
        // Remove duplicates if any invoice is fetched twice
        const uniqueInvoices = Array.from(new Map(mergedInvoices.map(item => [item.id, item])).values());
        setInvoices(uniqueInvoices);
      } catch (err) {
        setError(err.message || 'Không tải được hóa đơn.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate]);

  // Pagination calculations
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = invoices.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page">
      <section className="section-head center">
        <span className="eyebrow">Hóa đơn của tôi</span>
        <h1>Theo dõi hóa đơn và thanh toán</h1>
        <p>Trang này gọi API: <b>GET /api/invoices/customer/{'{customerId}'}</b>.</p>
      </section>
      <ErrorBox message={error} />
      <div className="table-card">
        <table>
          <thead>
            <tr><th>Mã</th><th>Ngày tạo</th><th>Khách hàng</th><th>Tổng tiền</th><th>Giảm giá</th><th>Thành tiền</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr><td colSpan="7" className="empty">Chưa có hóa đơn nào.</td></tr>
            ) : (
              currentItems.map((invoice) => (
                <tr key={invoice.id}>
                  <td>#{invoice.id}</td>
                  <td>{dateText(invoice.createdAt)}</td>
                  <td>{invoice.customer?.fullName || 'Khách hàng'}</td>
                  <td>{money(invoice.totalAmount)}</td>
                  <td>{money(invoice.discountAmount)}</td>
                  <td><b>{money(invoice.finalAmount)}</b></td>
                  <td><span className={`badge ${statusClass(invoice.paymentStatus)}`}>{statusText(invoice.paymentStatus)}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="page-btn text-btn" 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              &laquo; Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                className={`page-btn ${currentPage === number ? 'active' : ''}`}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            ))}
            <button 
              className="page-btn text-btn" 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Sau &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
