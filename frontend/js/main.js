const vungPhongCachHeThong = document.createElement('style');
vungPhongCachHeThong.innerHTML = `
    @keyframes bell-shake { 0%, 100% { transform: rotate(0); } 15% { transform: rotate(15deg); } 30% { transform: rotate(-15deg); } 45% { transform: rotate(10deg); } 60% { transform: rotate(-10deg); } }
    .bell-ringing i { animation: bell-shake 0.7s ease-in-out infinite; color: #dc3545 !important; }
    .back-to-top { position: fixed; bottom: 30px; right: 30px; width: 45px; height: 45px; background: #0d6efd; color: white; border: none; border-radius: 50%; display: none; align-items: center; justify-content: center; z-index: 1000; cursor: pointer; transition: 0.3s; }
    .back-to-top.show { display: flex; }
    .card-phong { transition: transform 0.3s ease; }
    .card-phong:hover { transform: translateY(-10px); }
    
    /* --- CHẾ ĐỘ TỐI CƠ BẢN --- */
    body.dark-mode { background-color: #121212 !important; color: #e0e0e0 !important; }
    body.dark-mode .card, body.dark-mode .navbar, body.dark-mode .modal-content, body.dark-mode .bg-white { background-color: #1e1e1e !important; color: #ffffff !important; border-color: #333 !important; }
    body.dark-mode .text-muted { color: #aaa !important; }
    body.dark-mode input, body.dark-mode textarea, body.dark-mode select { background-color: #2d2d2d !important; color: #fff !important; border-color: #444 !important; }
    
    /* --- ĐẶC TRỊ VIP TRONG DARK MODE (PHÁ GRADIENT TRẮNG) --- */
    /* Dùng 'background: none' để diệt cái dải màu trắng trong style.css */
    body.dark-mode .card.card-vip, 
    body.dark-mode .card.card-vip .card-body { 
        background: #1a1608 !important; /* Đen ánh vàng cực đậm */
        background-image: none !important; 
        border: 2px solid #ffd700 !important; 
    }

    /* Ép tất cả các thẻ con bên trong VIP Card (h4, h5, p, span) thành màu sáng */
    body.dark-mode .card.card-vip h4, 
    body.dark-mode .card.card-vip h5, 
    body.dark-mode .card.card-vip p, 
    body.dark-mode .card.card-vip span:not(.badge) {
        color: #ffffff !important; 
    }

    /* Riêng số tiền VND thì cho màu vàng kim rực rỡ */
    body.dark-mode .card.card-vip h4 {
        color: #ffc107 !important; 
    }

    /* Chỉnh lại các ô tiện ích (Amenity Pills) cho tối lại để nổi bật chữ trắng */
    body.dark-mode .card.card-vip .amenity-pill {
        background: #333 !important;
        border-color: #444 !important;
        color: #eee !important;
    }

    /* Fix màu cho dải ruy băng VIP */
    body.dark-mode .vip-ribbon span {
        color: #000 !important; /* Chữ VIP vẫn màu đen trên nền vàng ruy băng */
    }
`;
document.head.appendChild(vungPhongCachHeThong);

let trangHienTaiCuaHeThong = 0;
const soPhongMoiTrangHienThi = 9;
const duongDanGocApi = "http://localhost:9091";

if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');

let loaiLenhQuanTriHienTai = '';
let maPhongDuocChonQuanTri = null;
let maNguoiDungDuocChon = null;
let trangThaiTaiKhoanMoi = '';
let maPhongDangSua = null;

// Hàm thông báo chung
function hienThiThongBao(tieuDeThongBao, noiDungThongBao, loaiThongBao, hanhDongSauKhiDong) {
    let modalCuTonTai = document.getElementById('modalThongBaoChung');
    if (modalCuTonTai) modalCuTonTai.remove();

    let maBieuTuong = loaiThongBao === 'loi' ? '<i class="fa-solid fa-circle-xmark text-danger" style="font-size: 4rem;"></i>' :
                loaiThongBao === 'canhbao' || loaiThongBao === 'xacnhan' ? '<i class="fa-solid fa-triangle-exclamation text-warning" style="font-size: 4rem;"></i>' :
                '<i class="fa-solid fa-circle-check text-success" style="font-size: 4rem;"></i>';

    let maNutHuy = loaiThongBao === 'xacnhan' ? '<button type="button" class="btn btn-light fw-bold rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>' : '';
    let chuNutDongY = loaiThongBao === 'xacnhan' ? 'Confirm' : 'Close';
    let lopMauNutDongY = loaiThongBao === 'loi' ? 'btn-danger' : 'btn-primary';

    let maHtmlModal = '<div class="modal fade" id="modalThongBaoChung" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">' +
        '<div class="modal-dialog modal-dialog-centered">' +
            '<div class="modal-content rounded-4 border-0 shadow">' +
                '<div class="modal-body text-center p-5">' +
                    '<div class="mb-4">' + maBieuTuong + '</div>' +
                    '<h4 class="fw-bold mb-3">' + tieuDeThongBao + '</h4>' +
                    '<p class="text-muted mb-4">' + noiDungThongBao + '</p>' +
                    '<div class="d-flex justify-content-center gap-2">' +
                        maNutHuy +
                        '<button type="button" class="btn ' + lopMauNutDongY + ' fw-bold rounded-pill px-4" id="btnOkThongBao">' + chuNutDongY + '</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';
    
    document.body.insertAdjacentHTML('beforeend', maHtmlModal);
    let thucTheModalHienTai = new bootstrap.Modal(document.getElementById('modalThongBaoChung'));

    document.getElementById('btnOkThongBao').addEventListener('click', function() {
        thucTheModalHienTai.hide();
        if (typeof hanhDongSauKhiDong === 'function') hanhDongSauKhiDong();
    });
    thucTheModalHienTai.show();
}

// ---------------- ĐÃ SỬA LẠI HÀM GỌI API ĐĂNG NHẬP ----------------
// Đã xóa bỏ cái hàm xuLyDangNhap() thừa thãi, gộp chung vào goiAPI_DangNhap() để nó chạy chuẩn
function goiAPI_DangNhap() {
    let tenDangNhapVao = document.getElementById('tenDangNhap').value.trim();
    let matKhauVao = document.getElementById('mkdn').value;
    let vungThongBaoLoi = document.getElementById('thongBaoLoi');
    let nutDangNhapNgay = document.getElementById('btnMainLogin');

    if (!tenDangNhapVao || !matKhauVao) {
        vungThongBaoLoi.innerText = "Please fill in all fields!";
        vungThongBaoLoi.style.display = 'block';
        return;
    }
    vungThongBaoLoi.style.display = 'none';
    nutDangNhapNgay.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Checking...';

    // Dùng hằng số duongDanGocApi để đồng bộ
    fetch(duongDanGocApi + "/api/dang-nhap", { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenDangNhap: tenDangNhapVao, matKhau: matKhauVao })
    })
    .then(res => {
        if (!res.ok) throw new Error("SAI");
        return res.json();
    })
    .then(user => {
        localStorage.setItem("maNguoiDung", user.maNguoiDung);
        localStorage.setItem("taiKhoan", user.tenDangNhap);
        localStorage.setItem("vaiTro", user.quyenHan);
        nutDangNhapNgay.innerText = 'Success!';
        setTimeout(() => { window.location.href = "index.html"; }, 1000);
    })
    .catch(() => {
        nutDangNhapNgay.innerText = 'Login Now';
        vungThongBaoLoi.innerText = "Invalid account or password!";
        vungThongBaoLoi.style.display = 'block';
    });
}
function togglePass(idONhap, idBieuTuong) {
    const oNhapLieu = document.getElementById(idONhap);
    const bieuTuongMat = document.getElementById(idBieuTuong);
    if (oNhapLieu.type === "password") {
        oNhapLieu.type = "text";
        bieuTuongMat.className = "fa-solid fa-eye";
    } else {
        oNhapLieu.type = "password";
        bieuTuongMat.className = "fa-solid fa-eye-slash";
    }
}

function chuyenTrangDangTin(suKienClick) {
    suKienClick.preventDefault();
    if (!localStorage.getItem('taiKhoan')) {
        hienThiThongBao("Login Required", "Please login to post a room!", "canhbao", () => { window.location.href="dangnhap.html"; });
    } else {
        window.location.href = "dangtin.html";
    }
}

function xuLyDangTin() {
    let tieuDePhong = document.getElementById('dt-tieuDe').value.trim();
    let diaChiPhong = document.getElementById('dt-diaChi').value.trim();
    let giaTienPhong = document.getElementById('dt-giaTien').value.trim();
    let dienTichPhong = document.getElementById('dt-dienTich').value.trim();
    
    let inputAnh = document.getElementById('dt-roomImages');
    let danhSachFiles = inputAnh.files;

    if (!tieuDePhong || !diaChiPhong || !giaTienPhong || !dienTichPhong || danhSachFiles.length === 0) {
        hienThiThongBao("Incomplete Info", "Please fill in all mandatory fields (*) and upload at least 1 image.", "canhbao");
        return;
    }

    if (danhSachFiles.length > 5) {
        hienThiThongBao("Too many images", "You can only upload a maximum of 5 images.", "canhbao");
        return;
    }

    let nutSubmit = document.querySelector('button[onclick="xuLyDangTin()"]');
    let chuCu = nutSubmit ? nutSubmit.innerHTML : 'Post Listing Now';
    if (nutSubmit) {
        nutSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
        nutSubmit.disabled = true;
    }

    let tenAnhDaiDien = danhSachFiles[0].name;
    let idNguoiDang = parseInt(localStorage.getItem("maNguoiDung"));
    let tenNguoiDang = localStorage.getItem("taiKhoan");

    let duLieuGuiDi = {
        tieuDe: tieuDePhong, 
        diaChi: diaChiPhong, 
        giaTien: parseFloat(giaTienPhong) * 1000000,
        dienTich: parseInt(dienTichPhong),
        giaDien: document.getElementById('dt-giaDien').value || "Free",
        giaNuoc: document.getElementById('dt-giaNuoc').value || "Free",
        giaDichVu: document.getElementById('dt-giaDichVu').value || "Free",
        ganTruong: document.getElementById('dt-ganTruong').value || "",
        hinhAnh: tenAnhDaiDien,
        khongChungChu: document.getElementById('dt-chungchu').checked ? 1 : 0,
        veSinhKhepKin: document.getElementById('dt-vesinh').checked ? 1 : 0,
        coChoNauAn: document.getElementById('dt-nauan').checked ? 1 : 0,
        coDieuHoa: document.getElementById('dt-dieuhoa').checked ? 1 : 0,
        coBinhNongLanh: document.getElementById('dt-nonglanh').checked ? 1 : 0,
        deXeMienPhi: document.getElementById('dt-dexe').checked ? 1 : 0,
        khoaVanTay: document.getElementById('dt-vantay').checked ? 1 : 0,
        coMayGiat: document.getElementById('dt-maygiat').checked ? 1 : 0,
        coBanCong: document.getElementById('dt-bancong').checked ? 1 : 0,
        maNguoiDung: idNguoiDang,
        trangThai: 'CHO_DUYET'
    };

    fetch(duongDanGocApi + "/api/dang-tin", {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(duLieuGuiDi)
    }).then(res => res.text())
    .then(kq => {
        if (kq === "THANH_CONG") {
            hienThiThongBao("Success", "Post submitted! Waiting for admin approval.", "thanhcong", () => { 
                window.location.href = "quanliphong.html";
            });
        } else {
            hienThiThongBao("Error", "Could not submit. Try again.", "loi");
        }
    }).finally(() => {
        if (nutSubmit) {
            nutSubmit.addEventListener('click', function(e) {
             nutSubmit.innerHTML = chuCu;
             nutSubmit.disabled = false});
        }
    });
}
// ==========================================
// SUPPORT TICKET SUBMISSION (USER SIDE)
// ==========================================
function submitSupportTicket(event) {
    if (event) event.preventDefault(); // Prevent page reload

    // Get data from the form 
    // (Make sure the IDs match the input fields in your user support HTML file)
    let senderName = document.getElementById('support-name') ? document.getElementById('support-name').value.trim() : (localStorage.getItem("taiKhoan") || 'Guest');
    let senderContact = document.getElementById('support-contact') ? document.getElementById('support-contact').value.trim() : 'No contact provided';
    let content = document.getElementById('support-content') ? document.getElementById('support-content').value.trim() : '';

    if (!content) {
        hienThiThongBao("Warning", "Please enter your support request content!", "canhbao");
        return;
    }
let maUser = localStorage.getItem("maNguoiDung");
    let payload = {
        hoTen: senderName,
        lienHe: senderContact,
        noiDung: content,
        maNguoiDung: localStorage.getItem("maNguoiDung") ? parseInt(localStorage.getItem("maNguoiDung")) : null,
        trangThai: 'CHUA_XU_LY'
    };

    let btn = document.getElementById('btn-submit-support');
    let oldText = btn ? btn.innerHTML : 'Send Request';
    
    if (btn) { 
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...'; 
        btn.disabled = true; 
    }

    fetch(duongDanGocApi + "/api/gui-ho-tro", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (res.ok) {
            hienThiThongBao("Success", "Your request has been sent! Our admin will review it shortly.", "thanhcong");
            if (document.getElementById('support-content')) document.getElementById('support-content').value = ''; // Clear textarea
        } else {
            hienThiThongBao("Error", "Could not send the request. Please try again later.", "loi");
        }
    })
    .finally(() => {
        if (btn) { 
            btn.innerHTML = oldText; 
            btn.disabled = false; 
        }
    });
}
function taiTrangDanhSachMain(trangHienTaiXet) {
    trangHienTaiCuaHeThong = trangHienTaiXet;
    sessionStorage.setItem('trangHienTaiTroHD', trangHienTaiXet);
    const vungHienThiDanhSach = document.getElementById('khung-danh-sach');
    const vungPhanTrang = document.getElementById('cum-nut-phan-trang');
    if (!vungHienThiDanhSach) return;

    const thamSo = new URLSearchParams(window.location.search);
    const truongHoc = thamSo.get('truong') || '';
    const khuVuc = thamSo.get('khuvuc') || '';
    const khoangGia = thamSo.get('gia') || '';
    
    const boLoc = {
        ac: thamSo.get('ac') === 'true',
        wc: thamSo.get('wc') === 'true',
        heater: thamSo.get('heater') === 'true',
        kit: thamSo.get('kit') === 'true',
        park: thamSo.get('park') === 'true',
        lock: thamSo.get('lock') === 'true',
        wash: thamSo.get('wash') === 'true',
        nohost: thamSo.get('nohost') === 'true'
    };

    let duongDanApi = `${duongDanGocApi}/api/danh-sach-phong-tro?trangThai=DA_DUYET`;
    
    if (truongHoc || khuVuc || khoangGia) {
        duongDanApi = `${duongDanGocApi}/api/tim-kiem?truong=${encodeURIComponent(truongHoc)}&khu_vuc=${encodeURIComponent(khuVuc)}&muc_gia=${encodeURIComponent(khoangGia)}`;
    }

    fetch(duongDanApi)
    .then(phanHoi => {
        if (!phanHoi.ok) throw new Error("Loi API");
        return phanHoi.json();
    })
    .then(duLieu => {
        let danhSachPhong = Array.isArray(duLieu) ? duLieu : (duLieu.content || []);
        
        let phongDaLoc = danhSachPhong.filter(p => {
            if (p.trangThai !== 'DA_DUYET') return false;
            
            if (khuVuc && !p.diaChi.toLowerCase().includes(khuVuc.toLowerCase())) return false;
            
            if (truongHoc && p.ganTruong && !p.ganTruong.toLowerCase().includes(truongHoc.toLowerCase())) return false;

            if (khoangGia && khoangGia !== "0") {
                let phanGia = khoangGia.split('-');
                if (phanGia.length === 2) {
                    let giaNhoNhat = parseInt(phanGia[0]) || 0;
                    let giaLonNhat = parseInt(phanGia[1]) || 99999999;
                    if (p.giaTien < giaNhoNhat || p.giaTien > giaLonNhat) {
                        return false; 
                    }
                }
            }

            if (boLoc.ac && (p.coDieuHoa !== 1)) return false;
            if (boLoc.wc && (p.veSinhKhepKin !== 1)) return false;
            if (boLoc.heater && (p.coBinhNongLanh !== 1)) return false;
            if (boLoc.kit && (p.coChoNauAn !== 1)) return false;
            if (boLoc.park && (p.deXeMienPhi !== 1)) return false;
            if (boLoc.lock && (p.khoaVanTay !== 1)) return false;
            if (boLoc.wash && (p.coMayGiat !== 1)) return false;
            if (boLoc.nohost && (p.khongChungChu !== 1)) return false;
            
            return true;
        });

        if (phongDaLoc.length === 0) {
            vungHienThiDanhSach.innerHTML = '<div class="col-12 text-center py-5"><h4 class="text-muted">No rooms found matching your criteria.</h4></div>';
            if (vungPhanTrang) vungPhanTrang.innerHTML = '';
        } else {
            let tongSoTrang = Math.ceil(phongDaLoc.length / soPhongMoiTrangHienThi);
            
            if (isNaN(trangHienTaiXet) || trangHienTaiXet < 0 || trangHienTaiXet >= tongSoTrang) {
                trangHienTaiXet = 0;
            }
            trangHienTaiCuaHeThong = trangHienTaiXet;
            sessionStorage.setItem('trangHienTaiTroHD', trangHienTaiXet);

            let chiSoBatDau = trangHienTaiXet * soPhongMoiTrangHienThi;
            let phongHienTai = phongDaLoc.slice(chiSoBatDau, chiSoBatDau + soPhongMoiTrangHienThi);

            vungHienThiDanhSach.innerHTML = phongHienTai.map(p => taoThePhong(p)).join('');
            
            vePhanTrang(tongSoTrang, trangHienTaiXet);
        }
    })
    .catch(loi => {
        vungHienThiDanhSach.innerHTML = '<div class="col-12 text-center py-5"><h4 class="text-danger">Error connecting to server.</h4></div>';
    });
}

function vePhanTrang(tongSoTrangCoThe, trangChonHienTai) {
    const vungDanhDauTrang = document.getElementById('cum-nut-phan-trang');
    if (!vungDanhDauTrang) return;
    
    if (tongSoTrangCoThe <= 1) {
        vungDanhDauTrang.innerHTML = '';
        return;
    }
    
    let chuoiHtmlInTrang = '';
    for (let mucDemTrang = 0; mucDemTrang < tongSoTrangCoThe; mucDemTrang++) { 
        chuoiHtmlInTrang += '<li class="page-item ' + (mucDemTrang === trangChonHienTai ? 'active' : '') + '"><a class="page-link rounded-3 mx-1 shadow-sm" href="javascript:void(0)" onclick="taiTrangDanhSachMain(' + mucDemTrang + ')">' + (mucDemTrang + 1) + '</a></li>';
    }
    vungDanhDauTrang.innerHTML = chuoiHtmlInTrang;
}

function taoThePhong(phongTroDeHienThi, laTinNoiBat = false) {
    let danhSachYeuThich = JSON.parse(localStorage.getItem('yeuthich')) || [];
    let daYeuThich = danhSachYeuThich.map(String).includes(String(phongTroDeHienThi.maPhong));
    
    let laVip = phongTroDeHienThi.isVip === 1;
    let lopVip = laVip ? 'card-vip' : '';
    let giaTienViet = phongTroDeHienThi.giaTien || 0;
    
    // ĐÂY NÈ SẾP: Tính toán tiền Đô la (Tỷ giá 25k cho đẹp)
    let giaTienMy = Math.round(giaTienViet / 25000);

    // Nhãn VIP bên trái
    let htmlNhanVip = laVip ? `<div class="vip-ribbon"><span>VIP</span></div>` : '';

    // Nhãn HOT đẩy về bên trái một chút để tránh cái nút tim
    let htmlNhanHot = laTinNoiBat ? `
        <span class="badge hot-badge-new position-absolute top-0 start-50 translate-middle-x mt-3 shadow" style="z-index: 15;">
            <i class="fa-solid fa-fire me-1"></i> HOT
        </span>` : '';

    return `
    <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden card-phong ${lopVip} position-relative">
            <div class="position-relative overflow-hidden">
                <img src="images/${phongTroDeHienThi.hinhAnh || 'phong1.jpg'}" class="card-img-top" style="height: 220px; object-fit: cover; cursor: pointer;" onclick="xemChiTiet(${phongTroDeHienThi.maPhong})">
                
                ${htmlNhanVip}
                ${htmlNhanHot}

                <button class="btn btn-dark btn-sm rounded-circle position-absolute top-0 end-0 m-3 bg-opacity-50 border-0" style="z-index: 20;" onclick="toggleYeuThich(event, ${phongTroDeHienThi.maPhong}, ${phongTroDeHienThi.maNguoiDung}, '${phongTroDeHienThi.tieuDe}')">
                    <i class="${daYeuThich ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart text-white'}"></i>
                </button>
            </div>
            <div class="card-body p-4 d-flex flex-column">
                <div class="mb-2">
                    <h4 class="${laVip ? 'text-warning' : 'text-primary'} fw-bold mb-0">
                        ${giaTienViet.toLocaleString()} VND<span class="fs-6 fw-normal text-muted">/mo</span>
                    </h4>
                    <span class="text-muted fw-bold" style="font-size: 0.85rem;">(~ $${giaTienMy}/mo)</span>
                </div>
                
                <p class="text-muted small text-truncate mb-2"><i class="fa-solid fa-location-dot text-danger me-1"></i> ${phongTroDeHienThi.diaChi}</p>
                <h5 class="fs-6 fw-bold text-truncate mb-3">${phongTroDeHienThi.tieuDe}</h5>
                
                <div class="d-flex flex-wrap gap-2 mb-4">
                    <div class="amenity-pill"><i class="fa-solid fa-bolt text-warning me-1"></i>${phongTroDeHienThi.giaDien || '3.5k'}</div>
                    <div class="amenity-pill"><i class="fa-solid fa-droplet text-primary me-1"></i>${phongTroDeHienThi.giaNuoc || '30k'}</div>
                    <div class="amenity-pill"><i class="fa-solid fa-user-shield text-success me-1"></i>${phongTroDeHienThi.giaDichVu || '50k'}</div>
                </div>

                <button class="btn ${laVip ? 'btn-warning text-white' : 'btn-outline-primary'} w-100 rounded-pill mt-auto btn-sm fw-bold shadow-sm" onclick="xemChiTiet(${phongTroDeHienThi.maPhong})">
                    View Listing <i class="fa-solid fa-arrow-right-long ms-1"></i>
                </button>
            </div>
        </div>
    </div>`;
}
function xemChiTiet(idPhongBiAn) {
    if (!localStorage.getItem('taiKhoan')) {
        hienThiThongBao("Login Required", "Login to see listing details!", "canhbao", () => { window.location.href="dangnhap.html"; });
        return;
    }
    fetch(duongDanGocApi + "/api/tang-view/" + idPhongBiAn, { method: 'POST' }).finally(() => { window.location.href = "chitiet.html?id=" + idPhongBiAn; });
}

function toggleYeuThich(suKienNhanBam, idPhongThich, chuTro, tenPhongThich) {
    suKienNhanBam.stopPropagation();
    if (!localStorage.getItem('taiKhoan')) {
        hienThiThongBao("Login Required", "Please login to favorite rooms!", "canhbao");
        return;
    }
    
    let idStr = String(idPhongThich);
    const tenTaiKhoanDaLuu = localStorage.getItem("taiKhoan");
    const idNguoiDungHienTai = localStorage.getItem("maNguoiDung");
    let danhSachIdYeuThich = JSON.parse(localStorage.getItem('yeuthich')) || [];
    danhSachIdYeuThich = danhSachIdYeuThich.map(String);
    
    let bieuTuongTraiTim = suKienNhanBam.currentTarget.querySelector('i');

    if (danhSachIdYeuThich.includes(idStr)) {
        danhSachIdYeuThich = danhSachIdYeuThich.filter(idHienTai => idHienTai !== idStr);
        if(bieuTuongTraiTim) bieuTuongTraiTim.className = 'fa-regular fa-heart text-white';
    } else {
        danhSachIdYeuThich.push(idStr);
        if(bieuTuongTraiTim) bieuTuongTraiTim.className = 'fa-solid fa-heart text-danger';
        
        if (chuTro && String(chuTro) !== idNguoiDungHienTai) {
            fetch(duongDanGocApi + "/api/gui-thong-bao-he-thong", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ maNguoiNhan: chuTro, noiDung: `User ${tenTaiKhoanDaLuu} liked your room: ${tenPhongThich}` })
            });
        }
    }
    localStorage.setItem('yeuthich', JSON.stringify(danhSachIdYeuThich));
    
    if (window.location.pathname.includes('yeuthich.html')) {
        location.reload();
    }
}

function taiTop6NoiBat() {
    const vungTopNoiBat = document.getElementById('khung-top-noi-bat');
    if (!vungTopNoiBat) return;
    fetch(duongDanGocApi + "/api/top-6-noi-bat")
        .then(phanHoiXongThongTin => phanHoiXongThongTin.json())
        .then(danhSachSuaDoiTruocXuat => {
            vungTopNoiBat.innerHTML = danhSachSuaDoiTruocXuat.map(phongDuocDuyetDauTien => taoThePhong(phongDuocDuyetDauTien, true)).join('');
        })
        .catch(loiXayRaTaiDay => console.error("Lỗi load Top 6:", loiXayRaTaiDay));
}
// ==========================================
// HÀM XỬ LÝ ĐĂNG KÝ (Đã khớp ID với dangky.html)
// ==========================================
function xuLyDangKy() {
    // 1. Lấy dữ liệu từ các ô nhập liệu theo đúng ID trong dangky.html
    let ten = document.getElementById('reg-username').value.trim();
    let hoTen = document.getElementById('reg-fullname').value.trim();
    let sdt = document.getElementById('reg-phone').value.trim();
    let mk1 = document.getElementById('mk1').value;
    let mk2 = document.getElementById('mk2').value;
    
    // Lấy vai trò (Student hoặc Landlord)
    let vaiTro = document.querySelector('input[name="roleAccount"]:checked')?.value || 'SINH_VIEN';
    
    // Kiểm tra xem đã tích vào nút Đồng ý điều khoản chưa
    let dongY = document.getElementById('terms').checked;

    // 2. Kiểm tra điều kiện bắt buộc
    if (!ten || !hoTen || !sdt || !mk1 || !mk2) {
        hienThiThongBao("Warning", "Please fill in all required fields (*).", "canhbao");
        return;
    }

    if (mk1 !== mk2) {
        document.getElementById('pass-error').classList.remove('d-none');
        return;
    } else {
        document.getElementById('pass-error').classList.add('d-none');
    }

    if (!dongY) {
        hienThiThongBao("Warning", "You must agree to the Terms & Policies.", "canhbao");
        return;
    }

    // 3. Hiệu ứng đang xử lý cho nút bấm
    let btn = document.getElementById('btnDangKySubmit');
    let oldText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
    btn.disabled = true;

    // 4. Gói dữ liệu gửi về Backend
    let data = {
        tenDangNhap: ten,
        matKhau: mk1,
        hoTen: hoTen,
        soDienThoai: sdt,
        quyenHan: vaiTro,
        trangThai: 'Hoạt động' // Trạng thái mặc định
    };

    // 5. Gọi API
    fetch(duongDanGocApi + "/api/dang-ky", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) {
            return res.text().then(text => { throw new Error(text) });
        }
        return res.text();
    })
    .then(kq => {
        if (kq === "THANH_CONG") {
            // Hiện Modal thành công xịn xò của sếp
            new bootstrap.Modal(document.getElementById('modalDangKy')).show();
        } else {
            hienThiThongBao("Error", "Registration failed!", "loi");
        }
    })
    .catch(err => {
        if(err.message === "TRUNG_TEN") {
            hienThiThongBao("Error", "Username already exists! Please choose another.", "loi");
        } else {
            hienThiThongBao("Error", "Server connection failed!", "loi");
        }
    })
    .finally(() => {
        // Trả lại trạng thái cho nút bấm
        btn.innerHTML = oldText;
        btn.disabled = false;
    });
}

// Dán đoạn này vào main.js, tìm chỗ taiDanhSachAdmin cũ rồi đè lên
function taiDanhSachAdmin() {
    const loc = document.getElementById('filterStatus');
    const tt = loc ? loc.value : 'TAT_CA';
    const vung = document.getElementById('bang-tin-dang');
    if (!vung) return;

    // Lấy toàn bộ danh sách về để lọc (Vì BE không có status CHO_DUYET_VIP)
    fetch(`${duongDanGocApi}/api/danh-sach-phong-tro?trangThai=TAT_CA`)
    .then(r => r.json()).then(ds => {
        let ketQuaLoc = ds;

        // Logic lọc thông minh theo yêu cầu của sếp
        if (tt === 'CHO_DUYET_VIP') {
            ketQuaLoc = ds.filter(p => p.isVip === 1 && p.trangThai !== 'DA_DUYET');
        } else if (tt === 'DA_DUYET_VIP') {
            ketQuaLoc = ds.filter(p => p.isVip === 1 && p.trangThai === 'DA_DUYET');
        } else if (tt === 'DA_DUYET') {
            ketQuaLoc = ds.filter(p => p.trangThai === 'DA_DUYET' && (p.isVip !== 1));
        } else if (tt === 'CHO_DUYET') {
            ketQuaLoc = ds.filter(p => p.trangThai === 'CHO_DUYET' && (p.isVip !== 1));
        }

        // Cập nhật số liệu thống kê nhanh
        if (document.getElementById('stat-tong')) document.getElementById('stat-tong').innerText = ds.length;
        if (document.getElementById('stat-cho')) document.getElementById('stat-cho').innerText = ds.filter(p => p.trangThai === 'CHO_DUYET').length;
        if (document.getElementById('stat-view')) document.getElementById('stat-view').innerText = ds.reduce((sum, p) => sum + (p.luotXem || 0), 0).toLocaleString();
        // Vẽ bảng
        vung.innerHTML = ketQuaLoc.map(p => {
            let ok = p.trangThai === 'DA_DUYET';
            let laVip = p.isVip === 1;
            
            // Nhãn trạng thái chuẩn A+ như ảnh sếp gửi
            let lopBadge = ok ? 'bg-success' : 'bg-warning text-dark';
            let chuBadge = ok ? (laVip ? 'Approved (VIP)' : 'Approved') : (laVip ? 'Pending VIP' : 'Pending');

            return `<tr>
                <td class="fw-bold text-muted">#PT${p.maPhong}</td>
                <td class="fw-medium text-truncate" style="max-width: 300px;">
                    ${laVip && !ok ? '<span class="text-danger small fw-bold">[VIP REQUEST] </span>' : ''}${p.tieuDe}
                </td>
                <td class="text-danger fw-bold">${(p.giaTien || 0).toLocaleString()} VND</td>
                <td><span class="badge ${lopBadge} px-3 py-2 rounded-pill">${chuBadge}</span></td>
                <td class="text-center">
                    ${!ok ? `<button class="btn btn-sm btn-success fw-bold me-1 rounded-pill px-3" onclick="moModalAdmin('DUYET', ${p.maPhong})">Approve</button>` : ''}
                    <a href="chitiet.html?id=${p.maPhong}" class="btn btn-sm btn-info text-white me-1 rounded-circle" style="width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center;"><i class="fa-solid fa-eye"></i></a>
                    <button class="btn btn-sm btn-outline-danger rounded-circle" style="width: 32px; height: 32px;" onclick="moModalAdmin('XOA', ${p.maPhong})"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
        }).join('') || '<tr><td colspan="5" class="text-center py-5">No listings found.</td></tr>';
    });
}

function taiThongKeChuan() {
    fetch(duongDanGocApi + "/api/thong-ke")
    .then(phanHoiTuServer => phanHoiTuServer.json())
    .then(duLieuThongKe => {
        ganGiaTriText('stat-tong', duLieuThongKe.tongPhong || 0);
        ganGiaTriText('stat-cho', duLieuThongKe.choDuyet || 0);
        ganGiaTriText('stat-view', (duLieuThongKe.tongView || 0).toLocaleString());
    });
}

function moModalAdmin(loaiHanhDong, idPhong) {
    loaiLenhQuanTriHienTai = loaiHanhDong;
    maPhongDuocChonQuanTri = idPhong;
    const tieuDeCuaModal = loaiHanhDong === 'DUYET' ? 'Approve Listing' : 'Delete Listing';
    const noiDungCuaModal = loaiHanhDong === 'DUYET' ? `Confirm approval for #PT${idPhong}?` : `Permanently delete listing #PT${idPhong}?`;
    hienThiThongBao(tieuDeCuaModal, noiDungCuaModal, "xacnhan", thucHienLenhAdmin);
}

function thucHienLenhAdmin() {
    let diemKetNoiApi = loaiLenhQuanTriHienTai === 'DUYET' ? 'duyet-phong' : 'xoa-phong';
    fetch(duongDanGocApi + "/api/" + diemKetNoiApi + "/" + maPhongDuocChonQuanTri, { method: loaiLenhQuanTriHienTai === 'DUYET' ? 'PUT' : 'DELETE' })
    .then(() => {
        hienThiThongBao("Success", "The operation was successful!", "thanhcong");
        taiDanhSachAdmin();
    });
}
function taiDanhSachQuanLyPhong() {
    const container = document.getElementById('bang-quan-ly-phong');
    const maChuTro = localStorage.getItem("maNguoiDung");
    if (!container || !maChuTro) return;

    fetch(`${duongDanGocApi}/api/phong-tro/chu-tro/${maChuTro}`)
        .then(res => res.json())
        .then(data => {
            // 1. TÍNH TOÁN THỐNG KÊ
            let tongView = 0, active = 0, pending = 0;
            data.forEach(p => { 
                tongView += (p.luotXem || 0); 
                if (p.trangThai === 'DA_DUYET') active++; else pending++; 
            });

            if(document.getElementById('stat-chu-tong')) document.getElementById('stat-chu-tong').innerText = data.length;
            if(document.getElementById('stat-chu-view')) document.getElementById('stat-chu-view').innerText = tongView.toLocaleString();
            if(document.getElementById('stat-chu-active')) document.getElementById('stat-chu-active').innerText = active;
            if(document.getElementById('stat-chu-pending')) document.getElementById('stat-chu-pending').innerText = pending;

            // ==========================================
            // 2. VẼ BIỂU ĐỒ: CỘT CAO NHẤT LÊN ĐẦU (Sắp xếp theo View)
            // ==========================================
            const ctx = document.getElementById('landlordChart');
            if (ctx) {
                // Tạo một bản sao dữ liệu riêng cho biểu đồ, xếp theo lượt xem giảm dần
                let chartData = [...data].sort((a, b) => (b.luotXem || 0) - (a.luotXem || 0));
                
                let oldChart = Chart.getChart(ctx);
                if (oldChart) oldChart.destroy();
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: chartData.map(p => p.tieuDe.substring(0, 15) + '...'),
                        datasets: [{ label: 'Views', data: chartData.map(p => p.luotXem || 0), backgroundColor: '#0d6efd', borderRadius: 8, barThickness: 30 }]
                    },
                    options: { 
                        responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 }, grid: { color: '#f8f9fa' } }, x: { grid: { display: false } } }
                    }
                });
            }

            // ==========================================
            // 3. VẼ BẢNG: PHÒNG MỚI NHẤT LÊN ĐẦU (Sắp xếp theo Mã Phòng)
            // ==========================================
            data.sort((a, b) => b.maPhong - a.maPhong);

            if (data.length === 0) {
                container.innerHTML = '<tr><td colspan="6" class="text-center py-5 text-muted">No rooms found.</td></tr>'; return;
            }

            container.innerHTML = data.map(p => {
                let stClass = p.trangThai === 'DA_DUYET' ? 'bg-success' : 'bg-warning text-dark';
                let stText = p.trangThai === 'DA_DUYET' ? 'Approved' : 'Pending';
                let vipBadge = (p.isVip === 1) ? '<i class="fa-solid fa-crown text-warning ms-1"></i>' : '';

                return `<tr>
                        <td class="px-4 fw-bold">#PT${p.maPhong}${vipBadge}</td>
                        <td class="fw-medium">${p.tieuDe}</td>
                        <td class="text-center fw-bold text-primary">${p.luotXem || 0}</td>
                        <td>${new Date(p.ngayDang).toLocaleDateString()}</td>
                        <td><span class="badge ${stClass} rounded-pill px-3">${stText}</span></td>
                        <td class="text-end px-4 text-nowrap">
                            ${(p.trangThai === 'DA_DUYET' && p.isVip !== 1) ? `<button class="btn btn-sm btn-warning text-white fw-bold rounded-pill px-3 me-1" onclick="moModalVip(${p.maPhong})"><i class="fa-solid fa-crown"></i> VIP</button>` : ''}
                            <button class="btn btn-sm btn-outline-info rounded-circle me-1" onclick="xemChiTiet(${p.maPhong})" title="View Details"><i class="fa-solid fa-eye"></i></button>
                            <button class="btn btn-sm btn-outline-primary rounded-circle me-1" onclick="moModalSuaPhong(${p.maPhong})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                            <button class="btn btn-sm btn-outline-danger rounded-circle" onclick="xoaPhongChuTro(${p.maPhong})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>`;
            }).join('');
        });
}
function xoaPhongChuTro(idPhong) {
    hienThiThongBao("Confirm Delete", "Are you sure you want to remove this listing?", "xacnhan", () => {
        fetch(duongDanGocApi + "/api/xoa-phong/" + idPhong, { method: 'DELETE' })
            .then(() => {
                hienThiThongBao("Deleted", "Post removed successfully!", "thanhcong");
                taiDanhSachQuanLyPhong();
            });
    });
}

function moModalSuaPhong(maPhong) {
    maPhongDangSua = maPhong;
    fetch(duongDanGocApi + "/api/chi-tiet-phong/" + maPhong)
    .then(r => r.json())
    .then(p => {
        document.getElementById('edit-tieuDe').value = p.tieuDe;
        document.getElementById('edit-diaChi').value = p.diaChi;
        document.getElementById('edit-giaTien').value = p.giaTien / 1000000;
        document.getElementById('edit-dienTich').value = p.dienTich;
        document.getElementById('edit-giaDien').value = p.giaDien;
        document.getElementById('edit-giaNuoc').value = p.giaNuoc;
        document.getElementById('edit-ganTruong').value = p.ganTruong;
        document.getElementById('edit-moTa').value = p.viTriDacDia;
        
        document.getElementById('edit-chungchu').checked = p.khongChungChu === 1;
        document.getElementById('edit-vesinh').checked = p.veSinhKhepKin === 1;
        document.getElementById('edit-nauan').checked = p.coChoNauAn === 1;
        document.getElementById('edit-dieuhoa').checked = p.coDieuHoa === 1;
        document.getElementById('edit-nonglanh').checked = p.coBinhNongLanh === 1;
        document.getElementById('edit-dexe').checked = p.deXeMienPhi === 1;
        document.getElementById('edit-vantay').checked = p.khoaVanTay === 1;
        document.getElementById('edit-maygiat').checked = p.coMayGiat === 1;
        

        new bootstrap.Modal(document.getElementById('modalSuaPhong')).show();
    });
}

function xuLyCapNhatPhong() {
    let inputAnh = document.getElementById('edit-roomImages');
    let danhSachFiles = inputAnh ? inputAnh.files : [];

    if (danhSachFiles.length > 5) {
        hienThiThongBao("Too many images", "You can only upload a maximum of 5 images.", "canhbao");
        return;
    }

    let tenAnhCapNhat = danhSachFiles.length > 0 ? danhSachFiles[0].name : null;

    let duLieu = {
        tieuDe: document.getElementById('edit-tieuDe').value,
        diaChi: document.getElementById('edit-diaChi').value,
        giaTien: parseFloat(document.getElementById('edit-giaTien').value) * 1000000,
        dienTich: parseInt(document.getElementById('edit-dienTich').value),
        giaDien: document.getElementById('edit-giaDien').value,
        giaNuoc: document.getElementById('edit-giaNuoc').value,
        ganTruong: document.getElementById('edit-ganTruong').value,
        viTriDacDia: document.getElementById('edit-moTa').value,
        coBanCong: document.getElementById('edit-bancong').checked ? 1 : 0,
        hinhAnh: tenAnhCapNhat,
        khongChungChu: document.getElementById('edit-chungchu').checked ? 1 : 0,
        veSinhKhepKin: document.getElementById('edit-vesinh').checked ? 1 : 0,
        coChoNauAn: document.getElementById('edit-nauan').checked ? 1 : 0,
        coDieuHoa: document.getElementById('edit-dieuhoa').checked ? 1 : 0,
        coBinhNongLanh: document.getElementById('edit-nonglanh').checked ? 1 : 0,
        deXeMienPhi: document.getElementById('edit-dexe').checked ? 1 : 0,
        khoaVanTay: document.getElementById('edit-vantay').checked ? 1 : 0,
        coMayGiat: document.getElementById('edit-maygiat').checked ? 1 : 0
    };

    fetch(duongDanGocApi + "/api/sua-phong/" + maPhongDangSua, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duLieu)
    }).then(r => r.text()).then(kq => {
        if(kq === "THANH_CONG") {
            hienThiThongBao("Updated", "Your listing has been updated and is pending review.", "thanhcong", () => location.reload());
        }
    });
}

function taiDanhSachNguoiDung() {
    const locVaiTro = document.getElementById('filterRole');
    const locTrangThaiNguoiDung = document.getElementById('filterStatus');
    const bangNguoiDung = document.getElementById('bang-nguoi-dung');
    if (!bangNguoiDung) return;

    const vaiTroDuocChon = locVaiTro ? locVaiTro.value : 'TAT_CA';
    const trangThaiDuocChon = locTrangThaiNguoiDung ? locTrangThaiNguoiDung.value : 'TAT_CA';

    fetch(duongDanGocApi + "/api/danh-sach-tai-khoan?quyenHan=TAT_CA&trangThai=TAT_CA")
    .then(res => res.json())
    .then(data => {
        // 1. CẬP NHẬT THỐNG KÊ (ĐÃ TRẢ LẠI ĐÚNG ID GỐC CỦA SẾP)
        let tongTaiKhoan = data.length;
        let tongChuTro = data.filter(u => u.quyenHan === 'CHU_TRO').length;
        let tongSinhVien = data.filter(u => u.quyenHan === 'SINH_VIEN').length;

        if (document.getElementById('stat-user-tong')) document.getElementById('stat-user-tong').innerText = tongTaiKhoan;
        if (document.getElementById('stat-user-chu')) document.getElementById('stat-user-chu').innerText = tongChuTro;
        if (document.getElementById('stat-user-sv')) document.getElementById('stat-user-sv').innerText = tongSinhVien;

        // 2. LỌC DANH SÁCH VÀ VẼ BẢNG
        let ketQuaLoc = data;
        if (vaiTroDuocChon !== 'TAT_CA') ketQuaLoc = ketQuaLoc.filter(u => u.quyenHan === vaiTroDuocChon);
        if (trangThaiDuocChon !== 'TAT_CA') ketQuaLoc = ketQuaLoc.filter(u => u.trangThai === trangThaiDuocChon);

        bangNguoiDung.innerHTML = ketQuaLoc.map(nguoiDung => {
            let laQuanTri = nguoiDung.quyenHan === 'QUAN_TRI';
            let laKhoa = nguoiDung.trangThai === 'Locked' || nguoiDung.trangThai === 'Đã khóa'; 
            
            let hienThiVaiTro = laQuanTri ? 'Admin' : (nguoiDung.quyenHan === 'CHU_TRO' ? 'Landlord' : 'Student');
            let hienThiTrangThai = laKhoa ? 'Locked' : 'Active';

            return `<tr>
                <td class="fw-bold">#${nguoiDung.maNguoiDung}</td>
                <td class="fw-bold">${nguoiDung.tenDangNhap}</td>
                <td>${nguoiDung.hoTen}</td>
                <td><span class="badge ${laQuanTri ? 'bg-danger' : (nguoiDung.quyenHan === 'CHU_TRO' ? 'bg-primary' : 'bg-success')} rounded-pill px-3">${hienThiVaiTro}</span></td>
                <td><span class="badge ${laKhoa ? 'bg-secondary' : 'bg-success'} rounded-pill px-3">${hienThiTrangThai}</span></td>
                <td class="text-center">
                    ${!laQuanTri ? `<button class="btn btn-sm ${laKhoa ? 'btn-success' : 'btn-outline-danger'} rounded-pill px-3 fw-bold" 
                        onclick="moModalUser(${nguoiDung.maNguoiDung}, '${nguoiDung.tenDangNhap}', '${laKhoa ? 'Active' : 'Locked'}')">
                        ${laKhoa ? '<i class="fa-solid fa-unlock me-1"></i> Unlock' : '<i class="fa-solid fa-lock me-1"></i> Lock'}</button>` : '<span class="text-muted small fw-bold">System</span>'}
                </td>
            </tr>`;
        }).join('') || '<tr><td colspan="6" class="text-center py-5 text-muted">No users found.</td></tr>';
    });
}

function moModalUser(idNguoiDung, tenNguoiDung, trangThaiMoi) {
    maNguoiDungDuocChon = idNguoiDung; 
    trangThaiTaiKhoanMoi = trangThaiMoi;
    hienThiThongBao("Account Action", `Do you want to ${trangThaiMoi === 'Đã khóa' ? 'Lock' : 'Unlock'} account <b>${tenNguoiDung}</b>?`, "xacnhan", () => {
        fetch(duongDanGocApi + "/api/trang-thai-tai-khoan/" + maNguoiDungDuocChon + "?trangThaiMoi=" + encodeURIComponent(trangThaiTaiKhoanMoi), { method: 'PUT' }).then(() => taiDanhSachNguoiDung());
    });
}

function khoiTaoBieuDo() {
    const vungBieuDoCot = document.getElementById('chartTopPhong');
    const vungBieuDoTron = document.getElementById('chartNguoiDung');

    if (!vungBieuDoCot || !vungBieuDoTron) return;

    fetch(duongDanGocApi + "/api/thong-ke")
        .then(phanHoi => phanHoi.json())
        .then(duLieuStats => {
            ganGiaTriText('stat-user', duLieuStats.tongUser);
            ganGiaTriText('stat-phong', duLieuStats.tongPhong);
            ganGiaTriText('stat-view', duLieuStats.tongView);
            ganGiaTriText('totalUserCenter', duLieuStats.tongUser);
            ganGiaTriText('label-chu-tro', duLieuStats.chuTro);
            ganGiaTriText('label-sinh-vien', duLieuStats.sinhVien);

            if (bieuDoTronNguoiDung) bieuDoTronNguoiDung.destroy();
            bieuDoTronNguoiDung = new Chart(vungBieuDoTron, {
                type: 'doughnut',
                data: {
                    labels: ['Landlords', 'Students'],
                    datasets: [{
                        data: [duLieuStats.chuTro, duLieuStats.sinhVien],
                        backgroundColor: ['#0d6efd', '#198754'],
                        borderWidth: 0
                    }]
                },
                options: {
                    cutout: '75%',
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false
                }
            });
        })
        .catch(err => console.error("Lỗi load thong-ke:", err));

    fetch(duongDanGocApi + "/api/top-6-noi-bat")
        .then(phanHoi => phanHoi.json())
        .then(danhSachTop => {
            const nhanBieuDo = danhSachTop.map(p => "#PT" + p.maPhong);
            const duLieuLuotXem = danhSachTop.map(p => p.luotXem);

            if (bieuDoCotTopPhong) bieuDoCotTopPhong.destroy();
            bieuDoCotTopPhong = new Chart(vungBieuDoCot, {
                type: 'bar',
                data: {
                    labels: nhanBieuDo,
                    datasets: [{
                        label: 'Views',
                        data: duLieuLuotXem,
                        backgroundColor: '#0d6efd',
                        borderRadius: 8,
                        barThickness: 40
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { stepSize: 1 } },
                        x: { grid: { display: false } }
                    }
                }
            });
        })
        .catch(err => console.error("Lỗi load top-6:", err));
}

function ganGiaTriText(idPhanTu, giaTri) {
    const phanTu = document.getElementById(idPhanTu);
    if (phanTu) phanTu.innerText = giaTri;
}

function taiThongBao() {
    const maNguoiDung = localStorage.getItem("maNguoiDung");
    const vungThongBao = document.getElementById('noi-dung-thong-bao');
    const theHuyHieu = document.getElementById('badge-thong-bao');
    const nutChuong = document.getElementById('dropdownNotification');
    
    const badgeDuyetBai = document.getElementById('badge-duyet-bai');
    const badgeHoTro = document.getElementById('badge-hotro');

    if (!maNguoiDung) return;

    fetch(`${duongDanGocApi}/api/danh-sach-thong-bao/${maNguoiDung}`)
        .then(res => {
            if (!res.ok) throw new Error("API Error");
            return res.json();
        })
        .then(ds => {
            const tinMoi = ds.filter(t => t.trangThaiXem === 0);
            
            // 1. Cập nhật Badge
            if (theHuyHieu) {
                theHuyHieu.innerText = tinMoi.length;
                tinMoi.length > 0 ? theHuyHieu.classList.remove('d-none') : theHuyHieu.classList.add('d-none');
            }

            // 2. Admin Sidebar
            if (localStorage.getItem("vaiTro") === 'QUAN_TRI') {
                const soDuyet = tinMoi.filter(t => t.noiDung.toLowerCase().includes('pending')).length;
                if (badgeDuyetBai) {
                    badgeDuyetBai.innerText = soDuyet;
                    if (soDuyet > 0) {
                        badgeDuyetBai.classList.remove('d-none');
                    } else {
                        badgeDuyetBai.classList.add('d-none');
                    }
                }
                
            }
                const soHoTro = tinMoi.filter(t => t.noiDung.toLowerCase().includes('support')).length;
                if (badgeHoTro) {
                    badgeHoTro.innerText = soHoTro;
                    soHoTro > 0 ? badgeHoTro.classList.remove('d-none') : badgeHoTro.classList.add('d-none');
                }
            
            if (!vungThongBao) return;
            if (ds.length === 0) {
                vungThongBao.innerHTML = '<li class="text-center py-4 text-muted small">No notifications</li>';
                return;
            }

            ds.sort((a, b) => b.maThongBao - a.maThongBao);
            vungThongBao.innerHTML = ds.map(t => {
                // ĐÂY NỀ SẾP: Hóa giải dấu nháy để không bị lỗi JS khi vẽ onclick
                const noiDungAnToan = t.noiDung.replace(/'/g, "\\'"); 
                return `
                    <li class="dropdown-item p-3 border-bottom ${t.trangThaiXem === 0 ? 'bg-light' : ''}" 
                        style="cursor: pointer; white-space: normal;" 
                        onclick="xuLyBamThongBao(${t.maThongBao}, '${noiDungAnToan}')">
                        <p class="mb-1 small ${t.trangThaiXem === 0 ? 'fw-bold text-dark' : 'text-secondary'}">${t.noiDung}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-muted small" style="font-size: 0.7rem;">${new Date(t.ngayTao).toLocaleString()}</span>
                            ${t.trangThaiXem === 0 ? '<span class="badge bg-primary" style="font-size: 0.5rem;">NEW</span>' : ''}
                        </div>
                    </li>`;
            }).join('');
        })
        .catch(err => {
            if (vungThongBao) vungThongBao.innerHTML = '<li class="text-center py-4 text-danger small">Disconnected from server</li>';
        });
}
// 2. Hàm xử lý Click: Vừa đánh dấu đã xem, vừa chuyển trang
function xuLyBamThongBao(id, noiDung) {
    // Đánh dấu đã xem trước
    fetch(duongDanGocApi + "/api/danh-dau-da-xem/" + id, { method: 'POST' }).then(() => {
        // Tìm mã phòng trong nội dung (Ví dụ: #PT12)
        const timMa = noiDung.match(/#PT(\d+)/);
        if (timMa && timMa[1]) {
            window.location.href = `chitiet.html?id=${timMa[1]}`;
        } else {
            taiThongBao(); // Nếu không có mã phòng thì chỉ load lại danh sách
        }
    });
}

function xacNhanDangXuat() {
    hienThiThongBao("Logout", "Are you sure you want to log out?", "xacnhan", () => {
        localStorage.clear();
        window.location.href = "dangnhap.html";
    });
}

function moModalLogout() {
    xacNhanDangXuat();
}

function khoiTaoCheDoToi() {
    let nutBamChuyenCheDo = document.getElementById('darkModeToggle');
    if (!nutBamChuyenCheDo) return;
    nutBamChuyenCheDo.onclick = () => {
        document.body.classList.toggle('dark-mode');
        let hienTaiTrangThaiThem = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', hienTaiTrangThaiThem);
        let bieuTuongSangToiBaoHieu = document.getElementById('themeIcon');
        if (bieuTuongSangToiBaoHieu) bieuTuongSangToiBaoHieu.className = hienTaiTrangThaiThem === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    };
}
function capNhatMenu() {
    const taiKhoan = localStorage.getItem("taiKhoan");
    const vaiTro = (localStorage.getItem("vaiTro") || "").trim().toUpperCase(); 
    
    // ĐÃ FIX: Dùng href="hotro.html" để tha cho trang admin-hotro.html
    const menuDangTin = document.querySelector('a[href="dangtin.html"], a[onclick*="chuyenTrangDangTin"]')?.parentElement;
    const menuYeuThich = document.querySelector('a[href="yeuthich.html"]')?.parentElement;
    const menuHoTro = document.querySelector('a[href="hotro.html"]')?.parentElement; 
    const navbarNav = document.querySelector('.navbar-nav');

    if (vaiTro === 'QUAN_TRI') {
        if (menuDangTin) menuDangTin.style.display = 'none';
        if (menuYeuThich) menuYeuThich.style.display = 'none';
        if (menuHoTro) menuHoTro.style.display = 'none'; // Chỉ ẩn form gửi hỗ trợ của sinh viên
        
        if (navbarNav && !document.getElementById('nav-admin-panel')) {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.id = 'nav-admin-panel';
            li.innerHTML = `<a class="nav-link text-danger fw-bold" href="admin.html"><i class="fa-solid fa-shield-halved me-1"></i>Admin Panel</a>`;
            navbarNav.appendChild(li);
        }
    } else if (vaiTro === 'CHU_TRO') {
        if (menuYeuThich) menuYeuThich.style.display = 'none';
        let ql = document.getElementById('nav-quan-ly-phong');
        if (ql) {
            ql.classList.remove('d-none');
            ql.style.display = 'block';
        }
    } else if (vaiTro === 'SINH_VIEN') {
        if (menuDangTin) menuDangTin.style.display = 'none';
    }

    const authZone = document.getElementById('user-auth-zone');
    if (taiKhoan && authZone) {
        authZone.innerHTML = `
            <span class="fw-bold text-primary me-2">Chào, ${taiKhoan}</span>
            <button class="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold" onclick="localStorage.clear(); window.location.href='dangnhap.html'">Logout</button>
        `;
    }
}
function copySDT() {
    let soDienThoaiDuocChon = document.getElementById('chi-tiet-sdt').innerText;
    navigator.clipboard.writeText(soDienThoaiDuocChon);
    alert("Copied: " + soDienThoaiDuocChon);
}
// Hàm này sẽ gom sạch dữ liệu trong Form và ném vào bộ nhớ máy tính
function tuDongLuuNhapDangTin() {
    const formDangTin = {
        tieuDe: document.getElementById('dt-tieuDe')?.value || '',
        diaChi: document.getElementById('dt-diaChi')?.value || '',
        giaTien: document.getElementById('dt-giaTien')?.value || '',
        dienTich: document.getElementById('dt-dienTich')?.value || '',
        ganTruong: document.getElementById('dt-ganTruong')?.value || '',
        giaDien: document.getElementById('dt-giaDien')?.value || '',
        giaNuoc: document.getElementById('dt-giaNuoc')?.value || ''
        // Sếp có thể thêm các trường khác vào đây nếu muốn
    };
    localStorage.setItem('nhap_dang_tin', JSON.stringify(formDangTin));
}

// Hàm này để lôi dữ liệu cũ ra điền lại vào Form
function khoiPhucNhapDangTin() {
    const duLieuCu = localStorage.getItem('nhap_dang_tin');
    if (duLieuCu) {
        const p = JSON.parse(duLieuCu);
        if(document.getElementById('dt-tieuDe')) document.getElementById('dt-tieuDe').value = p.tieuDe;
        if(document.getElementById('dt-diaChi')) document.getElementById('dt-diaChi').value = p.diaChi;
        if(document.getElementById('dt-giaTien')) document.getElementById('dt-giaTien').value = p.giaTien;
        if(document.getElementById('dt-dienTich')) document.getElementById('dt-dienTich').value = p.dienTich;
        if(document.getElementById('dt-ganTruong')) document.getElementById('dt-ganTruong').value = p.ganTruong;
        if(document.getElementById('dt-giaDien')) document.getElementById('dt-giaDien').value = p.giaDien;
        if(document.getElementById('dt-giaNuoc')) document.getElementById('dt-giaNuoc').value = p.giaNuoc;
    }
}
function taiChiTietPhong() {
    let maPhongTuUrl = new URLSearchParams(window.location.search).get('id');
    if (!maPhongTuUrl || !document.getElementById('chi-tiet-tieu-de')) return;

    fetch(duongDanGocApi + "/api/chi-tiet-phong/" + maPhongTuUrl).then(res => res.json()).then(p => {
        ganGiaTriText('chi-tiet-tieu-de', p.tieuDe); 
        ganGiaTriText('chi-tiet-dia-chi', p.diaChi); 
        ganGiaTriText('chi-tiet-truong', p.ganTruong);
        document.getElementById('chi-tiet-anh').src = `images/${p.hinhAnh || 'phong1.jpg'}`;
        
        let giaViet = p.giaTien || 0; 
        let giaMy = Math.round(giaViet / 25000);
        const vungGia = document.getElementById('chi-tiet-gia');
        if (vungGia) vungGia.innerHTML = `${giaViet.toLocaleString()} đ<span class="fs-5 text-muted fw-normal">/mo</span> <div class="mt-1 fs-6 text-muted fw-bold">(~ $${giaMy}/mo)</div>`;

        ganGiaTriText('chi-tiet-dien-tich', p.dienTich); 
        ganGiaTriText('gia-dien', p.giaDien); 
        ganGiaTriText('gia-nuoc', p.giaNuoc);
        ganGiaTriText('gia-dich-vu', p.giaDichVu); 
        ganGiaTriText('chi-tiet-sdt', p.soDienThoai); 
        ganGiaTriText('mo-ta-vi-tri', p.viTriDacDia);

        let iframeBanDo = document.getElementById('ban-do-iframe');
        if (iframeBanDo && p.diaChi) {
            let diaChiEncode = encodeURIComponent(p.diaChi + ", Hà Nội");
            iframeBanDo.src = `https://maps.google.com/maps?q=${diaChiEncode}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }

        let vungTI = document.getElementById('danh-sach-tien-ich');
        let ds = [
            {v: p.coDieuHoa, t: 'Air Conditioner', i: 'fa-snowflake text-primary'}, 
            {v: p.veSinhKhepKin, t: 'Private WC', i: 'fa-restroom text-info'}, 
            {v: p.coMayGiat, t: 'Washer', i: 'fa-shirt text-success'}, 
            {v: p.khongChungChu, t: 'No Landlord', i: 'fa-key text-warning'},
            {v: p.coChoNauAn, t: 'Kitchen', i: 'fa-fire-burner text-danger'}, 
            {v: p.coBinhNongLanh, t: 'Heater', i: 'fa-shower text-info'},
            {v: p.deXeMienPhi, t: 'Free Parking', i: 'fa-motorcycle text-secondary'}, 
            {v: p.khoaVanTay, t: 'Smart Lock', i: 'fa-fingerprint text-dark'}, 
            {v: p.coBanCong, t: 'Balcony', i: 'fa-kaaba text-success'} 
        ];
        if (vungTI) {
            let html = ds.filter(x => x.v === 1).map(x => `<li class="d-inline-flex align-items-center bg-light rounded-pill px-3 py-2 me-2 mb-2 border shadow-sm fw-bold text-dark"><i class="fa-solid ${x.i} me-2 fs-5"></i>${x.t}</li>`).join('');
            vungTI.innerHTML = html || '<li class="text-muted fst-italic">No amenities listed</li>';
        }
        taiPhongTuongTu(p); 
        taiBinhLuan(maPhongTuUrl);
    });
}
function taiPhongTuongTu(phongXetTuongTuHienTai) {
    let khungChuaPhongTuongTuBenDuoi = document.getElementById('khung-phong-tuong-tu');
    if (!khungChuaPhongTuongTuBenDuoi) {
         const phanVungMoiInRaGiaoDien = document.createElement('section');
         phanVungMoiInRaGiaoDien.className = "py-5 bg-white border-top mt-4";
         phanVungMoiInRaGiaoDien.innerHTML = '<div class="container"><h3 class="fw-bold mb-4"><i class="fa-solid fa-house-circle-check text-primary me-2"></i>Similar Rooms</h3><div class="row g-4" id="khung-phong-tuong-tu"></div></div>';
         const theNgoaiCungMainGiaoDien = document.querySelector('.py-5.bg-light');
         if(theNgoaiCungMainGiaoDien) theNgoaiCungMainGiaoDien.after(phanVungMoiInRaGiaoDien);
         khungChuaPhongTuongTuBenDuoi = document.getElementById('khung-phong-tuong-tu');
    }
    if (!khungChuaPhongTuongTuBenDuoi) return;

    fetch(duongDanGocApi + "/api/danh-sach-phong-tro")
    .then(phanHoiTuMayChuLayDanhSach => phanHoiTuMayChuLayDanhSach.json())
    .then(danhSachChuanBiInPhongRa => {
        if (!Array.isArray(danhSachChuanBiInPhongRa) || danhSachChuanBiInPhongRa.length === 0) {
            khungChuaPhongTuongTuBenDuoi.innerHTML = '<div class="col-12 text-center py-4 text-muted fst-italic">No similar rooms found.</div>';
            return;
        }

        let maLuuPhongHienTai = String(phongXetTuongTuHienTai.maPhong || new URLSearchParams(window.location.search).get('id'));
        let truongCuaPhongHienTaiNhe = (phongXetTuongTuHienTai.ganTruong || "").trim().toLowerCase();
        let giaCuaPhongHienTaiTheNe = phongXetTuongTuHienTai.giaTien || 0;

        let danhSachXuatRaGiaoDienTuongTu = danhSachChuanBiInPhongRa.filter(phongBinhThuong => {
            let kiemTraDaDuyetHayChua = (phongBinhThuong.trangThai || '').toUpperCase() === 'DA_DUYET';
            let kiemTraKhacPhongHienTaiDangXem = String(phongBinhThuong.maPhong) !== maLuuPhongHienTai;
            let truongCuaPhongChuanBiDuocHienThi = (phongBinhThuong.ganTruong || "").trim().toLowerCase();
            let kiemTraCungTruongDaiHocCanThiet = (truongCuaPhongChuanBiDuocHienThi === truongCuaPhongHienTaiNhe) && (truongCuaPhongChuanBiDuocHienThi !== "");
            let kiemTraDoChenhLechGiuaCacPhongTro = Math.abs((phongBinhThuong.giaTien || 0) - giaCuaPhongHienTaiTheNe) <= 1000000;
            return kiemTraDaDuyetHayChua && kiemTraKhacPhongHienTaiDangXem && kiemTraCungTruongDaiHocCanThiet && kiemTraDoChenhLechGiuaCacPhongTro;
        });

        if (danhSachXuatRaGiaoDienTuongTu.length === 0) {
            khungChuaPhongTuongTuBenDuoi.innerHTML = '<div class="col-12 text-center py-4 text-muted fst-italic">No similar rooms found.</div>';
            return;
        }

        khungChuaPhongTuongTuBenDuoi.innerHTML = danhSachXuatRaGiaoDienTuongTu.slice(0, 4).map(phongDeHienThi => {
            let giaTienViet = phongDeHienThi.giaTien || 0;
            let giaTienMy = Math.round(giaTienViet / 26318);
            return `
            <div class="col-md-3">
                <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden card-phong" onclick="window.location.href='chitiet.html?id=${phongDeHienThi.maPhong}'" style="cursor:pointer">
                    <img src="images/${phongDeHienThi.hinhAnh || 'phong1.jpg'}" class="card-img-top" style="height:150px; object-fit:cover">
                    <div class="card-body p-3">
                        <h6 class="fw-bold text-truncate">${phongDeHienThi.tieuDe}</h6>
                        <div class="d-flex align-items-baseline gap-2 mb-1">
                            <h4 class="text-primary fw-bold mb-0" style="font-size: 1.1rem;">${giaTienViet.toLocaleString()} VND<span class="fs-6 fw-normal">/mo</span></h4>
                        </div>
                        <span class="text-muted small fw-medium">(~ $${giaTienMy}/mo)</span>
                    </div>
                </div>
            </div>`
        }).join('');
    }).catch(loiNgoaiLeXayRa => {
        khungChuaPhongTuongTuBenDuoi.innerHTML = '<div class="col-12 text-center py-4 text-danger">Error loading similar rooms.</div>';
    });
}

function taiDanhSachYeuThich() {
    const vungDeLuuYeuThichPhongNgayNay = document.getElementById('khung-yeu-thich');
    const nhanHienThiSoLuongPhong = document.getElementById('so-luong-yeu-thich');
    
    if (!vungDeLuuYeuThichPhongNgayNay) return;

    let danhSachIdYeuThichNheDeLayLai = JSON.parse(localStorage.getItem('yeuthich')) || [];
    let mangCacChuoiMaHienThiPhong = danhSachIdYeuThichNheDeLayLai.map(String);

    if (mangCacChuoiMaHienThiPhong.length === 0) {
        if (nhanHienThiSoLuongPhong) nhanHienThiSoLuongPhong.innerText = "0 saved rooms";
        vungDeLuuYeuThichPhongNgayNay.innerHTML = '<div class="col-12 text-center py-5"><h4 class="text-muted fst-italic">You haven\'t saved any rooms yet.</h4></div>';
        return;
    }

    fetch(duongDanGocApi + "/api/danh-sach-phong-tro")
    .then(phanHoiGoiMayChuTheKia => phanHoiGoiMayChuTheKia.json())
    .then(duLieuBocTachDuocNgayHomNay => {
        let phongDuocLuuYeuThichTraVeThoi = duLieuBocTachDuocNgayHomNay.filter(phongCoNheThongTinhNay => mangCacChuoiMaHienThiPhong.includes(String(phongCoNheThongTinhNay.maPhong)));

        if (nhanHienThiSoLuongPhong) nhanHienThiSoLuongPhong.innerText = `${phongDuocLuuYeuThichTraVeThoi.length} saved rooms`;

        if (phongDuocLuuYeuThichTraVeThoi.length === 0) {
             vungDeLuuYeuThichPhongNgayNay.innerHTML = '<div class="col-12 text-center py-5"><h4 class="text-muted fst-italic">You haven\'t saved any rooms yet.</h4></div>';
             return;
        }

        vungDeLuuYeuThichPhongNgayNay.innerHTML = phongDuocLuuYeuThichTraVeThoi.map(phongSeInRaTrucTiepNgayNe => taoThePhong(phongSeInRaTrucTiepNgayNe)).join('');
    })
    .catch(loiTruyCapHienTaiLaTaiNay => {
        if (nhanHienThiSoLuongPhong) nhanHienThiSoLuongPhong.innerText = "Error loading data";
        vungDeLuuYeuThichPhongNgayNay.innerHTML = '<div class="col-12 text-center py-5 text-danger">Error loading favorites.</div>';
    });
}

let diemSaoChon = 5;

// 1. Hàm vẽ sao (Xử lý được cả sao rưỡi)
function veSaoHtml(diem) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (diem >= i) html += '<i class="fa-solid fa-star"></i>';
        else if (diem >= i - 0.5) html += '<i class="fa-solid fa-star-half-stroke"></i>';
        else html += '<i class="fa-regular fa-star"></i>';
    }
    return html;
}

function taiBinhLuan(maPhong) {
    const container = document.getElementById('danh-sach-binh-luan');
    const vungSaoTop = document.getElementById('vung-sao-trung-binh-top'); // ID khớp với HTML
    if (!container) return;

    fetch(`${duongDanGocApi}/api/binh-luan/${maPhong}`)
    .then(res => res.json()).then(data => {
        if (!data || data.length === 0) {
            container.innerHTML = '<p class="text-muted fst-italic">No reviews yet.</p>';
            if (vungSaoTop) vungSaoTop.innerHTML = '<small class="text-muted">No ratings</small>';
            return;
        }

        // Tính trung bình cộng chính xác
        let tb = (data.reduce((s, b) => s + (b.soSao || 5), 0) / data.length).toFixed(1);
        
        // HIỂN THỊ LÊN KHUNG CẠNH TÊN PHÒNG
        if (vungSaoTop) {
            vungSaoTop.innerHTML = `
                <div class="text-warning fs-5 lh-1 mb-1">${veSaoHtml(tb)}</div>
                <div class="d-flex align-items-center justify-content-end gap-1">
                    <span class="fw-bold fs-2 text-dark">${tb}</span>
                    <span class="text-muted small">/ 5.0</span>
                </div>
                <div class="text-muted small" style="font-size: 0.75rem;">${data.length} reviews</div>
            `;
        }

        // Vẽ danh sách bình luận (ĐÃ THÊM NÚT LIKE VÀ SỐ LƯỢT THÍCH)
        container.innerHTML = data.map(bl => `
            <div class="d-flex gap-3 mb-4 border-bottom pb-3">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(bl.tenNguoiDung)}&background=random&color=fff" class="rounded-circle shadow" width="45" height="45">
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="fw-bold text-dark">${bl.tenNguoiDung}</span>
                        <span class="text-muted" style="font-size: 0.75rem;">${new Date(bl.ngayTao).toLocaleString()}</span>
                    </div>
                    <div class="text-warning small mb-2">${veSaoHtml(bl.soSao || 5)}</div>
                    <p class="mb-2 text-secondary small">${bl.noiDung}</p>
                    
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-sm btn-light rounded-pill px-3 border shadow-sm" onclick="thucHienLike(${bl.maBinhLuan}, ${maPhong})">
                            <i class="fa-solid fa-thumbs-up text-primary me-1"></i> 
                            <span class="fw-bold" id="like-count-${bl.maBinhLuan}">${bl.luotLike || 0}</span>
                        </button>
                    </div>
                </div>
            </div>`).join('');
    });
}
function thucHienLike(idBinhLuan, idPhong) {
    if (!localStorage.getItem('taiKhoan')) {
        hienThiThongBao("Login Required", "Please login to like comments!", "canhbao");
        return;
    }

    fetch(`${duongDanGocApi}/api/like-binh-luan/${idBinhLuan}`, { method: 'POST' })
    .then(res => {
        if (res.ok) {
            // Tải lại danh sách bình luận để cập nhật số like mới nhất từ server
            taiBinhLuan(idPhong);
        } else {
            hienThiThongBao("Error", "Could not like this comment.", "loi");
        }
    });
}
function khoiTaoSaoReview() {
    const stars = document.querySelectorAll('#star-rating-input i');
    if(!stars.length) return;
    stars.forEach(s => {
        s.onclick = () => {
            diemSaoChon = parseInt(s.getAttribute('data-value'));
            document.getElementById('star-text').innerText = diemSaoChon + ".0";
            stars.forEach((star, idx) => {
                star.className = idx < diemSaoChon ? 'fa-solid fa-star' : 'fa-regular fa-star';
            });
        };
    });
}



// Hàm gửi đánh giá (Đã bọc thép chặn SPAM)
// Đảm bảo đầu file main.js sếp có khai báo: let diemSaoChon = 5;
// 1. Mở Modal đặt lịch
function moModalDatLich() {
    if (!localStorage.getItem('taiKhoan')) {
        hienThiThongBao("Login Required", "Please login to schedule a viewing!", "canhbao");
        return;
    }
    new bootstrap.Modal(document.getElementById('modalDatLichHen')).show();
}

// 2. Xác nhận và gửi thông báo
function xacNhanDatLich() {
    let ngay = document.getElementById('hen-ngay').value;
    let gio24 = document.getElementById('hen-gio').value; // Định dạng mặc định là HH:mm
    let user = localStorage.getItem('taiKhoan');
    let idPhong = new URLSearchParams(window.location.search).get('id');
    let tieuDe = document.getElementById('chi-tiet-tieu-de').innerText;

    if (!ngay || !gio24) {
        hienThiThongBao("Warning", "Please select both date and time!", "canhbao");
        return;
    }

    // --- ĐOẠN SỬA: Chuyển đổi HH:mm sang AM/PM ---
    let [hours, minutes] = gio24.split(':');
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Chuyển 0 thành 12, 13 thành 1...
    let gioAMPM = `${hours}:${minutes} ${ampm}`;

    fetch(`${duongDanGocApi}/api/chi-tiet-phong/${idPhong}`)
    .then(res => res.json()).then(p => {
        let maChuTro = p.maNguoiDung;

        fetch(duongDanGocApi + "/api/gui-thong-bao-he-thong", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                maNguoiNhan: maChuTro,
                // Đã thay 'gio' bằng 'gioAMPM' để không còn hiện 22:31 như ảnh cũ
                noiDung: `Schedule: User [${user}] wants to see room [#PT${idPhong} - ${tieuDe}] on ${ngay} at ${gioAMPM}.`
            })
        }).then(() => {
            const modalElement = document.getElementById('modalDatLichHen');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();
            
            hienThiThongBao("Success", "Booking request sent to landlord!", "thanhcong");
        });
    });
}

function guiBinhLuan() {
    let noiDung = document.getElementById('noiDungBinhLuan').value.trim();
    let maPhong = new URLSearchParams(window.location.search).get('id');
    let taiKhoan = localStorage.getItem('taiKhoan');

    if (!taiKhoan) { 
        hienThiThongBao("Login Required", "Please login to write a review!", "canhbao"); 
        return; 
    }
    if (!noiDung) { 
        hienThiThongBao("Warning", "Please enter your review!", "canhbao"); 
        return; 
    }

    // ĐÃ FIX: Dùng đúng biến diemSaoChon đồng bộ với hàm khoiTaoSaoReview
    let obj = { 
        maPhong: parseInt(maPhong), 
        tenNguoiDung: taiKhoan, 
        noiDung: noiDung, 
        soSao: diemSaoChon 
    };
    
    let btn = document.getElementById('btnGuiBinhLuan');
    if(btn) btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

    fetch(duongDanGocApi + "/api/binh-luan", {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(obj)
    })
    .then(res => {
        if (!res.ok) {
            return res.text().then(text => { throw new Error(text) });
        }
        return res.text();
    })
    .then(kq => {
        if(btn) btn.innerHTML = 'Post Review';
        document.getElementById('noiDungBinhLuan').value = '';
        hienThiThongBao("Success", `Review posted successfully!`, "thanhcong");
        taiBinhLuan(maPhong); // Tải lại để cập nhật con số trung bình ngay lập tức
    })
    .catch(err => {
        if(btn) btn.innerHTML = 'Post Review';
        if (err.message === "DA_DANH_GIA") {
            hienThiThongBao("Warning", "You have already rated this room! Each account can only rate once.", "loi");
        } else {
            hienThiThongBao("Error", "Could not post review. Try again.", "loi");
        }
    });
}

function phânQuyềnTrangHỗTrợ() {
    const kiemTraVaiTroNhanDuocTiepCanChucNang = (localStorage.getItem("vaiTro") || "").trim().toUpperCase();
    const theMoFormTuDongChoNguoiSuDungGiaoThiep = document.getElementById('form-gui-ho-tro');
    const bieuBangDieuKhienDanhChoCacPhaQuangTri = document.getElementById('vung-quan-ly-ho-tro'); 

    if (kiemTraVaiTroNhanDuocTiepCanChucNang === 'QUAN_TRI') {
        if (theMoFormTuDongChoNguoiSuDungGiaoThiep) theMoFormTuDongChoNguoiSuDungGiaoThiep.classList.add('d-none');
        if (bieuBangDieuKhienDanhChoCacPhaQuangTri) {
            bieuBangDieuKhienDanhChoCacPhaQuangTri.classList.remove('d-none');
            taiDanhSachHoTro(); 
        }
    } else {
        if (theMoFormTuDongChoNguoiSuDungGiaoThiep) theMoFormTuDongChoNguoiSuDungGiaoThiep.classList.remove('d-none');
        if (bieuBangDieuKhienDanhChoCacPhaQuangTri) bieuBangDieuKhienDanhChoCacPhaQuangTri.classList.add('d-none');
    }
}

function taiDanhSachHoTro() {
    const vungDanhDauHienThiBangVeHoTroNgayNe = document.getElementById('bang-ho-tro');
    if (!vungDanhDauHienThiBangVeHoTroNgayNe) return;
    fetch(duongDanGocApi + "/api/danh-sach-ho-tro")
    .then(phanHoiXepThanhTheoCotLieuT => phanHoiXepThanhTheoCotLieuT.json())
    .then(chuanBiInDanhSachHoTroChoNguoiQuanLy => {
        let chieuDaiCuaChuoiDuocTaoRaDungTrongDayTheNa = '';
        chuanBiInDanhSachHoTroChoNguoiQuanLy.forEach(tungTinNhanGoiLoiThongBaoChoBanTiepNhano => {
            const chucNangTinMoiBiQuenLamRoi = tungTinNhanGoiLoiThongBaoChoBanTiepNhano.trangThai !== 'DA_XU_LY';
            chieuDaiCuaChuoiDuocTaoRaDungTrongDayTheNa += `<tr>
                <td class="ps-3 fw-bold">${tungTinNhanGoiLoiThongBaoChoBanTiepNhano.hoTen}</td>
                <td>${tungTinNhanGoiLoiThongBaoChoBanTiepNhano.lienHe || ''}</td>
                <td>${tungTinNhanGoiLoiThongBaoChoBanTiepNhano.noiDung}</td>
                <td><span class="badge ${chucNangTinMoiBiQuenLamRoi ? 'bg-warning' : 'bg-success'} rounded-pill">${chucNangTinMoiBiQuenLamRoi ? 'New' : 'Solved'}</span></td>
                <td class="text-center">${chucNangTinMoiBiQuenLamRoi ? '<button class="btn btn-sm btn-primary rounded-pill" onclick="repHoTro(' + tungTinNhanGoiLoiThongBaoChoBanTiepNhano.maHoTro + ')">Mark Solved</button>' : '<i class="fa-solid fa-circle-check text-success"></i>'}</td>
            </tr>`;
        });
        vungDanhDauHienThiBangVeHoTroNgayNe.innerHTML = chieuDaiCuaChuoiDuocTaoRaDungTrongDayTheNa || '<tr><td colspan="5" class="text-center py-4">No support requests.</td></tr>';
    })
    .catch(khongKetNoiDuocPhanTiepNhanHoTroGoiChoMinhh => console.error("Loi tai ho tro", khongKetNoiDuocPhanTiepNhanHoTroGoiChoMinhh));
}

function repHoTro(idHienThongBaoBaoMat) {
    fetch(duongDanGocApi + "/api/phan-hoi-ho-tro/" + idHienThongBaoBaoMat, { method: 'POST' }).then(() => taiDanhSachHoTro());
}


let bieuDoTronNguoiDung, bieuDoCotTopPhong;


document.addEventListener("DOMContentLoaded", () => {
    capNhatMenu(); 
    khoiTaoSaoReview();
    if (typeof taiChiTietPhong === 'function') taiChiTietPhong();
    if (typeof khoiTaoCheDoToi === 'function') khoiTaoCheDoToi();
    if (typeof taiTop6NoiBat === 'function' && document.getElementById('khung-top-noi-bat')) taiTop6NoiBat();
    if (document.getElementById('khung-danh-sach')) {
        let trangDaLuu = sessionStorage.getItem('trangHienTaiTroHD') || 0;
        taiTrangDanhSachMain(parseInt(trangDaLuu));
    }
    if (document.getElementById('bang-tin-dang')) taiDanhSachAdmin();
    if (document.getElementById('bang-quan-ly-phong')) taiDanhSachQuanLyPhong();
    if (document.getElementById('noi-dung-thong-bao')) taiThongBao();
    if (document.getElementById('bang-ho-tro')) taiDanhSachHoTro();
    if (document.getElementById('chartNguoiDung')) khoiTaoBieuDo();
    if (document.getElementById('khung-yeu-thich')) taiDanhSachYeuThich();
    if (document.getElementById('bang-nguoi-dung')) taiDanhSachNguoiDung();
    
    if (document.getElementById('dt-tieuDe')) {
        khoiPhucNhapDangTin();
        document.querySelectorAll('input, select, textarea').forEach(oNhap => { oNhap.addEventListener('input', tuDongLuuNhapDangTin); });
    }

    const nutTimKiem = document.getElementById('btn-tim-kiem');
    if (nutTimKiem) {
        nutTimKiem.addEventListener('click', (suKien) => {
            suKien.preventDefault();
            const truong = document.getElementById('filter-truong').value; 
            const khuVuc = document.getElementById('filter-khu-vuc').value; 
            const giaRange = document.getElementById('filter-gia').value;
            const thamSo = new URLSearchParams();
            if (truong && truong !== "All Universities") thamSo.append('truong', truong);
            if (khuVuc && khuVuc !== "All Areas") thamSo.append('khuvuc', khuVuc);
            if (giaRange && giaRange !== "0") thamSo.append('gia', giaRange);
            window.location.href = `danhsach.html?${thamSo.toString()}`;
        });
    }
    if (window.location.pathname.includes('hotro.html')) phânQuyềnTrangHỗTrợ();
    
    if (localStorage.getItem("maNguoiDung")) {
        setInterval(taiThongBao, 60000);
    }
});

let selectedVipRoomId = null;

function moModalVip(id) {
    selectedVipRoomId = id;
    const modalElement = document.getElementById('modalDayVip');
    if (modalElement) {
        new bootstrap.Modal(modalElement).show();
    }
}

const btnXacNhanVip = document.getElementById('btnXacNhanVip');
if (btnXacNhanVip) {
    btnXacNhanVip.onclick = () => {
        btnXacNhanVip.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Promoting...';
        btnXacNhanVip.disabled = true;

        fetch(`${duongDanGocApi}/api/promote/${selectedVipRoomId}`, { method: 'PUT' })
        .then(response => {
            if(response.ok) {
                const modalInstance = bootstrap.Modal.getInstance(document.getElementById('modalDayVip'));
                if (modalInstance) modalInstance.hide();
                hienThiThongBao("Success", "VIP request sent! Admin will review it.", "thanhcong", () => location.reload());
            } else {
                throw new Error("API Error");
            }
        })
        .catch(() => {
            hienThiThongBao("Error", "Could not send VIP request.", "loi");
            btnXacNhanVip.innerHTML = 'Confirm VIP';
            btnXacNhanVip.disabled = false;
        });
    };
}

// ==========================================
// 2. AI SMART SEARCH (SAFE VERSION)
// ==========================================
// --- AI SMART SEARCH PRO (WITH MEMORY & SMART LINK) ---

// --- AI SMART SEARCH (PROFESSIONAL ENGLISH VERSION) ---

const oInputAI = document.getElementById('aiChatInput');
const btnGuiAI = document.getElementById('btnGuiAI');
const khungLichSu = document.getElementById('aiChatHistory');

if (khungLichSu) {
    const savedHistory = localStorage.getItem('ai_history');
    if (savedHistory) {
        khungLichSu.innerHTML = savedHistory;
        khungLichSu.scrollTop = khungLichSu.scrollHeight;
    }
}

if (oInputAI && btnGuiAI) {
    btnGuiAI.onclick = guiTinNhanAI;
    oInputAI.onkeypress = (e) => { if (e.key === 'Enter') guiTinNhanAI(); };
}

function guiTinNhanAI() {
    const noiDung = oInputAI.value.trim();
    if (!noiDung) return;

    khungLichSu.insertAdjacentHTML('beforeend', `
        <div class="text-end mb-3">
            <div class="d-inline-block text-white rounded-4 p-2 px-3 shadow-sm" style="background-color: #0a2540; max-width: 85%; font-size: 0.9rem;">
                ${noiDung}
            </div>
        </div>`);
    
    oInputAI.value = '';
    oInputAI.focus();
    khungLichSu.scrollTo({ top: khungLichSu.scrollHeight, behavior: 'smooth' });

    const idBot = 'bot-' + Date.now();
    khungLichSu.insertAdjacentHTML('beforeend', `
        <div class="text-start mb-3" id="${idBot}">
            <div class="ai-message-bot shadow-sm">
                <span class="spinner-grow spinner-grow-sm text-primary"></span>
                <span class="ms-1 text-muted small fst-italic">AI is processing...</span>
            </div>
        </div>`);
    khungLichSu.scrollTo({ top: khungLichSu.scrollHeight, behavior: 'smooth' });

    fetch(`${duongDanGocApi}/api/ai/search?message=${encodeURIComponent(noiDung)}`)
    .then(res => res.json())
    .then(data => {
        const theBot = document.getElementById(idBot);
        if (theBot) {
            // ==========================================
            // LOGIC NÚT BẤM THÔNG MINH THEO Ý SẾP
            // ==========================================
            let labelNut = "";
            let linkUrl = data.url;

            if (data.count === 0) {
                // 1. Khi 0 kết quả: Không hiện "View 0 Results" mà mời xem full phòng
                labelNut = "Explore All Available Rooms";
                linkUrl = "danhsach.html"; // Ép link về trang danh sách không có bộ lọc
            } else if (data.count === 1) {
                // 2. Khi có đúng 1 kết quả: Hiện "View Details" (không có chữ 's')
                labelNut = "View Details";
            } else {
                // 3. Khi có nhiều kết quả: Hiện số lượng kèm Results (có chữ 's')
                labelNut = `View ${data.count} Results`;
            }

            theBot.innerHTML = `
                <div class="ai-message-bot shadow-sm border-start border-4 border-warning">
                    ${data.reply} <br>
                    <a href="${linkUrl}" class="btn btn-sm btn-primary mt-2 rounded-pill w-100 fw-bold shadow-sm">
                        ${labelNut}
                    </a>
                </div>`;
                
            localStorage.setItem('ai_history', khungLichSu.innerHTML);
            khungLichSu.scrollTo({ top: khungLichSu.scrollHeight, behavior: 'smooth' });
        }
    })
    .catch(() => {
        const theBot = document.getElementById(idBot);
        if (theBot) theBot.innerHTML = "AI Server is currently offline.";
    });
}