// Map backend entities to flat frontend models for visual display
export const mapApiToUi = (endpoint, item) => {
  if (!item) return item;
  switch (endpoint) {
    case '/customers':
      return {
        ...item,
        status: item.status || 'ACTIVE'
      };
    case '/employees':
      return {
        ...item,
        status: item.status === 'DANG_LAM' ? 'WORKING' : (item.status === 'NGHI_VIEC' ? 'INACTIVE' : item.status)
      };
    case '/spa-services':
      return {
        ...item,
        categoryName: item.category?.name || item.categoryName || ''
      };
    case '/appointments':
      return {
        ...item,
        customerName: item.customer?.fullName || item.customerName || '',
        employeeName: item.employee?.fullName || item.employeeName || '',
        roomName: item.room?.roomName || item.room?.name || item.roomName || '',
        serviceName: item.appointmentDetails?.[0]?.service?.name || item.serviceName || '',
        startTime: item.appointmentTime ? item.appointmentTime.substring(0, 5) : item.startTime || '',
        status: item.status === 'DANG_CHO' ? 'PENDING' : 
                item.status === 'DA_XAC_NHAN' ? 'CONFIRMED' :
                item.status === 'DANG_THUC_HIEN' ? 'IN_PROGRESS' :
                item.status === 'HOAN_THANH' ? 'COMPLETED' :
                item.status === 'DA_HUY' ? 'CANCELLED' : item.status
      };
    case '/invoices':
      return {
        ...item,
        customerName: item.customer?.fullName || item.customerName || '',
        createdAt: item.createdAt ? item.createdAt.substring(0, 10) : item.createdAt || '',
        paymentStatus: item.paymentStatus === 'CHUA_THANH_TOAN' ? 'PENDING' :
                       item.paymentStatus === 'DA_THANH_TOAN' ? 'PAID' : item.paymentStatus
      };
    case '/payments':
      return {
        ...item,
        invoiceId: item.invoice?.id || item.invoiceId || '',
        customerName: item.invoice?.customer?.fullName || item.customerName || '',
        paymentDate: item.paymentDate ? item.paymentDate.toString().substring(0, 10) : item.paymentDate || '',
        status: item.status === 'THANH_CONG' ? 'SUCCESS' : (item.status === 'THAT_BAI' ? 'CANCELLED' : item.status)
      };
    case '/promotions':
      return item;
    case '/rooms':
      return {
        ...item,
        status: item.status === 'TRONG' ? 'AVAILABLE' :
                item.status === 'DANG_SU_DUNG' ? 'USING' :
                item.status === 'BAO_TRI' ? 'MAINTENANCE' : (item.status || 'AVAILABLE')
      };
    case '/reviews':
      return {
        ...item,
        customerName: item.customer?.fullName || item.customerName || '',
        serviceName: item.service?.name || item.serviceName || '',
        createdAt: item.createdAt ? item.createdAt.toString().substring(0, 10) : item.createdAt || '',
        status: 'SHOW'
      };
    case '/users':
      return {
        ...item,
        roleName: item.role?.roleName || item.roleName || '',
        password: '',
        status: item.status || 'ACTIVE'
      };
    default:
      return item;
  }
};

// Map UI flat model back to structured backend payload
export const mapUiToApi = (endpoint, item, lookups = {}) => {
  if (!item) return item;
  switch (endpoint) {
    case '/customers': {
      const { status, ...rest } = item;
      return rest;
    }
    case '/employees':
      return {
        ...item,
        status: item.status === 'WORKING' ? 'DANG_LAM' : (item.status === 'INACTIVE' ? 'NGHI_VIEC' : item.status)
      };
    case '/spa-services': {
      const cat = lookups.categories?.find(c => c.name === item.categoryName);
      return {
        ...item,
        category: cat ? { id: cat.id } : null
      };
    }
    case '/appointments': {
      const cust = lookups.customers?.find(c => c.fullName === item.customerName);
      const emp = lookups.employees?.find(e => e.fullName === item.employeeName);
      const rm = lookups.rooms?.find(r => r.roomName === item.roomName || r.name === item.roomName);
      const svc = lookups.services?.find(s => s.name === item.serviceName);

      const statusMap = {
        PENDING: 'DANG_CHO',
        CONFIRMED: 'DA_XAC_NHAN',
        IN_PROGRESS: 'DANG_THUC_HIEN',
        COMPLETED: 'HOAN_THANH',
        CANCELLED: 'DA_HUY'
      };

      const payload = {
        id: item.id,
        customer: cust ? { id: cust.id } : null,
        employee: emp ? { id: emp.id } : null,
        room: rm ? { id: rm.id } : null,
        appointmentDate: item.appointmentDate,
        appointmentTime: item.startTime ? (item.startTime.length === 5 ? item.startTime + ':00' : item.startTime) : null,
        status: statusMap[item.status] || item.status || 'DANG_CHO',
        note: item.note || ''
      };

      if (svc) {
        payload.appointmentDetails = [
          {
            service: { id: svc.id },
            price: svc.price,
            duration: svc.duration
          }
        ];
      }
      return payload;
    }
    case '/invoices': {
      const cust = lookups.customers?.find(c => c.fullName === item.customerName);
      const statusMap = {
        PENDING: 'CHUA_THANH_TOAN',
        PAID: 'DA_THANH_TOAN'
      };
      return {
        ...item,
        customer: cust ? { id: cust.id } : null,
        paymentStatus: statusMap[item.paymentStatus] || item.paymentStatus || 'CHUA_THANH_TOAN'
      };
    }
    case '/payments': {
      const statusMap = {
        SUCCESS: 'THANH_CONG',
        CANCELLED: 'THAT_BAI'
      };
      return {
        ...item,
        invoice: item.invoiceId ? { id: Number(item.invoiceId) } : null,
        status: statusMap[item.status] || item.status || 'THANH_CONG'
      };
    }
    case '/promotions':
      return {
        ...item,
        discountValue: Number(item.discountValue || 0)
      };
    case '/rooms':
      return {
        ...item,
        status: item.status === 'AVAILABLE' ? 'TRONG' :
                item.status === 'USING' ? 'DANG_SU_DUNG' :
                item.status === 'MAINTENANCE' ? 'BAO_TRI' : (item.status || 'TRONG')
      };
    case '/reviews': {
      const cust = lookups.customers?.find(c => c.fullName === item.customerName);
      const svc = lookups.services?.find(s => s.name === item.serviceName);
      return {
        ...item,
        customer: cust ? { id: cust.id } : null,
        service: svc ? { id: svc.id } : null
      };
    }
    case '/users':
      return {
        ...item,
        role: {
          roleName: item.roleName || 'ROLE_NHAN_VIEN'
        }
      };
    default:
      return item;
  }
};
