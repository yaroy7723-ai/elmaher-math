// ==========================================
// EL MAHER - MASTER DASHBOARD DYNAMIC SCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Calculate Real Dynamic Stats
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const videos = JSON.parse(localStorage.getItem("videos")) || [];
    const files = JSON.parse(localStorage.getItem("files")) || [];
    const studentAccounts = JSON.parse(localStorage.getItem("studentAccounts")) || [];

    // Elements
    const totalCoursesEl = document.getElementById("totalCoursesCount");
    const totalVideosEl = document.getElementById("totalVideosCount");
    const totalFilesEl = document.getElementById("totalFilesCount");
    const totalStudentsEl = document.getElementById("totalStudentsCount");

    if (totalCoursesEl) totalCoursesEl.textContent = courses.length;
    if (totalVideosEl) totalVideosEl.textContent = videos.length;
    if (totalFilesEl) totalFilesEl.textContent = files.length;
    if (totalStudentsEl) totalStudentsEl.textContent = studentAccounts.length;

    // Logout Handler
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("userRole");
            localStorage.removeItem("teacherLoggedIn");
            window.location.href = "login.html";
        });
    }

    // Admin Mobile Hamburger Toggle
    const adminToggleBtn = document.getElementById("adminMobileToggle");
    const sidebar = document.querySelector(".sidebar");
    if (adminToggleBtn && sidebar) {
        adminToggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("active");
            const isOpen = sidebar.classList.contains("active");
            adminToggleBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener("click", (e) => {
            if (!sidebar.contains(e.target) && !adminToggleBtn.contains(e.target)) {
                sidebar.classList.remove("active");
                adminToggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
});