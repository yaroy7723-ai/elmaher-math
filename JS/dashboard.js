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

    // Render Latest Courses on Dashboard
    const dashboardCoursesGrid = document.getElementById("dashboardCoursesGrid");
    const coursesEmptyState = document.getElementById("coursesEmptyState");
    const viewAllBtn = document.querySelector(".view-all");

    if (viewAllBtn) {
        viewAllBtn.addEventListener("click", () => {
            window.location.href = "courses.html";
        });
    }

    if (dashboardCoursesGrid) {
        if (courses.length === 0) {
            if (coursesEmptyState) coursesEmptyState.style.display = "block";
            dashboardCoursesGrid.style.display = "none";
        } else {
            if (coursesEmptyState) coursesEmptyState.style.display = "none";
            dashboardCoursesGrid.style.display = "grid";

            // Render up to 4 latest courses
            const latestCourses = courses.slice(-4).reverse();
            dashboardCoursesGrid.innerHTML = latestCourses.map(c => {
                const coverStyle = c.image 
                    ? `background-image: url('${c.image}'); background-size: cover; background-position: center;` 
                    : `background: linear-gradient(135deg, #072b6b 0%, #0d47a1 100%); display: flex; align-items: center; justify-content: center; color: var(--gold); font-size: 40px;`;
                
                return `
                    <div style="background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="height: 140px; ${coverStyle} position: relative;">
                                ${c.image ? '' : '📐'}
                                <span style="position: absolute; top: 10px; right: 10px; background: rgba(7, 43, 107, 0.85); color: white; padding: 4px 10px; border-radius: 10px; font-size: 11px; font-weight: 800; backdrop-filter: blur(4px);">${c.level || ''}</span>
                            </div>
                            <div style="padding: 16px;">
                                <small style="color: #fb8500; font-weight: 800; font-size: 12px; display: block; margin-bottom: 4px;">${c.subject || 'الرياضيات'}</small>
                                <h4 style="font-size: 17px; font-weight: 900; color: #072b6b; margin-bottom: 6px; line-height: 1.3;">${c.name}</h4>
                                <p style="color: #64748b; font-size: 13px; line-height: 1.5; height: 38px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${c.description || 'لا يوجد وصف متاح.'}</p>
                            </div>
                        </div>
                        <div style="padding: 12px 16px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; background: #f8fafc;">
                            <strong style="color: #072b6b; font-size: 16px; font-weight: 900;">${c.price || '150'} ج.م</strong>
                            <a href="courses.html" style="background: #072b6b; color: white; border: none; padding: 6px 14px; border-radius: 8px; font-weight: 800; font-size: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">تعديل الكورس ✏️</a>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // Logout Handler
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("userRole");
            localStorage.removeItem("teacherLoggedIn");
            window.location.href = "teacher-login.html";
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