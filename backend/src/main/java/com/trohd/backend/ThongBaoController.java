package com.trohd.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class ThongBaoController {
    @Autowired private ThongBaoRepository repo;

    @GetMapping("/danh-sach-thong-bao/{maNguoiDung}")
    public List<ThongBao> getTB(@PathVariable Integer maNguoiDung) {
        // Gọi đúng hàm sắp xếp theo ID giảm dần
        return repo.findByMaNguoiNhanOrderByMaThongBaoDesc(maNguoiDung);
    }

    @PostMapping("/danh-dau-da-xem/{id}")
    public String markRead(@PathVariable Integer id) {
        repo.findById(id).ifPresent(tb -> {
            tb.setTrangThaiXem(1);
            repo.save(tb);
        });
        return "SUCCESS";
    }

    @PostMapping("/gui-thong-bao-he-thong")
    public String sendTB(@RequestBody ThongBao tb) {
        tb.setTrangThaiXem(0);
        repo.save(tb);
        return "SUCCESS";
    }
}