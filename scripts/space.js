"use strict";

(function setDefaults() {
    if (localStorage.getItem('stars') == null)
        localStorage.setItem('stars', 4000);
    if (localStorage.getItem('starSpeed') == null)
        localStorage.setItem('starSpeed', 0.01);
    if (localStorage.getItem('starRotation') == null)
        localStorage.setItem('starRotation', 0.01);
})()

function setCanvasProperties(canvas = new HTMLCanvasElement()) {
    canvas.id = "background"
    canvas.style.position = 'absolute';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.right = '0';
    return canvas;
}

const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 1200);
const renderer = new THREE.WebGLRenderer({ antialias: true });
let scene = new THREE.Scene();

let geometry = new THREE.Geometry();

let stars = null;
let starTexture = null;

scene.background = new THREE.Color(0x011937);

renderer.setSize(window.innerWidth, window.innerHeight);

let canvas = setCanvasProperties(renderer.domElement);
document.body.insertBefore(canvas, document.body.firstChild);

function rotateCamera(clientX = 0, clientY = 0) {
    function clamp(value = 0, min = 0, max = 0) {
        return value <= min ? min : value > max ? max : value;
    }

    const originX = window.innerWidth / 2;
    const originY = window.innerHeight / 2;

    let rotateX = clamp(clientX - originX, -180, 180) * Math.PI / 30;
    let rotateY = clamp(originY - clientY, -180, 180) * Math.PI / 30;

    camera.position.x = rotateX;
    camera.position.y = rotateY;
}


let starCount = Number.parseFloat(localStorage.getItem('stars'));
let speed = Number.parseFloat(localStorage.getItem('starSpeed'));
let rotationSpeed = Number.parseFloat(localStorage.getItem('starRotation'));


for (let i = 0; i < starCount; i++) {
    let star = new THREE.Vector3(
        Math.random() * 500 - 300,
        Math.random() * 500 - 300,
        Math.random() * 500 - 300
    )
    star.velocity = 0;
    star.speed = speed;

    geometry.vertices.push(star);
}

const texture = new THREE.TextureLoader().load('../assets/white_blob.png', () => {
    starTexture = new THREE.PointsMaterial({
        color: 0x81a2a0,
        size: 0.5,
        map: texture,
    });

    stars = new THREE.Points(geometry, starTexture);
    scene.add(stars)

    function animate() {
        geometry.vertices.forEach(vertex => {
            vertex.velocity += vertex.speed;
            vertex.z += vertex.velocity;

            if (vertex.z > 300) {
                vertex.z = -1 * (Math.random() * (300 - 100) + 100);
                vertex.y = Math.random() * 500 - 300;
                vertex.velocity = 0;
            }
        })

        geometry.verticesNeedUpdate = true;
        stars.rotation.z += rotationSpeed;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (event) => {
        rotateCamera(event.clientX, event.clientY);
    });

    window.addEventListener('touchmove', (event) => {
        event.preventDefault();
        rotateCamera(event.touches[0].clientX, event.touches[0].clientY);
    });

    animate();
})

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    let oldCanvas = canvas;
    canvas = setCanvasProperties(renderer.domElement);

    document.body.replaceChild(canvas, oldCanvas);
})

window.addEventListener('reRender', () => {
    const newScene = new THREE.Scene();
    const newGeometry = new THREE.Geometry();

    newScene.background = new THREE.Color(0x011937);

    starCount = Number.parseFloat(localStorage.getItem('stars'));
    speed = Number.parseFloat(localStorage.getItem('starSpeed'));
    rotationSpeed = Number.parseFloat(localStorage.getItem('starRotation'));

    for (let i = 0; i < starCount; i++) {
        let star = new THREE.Vector3(
            Math.random() * 500 - 300,
            Math.random() * 500 - 300,
            Math.random() * 500 - 300
        )
        star.velocity = 0;
        star.speed = speed;
    
        newGeometry.vertices.push(star);
    }

    geometry = newGeometry;

    stars = new THREE.Points(geometry, starTexture);

    newScene.add(stars);
    scene = newScene;
})