package com.trohd.backend;

public class DangNhapRequest {
    private String tenDangNhap;
    private String matKhau;

    // Phải có đúng 2 hàm này thì Controller mới hết đỏ
    public String getTenDangNhap() { return tenDangNhap; }
    public void setTenDangNhap(String tenDangNhap) { this.tenDangNhap = tenDangNhap; }
    public String getMatKhau() { return matKhau; }
    public void setMatKhau(String matKhau) { this.matKhau = matKhau; }
}