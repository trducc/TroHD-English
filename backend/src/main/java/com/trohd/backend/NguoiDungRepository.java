package com.trohd.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, Integer> {
    
    @Query("SELECT n FROM NguoiDung n WHERE n.tenDangNhap = :ten")
    Optional<NguoiDung> findByTenDangNhap(@Param("ten") String ten);

    @Query("SELECT n FROM NguoiDung n WHERE n.tenDangNhap = :ten AND n.matKhau = :mk")
    Optional<NguoiDung> findByTenDangNhapAndMatKhau(@Param("ten") String ten, @Param("mk") String mk);

    @Query("SELECT n FROM NguoiDung n WHERE n.quyenHan = :quyen")
    List<NguoiDung> findByQuyenHan(@Param("quyen") String quyen);

    @Query("SELECT n FROM NguoiDung n WHERE n.trangThai = :tt")
    List<NguoiDung> findByTrangThai(@Param("tt") String tt);

    @Query("SELECT n FROM NguoiDung n WHERE (:quyenHan = 'TAT_CA' OR n.quyenHan = :quyenHan) AND (:trangThai = 'TAT_CA' OR n.trangThai = :trangThai)")
    List<NguoiDung> locDanhSachNguoiDung(@Param("quyenHan") String quyenHan, @Param("trangThai") String trangThai);
}