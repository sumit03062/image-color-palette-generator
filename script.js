document.addEventListener("DOMContentLoaded", () => {
    const imageUpload = document.getElementById("imageUpload");
    const paletteContainer = document.getElementById("palette");
    const gradientPreview = document.getElementById("gradientPreview");
    const toggleThemeBtn = document.getElementById("toggleTheme");
    const generatePaletteBtn = document.getElementById("generatePalette");

    let darkMode = false;

    toggleThemeBtn.addEventListener("click", () => {
        darkMode = !darkMode;
        document.body.classList.toggle("dark-mode", darkMode);
        updateTheme(); // Apply theme to dynamically generated elements
    });

    generatePaletteBtn.addEventListener("click", () => {
        if (imageUpload.files.length === 0) {
            alert("Please upload an image first!");
            return;
        }
        extractColors(imageUpload.files[0]);
    });

    imageUpload.addEventListener("change", (event) => {
        extractColors(event.target.files[0]);
    });

    function extractColors(file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;
            img.crossOrigin = "Anonymous";
            img.onload = function () {
                const colorThief = new ColorThief();
                const palette = colorThief.getPalette(img, 5);
                displayPalette(palette);
            };
        };
        reader.readAsDataURL(file);
    }

    function displayPalette(palette) {
        paletteContainer.innerHTML = "";
        gradientPreview.style.background = `linear-gradient(to right, rgb(${palette[0]}), rgb(${palette[1]}))`;

        palette.forEach(color => {
            const colorBox = document.createElement("div");
            colorBox.classList.add("color-box");
            colorBox.style.background = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            colorBox.innerText = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            colorBox.addEventListener("click", () => copyToClipboard(colorBox.innerText));
            paletteContainer.appendChild(colorBox);
        });

        updateTheme(); // Apply dark mode styles after generating the palette
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert("Color copied to clipboard: " + text);
        });
    }

    function updateTheme() {
        document.body.style.background = darkMode ? "#222" : "linear-gradient(135deg, #f5f7fa, #c3cfe2)";
        document.body.style.color = darkMode ? "#fff" : "#000";
        
        // Apply theme to color boxes
        document.querySelectorAll(".color-box").forEach(box => {
            box.style.color = darkMode ? "#fff" : "#000";
            box.style.border = darkMode ? "1px solid #fff" : "1px solid #000";
        });

        // Apply theme to gradient preview
        gradientPreview.style.border = darkMode ? "2px solid #fff" : "2px solid #000";
    }
});
