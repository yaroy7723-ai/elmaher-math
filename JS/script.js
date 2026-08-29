// ==========================================
// ALMAHER MATH PLATFORM
// MAIN INTERACTION SCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Sticky Navbar & Header Blur on Scroll
    const navbar = document.querySelector(".navbar");
    
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 30) {
                navbar.classList.add("scrolled");
                navbar.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
            } else {
                navbar.classList.remove("scrolled");
                navbar.style.boxShadow = "var(--shadow-sm)";
            }
        });
    }

    // 2. Smooth Scroll for Anchor Links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId && targetId !== "#") {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        });
    });

    // 3. Math Symbols Hover & Subtle Parallax Effect
    const mathSymbols = document.querySelectorAll(".floating-math, .math-symbol");
    document.addEventListener("mousemove", (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        mathSymbols.forEach((symbol, index) => {
            const factor = (index + 1) * 12;
            symbol.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px)`;
        });
    });

    // 4. Highlight Active Link on Scroll
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {
        let currentSection = "";
        const scrollPosition = window.scrollY + 120;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    });
});
