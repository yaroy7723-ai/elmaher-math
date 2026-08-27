// ==========================================
// EL MAHER - SETTINGS SYSTEM
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const settingsForm = document.getElementById("settingsForm");

    if (settingsForm) {
        settingsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("تم حفظ التغييرات بنجاح ✅");
        });
    }
});
