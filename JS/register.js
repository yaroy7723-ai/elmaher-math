// =========================================================
// ALMAHER MATH PLATFORM - REGISTER SYSTEM (NAME & GRADE)
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("studentRegisterForm");
    const fullNameInput = document.getElementById("fullName");
    const gradeSelect = document.getElementById("studentGrade");
    const phoneInput = document.getElementById("studentPhone");
    const passwordInput = document.getElementById("studentPassword");
    const message = document.getElementById("registerMessage");

    if (!registerForm) return;

    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const fullName = fullNameInput.value.trim();
        const grade = gradeSelect.value;
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';

        if (!fullName) {
            alert("من فضلك اكتب اسمك بالكامل.");
            return;
        }

        if (!grade) {
            alert("من فضلك اختر الصف الدراسي الخاص بك.");
            return;
        }

        if (!phone || phone.length < 10) {
            alert("من فضلك أدخل رقم هاتف صحيح لربط الحساب.");
            return;
        }

        if (!password || password.length < 4) {
            alert("من فضلك ادخل كلمة سر مكونة من 4 أرقام أو حروف على الأقل.");
            return;
        }

        // Check Phone Uniqueness
        const studentAccounts = JSON.parse(localStorage.getItem('studentAccounts')) || [];
        const existingPhone = studentAccounts.find(s => s.phone && s.phone === phone);
        if (existingPhone) {
            alert("❌ رقم الهاتف هذا مسجل بحساب طالب آخر مسبقاً! لا يمكن استخدامه مرة أخرى.");
            return;
        }

        // Generate student code and unified email
        const studentCode = Math.floor(100000 + Math.random() * 900000).toString();
        const studentEmail = `${studentCode}@almahermath.com`;

        // Save student account
        const newAccount = {
            id: Date.now(),
            fullName: fullName,
            grade: grade,
            phone: phone,
            password: password,
            studentCode: studentCode,
            email: studentEmail,
            createdAt: new Date().toISOString()
        };

        studentAccounts.push(newAccount);
        localStorage.setItem('studentAccounts', JSON.stringify(studentAccounts));

        // Set logged-in state
        localStorage.setItem('studentLoggedIn', 'true');
        localStorage.setItem('currentStudent', JSON.stringify(newAccount));

        // Show credentials modal
        document.getElementById('modalStudentCode').textContent = studentCode;
        document.getElementById('modalStudentEmail').textContent = studentEmail;
        document.getElementById('credentialsModal').style.display = 'flex';
    });
});