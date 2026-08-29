// ==========================================
// CHECK LOGIN
// ==========================================

const teacherLoggedIn =
    localStorage.getItem("teacherLoggedIn");

if (teacherLoggedIn !== "true") {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
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


// ==========================================
// ELEMENTS
// ==========================================

const videosGrid = document.getElementById("videosGrid");
const emptyState = document.getElementById("emptyState");

const addVideoBtn = document.getElementById("addVideoBtn");
const emptyAddBtn = document.getElementById("emptyAddBtn");

const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("videoModal");
const videoForm = document.getElementById("videoForm");

const closeModalBtn =
    document.getElementById("closeModal");

const cancelModalBtn =
    document.getElementById("cancelModal");

const videoTitle =
    document.getElementById("videoTitle");

const videoCourse =
    document.getElementById("videoCourse");

const videoLesson =
    document.getElementById("videoLesson");

const videoUrl =
    document.getElementById("videoUrl");

const videoDescription =
    document.getElementById("videoDescription");

const videoStatus =
    document.getElementById("videoStatus");

const modalTitle =
    document.getElementById("modalTitle");


// ==========================================
// STATISTICS
// ==========================================

const totalVideos =
    document.getElementById("totalVideos");

const publishedVideos =
    document.getElementById("publishedVideos");

const draftVideos =
    document.getElementById("draftVideos");


// ==========================================
// WATCH VIDEO MODAL
// ==========================================

const watchVideoModal =
    document.getElementById("watchVideoModal");

const closeWatchVideo =
    document.getElementById("closeWatchVideo");

const youtubePlayer =
    document.getElementById("youtubePlayer");

const watchVideoTitle =
    document.getElementById("watchVideoTitle");


// ==========================================
// DATA
// ==========================================

let videos =
    JSON.parse(
        localStorage.getItem("videos")
    ) || [];

let courses =
    JSON.parse(
        localStorage.getItem("courses")
    ) || [];

let editingVideoId = null;


// ==========================================
// SAVE VIDEOS
// ==========================================

function saveVideos() {

    localStorage.setItem(
        "videos",
        JSON.stringify(videos)
    );

}


// ==========================================
// LOAD COURSES
// ==========================================

function loadCourses() {
    const select = document.getElementById("videoCourseSelect") || videoCourse;
    if (!select) return;

    select.innerHTML = `
        <option value="">
            اختر الكورس التابع له الفيديو
        </option>
    `;

    courses.forEach(course => {
        const option = document.createElement("option");
        option.value = course.id;
        option.textContent = `${course.name || course.title || "كورس بدون اسم"} (${course.level || ''})`;
        select.appendChild(option);
    });
}


// ==========================================
// OPEN ADD MODAL
// ==========================================

function openAddModal() {

    editingVideoId = null;

    modalTitle.textContent =
        "إضافة فيديو جديد";

    videoForm.reset();

    loadCourses();

    modal.classList.add("show");

    document.body.style.overflow =
        "hidden";

    setTimeout(() => {

        videoTitle.focus();

    }, 100);

}


// ==========================================
// OPEN EDIT MODAL
// ==========================================

function openEditModal(id) {

    const video =
        videos.find(
            item => item.id === id
        );

    if (!video) return;

    editingVideoId = id;

    modalTitle.textContent =
        "تعديل الفيديو";

    loadCourses();

    videoTitle.value =
        video.title || "";

    videoCourse.value =
        video.courseId || "";

    videoLesson.value =
        video.lessonNumber || "";

    videoUrl.value =
        video.url || "";

    videoDescription.value =
        video.description || "";

    videoStatus.value =
        video.status || "published";

    modal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


// ==========================================
// CLOSE ADD / EDIT MODAL
// ==========================================

function closeModal() {

    modal.classList.remove("show");

    document.body.style.overflow = "";

    editingVideoId = null;

    videoForm.reset();

}


// ==========================================
// EVENTS
// ==========================================

if (addVideoBtn) {

    addVideoBtn.addEventListener(
        "click",
        openAddModal
    );

}

if (emptyAddBtn) {

    emptyAddBtn.addEventListener(
        "click",
        openAddModal
    );

}

if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeModal
    );

}

if (cancelModalBtn) {

    cancelModalBtn.addEventListener(
        "click",
        closeModal
    );

}


// ==========================================
// CLOSE MODAL OUTSIDE
// ==========================================

if (modal) {

    modal.addEventListener(
        "click",
        function(event) {

            if (event.target === modal) {

                closeModal();

            }

        }
    );

}


// ==========================================
// SAVE VIDEO
// ==========================================

videoForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const title =
            videoTitle.value.trim();

        const courseId =
            videoCourse.value;

        const lessonNumber =
            videoLesson.value.trim();

        const url =
            videoUrl.value.trim();

        const description =
            videoDescription.value.trim();

        const status =
            videoStatus.value;


        // ==================================
        // VALIDATION
        // ==================================

        if (!title) {

            alert(
                "من فضلك اكتب اسم الفيديو."
            );

            videoTitle.focus();

            return;
        }


        if (!courseId) {

            alert(
                "من فضلك اختر الكورس."
            );

            videoCourse.focus();

            return;
        }


        if (!url) {

            alert(
                "من فضلك ضع رابط الفيديو."
            );

            videoUrl.focus();

            return;
        }


        // ==================================
        // GET YOUTUBE ID
        // ==================================

        const youtubeId =
            getYouTubeVideoId(url);


        if (!youtubeId) {

            alert(
                "من فضلك أدخل رابط YouTube صحيح."
            );

            videoUrl.focus();

            return;
        }


        // ==================================
        // GET THUMBNAIL
        // ==================================

        const thumbnail =
            `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;


        // ==================================
        // EDIT VIDEO
        // ==================================

        if (editingVideoId) {

            const videoIndex =
                videos.findIndex(
                    item =>
                        item.id ===
                        editingVideoId
                );


            if (videoIndex !== -1) {

                videos[videoIndex] = {

                    ...videos[videoIndex],

                    title,

                    courseId,

                    lessonNumber,

                    url,

                    description,

                    status,

                    youtubeId,

                    thumbnail

                };

            }


            saveVideos();

            closeModal();

            renderVideos();


            alert(
                "تم تعديل الفيديو بنجاح ✅"
            );

            return;
        }


        // ==================================
        // ADD VIDEO
        // ==================================

        const newVideo = {

            id:
                Date.now().toString(),

            title,

            courseId,

            lessonNumber,

            url,

            description,

            status,

            youtubeId,

            thumbnail,

            createdAt:
                new Date().toISOString()

        };


        videos.unshift(
            newVideo
        );


        saveVideos();

        closeModal();

        renderVideos();


        alert(
            "تم إضافة الفيديو بنجاح ✅"
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
// GET YOUTUBE VIDEO ID
// ==========================================

function getYouTubeVideoId(url) {

    if (!url) return null;


    try {

        const parsedUrl =
            new URL(url);


        // youtube.com/watch?v=XXXX

        if (
            parsedUrl.hostname.includes(
                "youtube.com"
            )
        ) {

            const videoId =
                parsedUrl.searchParams.get("v");


            if (videoId) {

                return videoId;

            }


            // youtube.com/embed/XXXX

            if (
                parsedUrl.pathname.startsWith(
                    "/embed/"
                )
            ) {

                return parsedUrl.pathname
                    .split("/embed/")[1]
                    .split("/")[0];

            }


            // youtube.com/shorts/XXXX

            if (
                parsedUrl.pathname.startsWith(
                    "/shorts/"
                )
            ) {

                return parsedUrl.pathname
                    .split("/shorts/")[1]
                    .split("/")[0];

            }

        }


        // youtu.be/XXXX

        if (
            parsedUrl.hostname ===
            "youtu.be"
        ) {

            return parsedUrl.pathname
                .replace("/", "")
                .split("/")[0];

        }

    }

    catch (error) {

        console.error(
            "Invalid YouTube URL:",
            error
        );

    }


    return null;

}


// ==========================================
// GET VIDEO THUMBNAIL
// ==========================================

function getVideoThumbnail(video) {

    if (video.thumbnail) {

        return video.thumbnail;

    }


    const youtubeId =
        video.youtubeId ||
        getYouTubeVideoId(video.url);


    if (!youtubeId) {

        return "";

    }


    return (
        `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    );

}


// ==========================================
// RENDER VIDEOS
// ==========================================

function renderVideos(
    list = videos
) {

    videosGrid.innerHTML = "";

    updateStatistics();


    if (list.length === 0) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    list.forEach(video => {

        const card =
            document.createElement(
                "article"
            );


        const courseName =
            getCourseName(
                video.courseId
            );


        const statusText =
            video.status === "draft"
                ? "مسودة"
                : "منشور";


        const lessonText =
            video.lessonNumber
                ? `الدرس ${video.lessonNumber}`
                : "فيديو شرح";


        const thumbnail =
            getVideoThumbnail(video);


        card.className =
            "video-card";


        card.innerHTML = `

            <div
                class="video-thumbnail"
                style="
                    ${
                        thumbnail
                            ? `
                                background-image:
                                url('${escapeHTML(thumbnail)}');
                            `
                            : ""
                    }

                    background-size: cover;
                    background-position: center;
                "
            >

                ${
                    !thumbnail
                        ? `
                            <div class="no-thumbnail">
                                ▶
                            </div>
                        `
                        : ""
                }


                <div class="play-circle">
                    ▶
                </div>


                <span class="
                    video-status
                    ${
                        video.status === "draft"
                            ? "draft"
                            : ""
                    }
                ">
                    ${statusText}
                </span>

            </div>


            <div class="video-content">

                <div class="video-course">
                    ${escapeHTML(courseName)}
                </div>


                <h3>
                    ${escapeHTML(video.title)}
                </h3>


                <p class="description">

                    ${
                        escapeHTML(
                            video.description ||
                            "لا يوجد وصف للفيديو."
                        )
                    }

                </p>


                <div class="video-meta">

                    <span>
                        ${escapeHTML(lessonText)}
                    </span>

                    <span>
                        YouTube
                    </span>

                </div>


                <div class="video-actions">

                    <button
                        class="watch-btn"
                        onclick="watchVideo('${video.id}')"
                    >
                        مشاهدة
                    </button>


                    <button
                        class="edit-btn"
                        onclick="openEditModal('${video.id}')"
                    >
                        تعديل
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteVideo('${video.id}')"
                    >
                        حذف
                    </button>

                </div>

            </div>

        `;


        videosGrid.appendChild(card);

    });

}


// ==========================================
// WATCH VIDEO
// ==========================================

function watchVideo(id) {

    const video =
        videos.find(
            item =>
                item.id === id
        );


    if (!video) return;


    const youtubeId =
        video.youtubeId ||
        getYouTubeVideoId(video.url);


    if (!youtubeId) {

        alert(
            "رابط الفيديو غير صالح."
        );

        return;

    }


    watchVideoTitle.textContent =
        video.title ||
        "مشاهدة الفيديو";


    youtubePlayer.src =
        `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;


    watchVideoModal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";

}


// ==========================================
// CLOSE WATCH VIDEO
// ==========================================

function closeWatchVideoModal() {

    youtubePlayer.src = "";

    watchVideoModal.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";

}


// ==========================================
// CLOSE WATCH BUTTON
// ==========================================

if (closeWatchVideo) {

    closeWatchVideo.addEventListener(
        "click",
        closeWatchVideoModal
    );

}


// ==========================================
// CLOSE VIDEO OUTSIDE
// ==========================================

if (watchVideoModal) {

    watchVideoModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                watchVideoModal
            ) {

                closeWatchVideoModal();

            }

        }
    );

}


// ==========================================
// ESC
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            modal &&
            modal.classList.contains("show")
        ) {

            closeModal();

            return;

        }


        if (
            event.key === "Escape" &&
            watchVideoModal &&
            watchVideoModal.classList.contains(
                "show"
            )
        ) {

            closeWatchVideoModal();

        }

    }
);


// ==========================================
// DELETE VIDEO
// ==========================================

function deleteVideo(id) {

    const video =
        videos.find(
            item =>
                item.id === id
        );


    if (!video) return;


    const confirmed =
        confirm(
            `هل أنت متأكد من حذف "${video.title}"؟`
        );


    if (!confirmed) return;


    videos =
        videos.filter(
            item =>
                item.id !== id
        );


    saveVideos();

    renderVideos();


    alert(
        "تم حذف الفيديو بنجاح 🗑️"
    );

}


// ==========================================
// SEARCH
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            const search =
                this.value
                    .trim()
                    .toLowerCase();


            if (!search) {

                renderVideos();

                return;

            }


            const filtered =
                videos.filter(video => {

                    const courseName =
                        getCourseName(
                            video.courseId
                        );


                    return (

                        (
                            video.title ||
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
                            video.description ||
                            ""
                        )
                        .toLowerCase()
                        .includes(search)

                    );

                });


            renderVideos(filtered);

        }
    );

}


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    totalVideos.textContent =
        videos.length;


    publishedVideos.textContent =
        videos.filter(
            video =>
                video.status ===
                "published"
        ).length;


    draftVideos.textContent =
        videos.filter(
            video =>
                video.status ===
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
// INITIALIZE
// ==========================================

loadCourses();

renderVideos();