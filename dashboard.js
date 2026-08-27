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
});