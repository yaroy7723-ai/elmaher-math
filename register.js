// =========================================================
// ALMAHER MATH PLATFORM - REGISTER SYSTEM (NAME & GRADE)
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("studentRegisterForm");
    const fullNameInput = document.getElementById("fullName");
    const gradeSelect = document.getElementById("studentGrade");
    const message = document.getElementById("registerMessage");

    if (!registerForm) return;

    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const fullName = fullNameInput.value.trim();
        const grade = gradeSelect.value;

        if (!fullName) {
            alert("من فضلك اكتب اسمك بالكامل.");
            return;
        }

        if (!grade) {
            alert("من فضلك اختر الصف الدراسي الخاص بك.");
            return;
        }

        // Generate student code and unified email
        const studentCode = Math.floor(100000 + Math.random() * 900000).toString();
        const studentEmail = `${studentCode}@almahermath.com`;

        // Save student account
        const studentAccounts = JSON.parse(localStorage.getItem('studentAccounts')) || [];
        const newAccount = {
            id: Date.now(),
            fullName: fullName,
            grade: grade,
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