import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className="page narrow">
      <section className="section-head center">
        <span className="eyebrow">Liên hệ</span>
        <h1>Spa Beauty luôn sẵn sàng tư vấn cho bạn</h1>
      </section>
      <div className="contact-grid">
        <div className="contact-item"><MapPin /><h3>Địa chỉ</h3><p>12 Nguyễn Văn Bảo, Gò Vấp, TP.HCM</p></div>
        <div className="contact-item"><Phone /><h3>Hotline</h3><p>0909 000 999</p></div>
        <div className="contact-item"><Mail /><h3>Email</h3><p>spabeauty@example.com</p></div>
      </div>
      <form className="booking-form">
        <div className="form-grid">
          <label>Họ tên<input placeholder="Tên của bạn" /></label>
          <label>Số điện thoại<input placeholder="0909..." /></label>
          <label>Email<input placeholder="email@gmail.com" /></label>
        </div>
        <label>Nội dung<textarea placeholder="Bạn cần tư vấn dịch vụ nào?" /></label>
        <button type="button" className="btn solid big full">Gửi liên hệ</button>
      </form>
    </div>
  );
}
