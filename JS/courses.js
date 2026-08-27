// Auto-set teacher logged in session if accessing directly
if (!localStorage.getItem("teacherLoggedIn")) {
    localStorage.setItem("teacherLoggedIn", "true");
}

let courses = JSON.parse(localStorage.getItem("courses")) || [];
let editingCourseId = null;

function saveCourses() {
    localStorage.setItem("courses", JSON.stringify(courses));
}

function openCourseModal() {
    const modal = document.getElementById("courseFormModal");
    if (modal) modal.style.display = "flex";
}

function closeCourseModal() {
    const modal = document.getElementById("courseFormModal");
    if (modal) modal.style.display = "none";
    editingCourseId = null;
    const form = document.getElementById("courseForm");
    if (form) form.reset();
}

window.openCourseModal = openCourseModal;
window.closeCourseModal = closeCourseModal;

function showAddPage() {
    editingCourseId = null;
    const form = document.getElementById("courseForm");
    if (form) form.reset();

    const title = document.getElementById("formTitle");
    if (title) title.textContent = "إضافة كورس جديد 📚";

    openCourseModal();
}

window.showAddPage = showAddPage;

function openEditCourse(id) {
    const course = courses.find(item => item.id.toString() === id.toString());
    if (!course) return;

    editingCourseId = course.id;

    const title = document.getElementById("formTitle");
    if (title) title.textContent = "تعديل الكورس ✏️";

    if (document.getElementById("courseName")) document.getElementById("courseName").value = course.name || "";
    if (document.getElementById("courseLevel")) document.getElementById("courseLevel").value = course.level || "";
    if (document.getElementById("courseSubject")) document.getElementById("courseSubject").value = course.subject || "الرياضيات العامة";
    if (document.getElementById("courseTerm")) document.getElementById("courseTerm").value = course.term || "الترم الأول";
    if (document.getElementById("courseStatus")) document.getElementById("courseStatus").value = course.status || "published";
    if (document.getElementById("coursePrice")) document.getElementById("coursePrice").value = course.price || "150";
    if (document.getElementById("courseDescription")) document.getElementById("courseDescription").value = course.description || "";
    if (document.getElementById("courseImage")) document.getElementById("courseImage").value = course.image || "";

    openCourseModal();
}

window.openEditCourse = openEditCourse;

function deleteCourse(id) {
    const course = courses.find(item => item.id.toString() === id.toString());
    if (!course) return;

    if (confirm(`هل تريد حذف كورس "${course.name}" نهائياً؟ ⚠️`)) {
        courses = courses.filter(item => item.id.toString() !== id.toString());
        saveCourses();
        renderCourses();
        alert("تم حذف الكورس بنجاح ✅");
    }
}

window.deleteCourse = deleteCourse;

function updateStatistics() {
    const totalEl = document.getElementById("totalCourses");
    const pubEl = document.getElementById("publishedCourses");
    const draftEl = document.getElementById("draftCourses");

    if (totalEl) totalEl.textContent = courses.length;
    if (pubEl) pubEl.textContent = courses.filter(c => c.status === "published" || !c.status).length;
    if (draftEl) draftEl.textContent = courses.filter(c => c.status === "draft").length;
}

function renderCourses(data = courses) {
    const coursesGrid = document.getElementById("coursesGrid");
    const emptyState = document.getElementById("emptyState");
    if (!coursesGrid) return;

    coursesGrid.innerHTML = "";
    updateStatistics();

    if (!data || data.length === 0) {
        if (emptyState) emptyState.style.display = "block";
        coursesGrid.style.display = "none";
        return;
    }

    if (emptyState) emptyState.style.display = "none";
    coursesGrid.style.display = "grid";

    data.forEach(course => {
        const card = document.createElement("article");
        card.className = "course-card";

        const statusText = course.status === "draft" ? "مسودة" : "منشور";
        const imageHTML = course.image ? `<img src="${course.image}" alt="${course.name}" style="width:100%; height:100%; object-fit:cover;">` : '';

        card.innerHTML = `
            <div class="course-image" style="position: relative; height: 180px; overflow: hidden; background: linear-gradient(135deg, #072b6b 0%, #0d47a1 100%);">
                ${imageHTML}
            </div>

            <div class="course-content" style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span class="course-level" style="font-weight: 800; color: var(--gold-dark); font-size: 12px;">${course.subject || 'الرياضيات العامة'}</span>
                    <small style="color: var(--muted); font-weight: 700; font-size: 12px;">${course.level || ''}</small>
                </div>

                <h3 style="font-size: 19px; font-weight: 900; color: var(--blue-dark); margin-bottom: 8px; font-family: inherit;">
                    ${course.name}
                </h3>

                <p class="course-desc" style="font-size: 13px; color: var(--text-light); line-height: 1.5; margin-bottom: 18px; min-height: 40px;">
                    ${course.description || 'لا يوجد وصف للكورس.'}
                </p>

                <div class="course-footer" style="display: flex; gap: 8px; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 14px;">
                    <button type="button" onclick="openEditCourse('${course.id}')" style="background: var(--blue-gradient); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 800; font-size: 12.5px; cursor: pointer; flex: 1; font-family: inherit;">
                        ✏️ تعديل
                    </button>
                    <button type="button" onclick="deleteCourse('${course.id}')" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 800; font-size: 12.5px; cursor: pointer; font-family: inherit;">
                        🗑️ حذف
                    </button>
                </div>
            </div>
        `;

        coursesGrid.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderCourses();

    const courseForm = document.getElementById("courseForm");
    if (courseForm) {
        courseForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const name = document.getElementById("courseName").value.trim();
            const level = document.getElementById("courseLevel").value;
            const subject = document.getElementById("courseSubject") ? document.getElementById("courseSubject").value : "الرياضيات العامة";
            const term = document.getElementById("courseTerm") ? document.getElementById("courseTerm").value : "الترم الأول";
            const status = document.getElementById("courseStatus") ? document.getElementById("courseStatus").value : "published";
            const price = document.getElementById("coursePrice") ? document.getElementById("coursePrice").value : "150";
            const description = document.getElementById("courseDescription").value.trim();
            const courseImageFileInput = document.getElementById("courseImageFile");
            const hiddenImageInput = document.getElementById("courseImage");

            const processSave = (imageSrc) => {
                if (!name || !level) {
                    alert("من فضلك اكتب اسم الكورس واختر المرحلة.");
                    return;
                }

                courses = JSON.parse(localStorage.getItem("courses")) || [];

                if (editingCourseId) {
                    courses = courses.map(course => {
                        if (course.id.toString() === editingCourseId.toString()) {
                            return {
                                ...course,
                                name,
                                level,
                                subject,
                                term,
                                status,
                                price: price || "150",
                                description,
                                image: imageSrc || course.image
                            };
                        }
                        return course;
                    });
                    alert("تم تعديل الكورس بنجاح ✅");
                } else {
                    const newCourse = {
                        id: Date.now().toString(),
                        name,
                        level,
                        subject,
                        term,
                        status,
                        price: price || "150",
                        description,
                        image: imageSrc || "",
                        lessons: 0,
                        students: 0,
                        createdAt: new Date().toISOString()
                    };
                    courses.unshift(newCourse);
                    alert("تم إضافة الكورس بنجاح والمزامنة فوراً مع الصفحة الرئيسية! 🎉");
                }

                saveCourses();
                closeCourseModal();
                renderCourses();
            };

            if (courseImageFileInput && courseImageFileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    processSave(e.target.result);
                };
                reader.readAsDataURL(courseImageFileInput.files[0]);
            } else {
                processSave(hiddenImageInput ? hiddenImageInput.value.trim() : '');
            }
        });
    }

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = courses.filter(c => 
                (c.name && c.name.toLowerCase().includes(query)) ||
                (c.level && c.level.toLowerCase().includes(query)) ||
                (c.subject && c.subject.toLowerCase().includes(query))
            );
            renderCourses(filtered);
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

        document.addEventListener("click", (e) => {
            if (!sidebar.contains(e.target) && !adminToggleBtn.contains(e.target)) {
                sidebar.classList.remove("active");
                adminToggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
});