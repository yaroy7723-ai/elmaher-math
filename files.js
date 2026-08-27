// ==========================================
// CHECK LOGIN
// ==========================================

const loggedIn =
    localStorage.getItem("teacherLoggedIn");


if (loggedIn !== "true") {

    window.location.href =
        "login.html";

}


// ==========================================
// ELEMENTS
// ==========================================

const filesGrid =
    document.getElementById("filesGrid");

const emptyState =
    document.getElementById("emptyState");

const addFileBtn =
    document.getElementById("addFileBtn");

const emptyAddBtn =
    document.getElementById("emptyAddBtn");

const searchInput =
    document.getElementById("searchInput");


// ==========================================
// MODAL ELEMENTS
// ==========================================

const modal =
    document.getElementById("fileModal");

const fileForm =
    document.getElementById("fileForm");

const closeModalBtn =
    document.getElementById("closeModal");

const cancelModalBtn =
    document.getElementById("cancelModal");

const modalTitle =
    document.getElementById("modalTitle");


// ==========================================
// FORM ELEMENTS
// ==========================================

const fileTitle =
    document.getElementById("fileTitle");

const fileCourse =
    document.getElementById("fileCourse");

const fileLesson =
    document.getElementById("fileLesson");

const fileInput =
    document.getElementById("fileInput");

const uploadArea =
    document.getElementById("uploadArea");

const selectedFile =
    document.getElementById("selectedFile");

const fileDescription =
    document.getElementById("fileDescription");

const fileStatus =
    document.getElementById("fileStatus");


// ==========================================
// STATISTICS
// ==========================================

const totalFiles =
    document.getElementById("totalFiles");

const publishedFiles =
    document.getElementById("publishedFiles");

const draftFiles =
    document.getElementById("draftFiles");


// ==========================================
// DATA
// ==========================================

let files =
    JSON.parse(
        localStorage.getItem("files")
    ) || [];


let courses =
    JSON.parse(
        localStorage.getItem("courses")
    ) || [];


let editingFileId = null;


// ==========================================
// SAVE FILES
// ==========================================

function saveFiles() {

    localStorage.setItem(
        "files",
        JSON.stringify(files)
    );

}


// ==========================================
// LOAD COURSES
// ==========================================

function loadCourses() {
    if (!fileCourse) return;

    fileCourse.innerHTML = `
        <option value="">
            اختر الكورس التابع له الملف
        </option>
    `;


    courses.forEach(course => {

        const option =
            document.createElement("option");


        option.value =
            course.id;


        option.textContent = `${course.name || course.title || "كورس بدون اسم"} (${course.level || ''})`;


        fileCourse.appendChild(
            option
        );

    });

}


// ==========================================
// OPEN ADD MODAL
// ==========================================

function openAddModal() {

    editingFileId = null;


    modalTitle.textContent =
        "إضافة ملف جديد";


    fileForm.reset();


    selectedFile.textContent =
        "لم يتم اختيار ملف";


    loadCourses();


    modal.classList.add("show");


    document.body.style.overflow =
        "hidden";


    setTimeout(() => {

        fileTitle.focus();

    }, 100);

}


// ==========================================
// OPEN EDIT MODAL
// ==========================================

function openEditModal(id) {

    const file =
        files.find(
            item =>
                item.id === id
        );


    if (!file) return;


    editingFileId = id;


    modalTitle.textContent =
        "تعديل الملف";


    loadCourses();


    fileTitle.value =
        file.title || "";


    fileCourse.value =
        file.courseId || "";


    fileLesson.value =
        file.lessonNumber || "";


    fileDescription.value =
        file.description || "";


    fileStatus.value =
        file.status || "published";


    selectedFile.textContent =
        file.fileName
            ? `الملف الحالي: ${file.fileName}`
            : "لم يتم اختيار ملف جديد";


    modal.classList.add("show");


    document.body.style.overflow =
        "hidden";

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeModal() {

    modal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";


    editingFileId = null;


    fileForm.reset();


    selectedFile.textContent =
        "لم يتم اختيار ملف";

}


// ==========================================
// BUTTON EVENTS
// ==========================================

addFileBtn.addEventListener(
    "click",
    openAddModal
);


emptyAddBtn.addEventListener(
    "click",
    openAddModal
);


closeModalBtn.addEventListener(
    "click",
    closeModal
);


cancelModalBtn.addEventListener(
    "click",
    closeModal
);


// ==========================================
// CLOSE OUTSIDE MODAL
// ==========================================

modal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === modal
        ) {

            closeModal();

        }

    }
);


// ==========================================
// FILE SELECT
// ==========================================

fileInput.addEventListener(
    "change",
    function() {

        if (
            !this.files ||
            !this.files.length
        ) {

            selectedFile.textContent =
                "لم يتم اختيار ملف";

            return;

        }


        const file =
            this.files[0];


        selectedFile.textContent =
            `تم اختيار: ${file.name}`;

    }
);


// ==========================================
// DRAG OVER
// ==========================================

uploadArea.addEventListener(
    "dragover",
    function(event) {

        event.preventDefault();


        uploadArea.classList.add(
            "dragover"
        );

    }
);


// ==========================================
// DRAG LEAVE
// ==========================================

uploadArea.addEventListener(
    "dragleave",
    function() {

        uploadArea.classList.remove(
            "dragover"
        );

    }
);


// ==========================================
// DROP
// ==========================================

uploadArea.addEventListener(
    "drop",
    function(event) {

        event.preventDefault();


        uploadArea.classList.remove(
            "dragover"
        );


        const droppedFiles =
            event.dataTransfer.files;


        if (
            !droppedFiles ||
            !droppedFiles.length
        ) {

            return;

        }


        fileInput.files =
            droppedFiles;


        const file =
            droppedFiles[0];


        selectedFile.textContent =
            `تم اختيار: ${file.name}`;

    }
);


// ==========================================
// SAVE FILE
// ==========================================

fileForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const title =
            fileTitle.value.trim();


        const courseId =
            fileCourse.value;


        const lessonNumber =
            fileLesson.value.trim();


        const description =
            fileDescription.value.trim();


        const status =
            fileStatus.value;


        // ==================================
        // VALIDATION
        // ==================================

        if (!title) {

            alert(
                "من فضلك اكتب اسم الملف."
            );


            fileTitle.focus();


            return;

        }


        if (!courseId) {

            alert(
                "من فضلك اختر الكورس."
            );


            fileCourse.focus();


            return;

        }


        // ==================================
        // FILE
        // ==================================

        let selectedFileObject = null;


        if (
            fileInput.files &&
            fileInput.files.length
        ) {

            selectedFileObject =
                fileInput.files[0];

        }


        // ==================================
        // EDIT
        // ==================================

        if (editingFileId) {

            const index =
                files.findIndex(
                    item =>
                        item.id ===
                        editingFileId
                );


            if (index !== -1) {

                const oldFile =
                    files[index];


                files[index] = {

                    ...oldFile,

                    title,

                    courseId,

                    lessonNumber,

                    description,

                    status,

                    fileName:
                        selectedFileObject
                            ? selectedFileObject.name
                            : oldFile.fileName || "",

                    fileType:
                        selectedFileObject
                            ? selectedFileObject.type
                            : oldFile.fileType || "",

                    fileSize:
                        selectedFileObject
                            ? selectedFileObject.size
                            : oldFile.fileSize || 0

                };

            }


            saveFiles();


            closeModal();


            renderFiles();


            alert(
                "تم تعديل الملف بنجاح ✅"
            );


            return;

        }


        // ==================================
        // ADD
        // ==================================

        if (!selectedFileObject) {

            alert(
                "من فضلك اختر ملفًا أولًا."
            );


            return;

        }


        const newFile = {

            id:
                Date.now().toString(),

            title,

            courseId,

            lessonNumber,

            description,

            status,

            fileName:
                selectedFileObject.name,

            fileType:
                selectedFileObject.type,

            fileSize:
                selectedFileObject.size,

            createdAt:
                new Date().toISOString()

        };


        files.unshift(
            newFile
        );


        saveFiles();


        closeModal();


        renderFiles();


        alert(
            "تم إضافة الملف بنجاح ✅"
        );

    }
);


// ==========================================
// GET COURSE NAME
// ==========================================

function getCourseName(courseId) {

    const course =
        courses.find(
            item =>
                item.id === courseId
        );


    if (!course) {

        return "كورس غير معروف";

    }


    return (
        course.name ||
        course.title ||
        "كورس بدون اسم"
    );

}


// ==========================================
// GET FILE SIZE
// ==========================================

function formatFileSize(bytes) {

    if (!bytes) {

        return "حجم غير معروف";

    }


    const sizes = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        Math.round(
            bytes /
            Math.pow(1024, index) *
            100
        ) / 100
    ) +
    " " +
    sizes[index];

}


// ==========================================
// GET FILE ICON
// ==========================================

function getFileIcon(fileName) {

    if (!fileName) {

        return "▤";

    }


    const extension =
        fileName
            .split(".")
            .pop()
            .toLowerCase();


    if (extension === "pdf") {

        return "PDF";

    }


    if (
        extension === "doc" ||
        extension === "docx"
    ) {

        return "DOC";

    }


    if (
        extension === "xls" ||
        extension === "xlsx"
    ) {

        return "XLS";

    }


    if (
        extension === "ppt" ||
        extension === "pptx"
    ) {

        return "PPT";

    }


    if (
        extension === "zip" ||
        extension === "rar"
    ) {

        return "ZIP";

    }


    return "FILE";

}


// ==========================================
// RENDER FILES
// ==========================================

function renderFiles(
    list = files
) {

    filesGrid.innerHTML = "";


    updateStatistics();


    if (list.length === 0) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    list.forEach(file => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "file-card";


        const courseName =
            getCourseName(
                file.courseId
            );


        const statusText =
            file.status === "draft"
                ? "مسودة"
                : "منشور";


        const lessonText =
            file.lessonNumber
                ? `الدرس ${file.lessonNumber}`
                : "ملف تعليمي";


        const icon =
            getFileIcon(
                file.fileName
            );


        card.innerHTML = `

            <div class="file-preview">

                <div class="file-icon">
                    ${escapeHTML(icon)}
                </div>


                <span
                    class="
                        file-status
                        ${
                            file.status === "draft"
                                ? "draft"
                                : ""
                        }
                    "
                >
                    ${statusText}
                </span>

            </div>


            <div class="file-content">

                <div class="file-course">
                    ${escapeHTML(courseName)}
                </div>


                <h3>
                    ${escapeHTML(file.title)}
                </h3>


                <p class="file-description">

                    ${
                        escapeHTML(
                            file.description ||
                            "لا يوجد وصف للملف."
                        )
                    }

                </p>


                <div class="file-meta">

                    <span>
                        ${escapeHTML(lessonText)}
                    </span>

                    <span>
                        ${formatFileSize(
                            file.fileSize
                        )}
                    </span>

                </div>


                <div class="file-actions">

                    <button
                        class="download-btn"
                        onclick="downloadFile('${file.id}')"
                    >
                        تحميل
                    </button>


                    <button
                        class="edit-btn"
                        onclick="openEditModal('${file.id}')"
                    >
                        تعديل
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteFile('${file.id}')"
                    >
                        حذف
                    </button>

                </div>

            </div>

        `;


        filesGrid.appendChild(
            card
        );

    });

}


// ==========================================
// DOWNLOAD FILE
// ==========================================

function downloadFile(id) {

    const file =
        files.find(
            item =>
                item.id === id
        );


    if (!file) return;


    /*
        مهم:
        حاليًا نحن نخزن بيانات الملف فقط
        في localStorage وليس الملف نفسه.

        لذلك لا يمكن للمتصفح تحميل الملف
        بعد إعادة تحميل الصفحة إلا لو استخدمنا
        Storage مثل Supabase Storage.

        هنظهر رسالة مؤقتة بدل ما يحصل خطأ.
    */

    alert(
        `الملف: ${file.fileName}\n\nرفع الملفات فعليًا يحتاج ربطه بـ Storage.`
    );

}


// ==========================================
// DELETE FILE
// ==========================================

function deleteFile(id) {

    const file =
        files.find(
            item =>
                item.id === id
        );


    if (!file) return;


    const confirmed =
        confirm(
            `هل أنت متأكد من حذف "${file.title}"؟`
        );


    if (!confirmed) return;


    files =
        files.filter(
            item =>
                item.id !== id
        );


    saveFiles();


    renderFiles();


    alert(
        "تم حذف الملف بنجاح 🗑️"
    );

}


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    function() {

        const search =
            this.value
                .trim()
                .toLowerCase();


        if (!search) {

            renderFiles();

            return;

        }


        const filtered =
            files.filter(file => {

                const courseName =
                    getCourseName(
                        file.courseId
                    );


                return (

                    (
                        file.title ||
                        ""
                    )
                    .toLowerCase()
                    .includes(search)


                    ||


                    courseName
                        .toLowerCase()
                        .includes(search)


                    ||


                    (
                        file.description ||
                        ""
                    )
                    .toLowerCase()
                    .includes(search)


                    ||


                    (
                        file.fileName ||
                        ""
                    )
                    .toLowerCase()
                    .includes(search)

                );

            });


        renderFiles(
            filtered
        );

    }
);


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    totalFiles.textContent =
        files.length;


    publishedFiles.textContent =
        files.filter(
            file =>
                file.status ===
                "published"
        ).length;


    draftFiles.textContent =
        files.filter(
            file =>
                file.status ===
                "draft"
        ).length;

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        value || "";


    return element.innerHTML;

}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "teacherLoggedIn"
            );


            window.location.href =
                "login.html";

        }
    );

}


// ==========================================
// ESC KEY
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("show")
        ) {

            closeModal();

        }

    }
);


// ==========================================
// INITIALIZE
// ==========================================

loadCourses();

renderFiles();