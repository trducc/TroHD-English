DROP DATABASE IF EXISTS thuctapcoso;
CREATE DATABASE thuctapcoso;
USE thuctapcoso;

CREATE TABLE nguoi_dung (
    ma_nguoi_dung INT AUTO_INCREMENT PRIMARY KEY,
    ten_dang_nhap VARCHAR(50) NOT NULL UNIQUE,
    mat_khau VARCHAR(255) NOT NULL,
    ho_ten VARCHAR(100) NOT NULL,
    so_dien_thoai VARCHAR(15),
    quyen_han ENUM('QUAN_TRI', 'CHU_TRO', 'SINH_VIEN') DEFAULT 'SINH_VIEN',
    trang_thai VARCHAR(20) DEFAULT 'Active',
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE phong_tro (
    ma_phong INT AUTO_INCREMENT PRIMARY KEY,
    tieu_de VARCHAR(255) NOT NULL,
    gia_tien INT NOT NULL,
    dien_tich INT NOT NULL,
    dia_chi VARCHAR(255) NOT NULL,
    gan_truong VARCHAR(255),
    so_dien_thoai VARCHAR(15),
    gia_dien VARCHAR(50),
    gia_nuoc VARCHAR(50),
    gia_dich_vu VARCHAR(50),
    hinh_anh VARCHAR(255),
    vi_tri_dac_dia TEXT,
    khong_chung_chu TINYINT DEFAULT 0,
    ve_sinh_khep_kin TINYINT DEFAULT 0,
    co_dieu_hoa TINYINT DEFAULT 0,
    co_binh_nong_lanh TINYINT DEFAULT 0,
    co_cho_nau_an TINYINT DEFAULT 0,
    de_xe_mien_phi TINYINT DEFAULT 0,
    khoa_van_tay TINYINT DEFAULT 0,
    co_may_giat TINYINT DEFAULT 0,
    trang_thai ENUM('CHO_DUYET', 'DA_DUYET') DEFAULT 'CHO_DUYET',
    luot_xem INT DEFAULT 0,
    ma_nguoi_dung INT,
    ngay_dang TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE CASCADE
);

CREATE TABLE thong_bao (
    ma_thong_bao INT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_nhan INT,
    noi_dung TEXT NOT NULL,
    trang_thai_xem TINYINT DEFAULT 0,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nguoi_nhan) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE CASCADE
);

INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau, ho_ten, so_dien_thoai, quyen_han) VALUES  
('admin', '123456', 'Tran Van Duc', '0366604516', 'QUAN_TRI'),
('khach_duy', '123456', 'Do Quang Duy', '0988123456', 'SINH_VIEN'),
('chutro_duc', '123456', 'Nguyen Minh Duc', '0912345678', 'CHU_TRO'),
('chutro_diep', '123456', 'Hoang Thi Ngoc Diep', '0905111222', 'CHU_TRO'),
('chutro_linh', '123456', 'Dao Ngoc Linh', '0977333444', 'CHU_TRO'),
('khach_hue', '123456', 'Luu Kim Hue', '0344555666', 'SINH_VIEN'),
('khach_thanh', '123456', 'Hoang Thi Hong Thanh', '0355666777', 'SINH_VIEN'),
('khach_nam', '123456', 'Pham Nhat Nam', '0388999000', 'SINH_VIEN'),
('khach_ha', '123456', 'Truong Thi Thu Ha', '0399888777', 'SINH_VIEN'),
('khach_quynh', '123456', 'Vu Nhu Quynh', '0322111000', 'SINH_VIEN'),
('khach_mai', '123456', 'Tran Tuyet Mai', '0341112222', 'SINH_VIEN'),
('khach_hoang', '123456', 'Nguyen Minh Hoang', '0919998888', 'SINH_VIEN'),
('chutro_binh', '123456', 'Luong Thanh Binh', '0933555222', 'CHU_TRO'),
('khach_linh', '123456', 'Phan Khanh Linh', '0377444555', 'SINH_VIEN'),
('chutro_yen', '123456', 'Ngo Hai Yen', '0966777111', 'CHU_TRO'),
('khach_tung', '123456', 'Le Son Tung', '0388666777', 'SINH_VIEN'),
('chutro_cuong', '123456', 'Tran Quoc Cuong', '0355000999', 'CHU_TRO'),
('khach_ngan', '123456', 'Bui Thu Ngan', '0766111333', 'SINH_VIEN'),
('chutro_van', '123456', 'Do Thuy Van', '0900444666', 'CHU_TRO'),
('khach_quang', '123456', 'Dang Hong Quang', '0944222000', 'SINH_VIEN');

INSERT INTO phong_tro (tieu_de, gia_tien, dien_tich, dia_chi, gan_truong, so_dien_thoai, gia_dien, gia_nuoc, gia_dich_vu, vi_tri_dac_dia, hinh_anh, khong_chung_chu, ve_sinh_khep_kin, co_dieu_hoa, co_binh_nong_lanh, co_cho_nau_an, de_xe_mien_phi, khoa_van_tay, co_may_giat, trang_thai, ma_nguoi_dung)  
VALUES  
('Self-contained room near PTIT', 3500000, 25, 'Alley 5 Ao Sen, Mo Lao', 'Posts and Telecommunications Institute of Technology', '0366604516', '3.8k/kWh', '30k/m3', '50k/person', '200m from PTIT, near market', 'phong1.jpg', 1, 1, 1, 1, 1, 1, 1, 1, 'DA_DUYET', 1),
('Newly built airy room', 2800000, 22, 'Chien Thang Street, Van Quan', 'People''s Security Academy', '0912345678', '4k/kWh', '25k/m3', '100k/room', 'Near market, good security', 'phong2.jpg', 0, 1, 1, 1, 0, 1, 0, 0, 'DA_DUYET', 3),
('Mini apartment near Phung Khoang market', 3700000, 35, 'Alley 159 Phung Khoang, Mo Lao', 'Viet Nam University of Traditional Medicine', '0912345678', '4k/kWh', '100k/person', '100k/room', 'Near supermarket, convenient transportation', 'phong3.jpg', 0, 1, 0, 1, 1, 1, 1, 0, 'DA_DUYET', 4),
('Room near Phenikaa', 3000000, 28, 'Alley 10 Nguyen Trac, Yen Nghia', 'Phenikaa University', '0912345678', '3.5k/kWh', '80k/person', '80k/room', 'Right next to Phenikaa, new room', 'phong4.jpg', 1, 1, 0, 1, 1, 0, 1, 1, 'DA_DUYET', 5),
('Room with airy balcony on Le Loi', 2100000, 18, 'Alley 4 Le Loi, Quang Trung', 'National University of Art Education', '0977333444', '3.4k/kWh', '30k/m3', '80k/person', 'Large balcony, many trees', 'phong5.jpg', 1, 1, 1, 1, 0, 1, 0, 0, 'DA_DUYET', 3),
('Cheap student room on Tran Phu', 1800000, 17, 'Alley 10 Tran Phu, Mo Lao', 'Posts and Telecommunications Institute of Technology', '0344555666', '3.5k/kWh', '25k/m3', '50k/room', 'Near Ho Guom Plaza, walk to bus stop', 'phong6.jpg', 0, 0, 0, 1, 0, 1, 0, 1, 'DA_DUYET', 4),
('Fingerprint lock room on Phung Hung', 2600000, 23, '291 Phung Hung, Mo Lao', 'Vietnam Military Medical Academy', '0355666777', '3.8k/kWh', '28k/m3', '100k/person', 'Absolute security, 24/7 camera', 'phong7.jpg', 1, 1, 1, 1, 1, 1, 1, 0, 'DA_DUYET', 5),
('Premium mini apartment on Le Trong Tan', 4100000, 40, '12 Le Trong Tan, La Khe', 'Dai Nam University', '0388999000', '4k/kWh', '100k/person', '150k/room', 'Spacious like an apartment, full wooden furniture', 'phong8.jpg', 1, 1, 1, 1, 1, 1, 0, 1, 'DA_DUYET', 3),
('High-class residential room in Van Khe', 2900000, 29, 'Alley 2 Van Khe, Phu La', 'Hanoi Procuracy University', '0399888777', '3.5k/kWh', '80k/person', '50k/room', 'Near train station, free high-speed WiFi', 'phong9.jpg', 1, 1, 1, 1, 1, 1, 0, 0, 'DA_DUYET', 4),
('Room with Van Quan lake view', 4500000, 35, 'No. 12 19/5 Street, Van Quan', 'People''s Security Academy', '0988123456', '4k/kWh', '100k/person', '150k/room', 'Very airy lake view, full premium wooden furniture', 'phong10.jpg', 1, 1, 1, 1, 1, 1, 1, 1, 'DA_DUYET', 12),
('Self-contained mini apartment near Architecture Uni', 3200000, 25, 'Alley 19 Tran Phu, Mo Lao', 'Hanoi Architectural University', '0977222333', '3.8k/kWh', '30k/m3', '80k/person', '100m from Architecture Uni gate, 2 mins walk', 'phong11.jpg', 1, 1, 1, 1, 0, 1, 0, 0, 'DA_DUYET', 8),
('Cheap room for Phenikaa students', 2200000, 20, 'Alley 56 Yen Lo, Yen Nghia', 'Phenikaa University', '0366999888', '3.5k/kWh', '25k/m3', '50k/person', 'Quiet, suitable for studying, near campus', 'phong12.jpg', 0, 1, 0, 1, 1, 1, 0, 1, 'DA_DUYET', 5),
('Fully furnished studio near Military Medical Academy', 3800000, 30, 'Alley 160 Phung Hung, Phuc La', 'Vietnam Military Medical Academy', '0344555111', '4k/kWh', '100k/person', '100k/room', 'Brand new room, safe fingerprint lock', 'phong13.jpg', 1, 1, 1, 1, 1, 1, 1, 1, 'DA_DUYET', 15),
('Large room near Dai Nam University', 2500000, 28, 'No. 12 Xom, Phu Lam', 'Dai Nam University', '0911222333', '3.5k/kWh', '28k/m3', '50k/room', 'Near Xom market, bus stop right at the door', 'phong14.jpg', 0, 1, 1, 1, 1, 1, 0, 0, 'DA_DUYET', 7),
('Self-contained room in Ao Sen alley', 3300000, 24, 'Alley 2 Ao Sen, Mo Lao', 'Posts and Telecommunications Institute of Technology', '0399000888', '3.8k/kWh', '30k/m3', '100k/person', 'Street food paradise, near PTIT and Architecture Uni', 'phong15.jpg', 1, 1, 1, 1, 0, 1, 1, 1, 'DA_DUYET', 20),
('Mini room for students on Quang Trung', 2000000, 18, 'Alley 17 Nguyen Viet Xuan, Quang Trung', 'Ha Dong Medical College', '0966444555', '3.4k/kWh', '25k/m3', '50k/person', 'Near Ha Dong General Hospital, convenient commute', 'phong16.jpg', 0, 1, 0, 1, 0, 1, 0, 0, 'DA_DUYET', 4),
('Premium serviced apartment in Duong Noi', 5000000, 45, 'Duong Noi Urban Area, Duong Noi', 'Hanoi Procuracy University', '0322111444', '4k/kWh', '120k/person', '200k/room', 'Luxurious, elevator, spacious parking basement', 'phong17.jpg', 1, 1, 1, 1, 1, 1, 1, 1, 'DA_DUYET', 10),
('Airy room in Ba La', 2400000, 22, 'Alley 4 Ba La, Phu Lam', 'Dai Nam University', '0988777666', '3.5k/kWh', '25k/m3', '80k/person', 'Near elevated train station, easy commute to downtown', 'phong18.jpg', 1, 1, 0, 1, 1, 1, 0, 0, 'DA_DUYET', 6),
('Premium mini apartment in Van Phuc', 4200000, 38, 'No. 5 Lua Street, Van Phuc', 'CMC University', '0912000555', '4k/kWh', '30k/m3', '150k/room', 'High-class residential area, near silk village, very airy', 'phong19.jpg', 1, 1, 1, 1, 1, 1, 1, 1, 'DA_DUYET', 11),
('Self-contained room in Phung Khoang', 2700000, 22, 'Alley 1 To Hieu, Ha Cau', 'Hanoi Open University', '0388222999', '3.8k/kWh', '28k/m3', '100k/person', 'Student shopping paradise, very convenient for buses', 'phong20.jpg', 1, 1, 0, 1, 1, 1, 1, 0, 'DA_DUYET', 9);

CREATE TABLE binh_luan (
    ma_binh_luan INT AUTO_INCREMENT PRIMARY KEY,
    ma_phong INT NOT NULL,
    ten_nguoi_dung VARCHAR(100) NOT NULL,
    noi_dung TEXT NOT NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_phong) REFERENCES phong_tro(ma_phong) ON DELETE CASCADE
);