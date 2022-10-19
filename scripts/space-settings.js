import { openModal, closeModal, clamp } from "./modal.js";

function generateHeader() {
    return `<div class="text-cen bold">Settings</div>`
}

function generateBody() {
    return `
        <div class="d-flex a-f-cen f-col">
            <label for="star-count-range">Star Count</label>
            <input class="min-w-224" type="range" name="star-count-range" id="star-count-range" min="500" max="10000">
            <input class="input simple text-cen" type="number" id="star-count-value" data-label="stars"></input>
            <br>
            <label for="star-speed-range">Star Speed</label>
            <input class="min-w-224" type="range" name="star-speed-range" id="star-speed-range" min="1" max="1000">
            <input class="input simple text-cen" type="number" step="0.001" id="star-speed-value" min="0.01" data-label="starSpeed"></input>
            <br>
            <label for="star-rotation-range">Rotation Speed</label>
            <input class="min-w-224" type="range" name="star-rotation-range" id="star-rotation-range" min="1" max="1000">
            <input class="input simple text-cen" type="number" step="0.001" id="star-rotation-value" min="0.01" data-label="starRotation"></input>
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

    const ranges = [
        document.getElementById('star-count-range'),
        document.getElementById('star-speed-range'),
        document.getElementById('star-rotation-range'),
    ]

    const rangeValues = [
        document.getElementById('star-count-value'),
        document.getElementById('star-speed-value'),
        document.getElementById('star-rotation-value'),
    ]

    const rangeBoundaries = [
        { min: 500, max: 10000, scale: 1 },
        { min: 0.01, max: 1, scale: 1000 },
        { min: 0.01, max: 1, scale: 1000 },
    ]

    rangeValues.forEach((range, index) => {
        const baseValue = Number.parseFloat(localStorage.getItem(range.getAttribute('data-label')));
        range.value = baseValue;
        ranges[index].value = Number.parseInt(baseValue * rangeBoundaries[index].scale);

        range.addEventListener('input', () => {
            let value = Number.parseFloat(range.value) * rangeBoundaries[index].scale;
            ranges[index].value = value;
        })

        ranges[index].addEventListener('input', () => {
            let value = ranges[index].value / rangeBoundaries[index].scale;
            range.value = clamp(value, rangeBoundaries[index].min, rangeBoundaries[index].max);
        })
    });

    document.getElementById('settings-save').addEventListener('click', () => {
        const event = new Event('reRender');

        rangeValues.forEach((range, index) => {
            let value = index? Number.parseFloat(range.value) : Number.parseInt(range.value);
            value = clamp(value, rangeBoundaries[index].min, rangeBoundaries[index].max);
            localStorage.setItem(range.getAttribute('data-label'), value);
        });

        window.dispatchEvent(event);
        closeModal(document.getElementById("modal-space-settings"));
    });
})