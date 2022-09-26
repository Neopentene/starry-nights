import { openModal, closeModal, clamp } from "./modal.js";

function generateHeader () {
    return `<div class="text-cen bold">Settings</div>`
}

function generateBody() {
    return `
        <div class="d-flex a-f-cen f-col">
            <label for="star-count-range">Star Count</label>
            <input class="min-w-224" type="range" name="star-count-range" id="star-count-range" min="500" max="10000">
            <p id="star-count-value"></p>
            <br>
            <label for="star-speed-range">Star Speed</label>
            <input class="min-w-224" type="range" name="star-speed-range" id="star-speed-range" min="1" max="1000">
            <p id="star-speed-value"></p>
            <br>
            <label for="star-rotation-range">Rotation Speed</label>
            <input class="min-w-224" type="range" name="star-rotation-range" id="star-rotation-range" min="1" max="1000">
            <p id="star-rotation-value"></p>
        </div>
    `
}

function generateFooter() {
    return `
        <div class="d-flex a-f-cen">
            <button id="settings-save" class="btn simple bold">save</button>
        </div>
    `
}

document.getElementById('space-settings').addEventListener('click', () => {
    openModal("modal-space-settings", generateHeader(), generateBody(), generateFooter());
    const starCountRange = document.getElementById('star-count-range');
    const starSpeedRange = document.getElementById('star-speed-range');
    const starRotationRange = document.getElementById('star-rotation-range');
    const starCountRangePara = document.getElementById('star-count-value');
    const starSpeedRangePara = document.getElementById('star-speed-value');
    const starRotationRangePara = document.getElementById('star-rotation-value');

    starCountRangePara.textContent = localStorage.getItem('stars');
    starSpeedRangePara.textContent = localStorage.getItem('starSpeed');
    starRotationRangePara.textContent = localStorage.getItem('starRotation');

    starCountRange.value = localStorage.getItem('stars');
    starSpeedRange.value = Number.parseFloat(localStorage.getItem('starSpeed')) * 1000;
    starRotationRange.value = Number.parseFloat(localStorage.getItem('starRotation')) * 1000;

    starCountRange.addEventListener('input', () => {
        let value = clamp(starCountRange.value, 500, 10000);
        starCountRangePara.textContent = value; 
    });

    starSpeedRange.addEventListener('input', () => {
        let value = clamp(starSpeedRange.value / 1000, 0.01, 1);
        starSpeedRangePara.textContent = value; 
    });

    starRotationRange.addEventListener('input', () => {
        let value = clamp(starRotationRange.value / 1000, 0.01, 1);
        starRotationRangePara.textContent = value;
    });

    document.getElementById('settings-save').addEventListener('click', () => {
        const event = new Event('reRender');
        localStorage.setItem('stars', starCountRangePara.textContent);
        localStorage.setItem('starSpeed', starSpeedRangePara.textContent);
        localStorage.setItem('starRotation', starRotationRangePara.textContent);

        window.dispatchEvent(event);
        closeModal(document.getElementById("modal-space-settings"));
    });
})