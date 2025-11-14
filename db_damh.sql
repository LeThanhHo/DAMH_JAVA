-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 12, 2025 at 09:52 AM
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
-- Database: `db_damh`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `created_at`, `user_id`) VALUES
(1, '2025-10-22 01:20:27.000000', 6),
(2, '2025-10-22 01:37:01.000000', 2),
(3, '2025-11-11 12:48:57.000000', 11);

-- --------------------------------------------------------

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
CREATE TABLE `cart_item` (
  `id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `cart_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_item`
--

INSERT INTO `cart_item` (`id`, `quantity`, `cart_id`, `product_id`) VALUES
(33, 1, 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `description`, `name`) VALUES
(1, 'abcccc\n', 'Xe đạp trẻ em'),
(2, 'haha\n', 'Xe đạp địa hình'),
(3, '', 'Xe đạp nữ'),
(4, '', 'Xe đạp thể thao đường phố'),
(5, '', 'Xe đạp đua'),
(6, '', 'Phụ kiện cho xe '),
(7, '', 'Phụ kiện cho người đạp xe'),
(8, '...', 'Xe đạp điện');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `order_date` datetime(6) DEFAULT NULL,
  `quantity` varchar(255) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_name`, `order_date`, `quantity`, `shipping_address`) VALUES
(1, 'thien', '2025-10-21 17:55:58.000000', NULL, 'HCM-city'),
(2, 'thien', '2025-10-21 20:13:11.000000', NULL, 'HCM-city'),
(3, 'NguyenTanThien', '2025-11-10 06:45:18.000000', NULL, 'binh quoi'),
(4, 'thien', '2025-11-10 21:22:18.000000', NULL, 'HCM-CiTy'),
(5, 'thien', '2025-11-10 21:31:06.000000', NULL, 'Bình Thuận'),
(6, 'thien', '2025-11-10 21:40:49.000000', NULL, 'HCM-city'),
(7, 'NguyenTanThien', '2025-11-10 22:05:55.000000', NULL, 'HCM'),
(8, 'thien', '2025-11-10 22:08:33.000000', NULL, 'Bình Tân-Bắc BÌnh-Bình Thuận'),
(9, 'thien', '2025-11-10 22:15:29.000000', NULL, 'Bình Thuận'),
(10, 'thiencute', '2025-11-10 22:31:32.000000', NULL, 'Bình Thuận'),
(11, 'NguyenTanThien', '2025-11-11 04:53:51.000000', NULL, 'HCM-city'),
(12, 'NguyenTanThien', '2025-11-11 05:34:09.000000', NULL, 'VinhomesGrankPark'),
(13, 'Nguyễn Văn Nghĩa', '2025-11-11 05:35:06.000000', NULL, 'Bình Thuận');

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
CREATE TABLE `order_item` (
  `id` bigint(20) NOT NULL,
  `price` double NOT NULL,
  `quantity` int(11) NOT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` (`id`, `price`, `quantity`, `order_id`, `product_id`) VALUES
(1, 2900000, 1, 1, 2),
(2, 2900000, 3, 2, 2),
(3, 2900000, 1, 3, 2),
(4, 2900000, 1, 4, 2),
(5, 7600000, 1, 5, 5),
(6, 2900000, 1, 6, 2),
(7, 2900000, 1, 7, 2),
(8, 2900000, 1, 8, 2),
(9, 2900000, 1, 9, 2),
(10, 2900000, 2, 10, 2),
(11, 2900000, 1, 11, 2),
(12, 2900000, 1, 12, 2),
(13, 2900000, 1, 13, 2);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` bigint(20) NOT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `description_product` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `name_product` varchar(255) DEFAULT NULL,
  `price_product` double DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `category_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `brand`, `description_product`, `image_url`, `name_product`, `price_product`, `quantity`, `category_id`) VALUES
(2, 'RAPTOR', '4 - Bánh 18 Inchhhh', 'https://xedapgiakho.com/wp-content/uploads/2022/07/xe-dap-gia-kho-17.jpg', 'Xe Đạp Trẻ Em Youth RAPTOR Mochi ', 2900000, 187, 1),
(3, 'MTB', 'Phanh Đĩa, Bánh 26 Inches', 'https://xedapgiakho.com/wp-content/uploads/2022/07/xe-dap-gia-kho-4-4.jpg', 'Xe Đạp Địa Hình MTB MEREC Honour 300  ', 5300000, 86, 2),
(4, 'RAPTOR', 'Bánh 26 Inch', 'https://xedapgiakho.vn/wp-content/uploads/2021/05/Xe-dap-the-thao-nu-Momentum-iNeed-Latte-2019-1.png', 'Xe đạp nữ Touring RAPTOR Lily 4', 2600000, 67, 3),
(5, 'JAVA', 'Phanh Đĩa, Bánh 700C', 'https://sieuthixedap.com/storage/anh-tin-tuc/xe-dap-duong-pho-1/xe-dap-duong-pho-2.jpg', 'Xe Đạp Đường Phố Touring JAVA Sequoia-7S-City ', 7600000, 785, 4),
(6, 'JAVA', 'Phanh Đĩa, Bánh 700C', 'https://th.bing.com/th/id/R.81eef27e97c6e4e0d6329fdb31d0afa7?rik=EAP4tyG3XJ7udA&pid=ImgRaw&r=0https://th.bing.com/th/id/R.81eef27e97c6e4e0d6329fdb31d0afa7?rik=EAP4tyG3XJ7udA&pid=ImgRaw&r=0', 'Xe Đạp Đường Trường Road JAVA Veloce-16S ', 12405000, 123, 5),
(7, 'Lumen', 'Siêu sáng', 'https://api.xedap.vn/products/GI/gi-230118.jpg', 'Đèn Trước Xe Đạp Sạc USB Type-C 300 Lumen GI62 Bicycle Front Light', 450000, 324, 6),
(8, 'SHIMANO', 'Êm ái đường dài', 'https://tse1.mm.bing.net/th/id/OIP.KVvqob-S4LpUuzSHZAqlUQHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3', 'Giày Đạp Xe Thể Thao Nam SHIMANO SH-XC903 Cycling Shoes Wide', 7900000, 100, 7),
(9, 'Smart', 'Kiểu dáng trẻ trung năng động', 'https://thegioixechaydien.com.vn/upload/hinhanh/xe-dap-dien-vnbike347.jpg', 'Xe đạp điện Smart M2', 6690000, 6, 8);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('ROLE_ADMIN','ROLE_USER') DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `role`, `username`) VALUES
(2, 'lethanhho.hb2005@gmail.com', '$2a$10$HJaBTIFWvfn82QnunymPM.HF6OjIH/1qEfTvbSffT3LD/JAhToVGa', 'ROLE_ADMIN', 'thanhho'),
(6, 'thien@gmail.com', '$2a$10$JuuKWLBBkvgj6PG/MfxtEeyJxCnGXFGbOYr/kE9hGdwfuDU2w1Axq', 'ROLE_USER', 'thien'),
(9, 'qh@gmail.com', '$2a$10$kbK192AzBAuOcJo5Y1RPfuRDNulSCrUSkO.O9Qyphu4YyAiq4sDze', 'ROLE_USER', 'qhuong'),
(11, 'vana@gmail.com', '$2a$10$4Wkgp9TDAZ2m3P6CkcORQeGru6pJp/qpJTybI6pS7E3IXyu64Fp6m', 'ROLE_USER', 'VanA'),
(13, 'admin@example.com', '$2a$10$.xjlmiyuDEEmaQnTIzG1V.tQpuiAud4R1tx91aohNYNt8vCffUFA6', 'ROLE_ADMIN', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK9emlp6m95v5er2bcqkjsw48he` (`user_id`);

--
-- Indexes for table `cart_item`
--
ALTER TABLE `cart_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1uobyhgl1wvgt1jpccia8xxs3` (`cart_id`),
  ADD KEY `FKjcyd5wv4igqnw413rgxbfu4nv` (`product_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKt4dc2r9nbvbujrljv3e23iibt` (`order_id`),
  ADD KEY `FK551losx9j75ss5d6bfsqvijna` (`product_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1mtsbur82frn64de7balymq9s` (`category_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cart_item`
--
ALTER TABLE `cart_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `order_item`
--
ALTER TABLE `order_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `FKl70asp4l4w0jmbm1tqyofho4o` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `cart_item`
--
ALTER TABLE `cart_item`
  ADD CONSTRAINT `FK1uobyhgl1wvgt1jpccia8xxs3` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`),
  ADD CONSTRAINT `FKjcyd5wv4igqnw413rgxbfu4nv` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `FK551losx9j75ss5d6bfsqvijna` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `FKt4dc2r9nbvbujrljv3e23iibt` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FK1mtsbur82frn64de7balymq9s` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
