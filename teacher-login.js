// ==========================================
// ALMAHER MATH PLATFORM
// LOGIN SYSTEM
// SUPABASE AUTHENTICATION
// ==========================================


// ==========================================
// SUPABASE CONFIG
// ==========================================

const SUPABASE_URL =
    "https://qvjqwbwlayswinivmyhm.supabase.co/rest/v1/";

const SUPABASE_ANON_KEY =
    "sb_publishable_TZbE2TX9Ue5mWMLK_sSUdA_yi19bx_7";


// ==========================================
// CREATE SUPABASE CLIENT
// ==========================================

const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ==========================================
// ELEMENTS
// ==========================================

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

const rememberInput =
    document.getElementById("remember");


// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(text, type = "error") {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = text;

    loginMessage.className =
        "auth-message " + type;
}


// ==========================================
// CLEAR MESSAGE
// ==========================================

function clearMessage() {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = "";

    loginMessage.className =
        "auth-message";
}


// ==========================================
// LOADING STATE
// ==========================================

function setLoading(isLoading) {

    if (!loginButton) {
        return;
    }

    loginButton.disabled =
        isLoading;

    if (isLoading) {

        loginButton.textContent =
            "جاري تسجيل الدخول...";

    } else {

        loginButton.textContent =
            "تسجيل الدخول";

    }
}


// ==========================================
// CHECK EMAIL
// ==========================================

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            clearMessage();


            // ==================================
            // GET VALUES
            // ==================================

            const email =
                emailInput.value.trim().toLowerCase();

            const password =
                passwordInput.value;


            // ==================================
            // VALIDATION
            // ==================================

            if (!email) {

                showMessage(
                    "من فضلك اكتب البريد الإلكتروني."
                );

                emailInput.focus();

                return;
            }


            if (!isValidEmail(email)) {

                showMessage(
                    "من فضلك اكتب بريدًا إلكترونيًا صحيحًا."
                );

                emailInput.focus();

                return;
            }


            if (!password) {

                showMessage(
                    "من فضلك اكتب كلمة المرور."
                );

                passwordInput.focus();

                return;
            }


            if (password.length < 6) {

                showMessage(
                    "كلمة المرور يجب أن تكون 6 أحرف على الأقل."
                );

                passwordInput.focus();

                return;
            }


            // ==================================
            // START LOADING
            // ==================================

            setLoading(true);

            // ==================================
            // TEACHER DIRECT CHECK
            // ==================================
            const TEACHER_EMAIL = "elmaher2027@math.com";
            const TEACHER_PASSWORD = "MaHeR#2027";

            if (
                email === TEACHER_EMAIL.toLowerCase() &&
                password === TEACHER_PASSWORD
            ) {
                localStorage.setItem("userRole", "teacher");
                localStorage.setItem("userEmail", email);
                localStorage.setItem("userId", "teacher_master_id");

                showMessage("تم تسجيل الدخول كمدرس بنجاح ✅", "success");

                setTimeout(function () {
                    window.location.href = "dashboard.html";
                }, 600);

                return;
            } else if (email === TEACHER_EMAIL.toLowerCase() && password !== TEACHER_PASSWORD) {
                setLoading(false);
                showMessage("كلمة المرور الخاصة بالمدرس غير صحيحة ❌", "error");
                return;
            }

            try {

                // ==================================
                // SUPABASE LOGIN FOR STUDENTS
                // ==================================

                const {
                    data,
                    error
                } = await db.auth.signInWithPassword({

                    email: email,

                    password: password

                });


                // ==================================
                // LOGIN ERROR
                // ==================================

                if (error) {

                    console.error(
                        "LOGIN ERROR:",
                        error
                    );

                    showMessage(
                        "البريد الإلكتروني أو كلمة المرور غير صحيحة."
                    );

                    return;
                }


                // ==================================
                // CHECK USER
                // ==================================

                if (!data || !data.user) {

                    showMessage(
                        "تعذر تسجيل الدخول، حاول مرة أخرى."
                    );

                    return;
                }


                const user =
                    data.user;


                // ==================================
                // SAVE LOGIN INFO
                // ==================================

                if (rememberInput.checked) {

                    localStorage.setItem(
                        "rememberLogin",
                        "true"
                    );

                } else {

                    localStorage.removeItem(
                        "rememberLogin"
                    );

                }


                // ==================================
                // CHECK IF TEACHER
                // ==================================

                /*
                    ضع إيميل المدرس هنا
                */

                const TEACHER_EMAIL = "elmaher2027@math.com";
                const TEACHER_PASSWORD = "MaHeR#2027";

                if (
                    email === TEACHER_EMAIL.toLowerCase() &&
                    password === TEACHER_PASSWORD
                ) {
                    // TEACHER Direct Bypass & Local Session
                    localStorage.setItem("userRole", "teacher");
                    localStorage.setItem("userEmail", email);
                    localStorage.setItem("userId", "teacher_master_id");

                    showMessage("تم تسجيل الدخول كمدرس بنجاح ✅", "success");

                    setTimeout(function () {
                        window.location.href = "dashboard.html";
                    }, 700);

                    return;
                } else if (email === TEACHER_EMAIL.toLowerCase() && password !== TEACHER_PASSWORD) {
                    showMessage("كلمة المرور الخاصة بالمدرس غير صحيحة ❌");
                    return;
                }


                // ==================================
                // STUDENT
                // ==================================

                const {
                    data: student,
                    error: studentError
                } = await db
                    .from("students")
                    .select(`
                        id,
                        student_code,
                        full_name,
                        email
                    `)
                    .eq(
                        "id",
                        user.id
                    )
                    .maybeSingle();


                // ==================================
                // STUDENT QUERY ERROR
                // ==================================

                if (studentError) {

                    console.error(
                        "STUDENT QUERY ERROR:",
                        studentError
                    );

                    await db.auth.signOut();

                    showMessage(
                        "حدث خطأ أثناء تحميل بيانات الطالب."
                    );

                    return;
                }


                // ==================================
                // STUDENT NOT FOUND
                // ==================================

                if (!student) {

                    await db.auth.signOut();

                    showMessage(
                        "هذا الحساب غير مرتبط بحساب طالب."
                    );

                    return;
                }


                // ==================================
                // SAVE STUDENT INFO
                // ==================================

                localStorage.setItem(
                    "userRole",
                    "student"
                );

                localStorage.setItem(
                    "userEmail",
                    student.email
                );

                localStorage.setItem(
                    "studentCode",
                    student.student_code
                );

                localStorage.setItem(
                    "studentName",
                    student.full_name
                );

                localStorage.setItem(
                    "userId",
                    user.id
                );


                // ==================================
                // SUCCESS
                // ==================================

                showMessage(
                    `مرحبًا ${student.full_name} 👋
جاري الدخول إلى المنصة ...`,
                    "success"
                );


                // ==================================
                // REDIRECT STUDENT
                // ==================================

                setTimeout(
                    function () {

                        window.location.href =
                            "index.html";

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "LOGIN SYSTEM ERROR:",
                    error
                );


                showMessage(
                    "حدث خطأ غير متوقع. حاول مرة أخرى."
                );


            } finally {

                setLoading(false);

            }

        }
    );

}