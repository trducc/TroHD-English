package com.trohd.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class BinhLuanController {

    @Autowired private BinhLuanRepository binhLuanRepo;
    @Autowired private PhongTroRepository phongTroRepo;
    @Autowired private ThongBaoRepository thongBaoRepo;
    
    // ĐÃ CHUYỂN VÀO BÊN TRONG CLASS CHO SẾP NÈ:
    @Autowired private NguoiDungRepository nguoiDungRepo;

    @GetMapping("/binh-luan/{maPhong}")
    public ResponseEntity<List<BinhLuan>> layBinhLuan(@PathVariable Integer maPhong) {
        try {
            List<BinhLuan> danhSach = binhLuanRepo.findByMaPhongOrderByMaBinhLuanDesc(maPhong);
            return new ResponseEntity<>(danhSach, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/binh-luan")
    public ResponseEntity<String> guiBinhLuan(@RequestBody BinhLuan yeuCau) {
        try {
            if (binhLuanRepo.existsByMaPhongAndTenNguoiDung(yeuCau.getMaPhong(), yeuCau.getTenNguoiDung())) {
                return new ResponseEntity<>("DA_DANH_GIA", HttpStatus.BAD_REQUEST);
            }

            binhLuanRepo.save(yeuCau);

            Optional<PhongTro> phongOpt = phongTroRepo.findById(yeuCau.getMaPhong());
            if (phongOpt.isPresent()) {
                PhongTro phong = phongOpt.get();
                if (phong.getMaNguoiDung() != null) {
                    ThongBao tb = new ThongBao();
                    tb.setMaNguoiNhan(phong.getMaNguoiDung());
                    tb.setNoiDung("User [" + yeuCau.getTenNguoiDung() + "] rated your listing: " + phong.getTieuDe());
                    tb.setTrangThaiXem(0);
                    thongBaoRepo.save(tb);
                }
            }
            return new ResponseEntity<>("OK", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/like-binh-luan/{id}")
    public ResponseEntity<?> likeBinhLuan(@PathVariable Integer id) {
        try {
            binhLuanRepo.tangLuotThich(id);
            
            Optional<BinhLuan> blOpt = binhLuanRepo.findById(id);
            if (blOpt.isPresent()) {
                BinhLuan bl = blOpt.get();
                if (bl.getTenNguoiDung() != null) {
                    NguoiDung chuNhan = nguoiDungRepo.findByTenDangNhap(bl.getTenNguoiDung()).orElse(null);
                    if (chuNhan != null) {
                        ThongBao tb = new ThongBao();
                        tb.setMaNguoiNhan(chuNhan.getMaNguoiDung());
                        tb.setNoiDung("👍 Someone liked your review on room #PT" + bl.getMaPhong());
                        tb.setTrangThaiXem(0);
                        thongBaoRepo.save(tb);
                    }
                }
            }
            return new ResponseEntity<>("OK", HttpStatus.OK);
        } catch (Exception loi) {
            return new ResponseEntity<>("ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}