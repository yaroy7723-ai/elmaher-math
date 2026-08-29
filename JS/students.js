// ==========================================
// EL MAHER - STUDENTS MANAGEMENT SYSTEM
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
    const studentsTable = document.getElementById("studentsTable");
    const studentsTbody = document.getElementById("studentsTbody");
    const emptyState = document.getElementById("emptyState");
    const studentsCount = document.getElementById("studentsCount");
    const searchInput = document.getElementById("searchInput");

    let currentEditingCode = null;

    function renderStudents(list) {
        if (!studentsTbody) return;

        if (list.length === 0) {
            emptyState.style.display = "block";
            studentsTable.style.display = "none";
            if (studentsCount) studentsCount.textContent = "0";
            return;
        }

        emptyState.style.display = "none";
        studentsTable.style.display = "table";
        if (studentsCount) studentsCount.textContent = list.length;

        studentsTbody.innerHTML = list.map(student => {
            const studentSubs = student.subscriptions || [];
            return `
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 14px; font-weight: 800; color: #072b6b; font-size: 15px;">#${student.code}</td>
                <td style="padding: 14px; font-weight: 700; color: #0f172a;">${student.name}</td>
                <td style="padding: 14px; font-weight: 700; color: #fb8500;">${student.grade || 'غير محدد'}</td>
                <td style="padding: 14px; color: #0d47a1; font-weight: 700;">${student.email}</td>
                <td style="padding: 14px; font-weight: 800; color: #10b981; direction: ltr; text-align: right;">${student.phone || 'غير محدد'}</td>
                <td style="padding: 14px; font-weight: 700; color: #64748b;">${student.password || '••••••••'}</td>
                <td style="padding: 14px; color: #64748b; font-weight: 600;">${student.date}</td>
                <td style="padding: 14px; text-align: center;">
                    <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="openCourseActivationModal('${student.code}')" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 800; font-size: 12px; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 4px;">⚡ تفعيل الكورسات (${studentSubs.length})</button>
                        <button onclick="openEditStudentModal('${student.code}')" style="background: #0d47a1; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 800; font-size: 12px; cursor: pointer; font-family: inherit;">✏️ تعديل</button>
                        <button onclick="deleteStudent('${student.code}')" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 800; font-size: 12px; cursor: pointer; font-family: inherit;">🗑️ حذف</button>
                    </div>
                </td>
            </tr>
        `}).join('');
    }

    // Refresh function
    window.refreshStudents = function() {
        let accounts = JSON.parse(localStorage.getItem("studentAccounts")) || [];
        let studentsList = accounts.map(acc => ({
            code: acc.studentCode || 'N/A',
            name: acc.fullName || 'طالب جديد',
            grade: acc.grade || 'غير محدد',
            email: acc.email || 'لا يوجد بريد',
            phone: acc.phone || 'غير محدد',
            password: acc.password || '••••••••',
            subscriptions: acc.subscriptions || [],
            date: new Date(acc.createdAt || Date.now()).toLocaleDateString('ar-EG')
        }));
        renderStudents(studentsList);
    };

    // Initial Render
    refreshStudents();

    let activeTargetStudentCode = null;

    window.openGlobalActivationModal = function(preselectedCode = null) {
        let courses = JSON.parse(localStorage.getItem("courses")) || [];
        let accounts = JSON.parse(localStorage.getItem("studentAccounts")) || [];

        const selectCourse = document.getElementById("selectActivationCourse");
        const selectStudent = document.getElementById("selectActivationStudent");
        const studentContainer = document.getElementById("studentSelectionContainer");
        const lockedDisplay = document.getElementById("singleStudentLockedDisplay");
        const lockedText = document.getElementById("lockedStudentText");
        const infoHeader = document.getElementById("activeTargetStudentInfo");

        if (courses.length === 0) {
            alert("⚠️ لا توجد كورسات مضافة حالياً في المنصة. يرجى إضافة كورس أولاً من صفحة 'إدارة الكورسات'!");
            return;
        }

        if (accounts.length === 0) {
            alert("⚠️ لا يوجد طلاب مسجلين في المنصة حالياً لتنشيط الكورسات لهم!");
            return;
        }

        activeTargetStudentCode = preselectedCode;

        if (preselectedCode) {
            // Mode A: Opened from student row button -> Lock Student Choice
            const targetStudent = accounts.find(a => a.studentCode === preselectedCode);
            if (targetStudent) {
                if (studentContainer) studentContainer.style.display = "none";
                if (lockedDisplay) lockedDisplay.style.display = "block";
                if (lockedText) lockedText.textContent = `#${targetStudent.studentCode} - ${targetStudent.fullName} (${targetStudent.grade || ''})`;
                if (infoHeader) infoHeader.textContent = targetStudent.fullName;
                if (selectStudent) selectStudent.value = preselectedCode;
            }
        } else {
            // Mode B: Opened from top toolbar button -> Allow choosing both student and course
            if (studentContainer) studentContainer.style.display = "block";
            if (lockedDisplay) lockedDisplay.style.display = "none";
            if (infoHeader) infoHeader.textContent = "جميع الطلاب المسجلين";

            // Populate Students dropdown (Name + Code)
            selectStudent.innerHTML = accounts.map(a => 
                `<option value="${a.studentCode}">#${a.studentCode} - ${a.fullName} (${a.grade || ''})</option>`
            ).join('');
        }

        // Populate Courses dropdown
        selectCourse.innerHTML = courses.map(c => 
            `<option value="${c.id}">${c.name} (${c.level || ''} - ${c.price || '150'} ج.م)</option>`
        ).join('');

        document.getElementById("globalActivationModal").style.display = "flex";
    };

    window.closeGlobalActivationModal = function() {
        document.getElementById("globalActivationModal").style.display = "none";
        activeTargetStudentCode = null;
    };

    // Alias for row button click
    window.openCourseActivationModal = function(code) {
        openGlobalActivationModal(code);
    };

    // Handle Deactivation Functionality
    window.handleDeactivation = function() {
        const courseId = document.getElementById("selectActivationCourse").value;
        const studentCode = activeTargetStudentCode || document.getElementById("selectActivationStudent").value;

        if (!courseId || !studentCode) {
            alert("من فضلك اختر الكورس والطالب أولاً!");
            return;
        }

        let accounts = JSON.parse(localStorage.getItem("studentAccounts")) || [];
        let idx = accounts.findIndex(a => a.studentCode === studentCode);

        if (idx !== -1) {
            if (!accounts[idx].subscriptions) accounts[idx].subscriptions = [];
            const subIdx = accounts[idx].subscriptions.indexOf(courseId.toString());

            if (subIdx !== -1) {
                accounts[idx].subscriptions.splice(subIdx, 1);
                localStorage.setItem("studentAccounts", JSON.stringify(accounts));
                refreshStudents();
                closeGlobalActivationModal();
                alert(`🔴 تم إلغاء تنشيط وقفل الكورس بنجاح للطالب (#${studentCode})!`);
            } else {
                alert(`⚠️ هذا الكورس غير مفعّل أساساً لهذا الطالب!`);
            }
        }
    };

    // Handle Global Activation Form submit
    const globalForm = document.getElementById("globalActivationForm");
    if (globalForm) {
        globalForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const courseId = document.getElementById("selectActivationCourse").value;
            const studentCode = activeTargetStudentCode || document.getElementById("selectActivationStudent").value;

            if (!courseId || !studentCode) {
                alert("من فضلك اختر الكورس والطالب أولاً!");
                return;
            }

            let accounts = JSON.parse(localStorage.getItem("studentAccounts")) || [];
            let idx = accounts.findIndex(a => a.studentCode === studentCode);

            if (idx !== -1) {
                if (!accounts[idx].subscriptions) accounts[idx].subscriptions = [];
                
                if (!accounts[idx].subscriptions.includes(courseId.toString())) {
                    accounts[idx].subscriptions.push(courseId.toString());
                    localStorage.setItem("studentAccounts", JSON.stringify(accounts));
                    refreshStudents();
                    closeGlobalActivationModal();
                    alert(`✅ تم تنشيط وتفعيل الكورس بنجاح للطالب (#${studentCode})!\nيمكن للطالب الآن مشاهدة المحتوى وتنزيل المذكرات فوراً 🚀`);
                } else {
                    alert(`⚠️ الكورس مفعّل ومُنشّط بالفعل لهذا الطالب مسبقاً!`);
                }
            }
        });
    }

    window.openEditStudentModal = function(code) {
        currentEditingCode = code;
        let accounts = JSON.parse(localStorage.getItem("studentAccounts")) || [];
        let student = accounts.find(a => a.studentCode === code);
        if (student) {
            document.getElementById("editStudentName").value = student.fullName || '';
            document.getElementById("editStudentGrade").value = student.grade || 'الصف الأول الثانوي';
            document.getElementById("editStudentModal").style.display = "flex";
        }
    };

    window.closeEditStudentModal = function() {
        document.getElementById("editStudentModal").style.display = "none";
        currentEditingCode = null;
    };

    window.deleteStudent = function(code) {
        if (confirm("هل أنت تأكد من رغبتك في حذف هذا الطالب نهائياً من المنصة؟ ⚠️")) {
            let accounts = JSON.parse(localStorage.getItem("studentAccounts")) || [];
            accounts = accounts.filter(a => a.studentCode !== code);
            localStorage.setItem("studentAccounts", JSON.stringify(accounts));
            refreshStudents();
            alert("تم حذف الطالب بنجاح! 🗑️");
        }
    };

    const editForm = document.getElementById("editStudentForm");
    if (editForm) {
        editForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!currentEditingCode) return;
            const newName = document.getElementById("editStudentName").value.trim();
            const newGrade = document.getElementById("editStudentGrade").value;

            let accounts = JSON.parse(localStorage.getItem("studentAccounts")) || [];
            let idx = accounts.findIndex(a => a.studentCode === currentEditingCode);
            if (idx !== -1) {
                accounts[idx].fullName = newName;
                accounts[idx].grade = newGrade;
                localStorage.setItem("studentAccounts", JSON.stringify(accounts));
                closeEditStudentModal();
                refreshStudents();
                alert("تم تحديث بيانات الطالب بنجاح! 💾");
            }
        });
    }

    refreshStudents();

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            let accounts = JSON.parse(localStorage.getItem("studentAccounts")) || [];
            let studentsList = accounts.map(acc => ({
                code: acc.studentCode || 'N/A',
                name: acc.fullName || 'طالب جديد',
                grade: acc.grade || 'غير محدد',
                phone: acc.phone || 'غير محدد',
                email: acc.email || 'لا يوجد بريد',
                subscriptions: acc.subscriptions || [],
                date: new Date(acc.createdAt || Date.now()).toLocaleDateString('ar-EG')
            }));
            const filtered = studentsList.filter(s => 
                (s.name && s.name.toLowerCase().includes(query)) ||
                (s.code && s.code.toLowerCase().includes(query)) ||
                (s.phone && s.phone.toLowerCase().includes(query)) ||
                (s.email && s.email.toLowerCase().includes(query)) ||
                (s.grade && s.grade.toLowerCase().includes(query))
            );
            renderStudents(filtered);
        });
    }

    // Export Students list to Excel (Clean CSV with UTF-8 BOM for perfect Excel column separation)
    const exportBtn = document.getElementById("exportExcelBtn");
    if (exportBtn) {
        exportBtn.addEventListener("click", () => {
            let accounts = JSON.parse(localStorage.getItem("studentAccounts")) || [];
            let courses = JSON.parse(localStorage.getItem("courses")) || [];

            if (accounts.length === 0) {
                alert("لا يوجد طلاب مسجلين لتصديرهم في شيت Excel!");
                return;
            }

            // UTF-8 BOM byte sequence so Excel auto-detects Arabic language & clean columns
            let csvContent = "\uFEFF";
            
            // Header Row
            csvContent += '"كود الطالب","اسم الطالب بالكامل","الصف الدراسي","البريد الإلكتروني الموحد","رقم الهاتف","كلمة السر","الكورسات المفعلة","تاريخ التسجيل"\n';

            // Data Rows
            accounts.forEach(s => {
                const code = s.studentCode ? `="${s.studentCode}"` : '"N/A"';
                const name = `"${(s.fullName || 'طالب جديد').replace(/"/g, '""')}"`;
                const grade = `"${(s.grade || 'غير محدد').replace(/"/g, '""')}"`;
                const email = `"${(s.email || 'لا يوجد بريد').replace(/"/g, '""')}"`;
                const phone = s.phone ? `="${s.phone}"` : '"غير محدد"';
                const password = `"${(s.password || '••••••••').replace(/"/g, '""')}"`;

                // Get Subscribed Course Names
                const subIds = s.subscriptions || [];
                const subNames = courses.filter(c => subIds.includes(c.id.toString())).map(c => c.name).join(" - ");
                const coursesStr = subNames ? `"${subNames.replace(/"/g, '""')}"` : '"لا يوجد كورسات مفعّلة"';

                const date = `"${new Date(s.createdAt || Date.now()).toLocaleDateString('ar-EG')}"`;

                csvContent += `${code},${name},${grade},${email},${phone},${password},${coursesStr},${date}\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `سجل_طلاب_منصة_الماهر_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Admin Mobile Toggle Event Listener
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
