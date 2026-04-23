package com.trohd.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ThongBaoRepository extends JpaRepository<ThongBao, Integer> {
    // SỬA Tên hàm: Sắp xếp theo ID giảm dần (Desc) cho an toàn tuyệt đối
    List<ThongBao> findByMaNguoiNhanOrderByMaThongBaoDesc(Integer maNguoiNhan);
}