-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 14, 2026 at 02:56 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spa_management_v2`
--
CREATE DATABASE IF NOT EXISTS `spa_management_v2` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `spa_management_v2`;

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `duration` int(11) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `customer_id` bigint(20) DEFAULT NULL,
  `employee_id` bigint(20) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `room_id` bigint(20) DEFAULT NULL,
  `service_id` bigint(20) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `status` varchar(30) DEFAULT 'DANG_CHO',
  `promotion_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`appointment_date`, `appointment_time`, `duration`, `price`, `created_at`, `customer_id`, `employee_id`, `id`, `room_id`, `service_id`, `note`, `status`, `promotion_id`) VALUES
('2026-07-07', '10:00:00', 60, 300000.00, '2026-07-07 22:18:16.000000', 1, 1, 1, 1, 1, 'Khách yêu cầu phòng yên tĩnh', 'DA_XAC_NHAN', NULL),
('2026-07-07', '11:30:00', 75, 400000.00, '2026-07-07 22:18:16.000000', 2, 2, 2, 2, 2, '', 'DANG_THUC_HIEN', NULL),
('2026-07-07', '13:00:00', 45, 150000.00, '2026-07-07 22:18:16.000000', 3, 1, 3, 1, 3, '', 'DANG_CHO', NULL),
('2026-07-07', '14:30:00', 40, 200000.00, '2026-07-07 22:18:16.000000', 4, 2, 4, 3, 4, '', 'DA_XAC_NHAN', NULL),
('2026-07-07', '09:00:00', 75, 400000.00, '2026-07-07 22:18:16.000000', 1, 1, 5, NULL, 2, NULL, 'HOAN_THANH', NULL),
('2026-07-07', '09:00:00', 60, 300000.00, '2026-07-07 22:18:16.000000', 2, 2, 6, NULL, 1, NULL, 'HOAN_THANH', NULL),
('2026-07-07', '09:00:00', 50, 250000.00, '2026-07-07 22:18:17.000000', 3, 3, 7, NULL, 5, NULL, 'HOAN_THANH', NULL),
('2026-07-05', '09:00:00', 60, 300000.00, '2026-07-07 22:18:17.000000', 1, 1, 8, NULL, 1, NULL, 'HOAN_THANH', NULL),
('2026-07-02', '09:00:00', 75, 400000.00, '2026-07-07 22:18:17.000000', 2, 2, 9, NULL, 2, NULL, 'HOAN_THANH', NULL),
('2026-06-29', '09:00:00', 45, 150000.00, '2026-07-07 22:18:17.000000', 3, 3, 10, NULL, 3, NULL, 'HOAN_THANH', NULL),
('2026-01-15', '09:00:00', 60, 300000.00, '2026-07-07 22:18:17.000000', 4, 4, 11, NULL, 1, NULL, 'HOAN_THANH', NULL),
('2026-02-15', '09:00:00', 60, 300000.00, '2026-07-07 22:18:17.000000', 4, 4, 12, NULL, 1, NULL, 'HOAN_THANH', NULL),
('2026-03-15', '09:00:00', 60, 300000.00, '2026-07-07 22:18:17.000000', 4, 4, 13, NULL, 1, NULL, 'HOAN_THANH', NULL),
('2026-04-15', '09:00:00', 60, 300000.00, '2026-07-07 22:18:17.000000', 4, 4, 14, NULL, 1, NULL, 'HOAN_THANH', NULL),
('2026-05-15', '09:00:00', 60, 300000.00, '2026-07-07 22:18:17.000000', 4, 4, 15, NULL, 1, NULL, 'HOAN_THANH', NULL),
('2026-06-15', '09:00:00', 60, 300000.00, '2026-07-07 22:18:17.000000', 4, 4, 16, NULL, 1, NULL, 'HOAN_THANH', NULL),
('2026-08-15', '09:00:00', 60, 300000.00, '2026-07-07 22:18:17.000000', 4, 4, 17, NULL, 1, NULL, 'HOAN_THANH', NULL),
('2026-09-15', '09:00:00', 60, 300000.00, '2026-07-07 22:18:17.000000', 4, 4, 18, NULL, 1, NULL, 'HOAN_THANH', NULL),
('2026-10-15', '09:00:00', 60, 300000.00, '2026-07-07 22:18:17.000000', 4, 4, 19, NULL, 1, NULL, 'HOAN_THANH', NULL),
('2026-11-15', '09:00:00', 60, 300000.00, '2026-07-07 22:18:17.000000', 4, 4, 20, NULL, 1, NULL, 'HOAN_THANH', NULL),
('2026-12-15', '09:00:00', 60, 300000.00, '2026-07-07 22:18:17.000000', 4, 4, 21, NULL, 1, NULL, 'HOAN_THANH', NULL),
('2026-07-16', '09:00:00', 60, 300000.00, '2026-07-08 16:17:37.000000', 6, 1, 22, 3, 1, 'kh', 'DANG_CHO', NULL),
('2026-07-17', '13:30:00', 60, 300000.00, '2026-07-08 18:58:31.000000', 7, 2, 23, 3, 1, '', 'DANG_CHO', NULL),
('2026-07-11', '10:30:00', 135, 700000.00, '2026-07-08 19:54:56.000000', 8, NULL, 24, 3, 2, '[Dịch vụ đặt: Massage thư giãn (60p), Chăm sóc da mặt (75p)]', 'DA_THANH_TOAN', NULL),
('2026-07-19', '13:30:00', 95, 400000.00, '2026-07-08 20:01:27.000000', 9, 2, 25, 2, 5, '[Dịch vụ đặt: Gội đầu thảo dược (45p), Xông hơi đá muối (50p)]', 'DA_THANH_TOAN', NULL),
('2026-07-19', '10:30:00', 100, 500000.00, '2026-07-08 20:05:25.000000', 7, 3, 26, 2, 1, '[Dịch vụ đặt: Massage thư giãn (60p), Tẩy tế bào chết (40p)]', 'DANG_CHO', NULL),
('2026-07-11', '10:30:00', 60, 300000.00, '2026-07-08 20:09:45.000000', 7, 2, 27, 2, 1, '[Dịch vụ đặt: Massage thư giãn (60p)]', 'DANG_CHO', NULL),
('2026-07-17', '11:00:00', 60, 300000.00, '2026-07-11 10:36:45.000000', 6, NULL, 28, 2, 1, '[Dịch vụ đặt: Massage thư giãn (60p)]\n123', 'DANG_CHO', NULL),
('2026-07-19', '13:30:00', 50, 250000.00, '2026-07-11 10:37:50.000000', 6, NULL, 29, 3, 5, '[Dịch vụ đặt: Xông hơi đá muối (50p)]', 'HOAN_THANH', NULL),
('2026-07-26', '13:30:00', 45, 150000.00, '2026-07-11 10:54:20.000000', 6, 2, 30, 3, 3, '[Dịch vụ đặt: Gội đầu thảo dược (45p), Tẩy tế bào chết (40p)]', 'DA_THANH_TOAN', NULL),
('2026-07-22', '13:30:00', 60, 300000.00, '2026-07-11 11:02:20.000000', 6, NULL, 31, 3, 1, '[Dịch vụ đặt: Massage thư giãn (60p), Tẩy tế bào chết (40p)]\n123', 'DA_HUY', NULL),
('2026-07-25', '14:00:00', 60, 300000.00, '2026-07-11 11:10:39.000000', 6, 3, 32, 3, 1, '[Dịch vụ đặt: Massage thư giãn (60p), Chăm sóc da mặt (75p)]', 'DANG_CHO', NULL),
('2026-07-11', '14:00:00', 60, 300000.00, '2026-07-11 11:12:03.000000', 6, NULL, 33, 3, 1, '[Dịch vụ đặt: Massage thư giãn (60p), Chăm sóc da mặt (75p)]', 'HOAN_THANH', NULL),
('2026-07-19', '13:30:00', 60, 300000.00, '2026-07-11 11:15:13.000000', 6, NULL, 34, 1, 1, '[Dịch vụ đặt: Massage thư giãn (60p), Chăm sóc da mặt (75p), Tẩy tế bào chết (40p)]', 'HOAN_THANH', NULL),
('2026-07-13', '10:30:00', 135, 700000.00, '2026-07-13 15:58:50.000000', 6, 2, 35, 3, 1, '[Dịch vụ đặt: Massage thư giãn (60p), Chăm sóc da mặt (75p)]', 'DANG_CHO', NULL),
('2026-07-17', '10:30:00', 135, 630000.00, '2026-07-13 16:32:00.000000', 6, 2, 36, 3, 1, '[Dịch vụ đặt: Massage thư giãn (60p), Chăm sóc da mặt (75p)]', 'DA_XAC_NHAN', 1),
('2026-07-19', '10:30:00', 105, 405000.00, '2026-07-13 16:36:51.000000', 6, 2, 37, 3, 1, '[Dịch vụ đặt: Massage thư giãn (60p), Gội đầu thảo dược (45p)]', 'DA_XAC_NHAN', 1),
('2026-07-17', '10:30:00', 75, 400000.00, '2026-07-13 17:28:31.000000', 6, 1, 38, 4, 2, '[Dịch vụ đặt: Chăm sóc da mặt (75p)]', 'DANG_CHO', NULL),
('2026-07-25', '13:30:00', 135, 630000.00, '2026-07-13 18:34:17.000000', 6, 1, 39, 1, 1, '[Dịch vụ đặt: Massage thư giãn (60p), Chăm sóc da mặt (75p)]\nkhông', 'DA_XAC_NHAN', 1),
('2026-07-18', '10:30:00', 120, 550000.00, '2026-07-13 18:40:34.000000', 6, 2, 40, 3, 2, '[Dịch vụ đặt: Chăm sóc da mặt (75p), Gội đầu thảo dược (45p)]', 'HOAN_THANH', NULL),
('2026-07-22', '14:00:00', 105, 405000.00, '2026-07-13 18:51:04.000000', 6, 2, 41, 3, 1, '[Dịch vụ đặt: Massage thư giãn (60p), Gội đầu thảo dược (45p)]', 'DANG_CHO', 1),
('2026-07-17', '14:00:00', 135, 630000.00, '2026-07-13 18:53:09.000000', 6, 4, 42, 4, 1, '[Dịch vụ đặt: Massage thư giãn (60p), Chăm sóc da mặt (75p)]', 'DA_XAC_NHAN', 1),
('2026-07-18', '13:30:00', 185, 855000.00, '2026-07-13 18:58:33.000000', 6, 3, 43, 4, 1, '[Dịch vụ đặt: Massage thư giãn (60p), Chăm sóc da mặt (75p), Xông hơi đá muối (50p)]', 'DANG_CHO', 1),
('2026-07-14', '10:30:00', 220, 945000.00, '2026-07-13 19:03:26.000000', 6, 2, 44, 3, 1, '[Dịch vụ đặt: Massage thư giãn (60p), Chăm sóc da mặt (75p), Gội đầu thảo dược (45p), Tẩy tế bào chết (40p)]', 'DANG_CHO', 1);

-- --------------------------------------------------------

--
-- Table structure for table `appointment_details`
--

CREATE TABLE `appointment_details` (
  `id` bigint(20) NOT NULL,
  `duration` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `appointment_id` bigint(20) DEFAULT NULL,
  `service_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `appointment_services`
--

CREATE TABLE `appointment_services` (
  `appointment_id` bigint(20) NOT NULL,
  `service_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointment_services`
--

INSERT INTO `appointment_services` (`appointment_id`, `service_id`) VALUES
(44, 1),
(44, 2),
(44, 3),
(44, 4);

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `order_no` int(11) NOT NULL DEFAULT 0,
  `status` varchar(20) DEFAULT 'ACTIVE',
  `subtitle` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `created_at`, `image_url`, `link_url`, `order_no`, `status`, `subtitle`, `title`) VALUES
(1, '2026-07-12 17:18:45.000000', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200', '/booking', 1, 'ACTIVE', 'Spa cham soc sac dep cao cap', 'Thu gian co the, lam dep lan da, phuc hoi nang luong moi ngay'),
(2, '2026-07-12 17:18:45.000000', 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1200', '/services', 2, 'ACTIVE', 'Khoi day ve dep tu nhien cua ban', 'Uu dai 20% cho lieu trinh Cham soc da lan dau'),
(3, '2026-07-12 17:18:45.000000', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1200', '/services', 3, 'ACTIVE', 'Giam stress, met moi, tai tao nang luong tuc thi', 'Goi dau duong sinh & Bam huyet vai gay');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `birthday` date DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `customer_type` varchar(20) DEFAULT 'THUONG',
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`birthday`, `created_at`, `id`, `address`, `customer_type`, `email`, `full_name`, `gender`, `image_url`, `note`, `phone`) VALUES
('1995-08-12', '2026-07-07 22:18:16.000000', 1, 'Quận 1, TP. HCM', 'VIP', 'lan.nguyen@gmail.com', 'Nguyễn Thị Lan', 'Nữ', NULL, NULL, '0912223334'),
('1990-05-20', '2026-07-07 22:18:16.000000', 2, 'Quận 3, TP. HCM', 'THUONG', 'hung.tran@gmail.com', 'Trần Văn Hùng', 'Nam', NULL, NULL, '0913334445'),
('1988-11-03', '2026-07-07 22:18:16.000000', 3, 'Quận Bình Thạnh, TP. HCM', 'THAN_THIET', 'mai.le@gmail.com', 'Lê Thị Mai', 'Nữ', NULL, NULL, '0914445556'),
('1998-02-28', '2026-07-07 22:18:16.000000', 4, 'Quận 7, TP. HCM', 'THUONG', 'oanh.pham@gmail.com', 'Phạm Hoàng Oanh', 'Nữ', NULL, NULL, '0915556667'),
(NULL, '2026-07-07 23:15:13.000000', 5, '', 'THUONG', '', 'Admin Ly', 'Nam', '', '', ''),
(NULL, '2026-07-08 16:17:03.000000', 6, '', 'THUONG', 'pukachi1132@gmail.com', 'Tran Van Toan', 'Nam', '', '', '038490940'),
(NULL, '2026-07-08 18:58:31.000000', 7, NULL, 'THUONG', '', 'Tran Van Toan', NULL, NULL, '', '0221155455'),
(NULL, '2026-07-08 19:54:56.000000', 8, NULL, 'THUONG', '', 'Tran Van Toan', NULL, NULL, '', '025'),
(NULL, '2026-07-08 20:01:27.000000', 9, NULL, 'THUONG', '', 'Tran Van Toan', NULL, NULL, '', '032232');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `salary` decimal(38,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'DANG_LAM'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`salary`, `created_at`, `id`, `email`, `full_name`, `gender`, `phone`, `position`, `status`) VALUES
(8000000.00, '2026-07-07 22:18:16.000000', 1, 'a.nguyen@spamanagement.com', 'Nguyễn Văn A', 'Nam', '0981111111', 'KY_THUAT', 'DANG_LAM'),
(8500000.00, '2026-07-07 22:18:16.000000', 2, 'b.tran@spamanagement.com', 'Trần Thị B', 'Nữ', '0982222222', 'KY_THUAT', 'DANG_LAM'),
(7000000.00, '2026-07-07 22:18:16.000000', 3, 'c.le@spamanagement.com', 'Lê Văn C', 'Nam', '0983333333', 'LE_TAN', 'DANG_LAM'),
(15000000.00, '2026-07-07 22:18:16.000000', 4, 'd.pham@spamanagement.com', 'Phạm Thị D', 'Nữ', '0984444444', 'QUAN_LY', 'DANG_LAM');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` bigint(20) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'CHUA_DOC',
  `subject` varchar(255) NOT NULL,
  `customer_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `import_receipts`
--

CREATE TABLE `import_receipts` (
  `id` bigint(20) NOT NULL,
  `import_date` datetime(6) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `total_amount` decimal(38,2) DEFAULT NULL,
  `supplier_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `import_receipt_details`
--

CREATE TABLE `import_receipt_details` (
  `id` bigint(20) NOT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `total` decimal(38,2) DEFAULT NULL,
  `import_receipt_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `discount_amount` decimal(15,2) DEFAULT 0.00,
  `final_amount` decimal(38,2) NOT NULL,
  `total_amount` decimal(38,2) NOT NULL,
  `appointment_id` bigint(20) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `customer_id` bigint(20) DEFAULT NULL,
  `employee_id` bigint(20) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `promotion_id` bigint(20) DEFAULT NULL,
  `payment_method` varchar(30) DEFAULT 'TIEN_MAT',
  `payment_status` varchar(20) DEFAULT 'CHUA_THANH_TOAN'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`discount_amount`, `final_amount`, `total_amount`, `appointment_id`, `created_at`, `customer_id`, `employee_id`, `id`, `paid_at`, `promotion_id`, `payment_method`, `payment_status`) VALUES
(0.00, 5500000.00, 5500000.00, 5, '2026-07-07 10:00:00.000000', 1, 1, 1, '2026-07-07 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 6000000.00, 6000000.00, 6, '2026-07-07 10:00:00.000000', 2, 2, 2, '2026-07-07 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 4000000.00, 4000000.00, 7, '2026-07-07 10:00:00.000000', 3, 3, 3, '2026-07-07 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 134500000.00, 134500000.00, 8, '2026-07-05 10:00:00.000000', 1, 1, 4, '2026-07-05 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 150000000.00, 150000000.00, 9, '2026-07-02 10:00:00.000000', 2, 2, 5, '2026-07-02 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 150000000.00, 150000000.00, 10, '2026-06-29 10:00:00.000000', 3, 3, 6, '2026-06-29 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 350000000.00, 350000000.00, 11, '2026-01-15 10:00:00.000000', 4, 4, 7, '2026-01-15 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 380000000.00, 380000000.00, 12, '2026-02-15 10:00:00.000000', 4, 4, 8, '2026-02-15 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 410000000.00, 410000000.00, 13, '2026-03-15 10:00:00.000000', 4, 4, 9, '2026-03-15 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 390000000.00, 390000000.00, 14, '2026-04-15 10:00:00.000000', 4, 4, 10, '2026-04-15 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 420000000.00, 420000000.00, 15, '2026-05-15 10:00:00.000000', 4, 4, 11, '2026-05-15 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 450000000.00, 450000000.00, 16, '2026-06-15 10:00:00.000000', 4, 4, 12, '2026-06-15 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 510000000.00, 510000000.00, 17, '2026-08-15 10:00:00.000000', 4, 4, 13, '2026-08-15 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 540000000.00, 540000000.00, 18, '2026-09-15 10:00:00.000000', 4, 4, 14, '2026-09-15 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 560000000.00, 560000000.00, 19, '2026-10-15 10:00:00.000000', 4, 4, 15, '2026-10-15 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 590000000.00, 590000000.00, 20, '2026-11-15 10:00:00.000000', 4, 4, 16, '2026-11-15 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 620000000.00, 620000000.00, 21, '2026-12-15 10:00:00.000000', 4, 4, 17, '2026-12-15 10:00:00.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 700000.00, 700000.00, 24, '2026-07-08 19:55:57.000000', 8, NULL, 18, '2026-07-08 19:55:57.000000', NULL, 'VNPAY', 'DA_THANH_TOAN'),
(0.00, 400000.00, 400000.00, 25, '2026-07-08 20:02:13.000000', 9, 2, 19, '2026-07-08 20:02:13.000000', NULL, 'VNPAY', 'DA_THANH_TOAN'),
(0.00, 150000.00, 150000.00, 30, '2026-07-11 10:55:47.000000', 6, 2, 20, '2026-07-11 10:55:47.000000', NULL, 'VNPAY', 'DA_THANH_TOAN'),
(0.00, 300000.00, 300000.00, 32, '2026-07-11 11:10:39.000000', 6, 3, 21, '2026-07-11 11:11:06.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(0.00, 300000.00, 300000.00, 33, '2026-07-11 11:12:03.000000', 6, NULL, 22, NULL, NULL, 'TIEN_MAT', 'CHUA_THANH_TOAN'),
(0.00, 900000.00, 900000.00, 34, '2026-07-11 11:15:13.000000', 6, NULL, 23, '2026-07-11 11:15:58.000000', NULL, 'VNPAY', 'DA_THANH_TOAN'),
(0.00, 700000.00, 700000.00, 35, '2026-07-13 15:58:50.000000', 6, 2, 24, '2026-07-13 16:31:22.000000', NULL, 'TIEN_MAT', 'DA_THANH_TOAN'),
(63000.00, 567000.00, 630000.00, 36, '2026-07-13 16:32:00.000000', 6, 2, 25, '2026-07-13 16:32:56.000000', 1, 'VNPAY', 'DA_THANH_TOAN'),
(40500.00, 364500.00, 405000.00, 37, '2026-07-13 16:36:51.000000', 6, 2, 26, '2026-07-13 16:37:24.000000', 1, 'VNPAY', 'DA_THANH_TOAN'),
(0.00, 400000.00, 400000.00, 38, '2026-07-13 17:28:31.000000', 6, 1, 27, NULL, NULL, 'TIEN_MAT', 'CHUA_THANH_TOAN'),
(63000.00, 567000.00, 630000.00, 39, '2026-07-13 18:34:17.000000', 6, 1, 28, '2026-07-13 18:35:27.000000', 1, 'VNPAY', 'DA_THANH_TOAN'),
(0.00, 550000.00, 550000.00, 40, '2026-07-13 18:40:34.000000', 6, 2, 29, '2026-07-13 18:41:33.000000', NULL, 'VNPAY', 'DA_THANH_TOAN'),
(40500.00, 364500.00, 405000.00, 41, '2026-07-13 18:51:04.000000', 6, 2, 30, NULL, 1, 'TIEN_MAT', 'CHUA_THANH_TOAN'),
(63000.00, 567000.00, 630000.00, 42, '2026-07-13 18:53:09.000000', 6, 4, 31, '2026-07-13 18:54:19.000000', 1, 'VNPAY', 'DA_THANH_TOAN'),
(30000.00, 270000.00, 300000.00, 43, '2026-07-13 18:58:33.000000', 6, 3, 32, NULL, 1, 'TIEN_MAT', 'CHUA_THANH_TOAN'),
(105000.00, 945000.00, 1050000.00, 44, '2026-07-13 19:03:26.000000', 6, 2, 33, NULL, 1, 'TIEN_MAT', 'CHUA_THANH_TOAN');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_details`
--

CREATE TABLE `invoice_details` (
  `id` bigint(20) NOT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `total` decimal(38,2) DEFAULT NULL,
  `invoice_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `service_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) NOT NULL,
  `amount` decimal(38,2) DEFAULT NULL,
  `payment_date` datetime(6) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'THANH_CONG',
  `invoice_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE',
  `category_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `discount_value` decimal(38,2) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `code` varchar(255) NOT NULL,
  `discount_type` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `promotions`
--

INSERT INTO `promotions` (`discount_value`, `end_date`, `start_date`, `id`, `code`, `discount_type`, `name`, `status`) VALUES
(10.00, '2026-07-30', '2026-07-12', 1, '1', 'PERCENT', 'trung thu', 'ACTIVE');

-- --------------------------------------------------------

--
-- Table structure for table `promotion_services`
--

CREATE TABLE `promotion_services` (
  `promotion_id` bigint(20) NOT NULL,
  `service_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `promotion_services`
--

INSERT INTO `promotion_services` (`promotion_id`, `service_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `rating` int(11) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `customer_id` bigint(20) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `service_id` bigint(20) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `employee_comment` text DEFAULT NULL,
  `employee_rating` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `employee_id` bigint(20) DEFAULT NULL,
  `appointment_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`rating`, `created_at`, `customer_id`, `id`, `service_id`, `comment`, `employee_comment`, `employee_rating`, `image_url`, `employee_id`, `appointment_id`) VALUES
(5, '2026-07-11 10:47:17.000000', 6, 1, 5, 'tốt', NULL, NULL, NULL, NULL, NULL),
(4, '2026-07-11 11:25:45.000000', 6, 2, 1, 'rất tốt', NULL, NULL, NULL, NULL, NULL),
(5, '2026-07-11 11:30:50.000000', 6, 3, 1, 'tốt', 'dỡ , láo', 2, '/uploads/39e66843-2278-4e55-8275-ef4aa6b94641.jpg', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `role_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `description`, `role_name`) VALUES
(1, 'Quản trị viên hệ thống', 'ROLE_ADMIN'),
(2, 'Nhân viên Spa', 'ROLE_NHAN_VIEN'),
(3, 'Khách hàng', 'ROLE_KHACH_HANG');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `room_name` varchar(255) NOT NULL,
  `status` varchar(20) DEFAULT 'TRONG',
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `description`, `room_name`, `status`, `image`) VALUES
(1, 'Phòng trị liệu cao cấp 1', 'Phòng VIP 1', 'TRONG', '/uploads/75ccfc0a-35c3-4f5b-89c0-08bfc6fb01d9.jpg'),
(2, 'Phòng trị liệu cao cấp 2', 'Phòng VIP 2', 'TRONG', '/uploads/31439a17-c9f5-4ced-8f34-d37353fcc03e.jpg'),
(3, 'Phòng trị liệu tiêu chuẩn 1', 'Phòng Thường 1', 'TRONG', '/uploads/49401cf4-286b-4c60-8886-28bfb5148472.jpg'),
(4, 'Phòng trị liệu tiêu chuẩn 2', 'Phòng Thường 2', 'TRONG', '/uploads/4262d2e1-9542-4025-a522-8fb620be86d7.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `service_categories`
--

CREATE TABLE `service_categories` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_categories`
--

INSERT INTO `service_categories` (`id`, `description`, `name`, `status`) VALUES
(1, 'Các liệu trình massage thư giãn và trị liệu cơ thể', 'Dịch vụ Massage', 'ACTIVE'),
(2, 'Liệu trình chăm sóc và trẻ hóa da mặt chuyên sâu', 'Chăm sóc da', 'ACTIVE'),
(3, 'Gội đầu dưỡng sinh bằng thảo dược tự nhiên', 'Gội đầu', 'ACTIVE'),
(4, 'Tẩy sạch tế bào chết toàn thân hoặc mặt', 'Tẩy tế bào chết', 'ACTIVE'),
(5, 'Xông hơi đá muối thải độc cơ thể', 'Liệu pháp xông hơi', 'ACTIVE');

-- --------------------------------------------------------

--
-- Table structure for table `spa_services`
--

CREATE TABLE `spa_services` (
  `duration` int(11) DEFAULT NULL,
  `price` decimal(38,2) NOT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `spa_services`
--

INSERT INTO `spa_services` (`duration`, `price`, `category_id`, `created_at`, `id`, `description`, `image`, `name`, `status`) VALUES
(60, 300000.00, 1, '2026-07-07 22:18:16.000000', 1, 'Massage body tinh dầu giúp giải tỏa căng thẳng', '/uploads/f8c9b19e-56ad-4330-bcb7-f42fb53d069d.jpg', 'Massage thư giãn', 'ACTIVE'),
(75, 400000.00, 2, '2026-07-07 22:18:16.000000', 2, 'Chăm sóc da mặt cơ bản kết hợp mặt nạ tự nhiên', '/uploads/2293bf1a-877f-4028-8c08-207b3cba0ab5.jpg', 'Chăm sóc da mặt', 'ACTIVE'),
(45, 150000.00, 3, '2026-07-07 22:18:16.000000', 3, 'Gội đầu thảo dược kết hợp bấm huyệt trị liệu vai gáy', '/uploads/1a54b384-9fb5-41ef-aea9-4f034872bdfe.jpg', 'Gội đầu thảo dược', 'ACTIVE'),
(40, 200000.00, 4, '2026-07-07 22:18:16.000000', 4, 'Tẩy tế bào chết toàn thân bằng hạt cafe và muối khoáng', '/uploads/5fedfe34-572e-4183-9fae-c02229e6a62b.webp', 'Tẩy tế bào chết', 'ACTIVE'),
(50, 250000.00, 5, '2026-07-07 22:18:16.000000', 5, 'Xông hơi đá muối Hymalaya đào thải độc tố', '/uploads/c117a07e-c3b8-48ea-9835-4e94b585aa3b.jpg', 'Xông hơi đá muối', 'ACTIVE');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `role_id` bigint(20) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE',
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`created_at`, `id`, `role_id`, `updated_at`, `email`, `full_name`, `image_url`, `password`, `phone`, `status`, `username`) VALUES
('2026-07-07 22:18:16.000000', 1, 1, '2026-07-08 16:51:35.000000', '', 'Admin Ly', '', '$2a$10$L2mWf3DKHfayMY62VPyV9u4Iho6D1.MFT9kDPnUGYuHc859.2n4nu', '', NULL, 'admin'),
('2026-07-07 22:18:16.000000', 2, 2, '2026-07-07 22:18:16.000000', 'staff@spamanagement.com', 'Nhân Viên Spa', NULL, '$2a$10$Z2V2LXq9F9go0nmRHpX0FOxTZfi719hWUA7VkR6I1HNeZa/kwBM7K', '0912345678', 'ACTIVE', 'staff'),
('2026-07-07 22:18:16.000000', 3, 3, '2026-07-07 22:18:16.000000', 'lan.nguyen@gmail.com', 'Nguyễn Thị Lan', NULL, '$2a$10$88h4ioHnqVkLWicn4aAZ/.RVlByXMIJsru3fA36IAOs.xL6LsULwG', '0912223334', 'ACTIVE', 'khachhang'),
('2026-07-08 16:17:03.000000', 4, 3, '2026-07-08 16:17:10.000000', 'pukachi1132@gmail.com', 'Tran Van Toan', '', '$2a$10$gno6TIzk4kIkjSwGTWbLxuvD5YZnlTD07x/CzsHtF/2J7WGGrKJ7u', '038490940', 'ACTIVE', 'toankh');

-- --------------------------------------------------------

--
-- Table structure for table `work_schedules`
--

CREATE TABLE `work_schedules` (
  `id` bigint(20) NOT NULL,
  `end_time` time NOT NULL,
  `start_time` time NOT NULL,
  `status` varchar(20) DEFAULT 'LICH_MOI',
  `work_date` date NOT NULL,
  `employee_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKrlbb09f329sfsmftrh7y0yxtk` (`customer_id`),
  ADD KEY `FKn9hov7hdkmkdpveiujpmq4sgh` (`employee_id`),
  ADD KEY `FKbsma6x4pnujct0e6xkycu9864` (`room_id`),
  ADD KEY `FK3pqv8qn11d3snrcyx2qta7m5t` (`service_id`),
  ADD KEY `FK6vwuu621mhftfhej92wam1xro` (`promotion_id`);

--
-- Indexes for table `appointment_details`
--
ALTER TABLE `appointment_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKo2gmv6bfyykm4f54nvixtoy6k` (`appointment_id`),
  ADD KEY `FK1v721b4qgqmj6xdalm8apb845` (`service_id`);

--
-- Indexes for table `appointment_services`
--
ALTER TABLE `appointment_services`
  ADD KEY `FKpte204aj39ptsg6ic6j467foi` (`service_id`),
  ADD KEY `FK7smp9csy21h26g51aii9gvfn8` (`appointment_id`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKi9b9keigxngo4a35fgwt4h2v6` (`customer_id`);

--
-- Indexes for table `import_receipts`
--
ALTER TABLE `import_receipts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKa1a55hf4b0yva4cdscu0ybhrs` (`supplier_id`);

--
-- Indexes for table `import_receipt_details`
--
ALTER TABLE `import_receipt_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKeff0p54wafujfct1d49lcgsi4` (`import_receipt_id`),
  ADD KEY `FKmwdguyi4fkworlip4i2ajcjxy` (`product_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKr1gsksmeq3yb5fipnxl93yqqv` (`appointment_id`),
  ADD KEY `FKq2w4hmh6l9othnp6cepp0cfe2` (`customer_id`),
  ADD KEY `FKc32tm1bml7yii031771flnvdg` (`employee_id`),
  ADD KEY `FKsev3d3jlk86toj8l50myia2ts` (`promotion_id`);

--
-- Indexes for table `invoice_details`
--
ALTER TABLE `invoice_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK439lfpbc6j1k0cn26wtp8f96r` (`invoice_id`),
  ADD KEY `FKchhydd0d280ruig3hmars76wa` (`product_id`),
  ADD KEY `FKv9k8mf9h5gfgg2f5t7khoxdw` (`service_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKrbqec6be74wab8iifh8g3i50i` (`invoice_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK6t5dtw6tyo83ywljwohuc6g7k` (`category_id`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKjdho73ymbyu46p2hh562dk4kk` (`code`);

--
-- Indexes for table `promotion_services`
--
ALTER TABLE `promotion_services`
  ADD PRIMARY KEY (`promotion_id`,`service_id`),
  ADD KEY `FK27hurxdlxtkck3ra5e2qhh9x2` (`service_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK4sm0k8kw740iyuex3vwwv1etu` (`customer_id`),
  ADD KEY `FKhc5us3bjhfrmdt0gs1ujfmcf7` (`service_id`),
  ADD KEY `FK7jiemmvnb2i0xu0vhfx4b9wr4` (`employee_id`),
  ADD KEY `FKfhaj6kqx2pjpn6eambt0pa1nm` (`appointment_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK716hgxp60ym1lifrdgp67xt5k` (`role_name`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_categories`
--
ALTER TABLE `service_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `spa_services`
--
ALTER TABLE `spa_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKe9grvsi6k4aqlx413445j5my1` (`category_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`),
  ADD KEY `FKp56c1712k691lhsyewcssf40f` (`role_id`);

--
-- Indexes for table `work_schedules`
--
ALTER TABLE `work_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKm18l3ivofctt3xg8i44nwowsk` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `appointment_details`
--
ALTER TABLE `appointment_details`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `import_receipts`
--
ALTER TABLE `import_receipts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `import_receipt_details`
--
ALTER TABLE `import_receipt_details`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `invoice_details`
--
ALTER TABLE `invoice_details`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `service_categories`
--
ALTER TABLE `service_categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `spa_services`
--
ALTER TABLE `spa_services`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `work_schedules`
--
ALTER TABLE `work_schedules`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `FK3pqv8qn11d3snrcyx2qta7m5t` FOREIGN KEY (`service_id`) REFERENCES `spa_services` (`id`),
  ADD CONSTRAINT `FK6vwuu621mhftfhej92wam1xro` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`),
  ADD CONSTRAINT `FKbsma6x4pnujct0e6xkycu9864` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  ADD CONSTRAINT `FKn9hov7hdkmkdpveiujpmq4sgh` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `FKrlbb09f329sfsmftrh7y0yxtk` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `appointment_details`
--
ALTER TABLE `appointment_details`
  ADD CONSTRAINT `FK1v721b4qgqmj6xdalm8apb845` FOREIGN KEY (`service_id`) REFERENCES `spa_services` (`id`),
  ADD CONSTRAINT `FKo2gmv6bfyykm4f54nvixtoy6k` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`);

--
-- Constraints for table `appointment_services`
--
ALTER TABLE `appointment_services`
  ADD CONSTRAINT `FK7smp9csy21h26g51aii9gvfn8` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`),
  ADD CONSTRAINT `FKpte204aj39ptsg6ic6j467foi` FOREIGN KEY (`service_id`) REFERENCES `spa_services` (`id`);

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `FKi9b9keigxngo4a35fgwt4h2v6` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `import_receipts`
--
ALTER TABLE `import_receipts`
  ADD CONSTRAINT `FKa1a55hf4b0yva4cdscu0ybhrs` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`);

--
-- Constraints for table `import_receipt_details`
--
ALTER TABLE `import_receipt_details`
  ADD CONSTRAINT `FKeff0p54wafujfct1d49lcgsi4` FOREIGN KEY (`import_receipt_id`) REFERENCES `import_receipts` (`id`),
  ADD CONSTRAINT `FKmwdguyi4fkworlip4i2ajcjxy` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `FKc32tm1bml7yii031771flnvdg` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `FKngg5bc8atao2b9jehl9l8tdsw` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`),
  ADD CONSTRAINT `FKq2w4hmh6l9othnp6cepp0cfe2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `FKsev3d3jlk86toj8l50myia2ts` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`);

--
-- Constraints for table `invoice_details`
--
ALTER TABLE `invoice_details`
  ADD CONSTRAINT `FK439lfpbc6j1k0cn26wtp8f96r` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`),
  ADD CONSTRAINT `FKchhydd0d280ruig3hmars76wa` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `FKv9k8mf9h5gfgg2f5t7khoxdw` FOREIGN KEY (`service_id`) REFERENCES `spa_services` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `FKrbqec6be74wab8iifh8g3i50i` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `FK6t5dtw6tyo83ywljwohuc6g7k` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`);

--
-- Constraints for table `promotion_services`
--
ALTER TABLE `promotion_services`
  ADD CONSTRAINT `FK27hurxdlxtkck3ra5e2qhh9x2` FOREIGN KEY (`service_id`) REFERENCES `spa_services` (`id`),
  ADD CONSTRAINT `FKdlf0p8maouuqqb1yts4pm2tmd` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `FK4sm0k8kw740iyuex3vwwv1etu` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `FK7jiemmvnb2i0xu0vhfx4b9wr4` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `FKfhaj6kqx2pjpn6eambt0pa1nm` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`),
  ADD CONSTRAINT `FKhc5us3bjhfrmdt0gs1ujfmcf7` FOREIGN KEY (`service_id`) REFERENCES `spa_services` (`id`);

--
-- Constraints for table `spa_services`
--
ALTER TABLE `spa_services`
  ADD CONSTRAINT `FKe9grvsi6k4aqlx413445j5my1` FOREIGN KEY (`category_id`) REFERENCES `service_categories` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FKp56c1712k691lhsyewcssf40f` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `work_schedules`
--
ALTER TABLE `work_schedules`
  ADD CONSTRAINT `FKm18l3ivofctt3xg8i44nwowsk` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
