package com.trohd.backend;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface PhongTroRepository extends JpaRepository<PhongTro, Integer> {

    // Tăng lượt xem: Dùng COALESCE để tránh lỗi nếu ban đầu luotXem là NULL
    @Modifying
    @Transactional
    @Query("UPDATE PhongTro p SET p.luotXem = COALESCE(p.luotXem, 0) + 1 WHERE p.maPhong = :id")
    void tangLuotXem(@Param("id") Integer id);

    // Tìm kiếm: Đã bổ sung check chuỗi rỗng '' để đảm bảo không bị sót tin đăng
    @Query("SELECT p FROM PhongTro p WHERE p.trangThai = 'DA_DUYET' " +
           "AND (:truong IS NULL OR :truong = '' OR p.ganTruong LIKE CONCAT('%', :truong, '%')) " +
           "AND (:khuVuc IS NULL OR :khuVuc = '' OR p.diaChi LIKE CONCAT('%', :khuVuc, '%')) " +
           "AND (:giaMin IS NULL OR p.giaTien >= :giaMin) " +
           "AND (:giaMax IS NULL OR p.giaTien <= :giaMax) " +
           "ORDER BY p.ngayDang DESC")
    List<PhongTro> timKiemPhongTro(
            @Param("truong") String truong,
            @Param("khuVuc") String khuVuc,
            @Param("giaMin") Integer giaMin,
            @Param("giaMax") Integer giaMax);

    // Lấy danh sách theo trạng thái (Dùng cho trang danh sách admin)
    List<PhongTro> findByTrangThaiOrderByNgayDangDesc(String trangThai);

    // Lấy tất cả (Dùng khi admin chọn lọc "TAT_CA")
    List<PhongTro> findAllByOrderByNgayDangDesc();

    // Lấy danh sách phân trang (Dùng cho trang chủ/danh sách sinh viên)
    Page<PhongTro> findByTrangThai(String trangThai, Pageable pageable);

    // Lấy danh sách phòng của một chủ trọ cụ thể
    List<PhongTro> findByMaNguoiDungOrderByNgayDangDesc(Integer maNguoiDung);
}