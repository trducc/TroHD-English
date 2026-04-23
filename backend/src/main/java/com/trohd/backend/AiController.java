package com.trohd.backend;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*")
public class AiController {

    @Autowired private AiService dichVuAi;
    @Autowired private PhongTroRepository khoPhongTro;

    @GetMapping("/search")
    public Map<String, Object> smartSearch(@RequestParam String message) {
        Map<String, Object> phanHoi = new HashMap<>();
        String chuoiJson = dichVuAi.extractCriteria(message);

        String khuVuc = null;
        String truongHoc = null;
        Integer giaNhoNhat = 0;
        Integer giaLonNhat = 99999999;
        boolean dieuHoa = false;
        boolean veSinh = false;
        boolean nongLanh = false;
        boolean bep = false;
        boolean deXe = false;
        boolean khoa = false;
        boolean mayGiat = false;
        boolean khongChungChu = false;

        try {
            JsonObject tieuChi = JsonParser.parseString(chuoiJson).getAsJsonObject();

            khuVuc = layChuoi(tieuChi, "area");
            truongHoc = layChuoi(tieuChi, "school");
            giaNhoNhat = laySo(tieuChi, "minPrice", 0);
            giaLonNhat = laySo(tieuChi, "maxPrice", 99999999);

            dieuHoa = layCo(tieuChi, "air_conditioner");
            veSinh = layCo(tieuChi, "private_bathroom");
            nongLanh = layCo(tieuChi, "water_heater");
            bep = layCo(tieuChi, "kitchen");
            deXe = layCo(tieuChi, "free_parking");
            khoa = layCo(tieuChi, "smart_lock");
            mayGiat = layCo(tieuChi, "washing_machine");
            khongChungChu = layCo(tieuChi, "no_landlord");

        } catch (Exception loi) {
        }

        String chuoiThuong = message.toLowerCase();

        if (dieuHoa && !chuoiThuong.matches(".*(\\bac\\b|air condition|máy lạnh|điều hòa).*")) {
            dieuHoa = false;
        }

        if (khuVuc == null) {
            if (chuoiThuong.contains("mo lao") || chuoiThuong.contains("ao sen") || chuoiThuong.contains("tran phu")) khuVuc = "Mo Lao";
            else if (chuoiThuong.contains("van quan") || chuoiThuong.contains("19/5")) khuVuc = "Van Quan";
            else if (chuoiThuong.contains("phung khoang")) khuVuc = "Phung Khoang";
            else if (chuoiThuong.contains("yen nghia") || chuoiThuong.contains("yen lo")) khuVuc = "Yen Nghia";
            else if (chuoiThuong.contains("quang trung") || chuoiThuong.contains("le loi") || chuoiThuong.contains("nguyen viet xuan")) khuVuc = "Quang Trung";
            else if (chuoiThuong.contains("la khe") || chuoiThuong.contains("le trong tan")) khuVuc = "La Khe";
            else if (chuoiThuong.contains("phu lam") || chuoiThuong.contains("xom") || chuoiThuong.contains("ba la")) khuVuc = "Phu Lam";
            else if (chuoiThuong.matches(".*\\bphu la\\b.*") || chuoiThuong.contains("van khe") || chuoiThuong.contains("phung hung")) khuVuc = "Phu La";
            else if (chuoiThuong.contains("duong noi")) khuVuc = "Duong Noi";
            else if (chuoiThuong.contains("van phuc") || chuoiThuong.contains("lua")) khuVuc = "Van Phuc";
            else if (chuoiThuong.contains("ha cau") || chuoiThuong.contains("to hieu")) khuVuc = "Ha Cau";
        }

        if (truongHoc == null) {
            if (chuoiThuong.contains("phenikaa")) truongHoc = "Phenikaa University";
            else if (chuoiThuong.contains("ptit") || chuoiThuong.contains("telecommunication")) truongHoc = "Posts and Telecommunications Institute of Technology";
            else if (chuoiThuong.contains("architecture")) truongHoc = "Hanoi Architectural University";
            else if (chuoiThuong.contains("security")) truongHoc = "People's Security Academy";
            else if (chuoiThuong.contains("traditional medicine")) truongHoc = "Viet Nam University of Traditional Medicine";
            else if (chuoiThuong.contains("art education")) truongHoc = "National University of Art Education";
            else if (chuoiThuong.contains("military medical")) truongHoc = "Vietnam Military Medical Academy";
            else if (chuoiThuong.contains("dai nam")) truongHoc = "Dai Nam University";
            else if (chuoiThuong.contains("procuracy")) truongHoc = "Hanoi Procuracy University";
            else if (chuoiThuong.contains("medical college")) truongHoc = "Ha Dong Medical College";
            else if (chuoiThuong.contains("cmc")) truongHoc = "CMC University";
            else if (chuoiThuong.contains("open university")) truongHoc = "Hanoi Open University";
            else if (chuoiThuong.contains("architecture") || chuoiThuong.matches(".*\\bhau\\b.*")) truongHoc = "Hanoi Architectural University";
        }

        if (!dieuHoa && chuoiThuong.matches(".*(\\bac\\b|air condition|máy lạnh|điều hòa).*")) dieuHoa = true;
        if (!veSinh && chuoiThuong.matches(".*(private bathroom|khép kín|wc|toilet).*")) veSinh = true;
        if (!nongLanh && chuoiThuong.matches(".*(heater|nóng lạnh|hot water).*")) nongLanh = true;
        if (!bep && chuoiThuong.matches(".*(kitchen|cook|bếp|nấu ăn).*")) bep = true;
        if (!deXe && chuoiThuong.matches(".*(park|để xe).*")) deXe = true;
        if (!khoa && chuoiThuong.matches(".*(smart lock|lock|vân tay|fingerprint).*")) khoa = true;
        if (!mayGiat && chuoiThuong.matches(".*(wash|máy giặt|laundry).*")) mayGiat = true;
        if (!khongChungChu && chuoiThuong.matches(".*(no landlord|không chung chủ|private entrance).*")) khongChungChu = true;

        // ĐÃ SỬA: Luôn quét Regex để bốc giá tiền, không tin tưởng AI 100% nữa
        Matcher mauTimKiem = Pattern.compile("(\\d+(?:\\.\\d+)?)\\s*(m|million|triệu|trieu)").matcher(chuoiThuong);
        List<Integer> cacMucGia = new ArrayList<>();
        while(mauTimKiem.find()) {
            cacMucGia.add((int) (Double.parseDouble(mauTimKiem.group(1)) * 1000000));
        }

        if (cacMucGia.size() >= 2) {
            // Nếu gõ 2 mức giá (between X and Y), ép luôn thành Min và Max
            giaNhoNhat = Math.min(cacMucGia.get(0), cacMucGia.get(1));
            giaLonNhat = Math.max(cacMucGia.get(0), cacMucGia.get(1));
        } else if (cacMucGia.size() == 1) {
            // Nếu chỉ có 1 mức giá, kiểm tra xem AI đã set max chưa, chưa thì đè vào
            if (giaLonNhat == 99999999 || giaLonNhat < cacMucGia.get(0)) {
                giaLonNhat = cacMucGia.get(0);
            }
        }

        if (truongHoc != null) {
            String truongHocThuong = truongHoc.toLowerCase();
            if (truongHocThuong.contains("ptit") || truongHocThuong.contains("telecommunication")) truongHoc = "Posts and Telecommunications Institute of Technology";
            else if (truongHocThuong.contains("architecture")) truongHoc = "Hanoi Architectural University";
            else if (truongHocThuong.contains("phenikaa")) truongHoc = "Phenikaa University";
            else if (truongHocThuong.contains("security")) truongHoc = "People's Security Academy";
            else if (truongHocThuong.contains("traditional medicine")) truongHoc = "Viet Nam University of Traditional Medicine";
            else if (truongHocThuong.contains("art education")) truongHoc = "National University of Art Education";
            else if (truongHocThuong.contains("military medical")) truongHoc = "Vietnam Military Medical Academy";
            else if (truongHocThuong.contains("dai nam")) truongHoc = "Dai Nam University";
            else if (truongHocThuong.contains("procuracy")) truongHoc = "Hanoi Procuracy University";
            else if (truongHocThuong.contains("medical college")) truongHoc = "Ha Dong Medical College";
            else if (truongHocThuong.contains("cmc")) truongHoc = "CMC University";
            else if (truongHocThuong.contains("open university")) truongHoc = "Hanoi Open University";
            else if (truongHocThuong.contains("architecture") || truongHocThuong.matches(".*\\bhau\\b.*")) truongHoc = "Hanoi Architectural University";
        }

        List<PhongTro> danhSachPhong = khoPhongTro.timKiemPhongTro(truongHoc, khuVuc, giaNhoNhat, giaLonNhat);
        long tongSoPhong = khoPhongTro.count();

        final Integer giaMinCuoi = giaNhoNhat;
        final Integer giaMaxCuoi = giaLonNhat;

        danhSachPhong = danhSachPhong.stream()
            .filter(p -> p.getGiaTien() != null && p.getGiaTien() >= giaMinCuoi && p.getGiaTien() <= giaMaxCuoi)
            .collect(Collectors.toList());

        if (dieuHoa) danhSachPhong = danhSachPhong.stream().filter(p -> p.getCoDieuHoa() != null && p.getCoDieuHoa() == 1).collect(Collectors.toList());
        if (veSinh) danhSachPhong = danhSachPhong.stream().filter(p -> p.getVeSinhKhepKin() != null && p.getVeSinhKhepKin() == 1).collect(Collectors.toList());
        if (nongLanh) danhSachPhong = danhSachPhong.stream().filter(p -> p.getCoBinhNongLanh() != null && p.getCoBinhNongLanh() == 1).collect(Collectors.toList());
        if (bep) danhSachPhong = danhSachPhong.stream().filter(p -> p.getCoChoNauAn() != null && p.getCoChoNauAn() == 1).collect(Collectors.toList());
        if (deXe) danhSachPhong = danhSachPhong.stream().filter(p -> p.getDeXeMienPhi() != null && p.getDeXeMienPhi() == 1).collect(Collectors.toList());
        if (khoa) danhSachPhong = danhSachPhong.stream().filter(p -> p.getKhoaVanTay() != null && p.getKhoaVanTay() == 1).collect(Collectors.toList());
        if (mayGiat) danhSachPhong = danhSachPhong.stream().filter(p -> p.getCoMayGiat() != null && p.getCoMayGiat() == 1).collect(Collectors.toList());
        if (khongChungChu) danhSachPhong = danhSachPhong.stream().filter(p -> p.getKhongChungChu() != null && p.getKhongChungChu() == 1).collect(Collectors.toList());

        if (danhSachPhong.isEmpty() || (danhSachPhong.size() >= (int)tongSoPhong && message.trim().length() > 3)) {
            phanHoi.put("reply", "I'm sorry, I couldn't find any rooms matching your specific request. Please try broadening your criteria! \ud83d\udd0d");
            phanHoi.put("url", "danhsach.html");
            phanHoi.put("count", 0);
        } else {
            String duongDan = String.format("khuvuc=%s&truong=%s&gia=%d-%d&ac=%b&wc=%b&heater=%b&kit=%b&park=%b&lock=%b&wash=%b&nohost=%b",
                khuVuc != null ? URLEncoder.encode(khuVuc.trim(), StandardCharsets.UTF_8) : "",
                truongHoc != null ? URLEncoder.encode(truongHoc.trim(), StandardCharsets.UTF_8) : "",
                giaMinCuoi, giaMaxCuoi, dieuHoa, veSinh, nongLanh, bep, deXe, khoa, mayGiat, khongChungChu);

            phanHoi.put("reply", "Great news! I found " + danhSachPhong.size() + " rooms matching your request exactly! \ud83c\udfe0");
            phanHoi.put("url", "danhsach.html?" + duongDan);
            phanHoi.put("count", danhSachPhong.size());
        }

        return phanHoi;
    }

    private String layChuoi(JsonObject doiTuong, String khoa) {
        for(String k : doiTuong.keySet()) {
            if(k.equalsIgnoreCase(khoa) && !doiTuong.get(k).isJsonNull()) {
                String giaTri = doiTuong.get(k).getAsString();
                if (giaTri == null || giaTri.trim().isEmpty() || giaTri.equalsIgnoreCase("null")) return null;
                return giaTri.trim();
            }
        }
        return null;
    }

    private boolean layCo(JsonObject doiTuong, String khoa) {
        for(String k : doiTuong.keySet()) {
            if(k.equalsIgnoreCase(khoa) && !doiTuong.get(k).isJsonNull()) {
                try { return doiTuong.get(k).getAsBoolean(); } catch (Exception loi) {
                    String chuoi = doiTuong.get(k).getAsString().toLowerCase();
                    return chuoi.equals("true") || chuoi.equals("1") || chuoi.equals("yes");
                }
            }
        }
        return false;
    }

    private Integer laySo(JsonObject doiTuong, String khoa, Integer macDinh) {
        try {
            for(String k : doiTuong.keySet()) {
                if(k.equalsIgnoreCase(khoa) && !doiTuong.get(k).isJsonNull()) {
                    String chuoiSo = doiTuong.get(k).getAsString().toLowerCase().replaceAll("[^0-9.]", "");
                    if (chuoiSo.isEmpty() || chuoiSo.equals(".")) return macDinh;
                    double giaTriSo = Double.parseDouble(chuoiSo);
                    if (giaTriSo > 0 && giaTriSo <= 1000) giaTriSo *= 1000000;
                    return (int) giaTriSo;
                }
            }
        } catch (Exception loi) {}
        return macDinh;
    }
}