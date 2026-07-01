export const mockCategories = [
  { id: 1, name: 'Massage', description: 'Thư giãn cơ thể', status: 'ACTIVE' },
  { id: 2, name: 'Chăm sóc da', description: 'Dưỡng da chuyên sâu', status: 'ACTIVE' },
  { id: 3, name: 'Gội đầu dưỡng sinh', description: 'Thư giãn da đầu', status: 'ACTIVE' },
  { id: 4, name: 'Body', description: 'Chăm sóc toàn thân', status: 'ACTIVE' },
];

export const mockServices = [
  { id: 1, name: 'Massage thư giãn', category: mockCategories[0], price: 500000, duration: 60, rating: 4.9, image: '', description: 'Liệu pháp massage toàn thân kết hợp tinh dầu giúp thư giãn cơ thể, giảm căng thẳng và phục hồi năng lượng.' },
  { id: 2, name: 'Chăm sóc da mặt', category: mockCategories[1], price: 800000, duration: 90, rating: 5.0, image: '', description: 'Làm sạch sâu, tẩy tế bào chết, đắp mặt nạ và dưỡng chất giúp da sáng mịn tự nhiên.' },
  { id: 3, name: 'Gội đầu dưỡng sinh', category: mockCategories[2], price: 350000, duration: 45, rating: 4.8, image: '', description: 'Gội đầu kết hợp massage da đầu bằng thảo dược thiên nhiên giúp thư giãn và giảm mệt mỏi.' },
  { id: 4, name: 'Tẩy tế bào chết body', category: mockCategories[3], price: 450000, duration: 50, rating: 4.7, image: '', description: 'Làm sạch da toàn thân, giúp da mềm mịn và hấp thụ dưỡng chất tốt hơn.' },
];

export const mockEmployees = [
  { id: 1, fullName: 'Nguyễn Thị Lan', position: 'KY_THUAT', status: 'DANG_LAM', phone: '0901000001' },
  { id: 2, fullName: 'Trần Hà Phương', position: 'KY_THUAT', status: 'DANG_LAM', phone: '0901000002' },
  { id: 3, fullName: 'Lê Minh Anh', position: 'KY_THUAT', status: 'DANG_LAM', phone: '0901000003' },
];

export const mockRooms = [
  { id: 1, roomName: 'Phòng Lotus 01', status: 'TRONG' },
  { id: 2, roomName: 'Phòng Rose 02', status: 'TRONG' },
];
