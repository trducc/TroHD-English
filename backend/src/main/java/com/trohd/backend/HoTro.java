package com.trohd.backend;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ho_tro")
public class HoTro {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_ho_tro") private Integer maHoTro;
    @Column(name = "ho_ten") private String hoTen;
    @Column(name = "lien_he") private String lienHe;
    @Column(name = "noi_dung", columnDefinition = "TEXT") private String noiDung;
    @Column(name = "ma_nguoi_dung") private Integer maNguoiDung;
    @Column(name = "thoi_gian") private String thoiGian;
    @Column(name = "trang_thai") private String trangThai;

    @PrePersist protected void onCreate() {
        if (thoiGian == null) thoiGian = LocalDateTime.now().toString();
        if (trangThai == null) trangThai = "CHUA_XU_LY";
    }

    // Getters and Setters
    public Integer getMaHoTro() { return maHoTro; }
    public void setMaHoTro(Integer maHoTro) { this.maHoTro = maHoTro; }
    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }
    public String getLienHe() { return lienHe; }
    public void setLienHe(String lienHe) { this.lienHe = lienHe; }
    public String getNoiDung() { return noiDung; }
    public void setNoiDung(String noiDung) { this.noiDung = noiDung; }
    public Integer getMaNguoiDung() { return maNguoiDung; }
    public void setMaNguoiDung(Integer maNguoiDung) { this.maNguoiDung = maNguoiDung; }
    public String getThoiGian() { return thoiGian; }
    public void setThoiGian(String thoiGian) { this.thoiGian = thoiGian; }
    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }
}