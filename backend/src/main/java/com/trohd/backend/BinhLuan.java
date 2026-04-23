package com.trohd.backend;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class BinhLuan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maBinhLuan;

    private Integer maPhong;
    private String tenNguoiDung;
    private String noiDung;
    
    // THÊM CỘT NÀY VÀO ĐỂ HẾT LỖI LIKE
    private Integer luotLike = 0; 

    private LocalDateTime ngayTao = LocalDateTime.now();
    // Thêm cột này vào dưới cột luotLike trong file BinhLuan.java
@Column(name = "so_sao")
private Integer soSao = 5;

// Nhớ thêm 2 dòng này ở cuối file (khu vực Getter/Setter)
public Integer getSoSao() { return soSao; }
public void setSoSao(Integer soSao) { this.soSao = soSao; }

    // GETTER & SETTER
    public Integer getMaBinhLuan() { return maBinhLuan; }
    public void setMaBinhLuan(Integer maBinhLuan) { this.maBinhLuan = maBinhLuan; }
    public Integer getMaPhong() { return maPhong; }
    public void setMaPhong(Integer maPhong) { this.maPhong = maPhong; }
    public String getTenNguoiDung() { return tenNguoiDung; }
    public void setTenNguoiDung(String tenNguoiDung) { this.tenNguoiDung = tenNguoiDung; }
    public String getNoiDung() { return noiDung; }
    public void setNoiDung(String noiDung) { this.noiDung = noiDung; }
    
    // PHẢI CÓ 2 HÀM NÀY THÌ CONTROLLER MỚI HẾT BÁO ĐỎ
    public Integer getLuotLike() { return luotLike; }
    public void setLuotLike(Integer luotLike) { this.luotLike = luotLike; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
}