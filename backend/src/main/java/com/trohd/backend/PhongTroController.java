package com.trohd.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class PhongTroController {

    @Autowired private PhongTroRepository phongTroRepo;
    @Autowired private ThongBaoRepository thongBaoRepo;
    @Autowired private NguoiDungRepository nguoiDungRepo;
    @Autowired private HoTroRepository hoTroRepo;

    @GetMapping("/danh-sach-phong-phan-trang")
    public ResponseEntity<Page<PhongTro>> layPhongPhanTrang(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Page<PhongTro> ketQua = phongTroRepo.findByTrangThai("DA_DUYET", PageRequest.of(page, size, Sort.by("maPhong").descending()));
        return ResponseEntity.ok(ketQua);
    }

    @GetMapping("/top-6-noi-bat")
    public List<PhongTro> layTop6NoiBat() {
        return phongTroRepo.findAll(Sort.by(Sort.Direction.DESC, "luotXem"))
                .stream().limit(6).toList();
    }

    @GetMapping("/chi-tiet-phong/{id}")
    public ResponseEntity<PhongTro> layChiTietPhong(@PathVariable Integer id) {
        return phongTroRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/tang-view/{id}")
    public ResponseEntity<String> tangView(@PathVariable Integer id) {
        try {
            phongTroRepo.tangLuotXem(id);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR");
        }
    }

    @PostMapping("/dang-tin")
    public String dangTin(@RequestBody PhongTro phong) {
        if (phong.getMaNguoiDung() != null) {
            NguoiDung user = nguoiDungRepo.findById(phong.getMaNguoiDung()).orElse(null);
            if (user != null && "SINH_VIEN".equalsIgnoreCase(user.getQuyenHan())) {
                return "LOI_QUYEN_HAN";
            }
        }
        phong.setTrangThai("CHO_DUYET");
        phong.setLuotXem(0); 
        phongTroRepo.save(phong); // Lưu phòng trước để lấy maPhong

        // --- ĐOẠN SỬA: Thông báo cho Admin duyệt bài ---
        ThongBao tb = new ThongBao();
        tb.setMaNguoiNhan(1); // Mặc định ID Admin hệ thống là 1
        tb.setNoiDung("New listing pending approval: " + phong.getTieuDe() + " [#PT" + phong.getMaPhong() + "]");
        tb.setTrangThaiXem(0);
        thongBaoRepo.save(tb);

        return "THANH_CONG";
    }

    @PutMapping("/duyet-phong/{id}")
    public ResponseEntity<String> duyetPhong(@PathVariable Integer id) {
        return phongTroRepo.findById(id).map(p -> {
            p.setTrangThai("DA_DUYET");
            phongTroRepo.save(p);
            
            if (p.getMaNguoiDung() != null) {
                ThongBao tbChuTro = new ThongBao();
                tbChuTro.setMaNguoiNhan(p.getMaNguoiDung());
                tbChuTro.setNoiDung("🎉 Your listing: '" + p.getTieuDe() + "' [#PT" + p.getMaPhong() + "] has been approved!");
                tbChuTro.setTrangThaiXem(0);
                thongBaoRepo.save(tbChuTro);
            }
            
            nguoiDungRepo.findAll().stream()
                .filter(u -> "SINH_VIEN".equalsIgnoreCase(u.getQuyenHan()))
                .forEach(sv -> {
                    ThongBao tb = new ThongBao();
                    tb.setMaNguoiNhan(sv.getMaNguoiDung());
                    tb.setNoiDung("New room available: " + p.getTieuDe() + " [#PT" + p.getMaPhong() + "]. Check it now!");
                    tb.setTrangThaiXem(0);
                    thongBaoRepo.save(tb);
                });
            return ResponseEntity.ok("OK");
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/xoa-phong/{id}")
    public ResponseEntity<String> xoaPhong(@PathVariable Integer id) {
        if (phongTroRepo.existsById(id)) {
            phongTroRepo.deleteById(id);
            return ResponseEntity.ok("OK");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/danh-sach-phong-tro")
    public List<PhongTro> layTatCa(@RequestParam(required = false) String trangThai) {
        if (trangThai != null && !"TAT_CA".equals(trangThai)) {
            return phongTroRepo.findByTrangThaiOrderByNgayDangDesc(trangThai);
        }
        return phongTroRepo.findAllByOrderByNgayDangDesc();
    }

    @GetMapping("/phong-tro/chu-tro/{userId}")
    public List<PhongTro> layPhongCuaChuTro(@PathVariable Integer userId) {
        return phongTroRepo.findByMaNguoiDungOrderByNgayDangDesc(userId);
    }

    @GetMapping("/thong-ke")
    public Map<String, Object> layThongKe() {
        Map<String, Object> stats = new HashMap<>();
        List<PhongTro> listPhong = phongTroRepo.findAll();
        List<NguoiDung> listUser = nguoiDungRepo.findAll();
        
        stats.put("tongUser", listUser.size());
        stats.put("tongPhong", listPhong.size());
        stats.put("choDuyet", listPhong.stream().filter(p -> "CHO_DUYET".equals(p.getTrangThai())).count());
        stats.put("chuTro", listUser.stream().filter(u -> "CHU_TRO".equalsIgnoreCase(u.getQuyenHan())).count());
        stats.put("sinhVien", listUser.stream().filter(u -> "SINH_VIEN".equalsIgnoreCase(u.getQuyenHan())).count());
        
        long tongView = listPhong.stream()
            .mapToLong(p -> p.getLuotXem() != null ? p.getLuotXem() : 0).sum();
        stats.put("tongView", tongView);
        return stats;
    }

    @GetMapping("/tim-kiem")
    public List<PhongTro> timKiemPhong(
            @RequestParam(required = false) String truong,
            @RequestParam(required = false) String khu_vuc,
            @RequestParam(required = false) String muc_gia) {
        
        if (truong != null && truong.trim().isEmpty()) truong = null;
        if (khu_vuc != null && khu_vuc.trim().isEmpty()) khu_vuc = null;

        Integer giaMin = null;
        Integer giaMax = null;

        if (muc_gia != null && muc_gia.contains("-")) {
            try {
                String[] parts = muc_gia.split("-");
                if (parts.length == 2) {
                    giaMin = Integer.parseInt(parts[0]);
                    giaMax = Integer.parseInt(parts[1]);
                }
            } catch (NumberFormatException e) {
                giaMin = null;
                giaMax = null;
            }
        }
        
        return phongTroRepo.timKiemPhongTro(truong, khu_vuc, giaMin, giaMax);
    }

    @GetMapping("/danh-sach-ho-tro")
    public List<HoTro> layDanhSachHoTro() {
        return hoTroRepo.findAll();
    }
@PostMapping("/gui-ho-tro")
    public ResponseEntity<String> guiHoTro(@RequestBody HoTro hoTro) {
        // Lấy maNguoiDung từ localStorage nếu có
        String taiKhoan = ""; // Từ FE gửi, nhưng nếu FE gửi, dùng hoTro.getMaNguoiDung()
        // Giả sử FE gửi maNguoiDung, nếu không thì null

        hoTroRepo.save(hoTro); // Lưu đơn hỗ trợ mới vào DB

        // --- ĐOẠN SỬA: Thông báo cho Admin có đơn hỗ trợ mới ---
        ThongBao tbAdmin = new ThongBao();
        tbAdmin.setMaNguoiNhan(1); // Gửi cho Admin
        tbAdmin.setNoiDung("New support request from: " + hoTro.getHoTen());
        tbAdmin.setTrangThaiXem(0);
        thongBaoRepo.save(tbAdmin);

        return ResponseEntity.ok("OK");
    }
    @PutMapping("/sua-phong/{maPhongCapNhat}")
    public ResponseEntity<String> thucHienCapNhatPhongTro(@PathVariable Integer maPhongCapNhat, @RequestBody PhongTro thongTinMoi) {
        return phongTroRepo.findById(maPhongCapNhat).map(phongHienTai -> {
            phongHienTai.setTieuDe(thongTinMoi.getTieuDe());
            phongHienTai.setDiaChi(thongTinMoi.getDiaChi());
            phongHienTai.setGiaTien(thongTinMoi.getGiaTien());
            phongHienTai.setDienTich(thongTinMoi.getDienTich());
            phongHienTai.setGiaDien(thongTinMoi.getGiaDien());
            phongHienTai.setCoBanCong(thongTinMoi.getCoBanCong());
            phongHienTai.setGiaNuoc(thongTinMoi.getGiaNuoc());
            phongHienTai.setGanTruong(thongTinMoi.getGanTruong());
            phongHienTai.setViTriDacDia(thongTinMoi.getViTriDacDia());
            
            if (thongTinMoi.getHinhAnh() != null && !thongTinMoi.getHinhAnh().isEmpty()) {
                phongHienTai.setHinhAnh(thongTinMoi.getHinhAnh());
            }

            phongHienTai.setKhongChungChu(thongTinMoi.getKhongChungChu());
            phongHienTai.setVeSinhKhepKin(thongTinMoi.getVeSinhKhepKin());
            phongHienTai.setCoChoNauAn(thongTinMoi.getCoChoNauAn());
            phongHienTai.setCoDieuHoa(thongTinMoi.getCoDieuHoa());
            phongHienTai.setCoBinhNongLanh(thongTinMoi.getCoBinhNongLanh());
            phongHienTai.setDeXeMienPhi(thongTinMoi.getDeXeMienPhi());
            phongHienTai.setKhoaVanTay(thongTinMoi.getKhoaVanTay());
            phongHienTai.setCoMayGiat(thongTinMoi.getCoMayGiat());
            
            phongHienTai.setTrangThai("CHO_DUYET");
            phongTroRepo.save(phongHienTai);
            return ResponseEntity.ok("THANH_CONG");
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/phong-vip")
    public List<PhongTro> layPhongVip() {
        return phongTroRepo.findAll().stream()
                .filter(p -> "DA_DUYET".equals(p.getTrangThai()) && p.getIsVip() != null && p.getIsVip() == 1)
                .toList();
    }

    @PutMapping("/promote/{id}")
    public ResponseEntity<String> yeuCauVip(@PathVariable Integer id) {
        return phongTroRepo.findById(id).map(p -> {
            p.setIsVip(1);
            p.setTrangThai("CHO_DUYET"); // Chuyển sang chờ duyệt cho khớp logic Frontend
            phongTroRepo.save(p);
            return ResponseEntity.ok("THANH_CONG");
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/phan-hoi-ho-tro/{id}")
    public String phanHoiHoTro(@PathVariable Integer id) {
        return hoTroRepo.findById(id).map(h -> {
            h.setTrangThai("DA_XU_LY");
            hoTroRepo.save(h);

            // Bật lại đoạn này vì Database đã có maNguoiDung
            if (h.getMaNguoiDung() != null) {
                ThongBao tb = new ThongBao();
                tb.setMaNguoiNhan(h.getMaNguoiDung());
                tb.setNoiDung("✅ Your support request regarding '" + h.getNoiDung() + "' has been processed.");
                tb.setTrangThaiXem(0);
                thongBaoRepo.save(tb);
            }

            return "OK";
        }).orElse("ERROR");
    }
}