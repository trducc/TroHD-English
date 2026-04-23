package com.trohd.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class NguoiDungController {
    
    @Autowired
    private NguoiDungRepository repo;

    @PostMapping("/dang-nhap")
    public ResponseEntity<?> login(@RequestBody DangNhapRequest req) {
        NguoiDung user = repo.findByTenDangNhapAndMatKhau(req.getTenDangNhap(), req.getMatKhau()).orElse(null);
        if (user != null) {
            // Kiểm tra theo đúng Tiếng Việt của Frontend
            if ("Đã khóa".equals(user.getTrangThai()) || "Locked".equals(user.getTrangThai())) {
                return ResponseEntity.status(403).body("LOCKED");
            }
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("SAI"); 
    }

    @PostMapping("/dang-ky")
public ResponseEntity<?> register(@RequestBody NguoiDung newUser) {
    // ... code check trùng tên ...
    newUser.setTrangThai("Active"); // Đã sửa từ "Hoạt động" sang "Active"
    repo.save(newUser);
    return ResponseEntity.ok("THANH_CONG"); 
}

    // ĐÃ BỔ SUNG: API Lọc danh sách tài khoản theo quyền và trạng thái
   @GetMapping("/danh-sach-tai-khoan")
public List<NguoiDung> getUsers(
        @RequestParam(defaultValue = "TAT_CA") String quyenHan,
        @RequestParam(defaultValue = "TAT_CA") String trangThai) {
    
    List<NguoiDung> danhSach = repo.findAll();
    return danhSach.stream()
        .filter(u -> "TAT_CA".equals(quyenHan) || quyenHan.equals(u.getQuyenHan()))
        .filter(u -> "TAT_CA".equals(trangThai) || trangThai.equals(u.getTrangThai()))
        .toList();
}
    // ĐÃ BỔ SUNG: API Khóa / Mở khóa tài khoản cho Admin
    @PutMapping("/trang-thai-tai-khoan/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestParam String trangThaiMoi) {
        NguoiDung user = repo.findById(id).orElse(null);
        if (user != null) {
            user.setTrangThai(trangThaiMoi);
            repo.save(user);
            return ResponseEntity.ok("OK");
        }
        return ResponseEntity.notFound().build();
    }
}

