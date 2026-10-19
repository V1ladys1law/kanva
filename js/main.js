document.addEventListener("DOMContentLoaded", () => {
    const widthInput = document.getElementById("width");
    const heightInput = document.getElementById("height");
    const canvas = document.getElementById("canvas");
    const totalPrice = document.getElementById("total-price");
    const customSize = document.querySelector(".custom-size-wrapper");

    const presetButtons = document.querySelectorAll(".size-btn");
    const options = document.querySelectorAll(".option-checkbox");

    const toggleButton = document.getElementById("set-size-btn");
    const calculateButton = document.getElementById("calculate-btn");

    const BASE_PRICE = 345;
    const BASE_AREA = 30 * 30;
    const PIXELS_PER_CM = 3.5;
    const MAX_CANVAS_WIDTH = 360;
    const MAX_CANVAS_HEIGHT = 500;

    let currentSize = { width: 30, height: 30 };

    function getDimensions() {
        const width = Number(widthInput.value);
        const height = Number(heightInput.value);

        if (
            !Number.isFinite(width) || !Number.isFinite(height) ||
            width < 10 || width > 300 ||
            height < 10 || height > 300
        ) {
            alert("Введіть ширину та висоту від 10 до 300 см.");
            return null;
        }

        return { width, height };
    }

    function updateCanvas({ width, height }) {
        const scale = Math.min(
            PIXELS_PER_CM,
            MAX_CANVAS_WIDTH / width,
            MAX_CANVAS_HEIGHT / height
        );

        canvas.style.width = `${width * scale}px`;
        canvas.style.height = `${height * scale}px`;
    }

    function updatePrice() {
        let price = BASE_PRICE * (currentSize.width * currentSize.height) / BASE_AREA;

        options.forEach((option) => {
            if (option.checked) {
                price += Number(option.dataset.price) || 0;
            }
        });

        totalPrice.textContent = Math.round(price);
    }

    function applySize(size) {
        currentSize = size;
        updateCanvas(size);
        updatePrice();
    }

    presetButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const size = {
                width: Number(button.dataset.w),
                height: Number(button.dataset.h)
            };

            widthInput.value = size.width;
            heightInput.value = size.height;

            presetButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");

            applySize(size);
        });
    });

    [widthInput, heightInput].forEach((input) => {
        input.addEventListener("input", () => {
            presetButtons.forEach((button) => button.classList.remove("active"));
        });
    });

    options.forEach((option) => {
        option.addEventListener("change", updatePrice);
    });

    toggleButton.addEventListener("click", () => {
        const isOpen = customSize.classList.toggle("open");
        toggleButton.textContent = isOpen ? "ПРИХОВАТИ" : "ЗАДАТИ РОЗМІР";
    });

    calculateButton.addEventListener("click", () => {
        const size = getDimensions();
        if (!size) return;

        presetButtons.forEach((button) => button.classList.remove("active"));
        applySize(size);
    });

    applySize(currentSize);
});