document.addEventListener("DOMContentLoaded", () => {
    const widthInput = document.getElementById("width");
    const heightInput = document.getElementById("height");
    const canvas = document.getElementById("canvas");
    const totalPrice = document.getElementById("total-price");

    const presetButtons = document.querySelectorAll(".size-btn");
    const options = document.querySelectorAll(".option-checkbox");

    const setSizeButton = document.getElementById("set-size-btn");
    const calculateButton = document.getElementById("calculate-btn");
    const buyButton = document.getElementById("buy-btn");

    // Початкова вартість полотна 30 × 30 см.
    const BASE_PRICE = 345;
    const BASE_AREA = 30 * 30;

    // Масштаб полотна на екрані.
    const PIXELS_PER_CM = 3.5;
    const MAX_CANVAS_WIDTH = 360;
    const MAX_CANVAS_HEIGHT = 500;

    // Перевірка введених розмірів.
    function getDimensions() {
        const width = Number(widthInput.value);
        const height = Number(heightInput.value);

        if (
            !Number.isFinite(width) ||
            !Number.isFinite(height) ||
            width < 10 ||
            width > 300 ||
            height < 10 ||
            height > 300
        ) {
            alert("Введіть ширину та висоту від 10 до 300 см.");
            return null;
        }

        return { width, height };
    }

    // Змінює лише візуальний розмір полотна.
    // Масштаб по ширині та висоті завжди однаковий,
    // тому пропорції фізичних розмірів зберігаються.
    function updateCanvas(width, height) {
        const scale = Math.min(
            PIXELS_PER_CM,
            MAX_CANVAS_WIDTH / width,
            MAX_CANVAS_HEIGHT / height
        );

        canvas.style.width = `${width * scale}px`;
        canvas.style.height = `${height * scale}px`;
    }

    // Розрахунок ціни з урахуванням площі та опцій.
    function calculateTotal(width, height) {
        let price = BASE_PRICE * (width * height) / BASE_AREA;

        options.forEach((option) => {
            if (option.checked) {
                price += Number(option.dataset.price) || 0;
            }
        });

        return Math.round(price);
    }

    // Початковий стан.
    updateCanvas(30, 30);
    totalPrice.textContent = "345";

    // Пресети змінюють тільки поля вводу.
    presetButtons.forEach((button) => {
        button.addEventListener("click", () => {
            widthInput.value = button.dataset.w;
            heightInput.value = button.dataset.h;

            presetButtons.forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");
        });
    });

    // При ручному введенні знімаємо активний пресет.
    // Полотно та ціна автоматично не змінюються.
    [widthInput, heightInput].forEach((input) => {
        input.addEventListener("input", () => {
            presetButtons.forEach((button) => {
                button.classList.remove("active");
            });
        });
    });

    // Кнопка «ЗАДАТИ РОЗМІР».
    // Змінює тільки візуалізацію.
    setSizeButton.addEventListener("click", () => {
        const dimensions = getDimensions();

        if (!dimensions) {
            return;
        }

        updateCanvas(dimensions.width, dimensions.height);
    });

    // Кнопка «ПІДРАХУВАТИ».
    // Змінює тільки загальну ціну.
    calculateButton.addEventListener("click", () => {
        const dimensions = getDimensions();

        if (!dimensions) {
            return;
        }

        const price = calculateTotal(
            dimensions.width,
            dimensions.height
        );

        totalPrice.textContent = String(price);
    });

    // Демонстраційна кнопка покупки.
    buyButton.addEventListener("click", () => {
        alert(
            "Кнопка покупки поки що демонстраційна. " +
            "Для оформлення замовлення потрібно підключити форму."
        );
    });
});