// simple_particles.js – lightweight particle background
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

function initBackground(){
  const canvas = document.getElementById('webgl-bg');
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 3.5;

  const particleCount = 20000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const color = new THREE.Color();

  for(let i=0;i<particleCount;i++){
    const i3 = i*3;
    positions[i3] = (Math.random()-0.5)*20;
    positions[i3+1] = (Math.random()-0.5)*20;
    positions[i3+2] = (Math.random()-0.5)*20;
    const hue = (i/particleCount);
    color.setHSL(hue, 0.7, 0.5);
    colors[i3] = color.r;
    colors[i3+1] = color.g;
    colors[i3+2] = color.b;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors,3));

  const material = new THREE.PointsMaterial({size:0.07, vertexColors:true, transparent:true, opacity:0.8, depthWrite:false});
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  function animate(time){
    requestAnimationFrame(animate);
    const t = time * 0.001;
    points.rotation.x = t * 0.05;
    points.rotation.y = t * 0.03;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize',()=>{
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w,h);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  });
}

document.addEventListener('DOMContentLoaded', initBackground);
