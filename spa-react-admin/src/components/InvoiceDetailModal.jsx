import React, { useRef } from 'react';
import { money } from '../utils/constants.js';
import StatusBadge from './StatusBadge.jsx';

export default function InvoiceDetailModal({ row, onClose }) {
  const printRef = useRef(null);

  if (!row) return null;

  // Extract appointment details
  const appointment = row.appointment || {};
  const details = appointment.appointmentDetails || [];

  // Fallback items if appointmentDetails is empty
  const items = details.length > 0 ? details : (
    appointment.service ? [
      {
        service: appointment.service,
        price: appointment.price || row.totalAmount,
        duration: appointment.duration || 60
      }
    ] : []
  );

  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'TIEN_MAT': return 'Tiền mặt';
      case 'CHUYEN_KHOAN': return 'Chuyển khoản';
      case 'THE': return 'Thẻ ngân hàng / Visa';
      default: return method || 'Chưa xác định';
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    // Create a new window for printing to isolate receipt layout and styles
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    printWindow.document.write(`
      <html>
        <head>
          <title>In Hóa Đơn #${row.id}</title>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              color: #000;
              background: #fff;
              padding: 20px;
              max-width: 450px;
              margin: 0 auto;
            }
            .text-center { text-align: center; }
            .divider { border-top: 1px dashed #000; margin: 12px 0; }
            .header h1 { font-size: 20px; margin: 0 0 5px; text-transform: uppercase; font-weight: bold; }
            .header p { margin: 2px 0; font-size: 13px; }
            .meta-table, .items-table { width: 100%; border-collapse: collapse; font-size: 13px; }
            .meta-table td { padding: 3px 0; }
            .items-table th { border-bottom: 1px dashed #000; padding: 5px 0; text-align: left; }
            .items-table td { padding: 6px 0; }
            .text-right { text-align: right; }
            .totals { font-size: 14px; margin-top: 10px; }
            .totals-row { display: flex; justify-content: space-between; padding: 4px 0; }
            .grand-total { font-size: 16px; font-weight: bold; border-top: 1px dashed #000; padding-top: 8px; margin-top: 8px; }
            .footer { font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 1100 }}>
      <div className="modal-box" style={{ maxWidth: '520px', width: '95%', padding: '24px' }}>
        
        {/* Printable Area Wrapper */}
        <div ref={printRef} style={{ background: '#fff', color: '#333', padding: '8px' }}>
          
          {/* Header */}
          <div className="text-center" style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: '0 0 4px', color: '#4a333a', fontSize: '22px', fontWeight: '800', fontFamily: 'Playfair Display, Georgia, serif' }}>
              Spa Beauty Management
            </h2>
            <p style={{ margin: '2px 0', fontSize: '13px', color: '#666' }}>123 Đường Sắc Đẹp, Quận 1, TP. HCM</p>
            <p style={{ margin: '2px 0', fontSize: '13px', color: '#666' }}>Hotline: 1900 8888</p>
          </div>

          <div className="divider" style={{ borderTop: '1px dashed #e2d5da', margin: '14px 0' }} />

          {/* Title */}
          <div className="text-center" style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '700', letterSpacing: '0.8px', color: 'var(--primary)' }}>
              HÓA ĐƠN THANH TOÁN
            </h3>
            <span style={{ fontSize: '13px', color: '#888' }}>Mã HD: #HD-{row.id}</span>
          </div>

          {/* Meta Info Grid */}
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', marginBottom: '16px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 0', color: '#777' }}>Khách hàng:</td>
                <td style={{ padding: '4px 0', fontWeight: '700', textAlign: 'right' }}>{row.customerName || 'Vãng lai'}</td>
              </tr>
              {row.employeeName && (
                <tr>
                  <td style={{ padding: '4px 0', color: '#777' }}>Kỹ thuật viên:</td>
                  <td style={{ padding: '4px 0', fontWeight: '600', textAlign: 'right' }}>{row.employeeName}</td>
                </tr>
              )}
              {appointment.room && (
                <tr>
                  <td style={{ padding: '4px 0', color: '#777' }}>Phòng thực hiện:</td>
                  <td style={{ padding: '4px 0', fontWeight: '600', textAlign: 'right' }}>{appointment.room.roomName || appointment.room.name}</td>
                </tr>
              )}
              <tr>
                <td style={{ padding: '4px 0', color: '#777' }}>Thời gian tạo:</td>
                <td style={{ padding: '4px 0', textAlign: 'right' }}>{row.createdAt}</td>
              </tr>
              {row.paymentStatus === 'PAID' && row.paidAt && (
                <tr>
                  <td style={{ padding: '4px 0', color: '#777' }}>Ngày thanh toán:</td>
                  <td style={{ padding: '4px 0', textAlign: 'right' }}>{row.paidAt.substring(0, 16).replace('T', ' ')}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="divider" style={{ borderTop: '1px dashed #e2d5da', margin: '14px 0' }} />

          {/* Service Items Table */}
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', marginBottom: '16px' }}>
            <thead>
              <tr style={{ borderBottom: '1px dashed #ccc' }}>
                <th style={{ textAlign: 'left', paddingBottom: '6px' }}>Dịch vụ</th>
                <th style={{ textAlign: 'center', paddingBottom: '6px' }}>Thời lượng</th>
                <th style={{ textAlign: 'right', paddingBottom: '6px' }}>Giá tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={{ padding: '8px 0', fontWeight: '600' }}>{item.service?.name || 'Dịch vụ Spa'}</td>
                  <td style={{ padding: '8px 0', textAlign: 'center', color: '#666' }}>{item.duration} phút</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: '700', color: 'var(--primary)' }}>
                    {money(item.price)}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: '8px 0', textAlign: 'center', fontStyle: 'italic', color: '#999' }}>
                    Không có dịch vụ đi kèm
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="divider" style={{ borderTop: '1px dashed #e2d5da', margin: '14px 0' }} />

          {/* Totals Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContext: 'space-between', justifyContent: 'space-between' }}>
              <span style={{ color: '#777' }}>Tạm tính:</span>
              <strong style={{ color: '#555' }}>{money(row.totalAmount)}</strong>
            </div>
            
            {row.promotion && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c2185b' }}>
                <span>Khuyến mãi ({row.promotion.code}):</span>
                <span>-{money(row.discountAmount)}</span>
              </div>
            )}
            
            {Number(row.discountAmount) > 0 && !row.promotion && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c2185b' }}>
                <span>Khấu trừ/Giảm giá:</span>
                <span>-{money(row.discountAmount)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '800', borderTop: '1px dashed #ccc', paddingTop: '8px', marginTop: '4px', color: 'var(--primary)' }}>
              <span>Tổng thanh toán:</span>
              <span>{money(row.finalAmount)}</span>
            </div>
          </div>

          <div className="divider" style={{ borderTop: '1px dashed #e2d5da', margin: '14px 0' }} />

          {/* Payment Status Metadata */}
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', marginTop: '8px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 0', color: '#777' }}>Hình thức thanh toán:</td>
                <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: '600' }}>{formatPaymentMethod(row.paymentMethod)}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', color: '#777' }}>Trạng thái:</td>
                <td style={{ padding: '4px 0', display: 'flex', justifyContent: 'flex-end' }}>
                  <StatusBadge status={row.paymentStatus} />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Message Footer */}
          <div className="text-center" style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
            Cảm ơn quý khách và hẹn gặp lại!
          </div>

        </div>

        {/* Modal Controller Actions */}
        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--line)', paddingTop: '16px', marginTop: '16px' }}>
          <button type="button" className="btn btn-light" onClick={onClose}>Đóng</button>
          <button type="button" className="btn btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            🖨️ In hóa đơn
          </button>
        </div>

      </div>
    </div>
  );
}
