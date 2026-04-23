package com.trohd.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface BinhLuanRepository extends JpaRepository<BinhLuan, Integer> {
    
    List<BinhLuan> findByMaPhongOrderByMaBinhLuanDesc(Integer maPhong);
    
    // Hàm kiểm tra xem user đã đánh giá phòng này chưa
    boolean existsByMaPhongAndTenNguoiDung(Integer maPhong, String tenNguoiDung);

    // HÀM TĂNG LIKE CHUẨN (Chỉ để 1 hàm duy nhất ở bên TRONG interface)
    @Transactional
    @Modifying
    @Query("UPDATE BinhLuan b SET b.luotLike = COALESCE(b.luotLike, 0) + 1 WHERE b.maBinhLuan = ?1")
    void tangLuotThich(Integer maBinhLuan);
}