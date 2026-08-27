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

        studentsTbody.innerHTML = list.map(student => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 14px; font-weight: 800; color: #072b6b; font-size: 15px;">#${student.code}</td>
                <td style="padding: 14px; font-weight: 700; color: #0f172a;">${student.name}</td>
                <td style="padding: 14px; font-weight: 700; color: #fb8500;">${student.grade || 'غير محدد'}</td>
                <td style="padding: 14px; color: #0d47a1; font-weight: 700;">${student.email}</td>
                <td style="padding: 14px; color: #64748b; font-weight: 600;">${student.date}</td>
                <td style="padding: 14px; text-align: center;">
                    <div style="display: flex; gap: 8px; justify-content: center;">
                        <button onclick="openEditStudentModal('${student.code}')" style="background: #0d47a1; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 800; font-size: 12px; cursor: pointer; font-family: inherit;">✏️ تعديل</button>
                        <button onclick="deleteStudent('${student.code}')" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 800; font-size: 12px; cursor: pointer; font-family: inherit;">🗑️ حذف</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Refresh function
    window.refreshStudents = function() {
        let accounts = JSON.parse(localStorage.getItem("studentAccounts")) || [];
        let studentsList = accounts.map(acc => ({
            code: acc.studentCode || 'N/A',
            name: acc.fullName || 'طالب جديد',
            grade: acc.grade || 'غير محدد',
            email: acc.email || 'لا يوجد بريد',
            date: new Date(acc.createdAt || Date.now()).toLocaleDateString('ar-EG')
        }));
        renderStudents(studentsList);
    };

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
                email: acc.email || 'لا يوجد بريد',
                date: new Date(acc.createdAt || Date.now()).toLocaleDateString('ar-EG')
            }));
            const filtered = studentsList.filter(s => 
                (s.name && s.name.toLowerCase().includes(query)) ||
                (s.code && s.code.toLowerCase().includes(query)) ||
                (s.email && s.email.toLowerCase().includes(query)) ||
                (s.grade && s.grade.toLowerCase().includes(query))
            );
            renderStudents(filtered);
        });
    }

    // Export Students list to Excel (XLS / Tab-Separated format)
    const exportBtn = document.getElementById("exportExcelBtn");
    if (exportBtn) {
        exportBtn.addEventListener("click", () => {
            let accounts = JSON.parse(localStorage.getItem("studentAccounts")) || [];
            if (accounts.length === 0) {
                alert("لا يوجد طلاب مسجلين لتصديرهم في شيت Excel!");
                return;
            }

            // UTF-8 BOM + Tab-delimited format guarantees Excel auto-separates columns perfectly!
            let excelContent = "\uFEFFكود الطالب\tاسم الطالب\tالصف الدراسي\tالبريد الإلكتروني الموحد\tتاريخ التسجيل\n";
            accounts.forEach(s => {
                const code = s.studentCode || 'N/A';
                const name = s.fullName || 'طالب جديد';
                const grade = s.grade || 'غير محدد';
                const email = s.email || 'لا يوجد بريد';
                const date = new Date(s.createdAt || Date.now()).toLocaleDateString('ar-EG');
                
                excelContent += `${code}\t${name}\t${grade}\t${email}\t${date}\n`;
            });

            const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `سجل_طلاب_منصة_الماهر_${new Date().toISOString().slice(0,10)}.xls`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});
