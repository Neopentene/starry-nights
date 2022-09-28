import { openModal, closeModal, clamp } from "./modal.js";

function generateHeader() {
    return `<div class="text-cen bold">Settings</div>`
}

function generateBody() {
    return `
        <div class="d-flex a-f-cen f-col">
            <label for="star-count-range">Star Count</label>
            <input class="min-w-224" type="range" name="star-count-range" id="star-count-range" min="500" max="10000">
            <input class="input simple text-cen" type="number" id="star-count-value"></input>
            <br>
            <label for="star-speed-range">Star Speed</label>
            <input class="min-w-224" type="range" name="star-speed-range" id="star-speed-range" min="1" max="1000">
            <input class="input simple text-cen" type="number" step="0.01" id="star-speed-value" min="0.01"></input>
            <br>
            <label for="star-rotation-range">Rotation Speed</label>
            <input class="min-w-224" type="range" name="star-rotation-range" id="star-rotation-range" min="1" max="1000">
            <input class="input simple text-cen" type="number" step="0.01" id="star-rotation-value" min="0.01"></input>
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
    openModal("modal-space-settings", generateHeader(), generateBody(), generateFooter(), true);
    const starCountRange = document.getElementById('star-count-range');
    const starSpeedRange = document.getElementById('star-speed-range');
    const starRotationRange = document.getElementById('star-rotation-range');
    const starCountRangePara = document.getElementById('star-count-value');
    const starSpeedRangePara = document.getElementById('star-speed-value');
    const starRotationRangePara = document.getElementById('star-rotation-value');

    starCountRangePara.value = localStorage.getItem('stars');
    starSpeedRangePara.value = localStorage.getItem('starSpeed');
    starRotationRangePara.value = localStorage.getItem('starRotation');

    starCountRange.value = localStorage.getItem('stars');
    starSpeedRange.value = Number.parseFloat(localStorage.getItem('starSpeed')) * 1000;
    starRotationRange.value = Number.parseFloat(localStorage.getItem('starRotation')) * 1000;

    starCountRangePara.addEventListener('input', () => {
        starCountRange.value = clamp(Number.parseInt(starCountRangePara.value), 500, 10000);
    })

    starSpeedRangePara.addEventListener('input', () => {
        starSpeedRange.value = clamp(Number.parseFloat(starSpeedRangePara.value) * 1000, 1, 1000);
    })

    starRotationRangePara.addEventListener('input', () => {
        starRotationRange.value = clamp(Number.parseFloat(starRotationRangePara.value) * 1000, 1, 1000);
    })

    starCountRange.addEventListener('input', (event) => {
        let value = clamp(starCountRange.value, 500, 10000);
        starCountRangePara.value = value;
    });

    starSpeedRange.addEventListener('input', () => {
        let value = clamp(starSpeedRange.value / 1000, 0.01, 1);
        starSpeedRangePara.value = value;
    });

    starRotationRange.addEventListener('input', () => {
        let value = clamp(starRotationRange.value / 1000, 0.01, 1);
        starRotationRangePara.value = value;
    });

    document.getElementById('settings-save').addEventListener('click', () => {
        const event = new Event('reRender');
        const count = starCountRangePara.value? Number.parseInt(starCountRangePara.value) : 0;
        const speed = starSpeedRangePara.value? Number.parseInt(starSpeedRangePara.value) : 0;
        const rotation = starRotationRangePara? Number.parseInt(starRotationRangePara.value) : 0;

        localStorage.setItem('stars', clamp(count, 500, 10000));
        localStorage.setItem('starSpeed', clamp(speed, 0.01, 1));
        localStorage.setItem('starRotation', clamp(rotation, 0.01, 1));

        window.dispatchEvent(event);
        closeModal(document.getElementById("modal-space-settings"));
    });
})