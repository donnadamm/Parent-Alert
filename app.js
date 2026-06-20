// ==================== DATA & STATE ====================
let currentUser = null;
let currentPage = "landing";
let isDark = false;
let currentAuthTab = "login";

// Data Laporan Sekolah - KOSONG
let systemRecords = [];

// ==================== LOCAL STORAGE DATA ====================
// Simpan data ke localStorage
function saveSystemData() {
  try {
    localStorage.setItem("parentAlertData", JSON.stringify(systemRecords));
    console.log("✅ Data berhasil disimpan ke localStorage");
  } catch (e) {
    console.error("❌ Gagal menyimpan data:", e);
  }
}

// Muat data dari localStorage
function loadSystemData() {
  try {
    const data = localStorage.getItem("parentAlertData");
    if (data) {
      systemRecords = JSON.parse(data);
      console.log(
        "✅ Data berhasil dimuat dari localStorage:",
        systemRecords.length,
        "record",
      );
      return true;
    }
    console.log("ℹ️ Tidak ada data di localStorage, menggunakan data kosong");
    return false;
  } catch (e) {
    console.error("❌ Gagal memuat data:", e);
    return false;
  }
}

// Hapus data dari localStorage (jika diperlukan)
function clearSystemData() {
  localStorage.removeItem("parentAlertData");
  systemRecords = [];
  console.log("🗑️ Data di localStorage telah dihapus");
}

// DATA KONFIGURASI DEVELOPER BYPASS
const DEV_EMAIL = "donadamayanti062@gmail.com";

// FUNGSI UTAMA: Mengambil database akun dari localStorage browser.
function getRegisteredUsers() {
  const users = localStorage.getItem("parentAlertUsers");
  if (!users) {
    const defaultAccounts = [
      {
        email: "admin@sekolah.com",
        password: "admin123",
        name: "Admin Sekolah",
        role: "admin",
        children: "",
      },
      {
        email: "guru@sekolah.com",
        password: "guru123",
        name: "Budi Santoso",
        role: "admin",
        children: "",
      },
    ];
    localStorage.setItem("parentAlertUsers", JSON.stringify(defaultAccounts));
    return defaultAccounts;
  }
  return JSON.parse(users);
}

// ==================== SDK INIT ====================
window.elementSdk?.init({
  defaultConfig: { app_title: "Parent Alert" },
  onConfigChange: (config) => {
    if (config.app_title) {
      const landingTitle = document.getElementById("landingNavTitle");
      const sidebarTitle = document.getElementById("sidebarTitle");
      if (landingTitle)
        landingTitle.textContent = config.app_title.toUpperCase();
      if (sidebarTitle)
        sidebarTitle.textContent = config.app_title.toUpperCase();
    }
  },
  mapToCapabilities: () => ({
    recolorables: [],
    borderables: [],
    fontEditable: null,
    fontSizeable: null,
  }),
});

window.dataSdk?.init({
  onDataChanged(data) {
    if (data && data.length > 0) systemRecords = data;
    if (currentUser) renderDashboardContent();
  },
});

// ==================== DROPDOWN FUNCTIONS ====================
function toggleCustomDropdown() {
  const menu = document.getElementById("dropdownMenuOptions");
  const chevron = document.getElementById("dropdownChevron");
  if (!menu) return;
  if (menu.classList.contains("show")) {
    menu.classList.remove("show");
    if (chevron) chevron.classList.remove("rotated");
  } else {
    menu.classList.add("show");
    if (chevron) chevron.classList.add("rotated");
    const btn = document.querySelector(".dropdown-role-btn");
    if (btn) {
      btn.style.transform = "scale(0.98)";
      setTimeout(() => {
        btn.style.transform = "scale(1)";
      }, 150);
    }
  }
}

function closeCustomDropdown() {
  const menu = document.getElementById("dropdownMenuOptions");
  const chevron = document.getElementById("dropdownChevron");
  if (menu && menu.classList.contains("show")) menu.classList.remove("show");
  if (chevron) chevron.classList.remove("rotated");
}

function selectRoleOption(roleValue, roleText) {
  const displaySpan = document.getElementById("dropdownSelectedValue");
  if (displaySpan) {
    displaySpan.style.opacity = "0";
    setTimeout(() => {
      displaySpan.setAttribute("data-value", roleValue);
      displaySpan.innerHTML = roleText;
      displaySpan.style.opacity = "1";
    }, 150);
  }
  closeCustomDropdown();
  showToast(`Role berhasil diubah menjadi ${roleText}`, "success");
}

document.addEventListener("click", function (e) {
  const wrapper = document.getElementById("groupRegisterRole");
  if (wrapper && !wrapper.contains(e.target)) closeCustomDropdown();
});

// ==================== AUTH FUNCTIONS ====================
function switchAuthTab(tab) {
  currentAuthTab = tab;
  const tabLogin = document.getElementById("tabLoginBtn");
  const tabRegister = document.getElementById("tabRegisterBtn");
  const leftTitle = document.getElementById("leftPanelTitle");
  const leftDesc = document.getElementById("leftPanelDesc");
  const leftFeatures = document.getElementById("leftPanelFeatures");
  const subTitle = document.getElementById("formSubtitle");
  const gName = document.getElementById("groupRegisterName");
  const gRole = document.getElementById("groupRegisterRole");
  const gLoginOpts = document.getElementById("groupLoginOptions");
  const btnText = document.getElementById("submitBtnText");
  const footerToggle = document.getElementById("toggleAuthFooter");

  const passwordInput = document.getElementById("authPassword");
  if (passwordInput) passwordInput.value = "";

  if (gRole) {
    gRole.classList.remove("hidden");
    gRole.style.display = "block";
    gRole.style.maxHeight = "150px";
    gRole.style.opacity = "1";
    gRole.style.transform = "translateY(0)";
  }

  if (tab === "register") {
    if (tabLogin)
      tabLogin.className =
        "text-base font-bold text-gray-500 hover:text-gray-300 pb-1 transition-all duration-300 uppercase tracking-wide outline-none";
    if (tabRegister)
      tabRegister.className =
        "text-base font-bold border-b-2 border-purple-500 text-white pb-1 transition-all duration-300 uppercase tracking-wide outline-none";
    if (subTitle)
      subTitle.textContent =
        "Lengkapi formulir di bawah untuk mendaftarkan akun baru";
    if (gName) {
      gName.classList.remove("hidden");
      void gName.offsetWidth;
      gName.style.maxHeight = "120px";
      gName.style.opacity = "1";
      gName.style.transform = "translateY(0)";
    }
    if (gLoginOpts) {
      gLoginOpts.style.opacity = "0";
      gLoginOpts.style.maxHeight = "0";
      setTimeout(() => gLoginOpts.classList.add("hidden"), 300);
    }
    if (leftTitle) leftTitle.textContent = "Mari Bergabung!";
    if (leftDesc)
      leftDesc.textContent =
        "Buat akun Parent Alert untuk mulai memantau dan berkolaborasi demi masa depan akademik siswa yang lebih baik.";
    if (leftFeatures)
      leftFeatures.innerHTML = `<li class="flex items-center gap-3 transform hover:translate-x-1 transition-transform"><span class="p-1 bg-white/20 rounded-lg"><i data-lucide="user-plus" class="w-3.5 h-3.5 text-white"></i></span>Pendaftaran instan tanpa biaya sekolah</li><li class="flex items-center gap-3 transform hover:translate-x-1 transition-transform"><span class="p-1 bg-white/20 rounded-lg"><i data-lucide="shield" class="w-3.5 h-3.5 text-white"></i></span>Keamanan rekam data siswa terjamin</li>`;
    if (btnText) btnText.textContent = "DAFTAR AKUN BARU";
    if (footerToggle)
      footerToggle.innerHTML = `Sudah memiliki akun? <a href="#" onclick="switchAuthTab('login')" class="text-purple-400 font-bold hover:text-purple-300 underline ml-1 transition-colors">Masuk Sekarang</a>`;

    // ==================== ISI DROPDOWN SISWA UNTUK ORANG TUA ====================
    const studentSelect = document.getElementById("authStudent");
    if (studentSelect) {
      // Ambil daftar siswa unik dari systemRecords
      const siswaList = [...new Set(systemRecords.map((r) => r.Nama))];
      studentSelect.innerHTML = '<option value="">-- Pilih Anak --</option>';
      siswaList.forEach((s) => {
        const option = document.createElement("option");
        option.value = s;
        option.textContent = s;
        studentSelect.appendChild(option);
      });
    }

    // Tampilkan field pilih anak saat register
    const studentGroup = document.getElementById("groupRegisterStudent");
    if (studentGroup) {
      studentGroup.classList.remove("hidden");
      void studentGroup.offsetWidth;
      studentGroup.style.maxHeight = "120px";
      studentGroup.style.opacity = "1";
      studentGroup.style.transform = "translateY(0)";
    }
  } else {
    if (tabLogin)
      tabLogin.className =
        "text-base font-bold border-b-2 border-purple-500 text-white pb-1 transition-all duration-300 uppercase tracking-wide outline-none";
    if (tabRegister)
      tabRegister.className =
        "text-base font-bold text-gray-500 hover:text-gray-300 pb-1 transition-all duration-300 uppercase tracking-wide outline-none";
    if (subTitle)
      subTitle.textContent =
        "Silakan masukkan kredensial akun Anda untuk masuk ke sistem";
    if (gName) {
      gName.style.maxHeight = "0";
      gName.style.opacity = "0";
      gName.style.transform = "translateY(-8px)";
      setTimeout(() => gName.classList.add("hidden"), 400);
    }
    if (gLoginOpts) {
      gLoginOpts.classList.remove("hidden");
      void gLoginOpts.offsetWidth;
      gLoginOpts.style.maxHeight = "50px";
      gLoginOpts.style.opacity = "1";
    }
    if (leftTitle) leftTitle.textContent = "Halo, Selamat Datang!";
    if (leftDesc)
      leftDesc.textContent =
        "Platform monitoring terintegrasi untuk memantau perkembangan akademik, kehadiran, dan kedisiplinan siswa secara real-time.";
    if (leftFeatures)
      leftFeatures.innerHTML = `<li class="flex items-center gap-3 transform hover:translate-x-1 transition-transform"><span class="p-1 bg-white/20 rounded-lg"><i data-lucide="check" class="w-3.5 h-3.5 text-white"></i></span>Akses info kapan saja & instan</li><li class="flex items-center gap-3 transform hover:translate-x-1 transition-transform"><span class="p-1 bg-white/20 rounded-lg"><i data-lucide="check" class="w-3.5 h-3.5 text-white"></i></span>Notifikasi perkembangan anak langsung</li>`;
    if (btnText) btnText.textContent = "MASUK KE DASHBOARD";
    if (footerToggle)
      footerToggle.innerHTML = `Belum punya akun? <a href="#" onclick="switchAuthTab('register')" class="text-purple-400 font-bold hover:text-purple-300 underline ml-1 transition-colors">Buat Akun Baru</a>`;

    // Sembunyikan field pilih anak saat login
    const studentGroup = document.getElementById("groupRegisterStudent");
    if (studentGroup) {
      studentGroup.style.maxHeight = "0";
      studentGroup.style.opacity = "0";
      studentGroup.style.transform = "translateY(-8px)";
      setTimeout(() => studentGroup.classList.add("hidden"), 400);
    }
  }

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function handleAuthSubmit(event) {
  event.preventDefault();
  if (currentAuthTab === "register") executeRegistration();
  else executeLogin();
}

function executeRegistration() {
  const name = document.getElementById("authName")?.value.trim() || "";
  const role =
    document
      .getElementById("dropdownSelectedValue")
      ?.getAttribute("data-value") || "parent";
  const email =
    document.getElementById("authEmail")?.value.trim().toLowerCase() || "";
  const password = document.getElementById("authPassword")?.value || "";
  const studentName =
    document.getElementById("authStudent")?.value.trim() || "";

  if (!name || !email || !password) {
    showToast("Mohon lengkapi seluruh baris data pokok!", "error");
    return;
  }

  // Jika role parent, wajib pilih anak
  if (role === "parent" && !studentName) {
    showToast("Mohon pilih nama anak!", "error");
    return;
  }

  let currentUsers = getRegisteredUsers();
  if (email !== DEV_EMAIL && currentUsers.some((u) => u.email === email)) {
    showToast("Gagal! Email ini telah terdaftar dalam sistem.", "error");
    return;
  }

  const newAccount = {
    email,
    password,
    name,
    role,
    children: studentName, // Simpan nama anak
  };

  currentUsers.push(newAccount);
  localStorage.setItem("parentAlertUsers", JSON.stringify(currentUsers));

  showToast("Akun Berhasil Dibuat! Silakan masuk.", "success");
  // ... reset form
}

function executeLogin() {
  const email =
    document.getElementById("authEmail")?.value.trim().toLowerCase() || "";
  const password = document.getElementById("authPassword")?.value || "";
  const selectedRole =
    document
      .getElementById("dropdownSelectedValue")
      ?.getAttribute("data-value") || "parent";
  const remember = document.getElementById("loginRemember")?.checked || false;
  let user = null;
  if (email === DEV_EMAIL) {
    let currentUsers = getRegisteredUsers();
    const matchesDev = currentUsers.filter((u) => u.email === DEV_EMAIL);
    if (matchesDev.length > 0) {
      const correctPass = matchesDev.find((u) => u.password === password);
      if (correctPass) {
        user = {
          name: correctPass.name + " (Dev)",
          role: selectedRole,
          email: correctPass.email,
          children: "",
        };
      }
    }
  }
  if (!user) {
    let currentUsers = getRegisteredUsers();
    user = currentUsers.find(
      (u) =>
        u.email === email && u.password === password && u.role === selectedRole,
    );
  }
  if (user) {
    if (remember) localStorage.setItem("rememberedEmail", email);
    else localStorage.removeItem("rememberedEmail");
    currentUser = user;
    document.getElementById("loginPageView").style.display = "none";
    document.getElementById("mainApp").style.display = "flex";
    document.getElementById("userProfileName").textContent = user.name;
    document.getElementById("avatarName").textContent = user.name
      .charAt(0)
      .toUpperCase();
    document.getElementById("sidebarRole").textContent =
      user.role === "admin" ? "Guru / Admin" : "Orang Tua Murid";
    document.getElementById("userEmailDisplay").textContent = user.email;
    showToast(`Selamat datang kembali, ${user.name}`, "success");
    buildSidebarMenu();
    switchPage("dashboard");
  } else {
    const form = document.getElementById("authForm");
    if (form) {
      form.classList.add("error-shake");
      setTimeout(() => form.classList.remove("error-shake"), 500);
    }
    showToast(
      "Kredensial atau Pilihan Role Anda tidak sesuai / belum terdaftar!",
      "error",
    );
  }
}

function openLoginPage() {
  document.getElementById("landingPageView").style.display = "none";
  document.getElementById("loginPageView").style.display = "flex";
  switchAuthTab("login");
  const emailInput = document.getElementById("authEmail");
  if (emailInput) {
    emailInput.value = "";
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      emailInput.value = rememberedEmail;
      const rememberCheck = document.getElementById("loginRemember");
      if (rememberCheck) rememberCheck.checked = true;
    }
  }
  lucide.createIcons();
}

function closeLoginPage() {
  document.getElementById("loginPageView").style.display = "none";
  document.getElementById("landingPageView").style.display = "flex";
}

function toggleLoginPassword() {
  const password = document.getElementById("authPassword");
  const eyeIcon = document.getElementById("loginEyeIcon");
  if (!password || !eyeIcon) return;
  if (password.type === "password") {
    password.type = "text";
    eyeIcon.setAttribute("data-lucide", "eye-off");
  } else {
    password.type = "password";
    eyeIcon.setAttribute("data-lucide", "eye");
  }
  lucide.createIcons();
}

function forgotPassword(event) {
  if (event) event.preventDefault();
  showToast("Link reset password telah dikirim ke email Anda!", "info");
}

function socialLogin(provider) {
  // Untuk Google, sudah ditangani oleh handleGoogleLogin
  if (provider === "Google") {
    // Google akan memunculkan popup sendiri melalui SDK
    return;
  }

  // Data dummy untuk simulasi GitHub dan Twitter
  const socialUsers = {
    GitHub: {
      name: "Pengguna GitHub",
      email: `user.github.${Math.random().toString(36).slice(-6)}@github.com`,
      role: "parent",
      children: "",
    },
    Twitter: {
      name: "Pengguna Twitter",
      email: `user.twitter.${Math.random().toString(36).slice(-6)}@twitter.com`,
      role: "parent",
      children: "",
    },
  };

  // Simulasi login untuk GitHub dan Twitter (untuk demo)
  let currentUsers = getRegisteredUsers();
  const socialEmail = socialUsers[provider].email;
  const existingUser = currentUsers.find((u) => u.email === socialEmail);

  let userData = null;

  if (existingUser) {
    userData = {
      name: existingUser.name + ` (${provider})`,
      role: existingUser.role || "parent",
      email: existingUser.email,
      children: existingUser.children || "",
    };
  } else {
    const newUser = {
      email: socialEmail,
      password: "social_" + Math.random().toString(36).slice(-8),
      name: socialUsers[provider].name,
      role: "parent",
      children: "",
    };
    currentUsers.push(newUser);
    localStorage.setItem("parentAlertUsers", JSON.stringify(currentUsers));

    userData = {
      name: newUser.name + ` (${provider})`,
      role: newUser.role,
      email: newUser.email,
      children: newUser.children,
    };
  }

  performLogin(userData, provider);

  // Proses login
  currentUser = userData;
  document.getElementById("loginPageView").style.display = "none";
  document.getElementById("mainApp").style.display = "flex";
  document.getElementById("userProfileName").textContent = userData.name;
  document.getElementById("avatarName").textContent = userData.name
    .charAt(0)
    .toUpperCase();
  document.getElementById("sidebarRole").textContent =
    userData.role === "admin" ? "Guru / Admin" : "Orang Tua Murid";
  document.getElementById("userEmailDisplay").textContent = userData.email;

  showToast(
    ` Berhasil login dengan ${provider}! Selamat datang, ${userData.name}`,
    "success",
  );
  buildSidebarMenu();
  switchPage("dashboard");
}

function handleLogout() {
  currentUser = null;
  currentPage = "landing";
  document.getElementById("mainApp").style.display = "none";
  document.getElementById("landingPageView").style.display = "flex";
  document.getElementById("loginPageView").style.display = "none";
  showToast("Sesi berhasil diakhiri.", "info");
}

function buildSidebarMenu() {
  const nav = document.getElementById("sidebarNav");
  if (!nav) return;
  nav.innerHTML = "";
  const routes = [
    { id: "dashboard", text: "Ringkasan Info", icon: "layout-grid" },
    { id: "akademik", text: "Nilai Academic", icon: "book-open" },
    { id: "kehadiran", text: "Presensi Siswa", icon: "user-check" },
    { id: "pelanggaran", text: "Log Pelanggaran", icon: "shield-alert" },
  ];
  routes.forEach((route) => {
    const btn = document.createElement("div");
    btn.className = `sidebar-item ${currentPage === route.id ? "active" : ""}`;
    btn.id = `menu-item-${route.id}`;
    btn.onclick = () => switchPage(route.id);
    btn.innerHTML = `<i data-lucide="${route.icon}" class="w-4 h-4"></i> <span class="font-medium">${route.text}</span>`;
    nav.appendChild(btn);
  });
  lucide.createIcons();
}

function switchPage(pageId) {
  currentPage = pageId;
  document
    .querySelectorAll("#sidebarNav .sidebar-item")
    .forEach((item) => item.classList.remove("active"));
  const currentActive = document.getElementById(`menu-item-${pageId}`);
  if (currentActive) currentActive.classList.add("active");
  const titles = {
    dashboard: "Dashboard Utama",
    siswa: "Data Siswa",
    akademik: "Nilai Akademik",
    kehadiran: "Presensi Siswa",
    pelanggaran: "Log Pelanggaran",
    analitik: "Analitik",
    notifikasi: "Notifikasi",
  };
  document.getElementById("pageCurrentTitle").textContent =
    titles[pageId] || "Dashboard";
  renderDashboardContent();
}

// ==================== RENDER DASHBOARD CONTENT (ASLI UNTUK PARENT) ====================
function renderDashboardContent() {
  const box = document.getElementById("mainContent");
  if (!box) return;
  box.innerHTML = "";

  const allowedRecords = systemRecords;

  if (currentPage === "dashboard") {
    const totalAkademik = allowedRecords.filter(
      (r) => r.Kategori === "Akademik",
    ).length;
    const totalKehadiran = allowedRecords.filter(
      (r) => r.Kategori === "Kehadiran",
    ).length;
    const totalPelanggaran = allowedRecords.filter(
      (r) => r.Kategori === "Pelanggaran",
    ).length;

    box.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade">
        <div class="glass-premium p-5 rounded-xl shadow-sm flex items-center gap-4 bg-white/50 dark:bg-[#151233]/50">
          <div class="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400"><i data-lucide="book-open" class="w-5 h-5"></i></div>
          <div><h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Log Akademik</h4><p class="text-2xl font-extrabold text-indigo-950 dark:text-white mt-0.5">${totalAkademik}</p></div>
        </div>
        <div class="glass-premium p-5 rounded-xl shadow-sm flex items-center gap-4 bg-white/50 dark:bg-[#151233]/50">
          <div class="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400"><i data-lucide="user-check" class="w-5 h-5"></i></div>
          <div><h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Log Presensi</h4><p class="text-2xl font-extrabold text-indigo-950 dark:text-white mt-0.5">${totalKehadiran}</p></div>
        </div>
        <div class="glass-premium p-5 rounded-xl shadow-sm flex items-center gap-4 bg-white/50 dark:bg-[#151233]/50">
          <div class="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400"><i data-lucide="shield-alert" class="w-5 h-5"></i></div>
          <div><h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pelanggaran</h4><p class="text-2xl font-extrabold text-indigo-950 dark:text-white mt-0.5">${totalPelanggaran}</p></div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade mt-6">
        <div class="lg:col-span-2 glass-premium rounded-xl p-5 bg-white/50 dark:bg-[#151233]/50">
          <h3 class="text-sm font-bold text-indigo-950 dark:text-white mb-4 flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4 text-purple-500"></i> Log Pembaruan Terkini</h3>
          <div class="space-y-3">
            ${
              allowedRecords.length === 0
                ? `<p class="text-xs text-slate-400 py-4">Belum ada rekam catatan resmi. Silakan tambah data manual atau via CSV.</p>`
                : allowedRecords
                    .slice(-3)
                    .reverse()
                    .map(
                      (r) =>
                        `<div class="p-3 bg-slate-100/60 dark:bg-purple-950/20 rounded-lg flex justify-between items-start text-xs border border-slate-200/40 dark:border-purple-500/10"><div><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300">${r.Kategori}</span><p class="font-bold text-indigo-950 dark:text-white mt-2">${r.Nama} <span class="text-slate-400 font-normal">(${r.Kelas})</span></p><p class="text-slate-500 dark:text-indigo-200/70 mt-0.5">${r.Detail}</p></div><span class="text-[10px] text-slate-400 font-mono">${r.Tanggal}</span></div>`,
                    )
                    .join("")
            }
          </div>
        </div>
      </div>
    `;
  } else {
    const targetKategori =
      currentPage === "akademik"
        ? "Akademik"
        : currentPage === "kehadiran"
          ? "Kehadiran"
          : "Pelanggaran";
    const filtered = allowedRecords.filter(
      (r) => r.Kategori === targetKategori,
    );
    let actionBtn =
      currentUser && currentUser.role === "admin"
        ? `<button class="btn-premium-grad w-auto text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm" onclick="openInputFormModal('${targetKategori}')"><i data-lucide="plus" class="w-4 h-4"></i> Tambah Laporan ${targetKategori}</button>`
        : "";
    box.innerHTML = `<div class="flex justify-between items-center animate-fade"><div><h3 class="text-md font-bold text-indigo-950 dark:text-white">Riwayat Log ${targetKategori}</h3></div>${actionBtn}</div><div class="glass-premium rounded-xl overflow-hidden shadow-sm mt-4 bg-white/50 dark:bg-[#151233]/50"><table class="w-full"><thead><tr class="bg-slate-50 dark:bg-slate-800/40"><th class="p-3 text-left text-xs font-bold text-slate-500 dark:text-indigo-300">Nama Siswa</th><th class="p-3 text-left text-xs font-bold text-slate-500 dark:text-indigo-300">Kelas</th><th class="p-3 text-left text-xs font-bold text-slate-500 dark:text-indigo-300">Detail Catatan</th><th class="p-3 text-left text-xs font-bold text-slate-500 dark:text-indigo-300">Tanggal</th></tr></thead><tbody>${filtered.length === 0 ? `<tr><td colspan="4" class="text-center text-slate-400 py-8 text-xs">Tidak ada rekaman log khusus kategori ini.</td></tr>` : filtered.map((r) => `<tr class="hover:bg-slate-100/50 dark:hover:bg-purple-950/10 transition-colors border-b border-slate-100 dark:border-slate-800/30"><td class="p-3 font-bold text-indigo-950 dark:text-white text-xs">${r.Nama}</td><td class="p-3 text-slate-500 text-xs">${r.Kelas}</td><td class="p-3 text-slate-600 dark:text-indigo-200/70 text-xs">${r.Detail}</td><td class="p-3 text-slate-400 font-mono text-xs">${r.Tanggal}</td></tr>`).join("")}</tbody></table></div>`;
  }
  lucide.createIcons();
}

// ==================== MODAL FUNCTIONS ====================
let currentFormKategori = "";
function openInputFormModal(kategori) {
  currentFormKategori = kategori;
  document.getElementById("formModalTitle").textContent =
    `Tambah Log ${kategori}`;
  document.getElementById("formTanggal").value = new Date()
    .toISOString()
    .split("T")[0];
  document.getElementById("inputFormModal").style.display = "flex";
}
function closeInputFormModal() {
  document.getElementById("inputFormModal").style.display = "none";
  document.getElementById("formNama").value = "";
  document.getElementById("formKelas").value = "";
  document.getElementById("formDetail").value = "";
}
function saveFormRecord() {
  const Nama = document.getElementById("formNama").value.trim();
  const Kelas = document.getElementById("formKelas").value.trim();
  const Detail = document.getElementById("formDetail").value.trim();
  const Tanggal = document.getElementById("formTanggal").value;
  if (!Nama || !Kelas || !Detail || !Tanggal) {
    showToast("Mohon lengkapi semua baris input!", "error");
    return;
  }
  systemRecords.push({
    Nama,
    Kelas,
    Kategori: currentFormKategori,
    Detail,
    Tanggal,
  });
  window.dataSdk?.setData?.(systemRecords);
  saveSystemData(); // <-- TAMBAHKAN INI
  showToast("Log berhasil disimpan!");
  closeInputFormModal();
  renderDashboardContent();
}

function showImportModal() {
  document.getElementById("importModal").style.display = "flex";
}
function closeImportModal() {
  document.getElementById("importModal").style.display = "none";
  document.getElementById("importData").value = "";
}
function importDataCSV() {
  const txt = document.getElementById("importData").value.trim();
  if (!txt) {
    showToast("Gagal! Data kosong.", "error");
    return;
  }
  const lines = txt.split("\n");
  lines.forEach((line) => {
    const cols = line.split(",");
    if (cols.length >= 4) {
      systemRecords.push({
        Nama: cols[0].trim(),
        Kelas: cols[1].trim(),
        Kategori: cols[2].trim(),
        Detail: cols[3].trim(),
        Tanggal: cols[4]
          ? cols[4].trim()
          : new Date().toISOString().split("T")[0],
      });
    }
  });
  window.dataSdk?.setData?.(systemRecords);
  saveSystemData(); // <-- TAMBAHKAN INI
  showToast("Berhasil memuat data baru.");
  closeImportModal();
  renderDashboardContent();
}

function toggleDarkMode() {
  isDark = !isDark;
  document.documentElement.classList.toggle("dark", isDark);
  const lIcon = document.getElementById("landingDarkIcon");
  const dIcon = document.getElementById("darkIcon");
  if (lIcon) lIcon.setAttribute("data-lucide", isDark ? "sun" : "moon");
  if (dIcon) dIcon.setAttribute("data-lucide", isDark ? "sun" : "moon");
  lucide.createIcons();
}

function showToast(msg, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const el = document.createElement("div");
  el.className = `p-3 px-5 rounded-xl text-white font-semibold text-xs shadow-xl animate-fade ${type === "error" ? "bg-rose-500" : type === "info" ? "bg-purple-600" : "bg-purple-500"}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function createLoginParticles(x, y) {
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.className = "login-particle";
    particle.style.left = x + "px";
    particle.style.top = y + "px";
    particle.style.animationDuration = Math.random() * 2 + 1 + "s";
    particle.style.width = Math.random() * 6 + 2 + "px";
    particle.style.height = particle.style.width;
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 3000);
  }
}

document.addEventListener("click", function (e) {
  if (document.getElementById("loginPageView")?.style.display === "flex") {
    createLoginParticles(e.clientX, e.clientY);
  }
});

function init() {
  getRegisteredUsers();

  // Load data dari localStorage
  loadSystemData();

  if (document.getElementById("landingPageView"))
    document.getElementById("landingPageView").style.display = "flex";
  if (document.getElementById("loginPageView"))
    document.getElementById("loginPageView").style.display = "none";
  if (document.getElementById("mainApp"))
    document.getElementById("mainApp").style.display = "none";

  currentPage = "landing";

  // Tampilkan home section
  setTimeout(() => {
    showLandingPage("home");
    if (typeof lucide !== "undefined") lucide.createIcons();
  }, 100);
}

// ==================== LANDING PAGE NAVIGATION - SMOOTH SCROLL ====================

// Fungsi untuk update active nav berdasarkan scroll position
function updateActiveNav() {
  const sections = ["home", "features", "about", "contact"];
  const scrollPosition = window.scrollY + 120;

  let currentSection = "home";
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      const offsetTop = el.offsetTop;
      const offsetHeight = el.offsetHeight;
      if (
        scrollPosition >= offsetTop &&
        scrollPosition < offsetTop + offsetHeight
      ) {
        currentSection = id;
      }
    }
  });

  // Update nav aktif
  document.querySelectorAll("#landingPageView nav a").forEach((link) => {
    link.classList.remove(
      "text-purple-600",
      "dark:text-purple-400",
      "font-bold",
      "border-b-2",
      "border-purple-600",
      "dark:border-purple-400",
    );
    link.classList.add("hover:text-purple-600", "dark:hover:text-purple-400");
    link.classList.remove("border-transparent");
  });

  const activeLink = document.getElementById(
    `nav${currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}`,
  );
  if (activeLink) {
    activeLink.classList.add(
      "text-purple-600",
      "dark:text-purple-400",
      "font-bold",
      "border-b-2",
      "border-purple-600",
      "dark:border-purple-400",
    );
    activeLink.classList.remove(
      "hover:text-purple-600",
      "dark:hover:text-purple-400",
    );
  }
}

// Smooth scroll ke section
function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    const offsetTop = target.offsetTop - 80; // offset untuk header
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
}

// Event listener untuk scroll (update active nav)
document.addEventListener("scroll", function () {
  updateActiveNav();
});

// Override click handler untuk nav links
document.addEventListener("DOMContentLoaded", function () {
  // Menangani klik di nav links
  document.querySelectorAll("#landingPageView nav a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        const sectionId = href.substring(1);
        scrollToSection(sectionId);
      }
    });
  });
});

// Update init function
function init() {
  getRegisteredUsers();
  loadSystemData();

  if (document.getElementById("landingPageView"))
    document.getElementById("landingPageView").style.display = "flex";
  if (document.getElementById("loginPageView"))
    document.getElementById("loginPageView").style.display = "none";
  if (document.getElementById("mainApp"))
    document.getElementById("mainApp").style.display = "none";

  currentPage = "landing";

  // Set initial active nav
  setTimeout(() => {
    updateActiveNav();
    if (typeof lucide !== "undefined") lucide.createIcons();
  }, 200);
}

document.addEventListener("DOMContentLoaded", init);

// ==================== DASHBOARD ORANG TUA ====================
function renderParentDashboard(allowedRecords, currentUser) {
  // Ambil nama anak dari akun orang tua
  const childName = currentUser.children || "";

  // Filter data hanya untuk anak yang dipilih
  const childRecords = allowedRecords.filter((r) => r.Nama === childName);

  // Jika tidak ada data anak, tampilkan pesan
  if (!childName) {
    return `
      <div class="parent-dashboard">
        <div class="welcome-banner-parent">
          <h2>Selamat datang, ${currentUser.name.split(" ")[0]} </h2>
          <p>Anda belum memilih anak. Silakan hubungi admin untuk mengatur data anak Anda.</p>
        </div>
      </div>
    `;
  }

  // Hitung statistik untuk anak tersebut
  const totalAkademik = childRecords.filter(
    (r) => r.Kategori === "Akademik",
  ).length;
  const totalKehadiran = childRecords.filter(
    (r) => r.Kategori === "Kehadiran",
  ).length;
  const totalPelanggaran = childRecords.filter(
    (r) => r.Kategori === "Pelanggaran",
  ).length;

  // Hitung rata-rata nilai akademik
  let totalNilai = 0;
  let nilaiCount = 0;
  childRecords.forEach((r) => {
    if (r.Kategori === "Akademik") {
      const angka = r.Detail.match(/\d+/);
      if (angka) {
        totalNilai += parseInt(angka[0]);
        nilaiCount++;
      }
    }
  });
  const rataNilai = nilaiCount > 0 ? (totalNilai / nilaiCount).toFixed(1) : "0";

  // Hitung persentase kehadiran
  const totalData = totalAkademik + totalKehadiran + totalPelanggaran;
  const persenKehadiran =
    totalData > 0 ? Math.round((totalKehadiran / totalData) * 100) : "0";

  // Data untuk ringkasan anak
  const totalNilaiTercatat = nilaiCount;
  const catatanKehadiran = totalKehadiran;
  const pelanggaran = totalPelanggaran;

  // Aktivitas terbaru (5 data terakhir)
  const recentActivities = [...childRecords].reverse().slice(0, 5);

  return `
    <div class="parent-dashboard">
      <!-- Welcome Banner -->
      <div class="welcome-banner-parent">
        <div>
          <h2>Selamat datang, ${currentUser.name.split(" ")[0]} 🎉</h2>
          <p>Pantau perkembangan akademik dan kedisiplinan ${childName} dengan mudah</p>
        </div>
        <div class="child-badge">
          <i data-lucide="user" class="w-5 h-5"></i>
          <span>${childName}</span>
        </div>
      </div>

      <!-- Stats Grid - 5 cards -->
      <div class="stats-grid-parent">
        <div class="stat-card-parent">
          <div class="stat-icon-parent"><i data-lucide="users" class="w-6 h-6"></i></div>
          <div class="stat-info-parent">
            <div class="stat-value-parent">${totalAkademik + totalKehadiran + totalPelanggaran}</div>
            <div class="stat-label-parent">Total Catatan</div>
          </div>
        </div>
        <div class="stat-card-parent">
          <div class="stat-icon-parent"><i data-lucide="bar-chart-2" class="w-6 h-6"></i></div>
          <div class="stat-info-parent">
            <div class="stat-value-parent">${rataNilai}</div>
            <div class="stat-label-parent">Rata-rata Nilai</div>
          </div>
        </div>
        <div class="stat-card-parent">
          <div class="stat-icon-parent"><i data-lucide="check-circle" class="w-6 h-6"></i></div>
          <div class="stat-info-parent">
            <div class="stat-value-parent">${persenKehadiran}%</div>
            <div class="stat-label-parent">Kehadiran</div>
          </div>
        </div>
        <div class="stat-card-parent">
          <div class="stat-icon-parent"><i data-lucide="alert-triangle" class="w-6 h-6"></i></div>
          <div class="stat-info-parent">
            <div class="stat-value-parent">${totalPelanggaran}</div>
            <div class="stat-label-parent">Pelanggaran</div>
          </div>
        </div>
        <div class="stat-card-parent">
          <div class="stat-icon-parent"><i data-lucide="bell" class="w-6 h-6"></i></div>
          <div class="stat-info-parent">
            <div class="stat-value-parent">${totalPelanggaran > 0 ? totalPelanggaran : 1}</div>
            <div class="stat-label-parent">Notifikasi</div>
          </div>
        </div>
      </div>

      <!-- Ringkasan Anak -->
      <div class="ringkasan-anak">
        <h3><i data-lucide="user-check" class="w-5 h-5"></i> Ringkasan ${childName}</h3>
        <div class="ringkasan-grid">
          <div class="ringkasan-item">
            <div class="ringkasan-value">${totalNilaiTercatat}</div>
            <div class="ringkasan-label">Total Nilai Tercatat</div>
          </div>
          <div class="ringkasan-item">
            <div class="ringkasan-value">${catatanKehadiran}</div>
            <div class="ringkasan-label">Catatan Kehadiran</div>
          </div>
          <div class="ringkasan-item">
            <div class="ringkasan-value">${pelanggaran}</div>
            <div class="ringkasan-label">Pelanggaran</div>
          </div>
        </div>
      </div>

      <!-- Aktivitas Terbaru -->
      <div class="recent-activities-parent">
        <h3><i data-lucide="clock" class="w-5 h-5"></i> Aktivitas Terbaru</h3>
        <div class="activity-list-parent">
          ${
            recentActivities.length === 0
              ? `
            <div class="no-data-parent">
              <i data-lucide="inbox" class="w-8 h-8"></i>
              <p>Belum ada aktivitas untuk ${childName}</p>
            </div>
          `
              : recentActivities
                  .map(
                    (activity) => `
            <div class="activity-item-parent">
              <div class="activity-icon ${activity.Kategori.toLowerCase()}">
                <i data-lucide="${activity.Kategori === "Akademik" ? "book-open" : activity.Kategori === "Kehadiran" ? "user-check" : "alert-triangle"}" class="w-4 h-4"></i>
              </div>
              <div class="activity-content">
                <div class="activity-title">${activity.Nama}</div>
                <div class="activity-detail">${activity.Detail}</div>
                <div class="activity-meta">
                  <span class="activity-badge ${activity.Kategori.toLowerCase()}">${activity.Kategori}</span>
                  <span class="activity-date">${activity.Tanggal}</span>
                </div>
              </div>
            </div>
          `,
                  )
                  .join("")
          }
        </div>
      </div>
    </div>
  `;
}

// ==================== HALAMAN DATA UNTUK ORANG TUA ====================
function renderParentDataPage(currentPage, allowedRecords, currentUser) {
  const childName = currentUser.children || "";
  const childRecords = allowedRecords.filter((r) => r.Nama === childName);

  const pageTitles = {
    dashboard: "Dashboard",
    anak: "Data Anak",
    notifikasi: "Notifikasi",
  };

  // Halaman Notifikasi
  if (currentPage === "notifikasi") {
    const notifications = [...childRecords].reverse().slice(0, 10);
    return `
      <div class="parent-data-page">
        <div class="page-header-parent">
          <h3><i data-lucide="bell" class="w-5 h-5"></i> Notifikasi ${childName}</h3>
        </div>
        <div class="data-table-container-parent">
          ${
            notifications.length === 0
              ? `
            <div class="no-data-parent">
              <i data-lucide="inbox" class="w-8 h-8"></i>
              <p>Belum ada notifikasi untuk ${childName}</p>
            </div>
          `
              : notifications
                  .map(
                    (notif, index) => `
            <div class="notif-item-parent">
              <div class="notif-icon ${notif.Kategori.toLowerCase()}">
                <i data-lucide="${notif.Kategori === "Akademik" ? "book-open" : notif.Kategori === "Kehadiran" ? "user-check" : "alert-triangle"}" class="w-4 h-4"></i>
              </div>
              <div class="notif-content">
                <div class="notif-title">${notif.Kategori}</div>
                <div class="notif-detail">${notif.Detail}</div>
                <div class="notif-date">${notif.Tanggal}</div>
              </div>
            </div>
          `,
                  )
                  .join("")
          }
        </div>
      </div>
    `;
  }

  // Halaman Data Anak (semua data anak)
  return `
    <div class="parent-data-page">
      <div class="page-header-parent">
        <h3><i data-lucide="user" class="w-5 h-5"></i> Data ${childName}</h3>
        <span class="data-count">${childRecords.length} catatan</span>
      </div>
      <div class="data-table-container-parent">
        <table class="data-table-parent">
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Detail</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            ${
              childRecords.length === 0
                ? `
              <tr>
                <td colspan="3" class="no-data-parent">
                  <i data-lucide="inbox" class="w-6 h-6"></i>
                  <p>Belum ada data untuk ${childName}</p>
                </td>
              </tr>
            `
                : childRecords
                    .map(
                      (record) => `
              <tr>
                <td><span class="badge-parent ${record.Kategori.toLowerCase()}">${record.Kategori}</span></td>
                <td>${record.Detail}</td>
                <td>${record.Tanggal}</td>
              </tr>
            `,
                    )
                    .join("")
            }
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ==================== FUNGSI NOTIFIKASI ====================
function renderNotifikasiPage(allowedRecords) {
  let notifications = allowedRecords.slice(-5).reverse();

  return `
    <div class="notifikasi-page">
      <h3>🔔 Notifikasi Terkini</h3>
      <div class="notification-list">
        ${notifications.length === 0 ? `<div style="text-align:center;padding:48px;color:#94a3b8;">📭 Belum ada notifikasi</div>` : notifications.map((notif) => `<div class="notification-item"><div class="notification-icon">📢</div><div class="notification-content"><div class="notification-title">${notif.Nama} - ${notif.Kategori}</div><div class="notification-message">${notif.Detail}</div><div class="notification-date">📅 ${notif.Tanggal}</div></div></div>`).join("")}
      </div>
    </div>
  `;
}

// ==================== HALAMAN ANALITIK ====================
let chartTrenNilai = null;
let chartDistribusi = null;
let chartRataSiswa = null;

function renderAnalitikPage(allowedRecords) {
  const nilaiRecords = allowedRecords.filter((r) => r.Kategori === "Akademik");
  const totalSiswa = [...new Set(allowedRecords.map((r) => r.Nama))].length;
  const totalNilai = nilaiRecords.length;

  let totalNilaiAngka = 0;
  nilaiRecords.forEach((r) => {
    const match = r.Detail.match(/:?\s*(\d+)/);
    if (match) totalNilaiAngka += parseInt(match[1]);
  });
  const rataRataKeseluruhan =
    totalNilai > 0 ? (totalNilaiAngka / totalNilai).toFixed(1) : 0;

  let baik = 0,
    cukup = 0,
    kurang = 0;
  nilaiRecords.forEach((r) => {
    const match = r.Detail.match(/:?\s*(\d+)/);
    if (match) {
      const n = parseInt(match[1]);
      if (n >= 85) baik++;
      else if (n >= 70) cukup++;
      else kurang++;
    }
  });

  const siswaMap = new Map();
  nilaiRecords.forEach((r) => {
    const match = r.Detail.match(/:?\s*(\d+)/);
    if (match) {
      const n = parseInt(match[1]);
      if (!siswaMap.has(r.Nama)) {
        siswaMap.set(r.Nama, []);
      }
      siswaMap.get(r.Nama).push(n);
    }
  });

  const sortedSiswa = Array.from(siswaMap.entries())
    .map(([nama, nilaiArr]) => ({
      nama,
      rataRata: nilaiArr.reduce((a, b) => a + b, 0) / nilaiArr.length,
      nilaiArr,
    }))
    .sort((a, b) => b.rataRata - a.rataRata)
    .slice(0, 10);

  return `
    <div class="analitik-page">
      <div class="analitik-header">
        <h3>Analitik & Statistik</h3>
        <div class="analitik-stats-overview">
          <div class="stat-mini">
            <span class="stat-mini-value">${totalSiswa}</span>
            <span class="stat-mini-label">Total Siswa</span>
          </div>
          <div class="stat-mini">
            <span class="stat-mini-value">${totalNilai}</span>
            <span class="stat-mini-label">Total Nilai</span>
          </div>
          <div class="stat-mini">
            <span class="stat-mini-value">${rataRataKeseluruhan}</span>
            <span class="stat-mini-label">Rata-rata</span>
          </div>
        </div>
      </div>

      <div class="analitik-grid">
        <div class="analitik-chart-card">
          <h4>Tren Nilai Siswa (Top 10)</h4>
          <div class="chart-wrapper">
            <canvas id="chartTrenNilai"></canvas>
          </div>
        </div>

        <div class="analitik-chart-card">
          <h4>Distribusi Nilai</h4>
          <div class="chart-wrapper">
            <canvas id="chartDistribusi"></canvas>
          </div>
          <div class="distribusi-legend">
            <span class="legend-item baik">Baik (≥85): ${baik}</span>
            <span class="legend-item cukup">Cukup (70-84): ${cukup}</span>
            <span class="legend-item kurang">Kurang (<70): ${kurang}</span>
          </div>
        </div>

        <div class="analitik-chart-card">
          <h4>Rata-rata Nilai per Siswa</h4>
          <div class="chart-wrapper">
            <canvas id="chartRataSiswa"></canvas>
          </div>
        </div>

        <div class="analitik-chart-card">
          <h4>Detail Nilai Siswa</h4>
          <div class="siswa-detail-list">
            ${sortedSiswa
              .map(
                (s) => `
              <div class="siswa-detail-item">
                <div class="siswa-detail-name">${s.nama}</div>
                <div class="siswa-detail-bars">
                  ${s.nilaiArr
                    .slice(0, 8)
                    .map((n) => {
                      let kelas = "";
                      if (n >= 85) kelas = "bar-baik";
                      else if (n >= 70) kelas = "bar-cukup";
                      else kelas = "bar-kurang";
                      return `<div class="nilai-bar ${kelas}" style="height: ${Math.max(n * 0.6, 4)}px;"></div>`;
                    })
                    .join("")}
                  ${s.nilaiArr.length > 8 ? `<span class="nilai-more">+${s.nilaiArr.length - 8}</span>` : ""}
                </div>
                <div class="siswa-detail-rata">${Math.round(s.rataRata)}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==================== FUNGSI INIT CHART ====================
function initCharts() {
  const nilaiRecords = systemRecords.filter((r) => r.Kategori === "Akademik");

  // Data per siswa
  const siswaMap = new Map();
  nilaiRecords.forEach((r) => {
    const match = r.Detail.match(/:?\s*(\d+)/);
    if (match) {
      const n = parseInt(match[1]);
      if (!siswaMap.has(r.Nama)) {
        siswaMap.set(r.Nama, []);
      }
      siswaMap.get(r.Nama).push(n);
    }
  });

  const sortedSiswa = Array.from(siswaMap.entries())
    .map(([nama, nilaiArr]) => ({
      nama,
      rataRata: nilaiArr.reduce((a, b) => a + b, 0) / nilaiArr.length,
      nilaiArr,
    }))
    .sort((a, b) => b.rataRata - a.rataRata)
    .slice(0, 10);

  // 1. Chart Tren Nilai
  const ctx1 = document.getElementById("chartTrenNilai");
  if (ctx1 && typeof Chart !== "undefined") {
    if (chartTrenNilai) chartTrenNilai.destroy();
    chartTrenNilai = new Chart(ctx1, {
      type: "bar",
      data: {
        labels: sortedSiswa.map((s) =>
          s.nama.length > 10 ? s.nama.substring(0, 10) + "..." : s.nama,
        ),
        datasets: [
          {
            label: "Rata-rata Nilai",
            data: sortedSiswa.map((s) => Math.round(s.rataRata)),
            backgroundColor: sortedSiswa.map((s) => {
              const r = s.rataRata;
              if (r >= 85) return "#16a34a";
              else if (r >= 70) return "#eab308";
              else return "#dc2626";
            }),
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `Nilai: ${context.raw}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { stepSize: 20 },
          },
        },
      },
    });
  }

  // 2. Chart Distribusi
  let baik = 0,
    cukup = 0,
    kurang = 0;
  nilaiRecords.forEach((r) => {
    const match = r.Detail.match(/:?\s*(\d+)/);
    if (match) {
      const n = parseInt(match[1]);
      if (n >= 85) baik++;
      else if (n >= 70) cukup++;
      else kurang++;
    }
  });

  const ctx2 = document.getElementById("chartDistribusi");
  if (ctx2 && typeof Chart !== "undefined") {
    if (chartDistribusi) chartDistribusi.destroy();
    chartDistribusi = new Chart(ctx2, {
      type: "doughnut",
      data: {
        labels: [
          `Baik (≥85): ${baik}`,
          `Cukup (70-84): ${cukup}`,
          `Kurang (<70): ${kurang}`,
        ],
        datasets: [
          {
            data: [baik, cukup, kurang],
            backgroundColor: ["#16a34a", "#eab308", "#dc2626"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 10,
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
        },
        cutout: "65%",
      },
    });
  }

  // 3. Chart Rata-rata per Siswa (Line Chart)
  const ctx3 = document.getElementById("chartRataSiswa");
  if (ctx3 && typeof Chart !== "undefined") {
    if (chartRataSiswa) chartRataSiswa.destroy();
    chartRataSiswa = new Chart(ctx3, {
      type: "line",
      data: {
        labels: sortedSiswa.map((s) =>
          s.nama.length > 10 ? s.nama.substring(0, 10) + "..." : s.nama,
        ),
        datasets: [
          {
            label: "Rata-rata Nilai",
            data: sortedSiswa.map((s) => Math.round(s.rataRata)),
            borderColor: "#4f46e5",
            backgroundColor: "rgba(79, 70, 229, 0.1)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: sortedSiswa.map((s) => {
              const r = s.rataRata;
              if (r >= 85) return "#16a34a";
              else if (r >= 70) return "#eab308";
              else return "#dc2626";
            }),
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `Rata-rata: ${context.raw}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { stepSize: 20 },
          },
        },
      },
    });
  }
}

// ==================== OVERRIDE UNTUK ADMIN ====================

// Simpan fungsi renderDashboardContent yang asli
const originalRender = renderDashboardContent;

// Buat fungsi baru yang akan mengecek role
window.renderDashboardContent = function () {
  const box = document.getElementById("mainContent");
  if (!box) return;

  if (currentUser && currentUser.role === "admin") {
    // ADMIN: gunakan tampilan enhanced
    if (currentPage === "dashboard") {
      box.innerHTML = renderAdminDashboardEnhanced(systemRecords, currentUser);
    } else if (currentPage === "analitik") {
      box.innerHTML = renderAnalitikPage(systemRecords);
      setTimeout(() => initCharts(), 100);
    } else if (currentPage === "notifikasi") {
      box.innerHTML = renderNotifikasiPage(systemRecords);
    } else if (
      currentPage === "siswa" ||
      currentPage === "akademik" ||
      currentPage === "kehadiran" ||
      currentPage === "pelanggaran"
    ) {
      box.innerHTML = renderDataPage(currentPage, systemRecords, currentUser);
    } else {
      originalRender();
    }
    if (typeof lucide !== "undefined") lucide.createIcons();
  } else if (currentUser && currentUser.role === "parent") {
    // PARENT: gunakan tampilan dashboard orang tua
    if (currentPage === "dashboard") {
      box.innerHTML = renderParentDashboard(systemRecords, currentUser);
    } else {
      // Untuk halaman lain, parent hanya bisa melihat data anaknya
      box.innerHTML = renderParentDataPage(
        currentPage,
        systemRecords,
        currentUser,
      );
    }
    if (typeof lucide !== "undefined") lucide.createIcons();
  } else {
    // Fallback
    originalRender();
  }
};

// Override buildSidebarMenu untuk admin
const originalBuildSidebar = buildSidebarMenu;
window.buildSidebarMenu = function () {
  const nav = document.getElementById("sidebarNav");
  if (!nav) return;
  nav.innerHTML = "";

  if (currentUser && currentUser.role === "admin") {
    // Menu Admin (7 menu)
    const routes = [
      { id: "dashboard", text: "Ringkasan Info", icon: "layout-grid" },
      { id: "siswa", text: "Data Siswa", icon: "users" },
      { id: "akademik", text: "Nilai Academic", icon: "book-open" },
      { id: "kehadiran", text: "Presensi Siswa", icon: "user-check" },
      { id: "pelanggaran", text: "Log Pelanggaran", icon: "shield-alert" },
      { id: "analitik", text: "Analitik", icon: "bar-chart-2" },
      { id: "notifikasi", text: "Notifikasi", icon: "bell" },
    ];
    routes.forEach((route) => {
      const btn = document.createElement("div");
      btn.className = `sidebar-item ${currentPage === route.id ? "active" : ""}`;
      btn.id = `menu-item-${route.id}`;
      btn.onclick = () => switchPage(route.id);
      btn.innerHTML = `<i data-lucide="${route.icon}" class="w-4 h-4"></i> <span>${route.text}</span>`;
      nav.appendChild(btn);
    });
  } else if (currentUser && currentUser.role === "parent") {
    // Menu Orang Tua (3 menu)
    const routes = [
      { id: "dashboard", text: "Dashboard", icon: "layout-grid" },
      { id: "anak", text: "Data Anak", icon: "user" },
      { id: "notifikasi", text: "Notifikasi", icon: "bell" },
    ];
    routes.forEach((route) => {
      const btn = document.createElement("div");
      btn.className = `sidebar-item ${currentPage === route.id ? "active" : ""}`;
      btn.id = `menu-item-${route.id}`;
      btn.onclick = () => switchPage(route.id);
      btn.innerHTML = `<i data-lucide="${route.icon}" class="w-4 h-4"></i> <span>${route.text}</span>`;
      nav.appendChild(btn);
    });
  } else {
    // Default (4 menu)
    const routes = [
      { id: "dashboard", text: "Ringkasan Info", icon: "layout-grid" },
      { id: "akademik", text: "Nilai Academic", icon: "book-open" },
      { id: "kehadiran", text: "Presensi Siswa", icon: "user-check" },
      { id: "pelanggaran", text: "Log Pelanggaran", icon: "shield-alert" },
    ];
    routes.forEach((route) => {
      const btn = document.createElement("div");
      btn.className = `sidebar-item ${currentPage === route.id ? "active" : ""}`;
      btn.id = `menu-item-${route.id}`;
      btn.onclick = () => switchPage(route.id);
      btn.innerHTML = `<i data-lucide="${route.icon}" class="w-4 h-4"></i> <span>${route.text}</span>`;
      nav.appendChild(btn);
    });
  }
  lucide.createIcons();
};

// Override switchPage untuk admin
const originalSwitchPage = switchPage;
window.switchPage = function (pageId) {
  currentPage = pageId;
  document
    .querySelectorAll("#sidebarNav .sidebar-item")
    .forEach((item) => item.classList.remove("active"));
  const currentActive = document.getElementById(`menu-item-${pageId}`);
  if (currentActive) currentActive.classList.add("active");
  const titles = {
    dashboard: currentUser?.role === "parent" ? "Dashboard" : "Dashboard Utama",
    siswa: "Data Siswa",
    anak: "Data Anak",
    akademik: "Nilai Akademik",
    kehadiran: "Presensi Siswa",
    pelanggaran: "Log Pelanggaran",
    analitik: "Analitik",
    notifikasi: "Notifikasi",
  };
  document.getElementById("pageCurrentTitle").textContent =
    titles[pageId] || "Dashboard";
  renderDashboardContent();
};

// ==================== CSS TAMBAHAN UNTUK DASHBOARD ADMIN ====================
if (!document.getElementById("admin-dashboard-styles")) {
  const styleAdmin = document.createElement("style");
  styleAdmin.id = "admin-dashboard-styles";
  styleAdmin.textContent = `
    .dashboard-admin-enhanced { padding: 24px; }
    .welcome-banner-enhanced { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; padding: 24px 32px; margin-bottom: 32px; color: white; }
    .welcome-banner-enhanced h2 { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
    .welcome-banner-enhanced p { font-size: 13px; opacity: 0.9; }
    .stats-grid-enhanced { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; margin-bottom: 32px; }
    @media (max-width: 1000px) { .stats-grid-enhanced { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); } }
    .stat-card-enhanced { background: white; border-radius: 16px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s ease; border: 1px solid #eef2f6; }
    .stat-card-enhanced:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
    .stat-value-enhanced { font-size: 34px; font-weight: 800; color: #1e293b; }
    .stat-label-enhanced { font-size: 12px; color: #64748b; margin-top: 6px; }
    .stat-icon-enhanced { font-size: 40px; display: block; margin-bottom: 8px; }
    .recent-activities-enhanced { background: white; border-radius: 16px; padding: 24px; border: 1px solid #eef2f6; }
    .recent-activities-enhanced h3 { font-size: 16px; font-weight: 700; margin-bottom: 20px; }
    .activity-table-enhanced { width: 100%; border-collapse: collapse; }
    .activity-table-enhanced th { text-align: left; padding: 12px 8px; font-size: 11px; font-weight: 600; color: #64748b; border-bottom: 1px solid #eef2f6; }
    .activity-table-enhanced td { padding: 12px 8px; font-size: 13px; color: #334155; border-bottom: 1px solid #f1f5f9; }
    .category-badge-enhanced { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 10px; font-weight: 600; }
    .category-badge-enhanced.Info, .category-badge-enhanced.Akademik { background: #dbeafe; color: #1e40af; }
    .category-badge-enhanced.telat, .category-badge-enhanced.Pelanggaran { background: #fee2e2; color: #991b1b; }
    .category-badge-enhanced.Kehadiran { background: #dcfce7; color: #166534; }
    .analitik-page h3 { font-size: 18px; font-weight: 700; margin-bottom: 24px; }
    .stats-grid-analitik { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .analitik-card { background: white; border-radius: 16px; padding: 24px; text-align: center; border: 1px solid #eef2f6; }
    .analitik-value { font-size: 36px; font-weight: 800; color: #667eea; }
    .analitik-label { font-size: 13px; color: #64748b; margin-top: 6px; }
    .notifikasi-page h3 { font-size: 18px; font-weight: 700; margin-bottom: 24px; }
    .notification-list { display: flex; flex-direction: column; gap: 12px; }
    .notification-item { background: white; border-radius: 12px; padding: 16px; display: flex; gap: 16px; border: 1px solid #eef2f6; }
    .notification-icon { font-size: 24px; }
    .notification-title { font-weight: 700; margin-bottom: 4px; }
    .notification-message { font-size: 13px; color: #64748b; margin-bottom: 6px; }
    .notification-date { font-size: 11px; color: #94a3b8; }
    .data-page { padding: 0; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .page-header h3 { font-size: 18px; font-weight: 700; }
    .btn-add { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer; }
    .data-table-container { background: white; border-radius: 16px; overflow-x: auto; border: 1px solid #eef2f6; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { padding: 14px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b; border-bottom: 1px solid #eef2f6; }
    .data-table td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
    .no-data { text-align: center; padding: 48px; color: #94a3b8; }
  `;
  document.head.appendChild(styleAdmin);
}

// ==================== FUNGSI DATA SISWA ====================
let pendingStudents = [];

// Buka modal tambah siswa
function openAddStudentModal() {
  document.getElementById("addStudentModal").style.display = "flex";
  switchStudentTab("manual");
  pendingStudents = [];
  document.getElementById("manualStudentList").innerHTML = "";
  lucide.createIcons();
}

function closeAddStudentModal() {
  document.getElementById("addStudentModal").style.display = "none";
  document.getElementById("studentName").value = "";
  document.getElementById("studentClass").value = "";
  document.getElementById("csvFileInput").value = "";
  document.getElementById("excelFileInput").value = "";
  document.getElementById("pasteStudentData").value = "";
  document.getElementById("csvPreview").innerHTML = "";
  document.getElementById("excelPreview").innerHTML = "";
  pendingStudents = [];
}

// Switch tab
function switchStudentTab(tab) {
  const tabs = ["manual", "import"];
  tabs.forEach((t) => {
    const el = document.getElementById(
      `studentTab${t.charAt(0).toUpperCase() + t.slice(1)}`,
    );
    if (el) el.style.display = t === tab ? "block" : "none";
    const btn = document.getElementById(
      `tab${t.charAt(0).toUpperCase() + t.slice(1)}`,
    );
    if (btn) {
      if (t === tab) {
        btn.className =
          "px-4 py-2 text-sm font-semibold border-b-2 border-purple-500 text-purple-600 dark:text-purple-400 transition-all whitespace-nowrap";
      } else {
        btn.className =
          "px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 transition-all whitespace-nowrap";
      }
    }
  });
}

// ==================== DRAG & DROP FUNCTIONS ====================

function handleDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add(
    "border-purple-500",
    "bg-purple-50",
    "dark:bg-purple-950/20",
  );
  event.currentTarget.classList.remove(
    "border-slate-300",
    "dark:border-slate-600",
  );
}

function handleDragLeave(event) {
  event.preventDefault();
  event.currentTarget.classList.remove(
    "border-purple-500",
    "bg-purple-50",
    "dark:bg-purple-950/20",
  );
  event.currentTarget.classList.add(
    "border-slate-300",
    "dark:border-slate-600",
  );
}

function handleCsvDrop(event) {
  event.preventDefault();
  const dropZone = document.getElementById("csvDropZone");
  dropZone.classList.remove(
    "border-purple-500",
    "bg-purple-50",
    "dark:bg-purple-950/20",
  );
  dropZone.classList.add("border-slate-300", "dark:border-slate-600");

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.name.endsWith(".csv")) {
      document.getElementById("csvFileInput").files = files;
      handleCsvFile({ target: { files: files } });
      showToast(`File ${file.name} berhasil di-drop!`, "success");
    } else {
      showToast("Mohon upload file CSV!", "error");
    }
  }
}

function handleExcelDrop(event) {
  event.preventDefault();
  const dropZone = document.getElementById("excelDropZone");
  dropZone.classList.remove(
    "border-purple-500",
    "bg-purple-50",
    "dark:bg-purple-950/20",
  );
  dropZone.classList.add("border-slate-300", "dark:border-slate-600");

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    const validExt = [".xlsx", ".xls"];
    const isValid = validExt.some((ext) => file.name.endsWith(ext));
    if (isValid) {
      document.getElementById("excelFileInput").files = files;
      handleExcelFile({ target: { files: files } });
      showToast(`File ${file.name} berhasil di-drop!`, "success");
    } else {
      showToast("Mohon upload file Excel (.xlsx atau .xls)!", "error");
    }
  }
}

// ==================== 1. INPUT MANUAL ====================
function addStudentManually() {
  const name = document.getElementById("studentName").value.trim();
  const kelas = document.getElementById("studentClass").value.trim();

  if (!name || !kelas) {
    showToast("Mohon isi Nama dan Kelas!", "error");
    return;
  }

  pendingStudents.push({ Nama: name, Kelas: kelas });
  document.getElementById("studentName").value = "";
  document.getElementById("studentClass").value = "";
  renderManualStudentList();
  showToast(`Siswa ${name} ditambahkan ke daftar`, "success");
}

function renderManualStudentList() {
  const container = document.getElementById("manualStudentList");
  if (pendingStudents.length === 0) {
    container.innerHTML =
      '<p class="text-center text-slate-400 text-sm py-4">Belum ada siswa ditambahkan</p>';
    return;
  }
  container.innerHTML = pendingStudents
    .map(
      (s, i) => `
    <div class="flex justify-between items-center bg-slate-50 dark:bg-slate-800/30 px-3 py-2 rounded-lg mb-1">
      <span class="text-sm">${s.Nama} - ${s.Kelas}</span>
      <button onclick="removePendingStudent(${i})" class="text-rose-500 hover:text-rose-700 text-sm">✕</button>
    </div>
  `,
    )
    .join("");
}

function removePendingStudent(index) {
  pendingStudents.splice(index, 1);
  renderManualStudentList();
}

// Simpan semua siswa manual ke database
function saveManualStudents() {
  if (pendingStudents.length === 0) {
    showToast("Tidak ada siswa untuk disimpan!", "error");
    return;
  }

  pendingStudents.forEach((s) => {
    systemRecords.push({
      Nama: s.Nama,
      Kelas: s.Kelas,
      Kategori: "Akademik",
      Detail: "Siswa baru terdaftar",
      Tanggal: new Date().toISOString().split("T")[0],
    });
  });

  window.dataSdk?.setData?.(systemRecords);
  saveSystemData(); // <-- TAMBAHKAN INI
  showToast(`Berhasil menambahkan ${pendingStudents.length} siswa!`, "success");
  pendingStudents = [];
  renderManualStudentList();
  closeAddStudentModal();
  renderDashboardContent();
}

// ==================== 2. IMPORT CSV ====================
let csvStudents = [];

function handleCsvFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const lines = text.split("\n").filter((line) => line.trim());
    csvStudents = [];

    lines.forEach((line, index) => {
      const cols = line.split(",").map((c) => c.trim());
      if (cols.length >= 2 && cols[0] && cols[1]) {
        csvStudents.push({ Nama: cols[0], Kelas: cols[1] });
      }
    });

    const preview = document.getElementById("csvPreview");
    if (csvStudents.length === 0) {
      preview.innerHTML =
        '<p class="text-center text-rose-500 text-sm py-4">⚠️ Tidak ada data valid ditemukan</p>';
    } else {
      preview.innerHTML = `
        <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <p class="text-sm font-semibold text-green-600">✅ ${csvStudents.length} siswa ditemukan</p>
          <div class="mt-2 max-h-32 overflow-y-auto">
            ${csvStudents
              .slice(0, 10)
              .map(
                (s) =>
                  `<div class="text-xs text-slate-600 dark:text-slate-300">${s.Nama} - ${s.Kelas}</div>`,
              )
              .join("")}
            ${csvStudents.length > 10 ? `<div class="text-xs text-slate-400">... dan ${csvStudents.length - 10} lainnya</div>` : ""}
          </div>
        </div>
      `;
    }
  };
  reader.readAsText(file);
}

function importCsvStudents() {
  if (csvStudents.length === 0) {
    showToast("Tidak ada data CSV untuk diimport!", "error");
    return;
  }

  csvStudents.forEach((s) => {
    systemRecords.push({
      Nama: s.Nama,
      Kelas: s.Kelas,
      Kategori: "Akademik",
      Detail: "Siswa baru terdaftar (CSV)",
      Tanggal: new Date().toISOString().split("T")[0],
    });
  });

  window.dataSdk?.setData?.(systemRecords);
  saveSystemData(); // <-- TAMBAHKAN INI
  showToast(
    `Berhasil mengimport ${csvStudents.length} siswa dari CSV!`,
    "success",
  );
  csvStudents = [];
  document.getElementById("csvPreview").innerHTML = "";
  document.getElementById("csvFileInput").value = "";
  closeAddStudentModal();
  renderDashboardContent();
}

// ==================== 4. COPY-PASTE ====================
function importPasteStudents() {
  const text = document.getElementById("pasteStudentData").value.trim();
  if (!text) {
    showToast("Data kosong!", "error");
    return;
  }

  const lines = text.split("\n").filter((line) => line.trim());
  let imported = 0;

  lines.forEach((line) => {
    const cols = line.split(",").map((c) => c.trim());
    if (cols.length >= 2 && cols[0] && cols[1]) {
      systemRecords.push({
        Nama: cols[0],
        Kelas: cols[1],
        Kategori: "Akademik",
        Detail: "Siswa baru terdaftar (Copy-Paste)",
        Tanggal: new Date().toISOString().split("T")[0],
      });
      imported++;
    }
  });

  if (imported === 0) {
    showToast("Tidak ada data valid! Format: Nama,Kelas", "error");
    return;
  }

  window.dataSdk?.setData?.(systemRecords);
  saveSystemData(); // <-- TAMBAHKAN INI
  showToast(`Berhasil menambahkan ${imported} siswa!`, "success");
  document.getElementById("pasteStudentData").value = "";
  closeAddStudentModal();
  renderDashboardContent();
}

function handleFullFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const preview = document.getElementById("fullImportPreview");
    if (!preview) return;

    const cleanText = text.replace(/\r/g, "");
    const lines = cleanText.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      preview.innerHTML = `
        <div class="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-xl text-center">
          <p class="text-rose-500 font-semibold">⚠️ File kosong!</p>
        </div>
      `;
      return;
    }

    // --- DETEKSI HEADER CERDAS ---
    let headerMap = {};
    let startIndex = 0;
    const firstLine = lines[0].toLowerCase();

    const headerKeywords = [
      "nama",
      "kelas",
      "kategori",
      "keterangan",
      "tanggal",
      "nilai",
      "predikat",
    ];
    const hasHeader = headerKeywords.some((keyword) =>
      firstLine.includes(keyword),
    );

    if (hasHeader) {
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

      const mapHeader = (possibleNames) => {
        for (const name of possibleNames) {
          const idx = headers.findIndex(
            (h) => h === name || h.includes(name) || name.includes(h),
          );
          if (idx !== -1) return idx;
        }
        return -1;
      };

      headerMap = {
        nama: mapHeader(["nama", "name"]),
        kelas: mapHeader(["kelas", "class"]),
        kategori: mapHeader(["kategori", "category", "jenis"]),
        keterangan: mapHeader(["keterangan", "detail", "description"]),
        tanggal: mapHeader(["tanggal", "date"]),
        nilai_angka: mapHeader(["nilai", "score", "angka"]),
        predikat: mapHeader(["predikat", "grade", "predicate"]),
      };

      startIndex = 1;
    }

    // --- PROSES DATA ---
    const dataLines = lines.slice(startIndex);
    const validLines = [];
    const stats = { akademik: 0, kehadiran: 0, pelanggaran: 0 };
    let nilaiTotal = 0;
    let nilaiCount = 0;
    const uniqueStudents = new Set();

    dataLines.forEach((line) => {
      const cols = line.split(",").map((c) => c.trim());
      if (cols.length < 3) return;

      let Nama, Kelas, Kategori, Keterangan, Tanggal, NilaiAngka, Predikat;

      if (Object.values(headerMap).some((idx) => idx !== -1)) {
        Nama = cols[headerMap.nama] || "";
        Kelas = cols[headerMap.kelas] || "";
        Kategori = cols[headerMap.kategori] || "";
        Keterangan = cols[headerMap.keterangan] || "";
        Tanggal =
          cols[headerMap.tanggal] || new Date().toISOString().split("T")[0];
        NilaiAngka = cols[headerMap.nilai_angka] || "";
        Predikat = cols[headerMap.predikat] || "";
      } else {
        // Auto detect: cari kolom yang berisi kategori
        const possibleKategori = ["Akademik", "Kehadiran", "Pelanggaran"];
        let kategoriIndex = -1;

        // Cari di semua kolom (tidak terbatas 5)
        for (let i = 0; i < cols.length; i++) {
          if (possibleKategori.includes(cols[i])) {
            kategoriIndex = i;
            break;
          }
        }

        if (kategoriIndex === -1) {
          // Jika tidak ketemu, asumsikan kolom ke-3 (index 2) adalah kategori
          if (cols.length >= 3) kategoriIndex = 2;
          else return;
        }

        Nama = cols[0] || "";
        Kelas = cols[1] || "";
        Kategori = cols[kategoriIndex] || "";
        Keterangan = cols[kategoriIndex + 1] || "";
        Tanggal =
          cols[kategoriIndex + 2] || new Date().toISOString().split("T")[0];
        NilaiAngka = cols[kategoriIndex + 3] || "";
        Predikat = cols[kategoriIndex + 4] || "";

        // Jika kategori tidak valid, coba cari di posisi lain
        if (!["Akademik", "Kehadiran", "Pelanggaran"].includes(Kategori)) {
          for (let i = 0; i < cols.length; i++) {
            if (possibleKategori.includes(cols[i])) {
              Kategori = cols[i];
              Keterangan = cols[i + 1] || "";
              Tanggal = cols[i + 2] || new Date().toISOString().split("T")[0];
              NilaiAngka = cols[i + 3] || "";
              Predikat = cols[i + 4] || "";
              break;
            }
          }
        }
      }

      // VALIDASI: Pastikan kategori valid
      const validKategori = ["Akademik", "Kehadiran", "Pelanggaran"];
      if (!Nama || !Kelas || !validKategori.includes(Kategori)) {
        return;
      }

      validLines.push({
        Nama,
        Kelas,
        Kategori,
        Keterangan,
        Tanggal,
        NilaiAngka,
        Predikat,
      });
      uniqueStudents.add(Nama);

      if (Kategori === "Akademik") {
        stats.akademik++;
        if (NilaiAngka && !isNaN(NilaiAngka)) {
          nilaiTotal += parseFloat(NilaiAngka);
          nilaiCount++;
        }
      } else if (Kategori === "Kehadiran") {
        stats.kehadiran++;
      } else if (Kategori === "Pelanggaran") {
        stats.pelanggaran++;
      }
    });

    if (validLines.length === 0) {
      preview.innerHTML = `
        <div class="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-xl text-center">
          <p class="text-rose-500 font-semibold">⚠️ Tidak ada data valid!</p>
          <p class="text-xs text-slate-500 mt-2">Pastikan format: Nama,Kelas,Kategori,Keterangan,Tanggal,Nilai,Predikat</p>
          <p class="text-xs text-slate-500">Contoh: Daffa Rayhan,12-RPL,Akademik,Nilai UTS,2026-06-17,85,A</p>
        </div>
      `;
      return;
    }

    const rataNilai =
      nilaiCount > 0 ? (nilaiTotal / nilaiCount).toFixed(1) : "N/A";

    preview.innerHTML = `
      <div class="import-preview-card">
        <div class="preview-header">
          <div class="preview-title">
            <span class="preview-icon">📊</span>
            <span>${validLines.length} Data Ditemukan</span>
          </div>
          <span class="preview-file">${file.name}</span>
        </div>
        <div class="preview-stats">
          <div class="stat-item siswa">
            <div class="stat-icon">👨‍🎓</div>
            <div class="stat-info">
              <div class="stat-number">${uniqueStudents.size}</div>
              <div class="stat-label">Siswa</div>
            </div>
          </div>
          <div class="stat-item akademik">
            <div class="stat-icon">📚</div>
            <div class="stat-info">
              <div class="stat-number">${stats.akademik}</div>
              <div class="stat-label">Akademik</div>
              ${rataNilai !== "N/A" ? `<div class="stat-sub">Rata-rata: ${rataNilai}</div>` : ""}
            </div>
          </div>
          <div class="stat-item kehadiran">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <div class="stat-number">${stats.kehadiran}</div>
              <div class="stat-label">Kehadiran</div>
            </div>
          </div>
          <div class="stat-item pelanggaran">
            <div class="stat-icon">⚠️</div>
            <div class="stat-info">
              <div class="stat-number">${stats.pelanggaran}</div>
              <div class="stat-label">Pelanggaran</div>
            </div>
          </div>
        </div>
        <div class="preview-data">
          <div class="preview-data-header">
            <span>📋 Preview Data (5 dari ${validLines.length})</span>
          </div>
          <div class="preview-data-list">
            ${validLines
              .slice(0, 5)
              .map((item) => {
                let badgeColor = "";
                if (item.Kategori === "Akademik") badgeColor = "badge-akademik";
                else if (item.Kategori === "Kehadiran")
                  badgeColor = "badge-kehadiran";
                else badgeColor = "badge-pelanggaran";

                let nilaiDisplay = "";
                if (item.Kategori === "Akademik" && item.NilaiAngka) {
                  nilaiDisplay = ` <span class="nilai-preview ${item.Predikat?.toLowerCase() || ""}">${item.NilaiAngka}</span>`;
                }

                return `
                <div class="preview-row">
                  <span class="preview-name">${item.Nama}</span>
                  <span class="preview-class">${item.Kelas}</span>
                  <span class="preview-badge ${badgeColor}">${item.Kategori}</span>
                  <span class="preview-detail">${item.Keterangan}</span>
                  ${nilaiDisplay}
                  <span class="preview-date">${item.Tanggal}</span>
                </div>
              `;
              })
              .join("")}
            ${validLines.length > 5 ? `<div class="preview-more">... dan ${validLines.length - 5} data lainnya</div>` : ""}
          </div>
        </div>
        <!-- TOMBOL IMPORT & UNDO -->
        <div class="preview-actions">
          <button onclick="importFullFileData()" class="preview-import-btn">
            📥 Import Semua Data (${validLines.length})
          </button>
          <button onclick="undoLastImport()" class="preview-undo-btn" title="Batalkan import terakhir">
            ↩️ Undo
          </button>
        </div>
      </div>
    `;

    window._fullImportData = validLines;
  };

  if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
    reader.readAsText(file);
  } else {
    preview.innerHTML = `
      <div class="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl text-center">
        <p class="text-yellow-600 font-semibold">📌 Untuk file Excel, gunakan opsi Copy-Paste</p>
        <p class="text-xs text-slate-500 mt-2">Atau simpan sebagai CSV terlebih dahulu</p>
      </div>
    `;
  }
}

// Fungsi import dari data yang sudah di-load
function importFullFileData() {
  if (!window._fullImportData || window._fullImportData.length === 0) {
    showToast("Tidak ada data untuk diimport!", "error");
    return;
  }

  // SAVE UNDO DATA SEBELUM IMPORT
  saveUndoData();

  let imported = {
    siswa: 0,
    akademik: 0,
    kehadiran: 0,
    pelanggaran: 0,
  };

  const uniqueStudents = new Set();

  window._fullImportData.forEach((item) => {
    const { Nama, Kelas, Kategori, Keterangan, Tanggal, NilaiAngka, Predikat } =
      item;

    let Detail = Keterangan;
    if (Kategori === "Akademik" && NilaiAngka) {
      Detail = `${Keterangan}: ${NilaiAngka}`;
      if (Predikat) Detail += ` (${Predikat})`;
    }

    systemRecords.push({
      Nama,
      Kelas,
      Kategori,
      Detail,
      Tanggal: Tanggal || new Date().toISOString().split("T")[0],
      NilaiAngka: NilaiAngka || "",
      Predikat: Predikat || "",
    });

    uniqueStudents.add(Nama);
    if (Kategori === "Akademik") imported.akademik++;
    else if (Kategori === "Kehadiran") imported.kehadiran++;
    else if (Kategori === "Pelanggaran") imported.pelanggaran++;
  });

  imported.siswa = uniqueStudents.size;

  if (
    imported.akademik === 0 &&
    imported.kehadiran === 0 &&
    imported.pelanggaran === 0
  ) {
    showToast("Tidak ada data valid!", "error");
    return;
  }

  window.dataSdk?.setData?.(systemRecords);
  saveSystemData(); // <-- TAMBAHKAN INI
  showToast(
    `✅ Berhasil import! Siswa: ${imported.siswa}, Akademik: ${imported.akademik}, Kehadiran: ${imported.kehadiran}, Pelanggaran: ${imported.pelanggaran}`,
    "success",
  );
  window._fullImportData = null;
  document.getElementById("fullImportPreview").innerHTML = "";
  document.getElementById("fullCsvFileInput").value = "";
  closeAddStudentModal();
  renderDashboardContent();
}

// ==================== FITUR UNDO IMPORT ====================
let lastImportData = null;
let lastImportCount = 0;

function saveUndoData() {
  // Simpan state sebelum import untuk keperluan undo
  lastImportData = JSON.parse(JSON.stringify(systemRecords));
  lastImportCount = systemRecords.length;
}

function undoLastImport() {
  if (!lastImportData) {
    showToast("Tidak ada data untuk di-undo!", "info");
    return;
  }

  if (!confirm("Yakin ingin membatalkan import data terakhir?")) return;

  // Restore data
  systemRecords = JSON.parse(JSON.stringify(lastImportData));
  window.dataSdk?.setData?.(systemRecords);

  showToast("Import data berhasil dibatalkan (Undo)!", "success");
  lastImportData = null;
  renderDashboardContent();
}

// Override fungsi import untuk menyimpan state sebelum import
const originalImportFullFileData = importFullFileData;
window.importFullFileData = function () {
  saveUndoData();
  originalImportFullFileData();
};

const originalImportFullDataPaste = importFullDataPaste;
window.importFullDataPaste = function () {
  saveUndoData();
  originalImportFullDataPaste();
};

const originalImportCsvStudents = importCsvStudents;
window.importCsvStudents = function () {
  saveUndoData();
  originalImportCsvStudents();
};

const originalImportPasteStudents = importPasteStudents;
window.importPasteStudents = function () {
  saveUndoData();
  originalImportPasteStudents();
};

const originalImportNilaiMassal = importNilaiMassal;
window.importNilaiMassal = function () {
  saveUndoData();
  originalImportNilaiMassal();
};

// Tambahkan tombol undo di halaman
function addUndoButton() {
  const mainContent = document.getElementById("mainContent");
  if (!mainContent) return;

  // Cek apakah tombol undo sudah ada
  if (document.getElementById("undoButtonContainer")) return;

  const container = document.createElement("div");
  container.id = "undoButtonContainer";
  container.className = "undo-container";
  container.innerHTML = `
    <button class="undo-floating-btn" onclick="undoLastImport()" title="Batalkan import data terakhir">
      <i data-lucide="undo-2" class="w-4 h-4"></i> Undo Import
    </button>
  `;
  mainContent.appendChild(container);
  lucide.createIcons();
}

// Panggil addUndoButton setelah render dashboard
const originalRenderDashboardContent = window.renderDashboardContent;
window.renderDashboardContent = function () {
  originalRenderDashboardContent();
  if (currentUser && currentUser.role === "admin") {
    setTimeout(() => addUndoButton(), 100);
  }
};

// ==================== FUNGSI DATA PAGE ====================
function renderDataPage(currentPage, allowedRecords, currentUser) {
  // Jika halaman Akademikk, gunakan tampilan khusus Nilai Akademik
  if (currentPage === "akademik") {
    return renderNilaiPage(allowedRecords, currentUser);
  }

  const pageTitles = {
    siswa: "Data Siswa",
    kehadiran: "Kehadiran",
    pelanggaran: "Pelanggaran",
  };

  const targetKategori =
    currentPage === "kehadiran"
      ? "Kehadiran"
      : currentPage === "pelanggaran"
        ? "Pelanggaran"
        : null;

  let filteredRecords = [];
  if (targetKategori) {
    filteredRecords = allowedRecords.filter(
      (r) => r.Kategori === targetKategori,
    );
  } else if (currentPage === "siswa") {
    const siswaMap = new Map();
    allowedRecords.forEach((r) => {
      if (!siswaMap.has(r.Nama)) {
        siswaMap.set(r.Nama, { Nama: r.Nama, Kelas: r.Kelas });
      }
    });
    filteredRecords = Array.from(siswaMap.values());
  }

  // Tentukan tombol aksi
  let actionButtons = "";
  if (currentUser && currentUser.role === "admin") {
    if (currentPage === "siswa") {
      actionButtons = `
        <button class="btn-add" onclick="openAddStudentModal()">
          <i data-lucide="user-plus" class="w-4 h-4"></i> Tambah Siswa
        </button>
      `;
    } else if (targetKategori) {
      actionButtons = `
        <button class="btn-add" onclick="openInputFormModal('${targetKategori}')">
          <i data-lucide="plus" class="w-4 h-4"></i> Tambah Laporan ${targetKategori}
        </button>
      `;
    }
  }

  let tableHeaders = "";
  let tableRows = "";

  if (currentPage === "siswa") {
    tableHeaders = `
      <th>No</th>
      <th>Nama Siswa</th>
      <th>Kelas</th>
    `;
    tableRows =
      filteredRecords.length === 0
        ? `
      <tr>
        <td colspan="3" class="no-data">📭 Belum ada data siswa. Klik "Tambah Siswa" untuk menambahkan.</td>
      </tr>
    `
        : filteredRecords
            .map(
              (record, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${record.Nama}</strong></td>
        <td>${record.Kelas}</td>
      </tr>
    `,
            )
            .join("");
  } else {
    tableHeaders = `
      <th>Nama Siswa</th>
      <th>Kelas</th>
      <th>Detail</th>
      <th>Tanggal</th>
    `;
    tableRows =
      filteredRecords.length === 0
        ? `
      <tr>
        <td colspan="4" class="no-data">📭 Tidak ada data</td>
      </tr>
    `
        : filteredRecords
            .map(
              (record) => `
      <tr>
        <td><strong>${record.Nama}</strong></td>
        <td>${record.Kelas}</td>
        <td>${record.Detail}</td>
        <td>${record.Tanggal}</td>
      </tr>
    `,
            )
            .join("");
  }

  return `
    <div class="data-page">
      <div class="page-header">
        <h3>${pageTitles[currentPage] || "Data"}</h3>
        <div class="page-actions">
          ${actionButtons}
        </div>
      </div>
      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              ${tableHeaders}
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ==================== IMPORT DATA LENGKAP (CSV/EXCEL) ====================
function importFullDataCSV(text) {
  const lines = text.split("\n").filter((line) => line.trim());
  let imported = {
    siswa: 0,
    akademik: 0,
    kehadiran: 0,
    pelanggaran: 0,
  };

  if (lines.length === 0) return imported;

  // Deteksi header
  let headerMap = {};
  let startIndex = 0;
  const firstLine = lines[0];
  if (firstLine.toLowerCase().includes("nama")) {
    const headers = firstLine.split(",").map((h) => h.trim().toLowerCase());
    const headerIndex = {
      nama: headers.indexOf("nama"),
      kelas: headers.indexOf("kelas"),
      kategori: headers.indexOf("kategori"),
      keterangan: headers.indexOf("keterangan"),
      tanggal: headers.indexOf("tanggal"),
      nilai_angka: headers.indexOf("nilai_angka"),
      predikat: headers.indexOf("predikat"),
    };
    // Cari alternatif jika tidak ditemukan
    if (headerIndex.kategori === -1)
      headerIndex.kategori =
        headers.indexOf("kategori") !== -1
          ? headers.indexOf("kategori")
          : headers.indexOf("jenis");
    if (headerIndex.keterangan === -1)
      headerIndex.keterangan =
        headers.indexOf("keterangan") !== -1
          ? headers.indexOf("keterangan")
          : headers.indexOf("detail");
    if (headerIndex.tanggal === -1)
      headerIndex.tanggal =
        headers.indexOf("tanggal") !== -1
          ? headers.indexOf("tanggal")
          : headers.indexOf("date");
    if (headerIndex.nilai_angka === -1)
      headerIndex.nilai_angka =
        headers.indexOf("nilai_angka") !== -1
          ? headers.indexOf("nilai_angka")
          : headers.indexOf("nilai");
    if (headerIndex.predikat === -1)
      headerIndex.predikat =
        headers.indexOf("predikat") !== -1
          ? headers.indexOf("predikat")
          : headers.indexOf("grade");

    headerMap = headerIndex;
    startIndex = 1;
  }

  const dataLines = lines.slice(startIndex);

  dataLines.forEach((line) => {
    const cols = line.split(",").map((c) => c.trim());
    if (cols.length < 4) return;

    let Nama, Kelas, Kategori, Keterangan, Tanggal, NilaiAngka, Predikat;

    if (Object.keys(headerMap).length > 0) {
      Nama = cols[headerMap.nama] || "";
      Kelas = cols[headerMap.kelas] || "";
      Kategori = cols[headerMap.kategori] || "";
      Keterangan = cols[headerMap.keterangan] || "";
      Tanggal =
        cols[headerMap.tanggal] || new Date().toISOString().split("T")[0];
      NilaiAngka = cols[headerMap.nilai_angka] || "";
      Predikat = cols[headerMap.predikat] || "";
    } else {
      // Auto detect berdasarkan posisi
      Nama = cols[0] || "";
      Kelas = cols[1] || "";

      // Cari kategori dari kolom yang ada
      const possibleKategori = ["Akademik", "Kehadiran", "Pelanggaran"];
      let kategoriIndex = -1;
      for (let i = 2; i < Math.min(cols.length, 6); i++) {
        if (possibleKategori.includes(cols[i])) {
          kategoriIndex = i;
          break;
        }
      }

      if (kategoriIndex === -1) {
        // Jika tidak ketemu, asumsikan kolom ke-3 (index 2) adalah kategori
        if (cols.length >= 3) kategoriIndex = 2;
        else return;
      }

      Kategori = cols[kategoriIndex] || "";
      Keterangan = cols[kategoriIndex + 1] || "";
      Tanggal =
        cols[kategoriIndex + 2] || new Date().toISOString().split("T")[0];
      NilaiAngka = cols[kategoriIndex + 3] || "";
      Predikat = cols[kategoriIndex + 4] || "";

      // Jika kategori tidak valid, coba cari di posisi lain
      if (!["Akademik", "Kehadiran", "Pelanggaran"].includes(Kategori)) {
        for (let i = 0; i < cols.length; i++) {
          if (possibleKategori.includes(cols[i])) {
            Kategori = cols[i];
            Keterangan = cols[i + 1] || "";
            Tanggal = cols[i + 2] || new Date().toISOString().split("T")[0];
            NilaiAngka = cols[i + 3] || "";
            Predikat = cols[i + 4] || "";
            break;
          }
        }
      }
    }

    // Validasi
    if (
      !Nama ||
      !Kelas ||
      !["Akademik", "Kehadiran", "Pelanggaran"].includes(Kategori)
    ) {
      return;
    }

    // Buat detail
    let Detail = Keterangan;
    if (Kategori === "Akademik" && NilaiAngka) {
      Detail = `${Keterangan}: ${NilaiAngka}`;
      if (Predikat) Detail += ` (${Predikat})`;
    } else if (Kategori === "Akademik" && !NilaiAngka) {
      // Jika tidak ada nilai, beri nilai default
      Detail = `${Keterangan}: 0`;
    }

    // Tambahkan ke systemRecords
    systemRecords.push({
      Nama,
      Kelas,
      Kategori,
      Detail,
      Tanggal: Tanggal || new Date().toISOString().split("T")[0],
      NilaiAngka: NilaiAngka || "",
      Predikat: Predikat || "",
    });

    if (Kategori === "Akademik") imported.akademik++;
    else if (Kategori === "Kehadiran") imported.kehadiran++;
    else if (Kategori === "Pelanggaran") imported.pelanggaran++;
  });

  const uniqueStudents = [...new Set(systemRecords.map((r) => r.Nama))];
  imported.siswa = uniqueStudents.length;

  return imported;
}

// ==================== HALAMAN NILAI AKADEMIK ====================
let currentEditNilaiIndex = -1;

function renderNilaiPage(allowedRecords, currentUser) {
  const nilaiRecords = allowedRecords.filter((r) => r.Kategori === "Akademik");

  // Kelompokkan nilai per siswa
  const siswaMap = new Map();
  nilaiRecords.forEach((r) => {
    const match = r.Detail.match(/:?\s*(\d+)/);
    const nilai = match ? parseInt(match[1]) : null;
    const mapel = r.Detail.split(":")[0].trim();

    if (!siswaMap.has(r.Nama)) {
      siswaMap.set(r.Nama, {
        nama: r.Nama,
        kelas: r.Kelas,
        nilaiList: [],
        rataRata: 0,
      });
    }
    if (nilai !== null) {
      siswaMap.get(r.Nama).nilaiList.push({
        nilai,
        mapel,
        tanggal: r.Tanggal,
        detail: r.Detail,
        record: r,
      });
    }
  });

  // Hitung rata-rata dan urutkan
  const sortedSiswa = Array.from(siswaMap.values())
    .map((s) => {
      const total = s.nilaiList.reduce((a, b) => a + b.nilai, 0);
      s.rataRata =
        s.nilaiList.length > 0 ? (total / s.nilaiList.length).toFixed(1) : 0;
      return s;
    })
    .sort((a, b) => b.rataRata - a.rataRata);

  // Ambil semua nilai untuk ditampilkan di tabel detail
  const sortedNilai = [...nilaiRecords].reverse();

  return `
    <div class="nilai-page">
      <div class="nilai-header">
        <h3>📊 Nilai Akademik</h3>
        <div class="nilai-header-actions">
          <span class="nilai-count">${nilaiRecords.length} catatan nilai</span>
          <button class="btn-add-nilai" onclick="openTambahNilaiModal()">
            <i data-lucide="plus" class="w-4 h-4"></i> Tambah Nilai
          </button>
        </div>
      </div>

      <!-- Ringkasan per Siswa -->
      <div class="nilai-ringkasan">
        <h4>Ringkasan Nilai per Siswa</h4>
        <div class="ringkasan-grid-nilai">
          ${sortedSiswa
            .map(
              (s) => `
  <div class="ringkasan-card-nilai" onclick="filterNilaiSiswa('${s.nama}')">
    <span class="card-badge">${s.nilaiList.length} nilai</span>
    <div class="ringkasan-nama">${s.nama}</div>
    <div class="ringkasan-kelas">${s.kelas}</div>
    <div class="ringkasan-stats">
      <div class="ringkasan-stat">
        <span class="stat-angka">${s.nilaiList.length}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="ringkasan-stat">
        <span class="stat-angka ${s.rataRata >= 85 ? "baik" : s.rataRata >= 70 ? "cukup" : "kurang"}">${s.rataRata}</span>
        <span class="stat-label">Rata-rata</span>
      </div>
    </div>
  </div>
`,
            )
            .join("")}
          ${sortedSiswa.length === 0 ? `<div class="no-data-nilai">Belum ada data nilai</div>` : ""}
        </div>
      </div>

      <!-- Tabel Nilai Detail -->
      <div class="nilai-table-container">
        <div class="table-toolbar">
          <span class="toolbar-title">Detail Nilai</span>
          <div class="toolbar-actions">
            <button class="btn-filter" onclick="resetNilaiFilter()" title="Reset filter">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
        <table class="nilai-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>Mata Pelajaran</th>
              <th>Nilai</th>
              <th>Kategori</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody id="nilaiTableBody">
            ${
              sortedNilai.length === 0
                ? `
              <tr>
                <td colspan="7" class="no-data">📭 Belum ada data nilai.</td>
              </tr>
            `
                : sortedNilai
                    .map((record, index) => {
                      const match = record.Detail.match(/:?\s*(\d+)/);
                      const nilai = match ? parseInt(match[1]) : null;
                      const mapel = record.Detail.split(":")[0].trim();

                      let kategori = "";
                      let kelasKategori = "";
                      if (nilai !== null) {
                        if (nilai >= 85) {
                          kategori = "Baik";
                          kelasKategori = "baik";
                        } else if (nilai >= 70) {
                          kategori = "Cukup";
                          kelasKategori = "cukup";
                        } else {
                          kategori = "Kurang";
                          kelasKategori = "kurang";
                        }
                      }

                      const displayMapel = mapel || record.Detail;

                      return `
                <tr data-siswa="${record.Nama}">
                  <td>${index + 1}</td>
                  <td><strong>${record.Nama}</strong></td>
                  <td>${displayMapel}</td>
                  <td class="nilai-angka ${kelasKategori}">${nilai !== null ? nilai : "-"}</td>
                  <td><span class="kategori-badge ${kelasKategori}">${kategori || "-"}</span></td>
                  <td>${record.Tanggal}</td>
                  <td>
                    <div class="aksi-buttons">
                      <button class="btn-edit" onclick="editNilai(${index})" title="Edit">
                        <i data-lucide="pencil" class="w-4 h-4"></i>
                      </button>
                      <button class="btn-delete" onclick="deleteNilai(${index})" title="Hapus">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `;
                    })
                    .join("")
            }
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ==================== FUNGSI FILTER NILAI PER SISWA ====================
function filterNilaiSiswa(nama) {
  const rows = document.querySelectorAll("#nilaiTableBody tr");
  rows.forEach((row) => {
    const siswa = row.getAttribute("data-siswa");
    if (siswa) {
      row.style.display = siswa === nama ? "" : "none";
    }
  });

  // Highlight card yang aktif
  document.querySelectorAll(".ringkasan-card-nilai").forEach((card) => {
    card.classList.remove("active");
    if (card.querySelector(".ringkasan-nama")?.textContent === nama) {
      card.classList.add("active");
    }
  });

  showToast(`Menampilkan data untuk ${nama}`, "info");
}

function resetNilaiFilter() {
  const rows = document.querySelectorAll("#nilaiTableBody tr");
  rows.forEach((row) => {
    row.style.display = "";
  });

  document.querySelectorAll(".ringkasan-card-nilai").forEach((card) => {
    card.classList.remove("active");
  });

  const hasData = document.querySelector("#nilaiTableBody tr:not(.no-data)");
  if (hasData) {
    showToast("Semua data ditampilkan", "info");
  }
}

function resetNilaiFilter() {
  const rows = document.querySelectorAll("#nilaiTableBody tr");
  rows.forEach((row) => {
    row.style.display = "";
  });

  document.querySelectorAll(".ringkasan-card-nilai").forEach((card) => {
    card.classList.remove("active");
  });

  showToast("Semua data ditampilkan", "info");
}

// ==================== MODAL TAMBAH NILAI ====================
let currentNilaiTab = "manual";

function openTambahNilaiModal() {
  document.getElementById("tambahNilaiModal").style.display = "flex";
  switchNilaiTab("manual");

  const siswaList = [...new Set(systemRecords.map((r) => r.Nama))];
  const select = document.getElementById("tambahNilaiSiswa");
  select.innerHTML =
    '<option value="">-- Pilih Siswa --</option>' +
    siswaList.map((s) => `<option value="${s}">${s}</option>`).join("");

  document.getElementById("tambahNilaiTanggal").value = new Date()
    .toISOString()
    .split("T")[0];
  document.getElementById("tambahNilaiMapel").value = "";
  document.getElementById("tambahNilaiAngka").value = "";
  document.getElementById("tambahPredikatDisplay").classList.add("hidden");

  lucide.createIcons();
}

function closeTambahNilaiModal() {
  document.getElementById("tambahNilaiModal").style.display = "none";
  document.getElementById("tambahNilaiSiswa").value = "";
  document.getElementById("tambahNilaiMapel").value = "";
  document.getElementById("tambahNilaiAngka").value = "";
  document.getElementById("importNilaiData").value = "";
  document.getElementById("importNilaiPreview").innerHTML = "";
}

function switchNilaiTab(tab) {
  currentNilaiTab = tab;

  const tabs = ["manual", "massal"];
  tabs.forEach((t) => {
    const el = document.getElementById(
      `nilaiTab${t.charAt(0).toUpperCase() + t.slice(1)}`,
    );
    if (el) el.style.display = t === tab ? "block" : "none";
    const btn = document.getElementById(
      `nilaiTabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`,
    );
    if (btn) {
      if (t === tab) {
        btn.className =
          "px-4 py-2 text-sm font-semibold border-b-2 border-purple-500 text-purple-600 dark:text-purple-400 transition-all";
      } else {
        btn.className =
          "px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 transition-all";
      }
    }
  });

  if (tab === "manual") {
    const siswaList = [...new Set(systemRecords.map((r) => r.Nama))];
    const select = document.getElementById("tambahNilaiSiswa");
    if (select) {
      select.innerHTML =
        '<option value="">-- Pilih Siswa --</option>' +
        siswaList.map((s) => `<option value="${s}">${s}</option>`).join("");
    }
    document.getElementById("tambahNilaiTanggal").value = new Date()
      .toISOString()
      .split("T")[0];
  }
}

function saveTambahNilai() {
  const siswa = document.getElementById("tambahNilaiSiswa").value;
  const mapel = document.getElementById("tambahNilaiMapel").value.trim();
  const nilai = document.getElementById("tambahNilaiAngka").value;
  const tanggal = document.getElementById("tambahNilaiTanggal").value;

  if (!siswa) {
    showToast("Pilih siswa terlebih dahulu!", "error");
    return;
  }
  if (!mapel) {
    showToast("Masukkan mata pelajaran!", "error");
    return;
  }
  if (!nilai || nilai < 0 || nilai > 100) {
    showToast("Masukkan nilai antara 0-100!", "error");
    return;
  }

  let predikat = "";
  if (nilai >= 85) predikat = "Baik";
  else if (nilai >= 70) predikat = "Cukup";
  else predikat = "Kurang";

  const siswaData = systemRecords.find((r) => r.Nama === siswa);
  const kelas = siswaData ? siswaData.Kelas : "";

  systemRecords.push({
    Nama: siswa,
    Kelas: kelas,
    Kategori: "Akademik",
    Detail: `${mapel}: ${nilai}`,
    Tanggal: tanggal || new Date().toISOString().split("T")[0],
    NilaiAngka: nilai,
    Predikat: predikat,
  });

  window.dataSdk?.setData?.(systemRecords);
  saveSystemData(); // <-- TAMBAHKAN INI
  showToast(
    `✅ Nilai ${mapel} untuk ${siswa} berhasil ditambahkan!`,
    "success",
  );
  closeTambahNilaiModal();
  renderDashboardContent();
}

// ==================== FUNGSI IMPORT NILAI MASSAL ====================
function handleImportNilaiFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    document.getElementById("importNilaiData").value = text;
    previewImportNilai(text);
  };
  reader.readAsText(file);
}

function previewImportNilai(text) {
  const preview = document.getElementById("importNilaiPreview");
  const lines = text.split("\n").filter((line) => line.trim());
  const validLines = [];
  const errors = [];

  lines.forEach((line, index) => {
    const cols = line.split(",").map((c) => c.trim());
    if (cols.length < 3) {
      errors.push(`Baris ${index + 1}: Format tidak lengkap`);
      return;
    }

    const nama = cols[0];
    const mapel = cols[1];
    const nilai = parseInt(cols[2]);

    if (!nama) errors.push(`Baris ${index + 1}: Nama siswa kosong`);
    else if (!mapel) errors.push(`Baris ${index + 1}: Mata pelajaran kosong`);
    else if (isNaN(nilai) || nilai < 0 || nilai > 100)
      errors.push(`Baris ${index + 1}: Nilai harus 0-100`);
    else
      validLines.push({
        nama,
        mapel,
        nilai,
        tanggal: cols[3] || new Date().toISOString().split("T")[0],
      });
  });

  if (validLines.length === 0) {
    preview.innerHTML = `
      <div class="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg">
        <p class="text-center text-rose-500 text-sm py-2">⚠️ Tidak ada data valid!</p>
        <p class="text-xs text-slate-500 text-center">Format: Nama, Mata Pelajaran, Nilai, Tanggal (opsional)</p>
        ${errors.length > 0 ? `<div class="mt-2 text-xs text-rose-400">${errors.slice(0, 3).join("<br>")}</div>` : ""}
      </div>
    `;
    return;
  }

  let stats = { total: validLines.length, baik: 0, cukup: 0, kurang: 0 };
  validLines.forEach((item) => {
    if (item.nilai >= 85) stats.baik++;
    else if (item.nilai >= 70) stats.cukup++;
    else stats.kurang++;
  });

  preview.innerHTML = `
    <div class="import-preview-card">
      <div class="preview-header">
        <div class="preview-title">
          <span class="preview-icon">📊</span>
          <span>${validLines.length} Data Nilai Ditemukan</span>
        </div>
      </div>
      <div class="preview-stats">
        <div class="stat-item siswa">
          <div class="stat-icon">📝</div>
          <div class="stat-info">
            <div class="stat-number">${validLines.length}</div>
            <div class="stat-label">Total Data</div>
          </div>
        </div>
        <div class="stat-item akademik">
          <div class="stat-icon">🟢</div>
          <div class="stat-info">
            <div class="stat-number">${stats.baik}</div>
            <div class="stat-label">Baik (≥85)</div>
          </div>
        <div class="stat-item kehadiran">
          <div class="stat-icon">🟡</div>
          <div class="stat-info">
            <div class="stat-number">${stats.cukup}</div>
            <div class="stat-label">Cukup (70-84)</div>
          </div>
        </div>
        <div class="stat-item pelanggaran">
          <div class="stat-icon">🔴</div>
          <div class="stat-info">
            <div class="stat-number">${stats.kurang}</div>
            <div class="stat-label">Kurang (&lt;70)</div>
          </div>
        </div>
      </div>
      ${errors.length > 0 ? `<div class="text-xs text-rose-400 mb-2">⚠️ ${errors.length} error: ${errors.slice(0, 3).join(", ")}</div>` : ""}
      <div class="preview-data">
        <div class="preview-data-header">
          <span>📋 Preview Data (${Math.min(validLines.length, 5)} dari ${validLines.length})</span>
        </div>
        <div class="preview-data-list">
          ${validLines
            .slice(0, 5)
            .map((item) => {
              let kelas = "";
              if (item.nilai >= 85) kelas = "baik";
              else if (item.nilai >= 70) kelas = "cukup";
              else kelas = "kurang";
              return `
              <div class="preview-row">
                <span class="preview-name">${item.nama}</span>
                <span class="preview-class">${item.mapel}</span>
                <span class="nilai-preview ${kelas}">${item.nilai}</span>
                <span class="preview-date">${item.tanggal}</span>
              </div>
            `;
            })
            .join("")}
          ${validLines.length > 5 ? `<div class="preview-more">... dan ${validLines.length - 5} data lainnya</div>` : ""}
        </div>
      </div>
      <div class="preview-actions">
        <button onclick="importNilaiMassal()" class="preview-import-btn">
          📥 Import ${validLines.length} Nilai
        </button>
        <button onclick="undoLastImport()" class="preview-undo-btn" title="Batalkan import terakhir">
          ↩️ Undo
        </button>
      </div>
    </div>
  `;

  window._importNilaiData = validLines;
}

function importNilaiMassal() {
  const data = window._importNilaiData;
  if (!data || data.length === 0) {
    showToast("Tidak ada data untuk diimport!", "error");
    return;
  }

  // SAVE UNDO DATA SEBELUM IMPORT
  saveUndoData();

  let imported = 0;

  data.forEach((item) => {
    const siswaData = systemRecords.find((r) => r.Nama === item.nama);
    const kelas = siswaData ? siswaData.Kelas : "";

    let predikat = "";
    if (item.nilai >= 85) predikat = "Baik";
    else if (item.nilai >= 70) predikat = "Cukup";
    else predikat = "Kurang";

    systemRecords.push({
      Nama: item.nama,
      Kelas: kelas,
      Kategori: "Akademik",
      Detail: `${item.mapel}: ${item.nilai}`,
      Tanggal: item.tanggal || new Date().toISOString().split("T")[0],
      NilaiAngka: item.nilai,
      Predikat: predikat,
    });
    imported++;
  });

  window.dataSdk?.setData?.(systemRecords);
  saveSystemData(); // <-- TAMBAHKAN INI
  showToast(`✅ Berhasil import ${imported} nilai!`, "success");
  window._importNilaiData = null;
  closeTambahNilaiModal();
  renderDashboardContent();
}

// ==================== FUNGSI CRUD NILAI ====================
function editNilai(index) {
  const nilaiRecords = systemRecords.filter((r) => r.Kategori === "Akademik");
  const sortedNilai = [...nilaiRecords].reverse();

  if (index >= sortedNilai.length) return;

  const record = sortedNilai[index];
  const nilaiMatch = record.Detail.match(/:?\s*(\d+)/);
  const nilai = nilaiMatch ? parseInt(nilaiMatch[1]) : "";
  const mapel = record.Detail.split(":")[0].trim();

  document.getElementById("editNilaiModal").style.display = "flex";
  document.getElementById("editNilaiIndex").value = index;
  document.getElementById("editNilaiSiswa").value = record.Nama;
  document.getElementById("editNilaiMapel").value = mapel;
  document.getElementById("editNilaiAngka").value = nilai;
  document.getElementById("editNilaiTanggal").value = record.Tanggal;
  document.getElementById("editNilaiPredikat").value = record.Predikat || "";

  lucide.createIcons();
}

function saveEditNilai() {
  const index = parseInt(document.getElementById("editNilaiIndex").value);
  const siswa = document.getElementById("editNilaiSiswa").value.trim();
  const mapel = document.getElementById("editNilaiMapel").value.trim();
  const nilai = document.getElementById("editNilaiAngka").value;
  const tanggal = document.getElementById("editNilaiTanggal").value;
  const predikat = document.getElementById("editNilaiPredikat").value;

  if (!siswa || !mapel || !nilai || !tanggal) {
    showToast("Lengkapi semua data!", "error");
    return;
  }

  const nilaiRecords = systemRecords.filter((r) => r.Kategori === "Akademik");
  const sortedNilai = [...nilaiRecords].reverse();

  if (index >= sortedNilai.length) return;

  const oldRecord = sortedNilai[index];
  const oldIndex = systemRecords.indexOf(oldRecord);

  if (oldIndex === -1) return;

  systemRecords[oldIndex] = {
    ...systemRecords[oldIndex],
    Nama: siswa,
    Detail: `${mapel}: ${nilai}`,
    Tanggal: tanggal,
    NilaiAngka: nilai,
    Predikat: predikat || "",
  };

  window.dataSdk?.setData?.(systemRecords);
  showToast("✅ Nilai berhasil diupdate!", "success");
  document.getElementById("editNilaiModal").style.display = "none";
  renderDashboardContent();
}

function closeEditNilaiModal() {
  document.getElementById("editNilaiModal").style.display = "none";
}

function deleteNilai(index) {
  const nilaiRecords = systemRecords.filter((r) => r.Kategori === "Akademik");
  const sortedNilai = [...nilaiRecords].reverse();

  if (index >= sortedNilai.length) return;

  const record = sortedNilai[index];

  if (
    !confirm(
      `Yakin ingin menghapus nilai ${record.Detail} untuk ${record.Nama}?`,
    )
  )
    return;

  const oldIndex = systemRecords.indexOf(record);
  if (oldIndex === -1) return;

  systemRecords.splice(oldIndex, 1);
  window.dataSdk?.setData?.(systemRecords);
  showToast("✅ Nilai berhasil dihapus!", "success");
  renderDashboardContent();
}

function updatePredikatManual(nilai) {
  const display = document.getElementById("tambahPredikatDisplay");
  const text = document.getElementById("tambahPredikatText");

  if (
    nilai === "" ||
    nilai === null ||
    isNaN(nilai) ||
    nilai < 0 ||
    nilai > 100
  ) {
    display.classList.remove("show");
    return;
  }

  const n = parseInt(nilai);
  let predikat = "";
  let kelas = "";

  if (n >= 85) {
    predikat = "Baik";
    kelas = "baik";
  } else if (n >= 70) {
    predikat = "Cukup";
    kelas = "cukup";
  } else {
    predikat = "Kurang";
    kelas = "kurang";
  }

  display.className = `predikat-display show ${kelas}`;
  text.textContent = predikat;
}

// ==================== FUNGSI IMPORT DATA LENGKAP ====================
function importFullDataPaste() {
  const text = document.getElementById("pasteFullData").value.trim();
  if (!text) {
    showToast("Data kosong!", "error");
    return;
  }

  const cleanText = text.replace(/\r/g, "");
  const lines = cleanText.split("\n").filter((line) => line.trim());

  const validLines = [];
  const uniqueStudents = new Set();
  const stats = { akademik: 0, kehadiran: 0, pelanggaran: 0 };
  let nilaiTotal = 0;
  let nilaiCount = 0;

  lines.forEach((line) => {
    const cols = line.split(",").map((c) => c.trim());
    if (cols.length < 4) return;

    let Nama = cols[0] || "";
    let Kelas = cols[1] || "";
    let Kategori = "";
    let Keterangan = "";
    let Tanggal = new Date().toISOString().split("T")[0];
    let NilaiAngka = "";
    let Predikat = "";

    const possibleKategori = ["Akademik", "Kehadiran", "Pelanggaran"];
    let kategoriIndex = -1;
    for (let i = 0; i < Math.min(cols.length, 5); i++) {
      if (possibleKategori.includes(cols[i])) {
        kategoriIndex = i;
        break;
      }
    }

    if (kategoriIndex === -1) {
      if (cols.length >= 3) kategoriIndex = 2;
      else return;
    }

    Kategori = cols[kategoriIndex] || "";
    Keterangan = cols[kategoriIndex + 1] || "";
    Tanggal = cols[kategoriIndex + 2] || new Date().toISOString().split("T")[0];
    NilaiAngka = cols[kategoriIndex + 3] || "";
    Predikat = cols[kategoriIndex + 4] || "";

    if (
      !Nama ||
      !Kelas ||
      !["Akademik", "Kehadiran", "Pelanggaran"].includes(Kategori)
    ) {
      return;
    }

    validLines.push({
      Nama,
      Kelas,
      Kategori,
      Keterangan,
      Tanggal,
      NilaiAngka,
      Predikat,
    });
    uniqueStudents.add(Nama);

    if (Kategori === "Akademik") {
      stats.akademik++;
      if (NilaiAngka && !isNaN(NilaiAngka)) {
        nilaiTotal += parseFloat(NilaiAngka);
        nilaiCount++;
      }
    } else if (Kategori === "Kehadiran") {
      stats.kehadiran++;
    } else if (Kategori === "Pelanggaran") {
      stats.pelanggaran++;
    }
  });

  if (validLines.length === 0) {
    showToast(
      "Tidak ada data valid! Format: Nama,Kelas,Kategori,Keterangan",
      "error",
    );
    return;
  }

  validLines.forEach((item) => {
    const { Nama, Kelas, Kategori, Keterangan, Tanggal, NilaiAngka, Predikat } =
      item;

    let Detail = Keterangan;
    if (Kategori === "Akademik" && NilaiAngka) {
      Detail = `${Keterangan}: ${NilaiAngka}`;
      if (Predikat) Detail += ` (${Predikat})`;
    }

    systemRecords.push({
      Nama,
      Kelas,
      Kategori,
      Detail,
      Tanggal: Tanggal || new Date().toISOString().split("T")[0],
      NilaiAngka: NilaiAngka || "",
      Predikat: Predikat || "",
    });
  });

  window.dataSdk?.setData?.(systemRecords);
  showToast(
    `✅ Berhasil import! Siswa: ${uniqueStudents.size}, Akademik: ${stats.akademik}, Kehadiran: ${stats.kehadiran}, Pelanggaran: ${stats.pelanggaran}`,
    "success",
  );
  document.getElementById("pasteFullData").value = "";
  document.getElementById("fullImportPreview").innerHTML = "";
  closeAddStudentModal();
  renderDashboardContent();
}

function openFullImportModal() {
  document.getElementById("fullImportModal").style.display = "flex";
  lucide.createIcons();
}

function closeFullImportModal() {
  document.getElementById("fullImportModal").style.display = "none";
  document.getElementById("pasteFullData").value = "";
  document.getElementById("fullCsvPreview").innerHTML = "";
  document.getElementById("fullCsvFileInput").value = "";
  window._fullCsvData = null;
}

function switchFullImportTab(tab) {
  const tabs = ["csv", "paste"];
  tabs.forEach((t) => {
    const el = document.getElementById(
      `fullTab${t.charAt(0).toUpperCase() + t.slice(1)}`,
    );
    if (el) el.style.display = t === tab ? "block" : "none";
    const btn = document.getElementById(
      `fullTabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`,
    );
    if (btn) {
      if (t === tab) {
        btn.className =
          "px-4 py-2 text-sm font-semibold border-b-2 border-purple-500 text-purple-600 dark:text-purple-400 transition-all";
      } else {
        btn.className =
          "px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 transition-all";
      }
    }
  });
}

const card = document.querySelector(".contact-card");

card.addEventListener("mousemove", (e) => {
  const rect = card.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const rotateY = (x / rect.width - 0.5) * 8;
  const rotateX = (0.5 - y / rect.height) * 8;

  card.style.transform = `perspective(1000px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)`;
});

card.addEventListener("mouseleave", () => {
  card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
});

const contactCard = document.querySelector(".contact-card");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

observer.observe(contactCard);

// ==================== GOOGLE LOGIN ====================
// Fungsi ini akan dipanggil oleh Google Identity Services
function handleGoogleLogin(response) {
  // Decode token dari Google
  try {
    const payload = decodeJwtResponse(response.credential);

    // Data user dari Google
    const googleUser = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      given_name: payload.given_name,
      family_name: payload.family_name,
    };

    // Cek apakah user sudah terdaftar
    let currentUsers = getRegisteredUsers();
    const existingUser = currentUsers.find((u) => u.email === googleUser.email);

    let userData = null;

    if (existingUser) {
      // User sudah terdaftar
      userData = {
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role || "parent",
        children: existingUser.children || "",
        picture: googleUser.picture,
      };
    } else {
      // Buat akun baru untuk user Google
      const newUser = {
        email: googleUser.email,
        password: "google_" + Math.random().toString(36).slice(-8),
        name: googleUser.name,
        role: "parent",
        children: "",
      };
      currentUsers.push(newUser);
      localStorage.setItem("parentAlertUsers", JSON.stringify(currentUsers));

      userData = {
        name: newUser.name + " (Google)",
        email: newUser.email,
        role: newUser.role,
        children: newUser.children,
        picture: googleUser.picture,
      };
    }

    // Proses login
    performLogin(userData, "Google");
  } catch (error) {
    console.error("Error decoding Google token:", error);
    showToast("Gagal login dengan Google!", "error");
  }
}

// Fungsi untuk decode JWT token dari Google
function decodeJwtResponse(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );
  return JSON.parse(jsonPayload);
}

// Fungsi login yang dipakai bersama
function performLogin(userData, provider = "manual") {
  currentUser = userData;
  document.getElementById("loginPageView").style.display = "none";
  document.getElementById("mainApp").style.display = "flex";
  document.getElementById("userProfileName").textContent = userData.name;
  document.getElementById("avatarName").textContent = userData.name
    .charAt(0)
    .toUpperCase();
  document.getElementById("sidebarRole").textContent =
    userData.role === "admin" ? "Guru / Admin" : "Orang Tua Murid";
  document.getElementById("userEmailDisplay").textContent = userData.email;

  // Jika ada foto profil dari Google, tampilkan
  if (userData.picture) {
    const avatarEl = document.getElementById("avatarName");
    avatarEl.innerHTML = `<img src="${userData.picture}" alt="Profile" class="w-8 h-8 rounded-full object-cover">`;
  }

  showToast(
    `✅ Berhasil login dengan ${provider}! Selamat datang, ${userData.name}`,
    "success",
  );
  buildSidebarMenu();
  switchPage("dashboard");
}

// Fungsi login yang dipakai bersama
function performLogin(userData, provider = "manual") {
  currentUser = userData;
  document.getElementById("loginPageView").style.display = "none";
  document.getElementById("mainApp").style.display = "flex";
  document.getElementById("userProfileName").textContent = userData.name;
  document.getElementById("avatarName").textContent = userData.name
    .charAt(0)
    .toUpperCase();
  document.getElementById("sidebarRole").textContent =
    userData.role === "admin" ? "Guru / Admin" : "Orang Tua Murid";
  document.getElementById("userEmailDisplay").textContent = userData.email;

  // Jika ada foto profil dari Google, tampilkan
  if (userData.picture) {
    const avatarEl = document.getElementById("avatarName");
    avatarEl.innerHTML = `<img src="${userData.picture}" alt="Profile" class="w-8 h-8 rounded-full object-cover">`;
  }

  showToast(
    `✅ Berhasil login dengan ${provider}! Selamat datang, ${userData.name}`,
    "success",
  );
  buildSidebarMenu();
  switchPage("dashboard");
  switchPage("dashboard");
}

// ==================== ADMIN DASHBOARD ENHANCED ====================
function renderAdminDashboardEnhanced(records, currentUser) {
  // Hitung statistik
  const totalSiswa = [...new Set(records.map((r) => r.Nama))].length;
  const totalAkademik = records.filter((r) => r.Kategori === "Akademik").length;
  const totalKehadiran = records.filter(
    (r) => r.Kategori === "Kehadiran",
  ).length;
  const totalPelanggaran = records.filter(
    (r) => r.Kategori === "Pelanggaran",
  ).length;
  const totalRecords = records.length;

  // Hitung rata-rata nilai
  let totalNilai = 0;
  let nilaiCount = 0;
  records.forEach((r) => {
    if (r.Kategori === "Akademik") {
      const match = r.Detail.match(/:?\s*(\d+)/);
      if (match) {
        totalNilai += parseInt(match[1]);
        nilaiCount++;
      }
    }
  });
  const rataNilai = nilaiCount > 0 ? (totalNilai / nilaiCount).toFixed(1) : "0";

  // Data untuk chart (simulasi)
  const hariIni = new Date().toISOString().split("T")[0];
  const todayRecords = records.filter((r) => r.Tanggal === hariIni).length;

  return `
    <div class="dashboard-admin-enhanced">
      <!-- Welcome Banner -->
      <div class="welcome-banner-enhanced">
        <div>
          <h2>Selamat datang, ${currentUser.name.split(" ")[0]}</h2>
          <p>${new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <div class="welcome-stats-mini">
          <div class="welcome-stat-item">
            <span class="welcome-stat-number">${totalRecords}</span>
            <span class="welcome-stat-label">Total Data</span>
          </div>
          <div class="welcome-stat-item">
            <span class="welcome-stat-number">${totalSiswa}</span>
            <span class="welcome-stat-label">Siswa</span>
          </div>
        </div>
      </div>

      <!-- Stats Grid - 6 Cards dengan Navigasi -->
      <div class="stats-grid-enhanced">
        <div class="stat-card-enhanced" onclick="switchPage('siswa')" style="cursor: pointer;">
          <div class="stat-icon-enhanced"><i data-lucide="users" class="w-6 h-6"></i></div>
          <div class="stat-value-enhanced">${totalSiswa}</div>
          <div class="stat-label-enhanced">Total Siswa</div>
          <div class="stat-sub-enhanced">Terdaftar</div>
        </div>
        <div class="stat-card-enhanced" onclick="switchPage('akademik')" style="cursor: pointer;">
          <div class="stat-icon-enhanced"><i data-lucide="book-open" class="w-6 h-6"></i></div>
          <div class="stat-value-enhanced">${totalAkademik}</div>
          <div class="stat-label-enhanced">Akademik</div>
          <div class="stat-sub-enhanced">Tercatat</div>
        </div>
        <div class="stat-card-enhanced" onclick="switchPage('kehadiran')" style="cursor: pointer;">
          <div class="stat-icon-enhanced"><i data-lucide="user-check" class="w-6 h-6"></i></div>
          <div class="stat-value-enhanced">${totalKehadiran}</div>
          <div class="stat-label-enhanced">Presensi</div>
          <div class="stat-sub-enhanced">Total</div>
        </div>
        <div class="stat-card-enhanced" onclick="switchPage('pelanggaran')" style="cursor: pointer;">
          <div class="stat-icon-enhanced"><i data-lucide="shield-alert" class="w-6 h-6"></i></div>
          <div class="stat-value-enhanced">${totalPelanggaran}</div>
          <div class="stat-label-enhanced">Pelanggaran</div>
          <div class="stat-sub-enhanced">Total</div>
        </div>
        <div class="stat-card-enhanced" onclick="switchPage('analitik')" style="cursor: pointer;">
          <div class="stat-icon-enhanced"><i data-lucide="bar-chart-2" class="w-6 h-6"></i></div>
          <div class="stat-value-enhanced">${rataNilai}</div>
          <div class="stat-label-enhanced">Rata-rata Nilai</div>
          <div class="stat-sub-enhanced">Keseluruhan</div>
        </div>
        <div class="stat-card-enhanced" onclick="switchPage('notifikasi')" style="cursor: pointer;">
          <div class="stat-icon-enhanced"><i data-lucide="bell" class="w-6 h-6"></i></div>
          <div class="stat-value-enhanced">${todayRecords}</div>
          <div class="stat-label-enhanced">Aktivitas Hari Ini</div>
          <div class="stat-sub-enhanced">Terbaru</div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="dashboard-main-grid">
        <!-- Recent Activities -->
        <div class="recent-activities-enhanced">
          <div class="section-header">
            <h3><i data-lucide="clock" class="w-5 h-5"></i> Aktivitas Terbaru</h3>
            <span class="section-badge">${records.length} Total</span>
          </div>
          <div class="activity-list-enhanced">
            ${
              records.length === 0
                ? `
              <div class="empty-state">
                <i data-lucide="inbox" class="w-12 h-12"></i>
                <p>Belum ada aktivitas</p>
              </div>
            `
                : records
                    .slice(-5)
                    .reverse()
                    .map(
                      (r, i) => `
              <div class="activity-item-enhanced" style="animation-delay: ${i * 0.1}s">
                <div class="activity-avatar" style="background: ${r.Kategori === "Akademik" ? "#4f46e5" : r.Kategori === "Kehadiran" ? "#7c3aed" : "#a78bfa"}">
                  ${r.Nama.charAt(0).toUpperCase()}
                </div>
                <div class="activity-info">
                  <div class="activity-name">${r.Nama}</div>
                  <div class="activity-detail">${r.Detail}</div>
                  <div class="activity-meta">
                    <span class="activity-badge ${r.Kategori.toLowerCase()}">${r.Kategori}</span>
                    <span class="activity-date">${r.Tanggal}</span>
                  </div>
                </div>
              </div>
            `,
                    )
                    .join("")
            }
          </div>
        </div>

        <!-- Dashboard Sidebar -->
        <div class="dashboard-sidebar">
          <!-- Ringkasan Cepat -->
          <div class="quick-summary-enhanced">
            <h3><i data-lucide="clipboard-list" class="w-5 h-5"></i> Ringkasan Cepat</h3>
            <div class="summary-item">
              <span class="summary-label">Total Data</span>
              <span class="summary-value">${totalRecords}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Siswa Terdaftar</span>
              <span class="summary-value">${totalSiswa}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Rata-rata Nilai</span>
              <span class="summary-value">${rataNilai}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Pelanggaran</span>
              <span class="summary-value">${totalPelanggaran}</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-today">
              <span class="today-label"><i data-lucide="calendar" class="w-4 h-4"></i> Hari Ini</span>
              <span class="today-value">${todayRecords} Aktivitas</span>
            </div>
          </div>

          <!-- Distribusi Kategori -->
          <div class="category-distribution">
            <h3><i data-lucide="pie-chart" class="w-5 h-5"></i> Distribusi Kategori</h3>
            <div class="category-bar" onclick="switchPage('akademik')" style="cursor: pointer;">
              <div class="category-bar-label">
                <span><i data-lucide="book-open" class="w-4 h-4"></i> Akademik</span>
                <span>${totalAkademik}</span>
              </div>
              <div class="category-bar-track">
                <div class="category-bar-fill akademik" style="width: ${totalRecords > 0 ? (totalAkademik / totalRecords) * 100 : 0}%"></div>
              </div>
            </div>
            <div class="category-bar" onclick="switchPage('kehadiran')" style="cursor: pointer;">
              <div class="category-bar-label">
                <span><i data-lucide="user-check" class="w-4 h-4"></i> Kehadiran</span>
                <span>${totalKehadiran}</span>
              </div>
              <div class="category-bar-track">
                <div class="category-bar-fill kehadiran" style="width: ${totalRecords > 0 ? (totalKehadiran / totalRecords) * 100 : 0}%"></div>
              </div>
            </div>
            <div class="category-bar" onclick="switchPage('pelanggaran')" style="cursor: pointer;">
              <div class="category-bar-label">
                <span><i data-lucide="shield-alert" class="w-4 h-4"></i> Pelanggaran</span>
                <span>${totalPelanggaran}</span>
              </div>
              <div class="category-bar-track">
                <div class="category-bar-fill pelanggaran" style="width: ${totalRecords > 0 ? (totalPelanggaran / totalRecords) * 100 : 0}%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
