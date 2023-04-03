import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from "gsap";
// Setup

// const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// const renderer = new THREE.WebGLRenderer({
//   canvas: document.querySelector('#bg'),
// });

// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
// camera.position.setZ(30);
// camera.position.setX(-3);

// renderer.render(scene, camera);

// // Torus

// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshBasicMaterial({ color: 'red', wireframe:true});
// const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);

// // Lights

// const pointLight = new THREE.PointLight(0xffffff);
// pointLight.position.set(5, 5, 5);

// const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(pointLight, ambientLight);

// // Helpers

// // const lightHelper = new THREE.PointLightHelper(pointLight)
// // const gridHelper = new THREE.GridHelper(200, 50);
// // scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

// function addStar() {
//   const geometry = new THREE.SphereGeometry(0.25, 24, 24);
//   const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe:true});
//   const star = new THREE.Mesh(geometry, material);

//   const [x, y, z] = Array(3)
//     .fill()
//     .map(() => THREE.MathUtils.randFloatSpread(100));

//   star.position.set(x, y, z);
//   scene.add(star);
// }

// Array(800).fill().forEach(addStar);

// // Background

// // const spaceTexture = new THREE.TextureLoader().load('space.jpg');
// // scene.background = spaceTexture;

// // // Avatar

// // const jeffTexture = new THREE.TextureLoader().load('jeff.png');

// // const jeff = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: jeffTexture }));

// // scene.add(jeff);

// // // Moon

// // const moonTexture = new THREE.TextureLoader().load('moon.jpg');
// // const normalTexture = new THREE.TextureLoader().load('normal.jpg');

// // const moon = new THREE.Mesh(
// //   new THREE.SphereGeometry(3, 32, 32),
// //   new THREE.MeshStandardMaterial({
// //     map: moonTexture,
// //     normalMap: normalTexture,
// //   })
// // );

// // scene.add(moon);

// // moon.position.z = 30;
// // moon.position.setX(-10);

// // jeff.position.z = -5;
// // jeff.position.x = 2;

// // Scroll Animation

// function moveCamera() {
//   const t = document.body.getBoundingClientRect().top;
// //   moon.rotation.x += 0.05;
// //   moon.rotation.y += 0.075;
// //   moon.rotation.z += 0.05;

// //   jeff.rotation.y += 0.01;
// //   jeff.rotation.z += 0.01;

//   camera.position.z = t * -0.01;
//   camera.position.x = t * -0.0002;
//   camera.rotation.y = t * -0.0002;
// }

// document.body.onscroll = moveCamera;
// moveCamera();

// // Animation Loop

// function animate() {
//   requestAnimationFrame(animate);

//   torus.rotation.x += 0.01;
//   torus.rotation.y += 0.005;
//   torus.rotation.z += 0.01;

// //   moon.rotation.x += 0.005;

//   controls.update();

//   renderer.render(scene, camera);
// }

// animate();

var scene, sceneLight, portalLight, cam, renderer, clock ,portalParticles = [],smokeParticles = [] ;
        function initScene(){
            scene = new THREE.Scene();

            sceneLight = new THREE.DirectionalLight(0xffffff,0.5);
            sceneLight.position.set(0,0,1);
            scene.add(sceneLight);

            portalLight = new THREE.PointLight(0x062d89, 30, 600, 1.7);
            portalLight.position.set(0,0,250);
            scene.add(portalLight);

            cam = new THREE.PerspectiveCamera(80,window.innerWidth/window.innerHeight,1,10000);
            cam.position.z = 1000;
            scene.add(cam);

            renderer = new THREE.WebGLRenderer();
            renderer.setClearColor(0x000000,1);
            renderer.setSize(window.innerWidth , window.innerHeight);
            document.body.appendChild(renderer.domElement);

            particleSetup();
        }
        function particleSetup() {
            var portalGeo,portalMaterial, smokeGeo, smokeMaterial
            let loader = new THREE.TextureLoader();

            loader.load("/images/smoke.png", function (texture){
                portalGeo = new THREE.PlaneBufferGeometry(350,350);
                portalMaterial = new THREE.MeshStandardMaterial({
                    map:texture,
                    transparent: true
                });
                smokeGeo = new THREE.PlaneBufferGeometry(1000,1000);
                smokeMaterial = new THREE.MeshStandardMaterial({
                    map:texture,
                    transparent: true
                });

                for(let p=880;p>250;p--) {
                    let particle = new THREE.Mesh(portalGeo,portalMaterial);
                    particle.position.set(
                        0.5 * p * Math.cos((4 * p * Math.PI) / 180),
                        0.5 * p * Math.sin((4 * p * Math.PI) / 180),
                        0.1 * p
                    );
                    particle.rotation.z = Math.random() *360;
                    portalParticles.push(particle);
                    scene.add(particle);
                }

                for(let p=0;p<40;p++) {
                    let particle = new THREE.Mesh(smokeGeo,smokeMaterial);
                    particle.position.set(
                        Math.random() * 1000-500,
                        Math.random() * 400-200,
                        25
                    );
                    particle.rotation.z = Math.random() *360;
                    particle.material.opacity = 0.6;
                    portalParticles.push(particle);
                    scene.add(particle);
                }
                clock = new THREE.Clock();
                animate();
                
            });
        }
        function animate() {
            let delta = clock.getDelta();
            portalParticles.forEach(p => {
                p.rotation.z -= delta *1.5;
            });
            smokeParticles.forEach(p => {
                p.rotation.z -= delta *0.2;
            });
            if(Math.random() > 0.9) {
                portalLight.power =350 + Math.random()*500;
            }
            renderer.render(scene,cam);
            requestAnimationFrame(animate);
        }
        initScene();
        function addStar() {
        const geometry = new THREE.SphereGeometry(10, 24, 24);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe:true});
        const star = new THREE.Mesh(geometry, material);

        const [x, y, z] = Array(3).fill()
          .map(() => THREE.MathUtils.randFloatSpread(6000));

        star.position.set(x, y, z);
        scene.add(star);
}

        Array(800).fill().forEach(addStar);
        // const geometry = new THREE.TorusGeometry(30, 10, 16, 200);
        // const material = new THREE.MeshBasicMaterial({ color: 'red', wireframe:true});
        // const torus = new THREE.Mesh(geometry, material);
        // torus.position.z = 3300
        // torus.position.x = 100
        // torus.position.y = 0


        // scene.add(torus);
        // function torusanimate() {
        //     requestAnimationFrame(torusanimate);

        //     torus.rotation.x += 0.01;
        //     torus.rotation.y += 0.005;
        //     torus.rotation.z += 0.01;
        //     renderer.render(scene, cam);
        // }           

        // torusanimate();
        // const serab = document.getElementById('86');
        // serab.addEventListener('click', function() {
        //     console.log(cam.position.x);
        //     serab.style.display = 'none';
        //     gsap.to(cam.position, {
        //         z: 400,
        //         duration: 0.5 
        //     });  
        // });
        document.addEventListener('dblclick', function() {
            serab.style.display = 'block';
            gsap.to(cam.position, {
                z: 1000,
                duration: 1.5 
            });  
        });
        const greens = document.querySelectorAll(".green")
        greens.forEach(function(item) {
            item.addEventListener('click', function(){
                portalLight.color.setHex(0x006E27);
            });
          });
          const browns = document.querySelectorAll(".brown")
            browns.forEach(function(item) {
            item.addEventListener('click', function(){
                portalLight.color.setHex(0x06E260E);
            });
          });
          const blues = document.querySelectorAll(".blue")
            blues.forEach(function(item) {
            item.addEventListener('click', function(){
                portalLight.color.setHex(0x062d89);
            });
          });
          const purples = document.querySelectorAll(".purple")
            purples.forEach(function(item) {
            item.addEventListener('click', function(){
                portalLight.color.setHex(0x5B0D74);
            });
          });
          const blacks = document.querySelectorAll(".black")
            blacks.forEach(function(item) {
            item.addEventListener('click', function(){
                portalLight.color.setHex(0x0D090F);
            });
          });
          function moveCamera() {
            const t = document.body.getBoundingClientRect().top;
            console.log(cam.position.z);
            if(t* -1 > 500){
                cam.position.z = t * -1;
                cam.position.x = t * -0.02;
                cam.rotation.z = t * -0.0002;

            }
            
        }

document.body.onscroll = moveCamera;
moveCamera();

                        
        
        
        

        


// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Set up the orbit controls
// const controls = new OrbitControls(camera, renderer.domElement);

// // Set up the cube
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// // Set the camera position and make it look at the cube
// camera.position.z = 5;
// controls.update();

// // Render the scene
// function animate() {
//   requestAnimationFrame(animate);
//   controls.update();
//   renderer.render(scene, camera);
// }
// animate();