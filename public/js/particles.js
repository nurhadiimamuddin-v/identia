// particles.js – exact replication of antigravity.google background animation
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

/* ─────────────────────────── CONFIG ─────────────────────────── */
const CONFIG = {
  light: {
    bg: '#ffffff',
    color1: '#2c64ed',
    color2: '#f84242',
    color3: '#ffcf03'
  },
  dark: {
    bg: '#121217',
    color1: '#318bf7',
    color2: '#bada4c',
    color3: '#e35058'
  },
  gridSize: 256,
  density: 150,
  particlesScale: 1,
  ringDisplacement: 0.15,
  ringWidth: 0.05,
  ringWidth2: 0.015,
  cameraZoom: 3.5,
  theme: 'light'   // white background like antigravity.google default
};

/* ─────────────────────── SIMPLEX NOISE GLSL ─────────────────── */
const noiseGLSL = `
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  float permute(float x){ return floor(mod(((x*34.0)+1.0)*x, 289.0)); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float taylorInvSqrt(float r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }
`;

/* ───────────────── SIMULATION FRAGMENT SHADER ───────────────── */
const simFragmentShader = `
  precision highp float;
  uniform sampler2D uPosition;
  uniform sampler2D uPosRefs;
  uniform vec2 uMousePos;
  uniform float uTime;
  uniform float uDeltaTime;
  uniform float uIsHovering;

  vec2 hash( vec2 p ){
    p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
    return fract(sin(p)*43758.5453);
  }

  void main() {
    vec2 simTexCoords = gl_FragCoord.xy / vec2(${CONFIG.gridSize}.0, ${CONFIG.gridSize}.0);
    vec4 pFrame = texture2D(uPosition, simTexCoords);

    float scale = pFrame.z;
    float velocity = pFrame.w;
    vec2 refPos = texture2D(uPosRefs, simTexCoords).xy;
    float seed = hash(simTexCoords).x;
    float seed2 = hash(simTexCoords).y;

    float time = uTime * .5;
    float lifeEnd = 3. + sin(seed2 * 100.) * 1.;
    float lifeTime = mod((seed * 100.) + time, lifeEnd);

    vec2 disp = vec2(0., 0.);
    vec2 pos = pFrame.xy;

    float distRadius = 0.15;

    vec2 targetPos = refPos;

    vec2 direction = normalize(targetPos - pos);
    direction *= .01;

    float dist = length(targetPos - pos);
    float distStrength = smoothstep(distRadius, 0., dist);

    if(dist > 0.005){
      pos += direction * distStrength;
    }

    if(lifeTime < .01){
      pos = refPos;
      pFrame.xy = refPos;
      scale = 0.;
    }

    // Scale lifecycle
    float targetScale = smoothstep(.01, 0.5, lifeTime) - smoothstep(0.5, 1., lifeTime/lifeEnd);

    float scaleDiff = targetScale - scale;
    scaleDiff *= .1;
    scale += scaleDiff;

    // Final position
    vec2 finalPos = pos + (disp * smoothstep(0.001, distRadius, dist));
    vec2 diff = finalPos - pFrame.xy;
    diff *= .2;

    velocity = 0.0;

    vec4 frame = vec4(pFrame.xy + diff, scale, velocity);
    gl_FragColor = frame;
  }
`;

/* ─────────────── RENDER VERTEX SHADER ─────────────── */
const renderVertexShader = `
  precision highp float;
  attribute vec4 seeds;

  uniform sampler2D uPosition;
  uniform float uTime;
  uniform float uParticleScale;
  uniform float uPixelRatio;
  uniform int uColorScheme;
  uniform float uIsHovering;
  uniform float uPulseProgress;

  varying vec4 vSeeds;
  varying float vVelocity;
  varying vec2 vLocalPos;
  varying vec2 vScreenPos;
  varying float vScale;

  ${noiseGLSL}

  void main() {
    vec4 pos = texture2D(uPosition, uv);
    vSeeds = seeds;

    float noiseX = snoise(vec3( vec2(pos.xy * 10.), uTime * .2 + 100.));
    float noiseY = snoise(vec3( vec2(pos.xy * 10.), uTime * .2));

    float noiseX2 = snoise(vec3( vec2(pos.xy * .5), uTime * .15 + 45.));
    float noiseY2 = snoise(vec3( vec2(pos.xy * .5), uTime * .15 + 87.));

    // Pulse wave
    float cDist = length(pos.xy) * 1.;
    float progress = uPulseProgress;
    float t = smoothstep(progress - .25, progress, cDist) - smoothstep(progress, progress + .25, cDist);
    t *= smoothstep(1., .0, cDist);
    pos.xy *= 1. + (t * .02);

    float dist = smoothstep(0., 0.9, pos.w);
    dist = mix(0., dist, uIsHovering);

    pos.y += noiseY * 0.005 * dist;
    pos.x += noiseX * 0.005 * dist;
    pos.y += noiseY2 * 0.02;
    pos.x += noiseX2 * 0.02;

    vVelocity = pos.w;
    vScale = pos.z;
    vLocalPos = pos.xy;
    vec4 viewSpace  = modelViewMatrix * vec4(vec3(pos.xy, 0.), 1.0);

    gl_Position = projectionMatrix * viewSpace;
    vScreenPos = gl_Position.xy;

    float minScale = .25;
    minScale += float(uColorScheme) * .75;

    gl_PointSize = ((vScale * 7.) * (uPixelRatio * 0.5) * uParticleScale) + (minScale * uPixelRatio);
  }
`;

/* ─────────────── RENDER FRAGMENT SHADER ─────────────── */
const renderFragmentShader = `
  precision highp float;

  varying vec4 vSeeds;
  varying vec2 vScreenPos;
  varying vec2 vLocalPos;
  varying float vScale;
  varying float vVelocity;

  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;

  uniform vec2 uMousePos;
  uniform vec2 uRez;

  uniform float uAlpha;
  uniform float uTime;

  uniform int uColorScheme;

  ${noiseGLSL}

  #define PI 3.1415926535897932384626433832795

  float sdRoundBox( in vec2 p, in vec2 b, in vec4 r )
  {
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;
    vec2 q = abs(p)-b+r.x;
    return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
  }

  vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, s, -s, c);
    return m * v;
  }

  void main() {
    float uBorderSize = 0.2;
    vec2 center = vec2(.48, .4);
    float ratio = uRez.x / uRez.y;

    float angle = atan(vLocalPos.y - uMousePos.y, vLocalPos.x - uMousePos.x);

    vec2 uv = gl_PointCoord.xy;
    uv -= vec2(0.5);
    uv.y *= -1.;

    vec2 tuv = vScreenPos;
    tuv = rotate(tuv, uTime * 1.);
    tuv.y *= 1./ratio;
    tuv += .5;

    float h = 0.8;
    float progress = vVelocity;
    vec3 col = mix(mix(uColor1, uColor2, progress/h), mix(uColor2, uColor3, (progress - h)/(1.0 - h)), step(h, progress));
    vec3 color = col;

    float dist = sqrt(dot(uv, uv));

    float dr = .5;
    float t = smoothstep(dr+(uBorderSize + .0001), dr-uBorderSize, dist);
    t = clamp(t, 0., 1.);

    float rounded = sdRoundBox(uv, vec2(0.5, 0.2), vec4(.25));
    rounded = smoothstep(.1, 0., rounded);

    float disc = smoothstep(.5, .45, length(uv));

    float a = uAlpha * disc * smoothstep(0.1, 0.2, vScale);

    if(a < 0.01){
      discard;
    }

    color = clamp(color, 0., 1.);
    color = mix(color, color * clamp(vVelocity, 0., 1.), float(uColorScheme));

    gl_FragColor = vec4(color, clamp(a, 0., 1.));
  }
`;

/* ─────────────── POISSON DISK SAMPLING ─────────────── */
function linearMap(x, a, b, c, d) {
  return ((x - a) * (d - c)) / (b - a) + c;
}

function poissonDiskSample(width, height, minDist, maxDist, tries = 20) {
  const cellSize = minDist / Math.SQRT2;
  const gridW = Math.ceil(width / cellSize);
  const gridH = Math.ceil(height / cellSize);
  const grid = new Int32Array(gridW * gridH).fill(-1);
  const points = [];
  const active = [];

  function gridIdx(x, y) {
    return Math.floor(y / cellSize) * gridW + Math.floor(x / cellSize);
  }

  function addPoint(x, y) {
    const i = points.length;
    points.push([x, y]);
    active.push(i);
    grid[gridIdx(x, y)] = i;
    return i;
  }

  function inNeighbourhood(px, py) {
    const gx = Math.floor(px / cellSize);
    const gy = Math.floor(py / cellSize);
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const nx = gx + dx, ny = gy + dy;
        if (nx < 0 || ny < 0 || nx >= gridW || ny >= gridH) continue;
        const idx = grid[ny * gridW + nx];
        if (idx === -1) continue;
        const [ex, ey] = points[idx];
        const d = (px - ex) ** 2 + (py - ey) ** 2;
        if (d < minDist * minDist) return true;
      }
    }
    return false;
  }

  addPoint(width / 2, height / 2);

  while (active.length > 0) {
    const ri = Math.floor(Math.random() * active.length);
    const [cx, cy] = points[active[ri]];
    let found = false;
    for (let t = 0; t < tries; t++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = minDist + Math.random() * (maxDist - minDist);
      const nx = cx + Math.cos(angle) * dist;
      const ny = cy + Math.sin(angle) * dist;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      if (!inNeighbourhood(nx, ny)) {
        addPoint(nx, ny);
        found = true;
        break;
      }
    }
    if (!found) active.splice(ri, 1);
  }
  return points;
}

/* ─────────────── MAIN INIT ─────────────── */
function initBackground() {
  const canvas = document.getElementById('webgl-bg');
  if (!canvas) return;

  const theme = CONFIG.theme;
  const colors = CONFIG[theme];
  const colorScheme = theme === 'dark' ? 0 : 1;

  const renderer = new THREE.WebGLRenderer({
    canvas, alpha: true, antialias: true,
    powerPreference: 'high-performance', stencil: false, precision: 'highp'
  });
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors.bg);

  const camera = new THREE.PerspectiveCamera(
    40, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.z = CONFIG.cameraZoom;

  /* ── Create particle base positions with Poisson disk sampling ── */
  const SIZE = CONFIG.gridSize;    // 256
  const count = SIZE * SIZE;       // 65536
  const minDist = linearMap(CONFIG.density, 0, 300, 10, 2);
  const maxDist = linearMap(CONFIG.density, 0, 300, 11, 3);
  const poissonPoints = poissonDiskSample(500, 500, minDist, maxDist, 20);

  // Create position data texture from Poisson points
  const posData = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const pi = i % poissonPoints.length;
    const pt = poissonPoints[pi];
    posData[i * 4 + 0] = (pt[0] - 250) * (1 / 250);
    posData[i * 4 + 1] = (pt[1] - 250) * (1 / 250);
    posData[i * 4 + 2] = 0; // scale
    posData[i * 4 + 3] = 0; // velocity
  }

  const posTex = new THREE.DataTexture(posData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType);
  posTex.needsUpdate = true;

  const refTex = new THREE.DataTexture(posData.slice(), SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType);
  refTex.needsUpdate = true;

  /* ── Render targets (GPGPU ping-pong) ── */
  const rtParams = {
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    depthBuffer: false,
    stencilBuffer: false
  };
  let rt1 = new THREE.WebGLRenderTarget(SIZE, SIZE, rtParams);
  let rt2 = new THREE.WebGLRenderTarget(SIZE, SIZE, rtParams);

  // Initialize render targets with position data
  const initScene = new THREE.Scene();
  const initCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const initMat = new THREE.ShaderMaterial({
    uniforms: { uTex: { value: posTex } },
    vertexShader: `void main(){ gl_Position = vec4(position, 1.0); }`,
    fragmentShader: `
      precision highp float;
      uniform sampler2D uTex;
      void main(){
        vec2 uv = gl_FragCoord.xy / vec2(${SIZE}.0);
        gl_FragColor = texture2D(uTex, uv);
      }
    `
  });
  initScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), initMat));
  renderer.setRenderTarget(rt1);
  renderer.render(initScene, initCamera);
  renderer.setRenderTarget(rt2);
  renderer.render(initScene, initCamera);
  renderer.setRenderTarget(null);

  /* ── Simulation material (GPGPU) ── */
  const simMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uPosition: { value: rt1.texture },
      uPosRefs: { value: refTex },
      uMousePos: { value: new THREE.Vector2(0, 0) },
      uRingRadius: { value: 0.2 },
      uDeltaTime: { value: 0 },
      uRingWidth: { value: CONFIG.ringWidth },
      uRingWidth2: { value: CONFIG.ringWidth2 },
      uIsHovering: { value: 0 },
      uRingDisplacement: { value: CONFIG.ringDisplacement },
      uTime: { value: 0 }
    },
    vertexShader: `void main(){ gl_Position = vec4(position, 1.0); }`,
    fragmentShader: simFragmentShader
  });
  const simScene = new THREE.Scene();
  simScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial));
  const simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  /* ── Particle render material ── */
  const particleScale = (window.innerWidth / pixelRatio) / 2000 * CONFIG.particlesScale;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);
  const seeds = new Float32Array(count * 4);

  for (let i = 0; i < count; i++) {
    const col = i % SIZE;
    const row = Math.floor(i / SIZE);
    uvs[i * 2] = col / SIZE;
    uvs[i * 2 + 1] = row / SIZE;
    seeds[i * 4] = Math.random();
    seeds[i * 4 + 1] = Math.random();
    seeds[i * 4 + 2] = Math.random();
    seeds[i * 4 + 3] = Math.random();
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  particleGeo.setAttribute('seeds', new THREE.BufferAttribute(seeds, 4));

  const renderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uPosition: { value: rt1.texture },
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(colors.color1) },
      uColor2: { value: new THREE.Color(colors.color2) },
      uColor3: { value: new THREE.Color(colors.color3) },
      uAlpha: { value: 1.0 },
      uIsHovering: { value: 0 },
      uPulseProgress: { value: 0 },
      uMousePos: { value: new THREE.Vector2(0, 0) },
      uRez: { value: new THREE.Vector2(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio) },
      uParticleScale: { value: particleScale },
      uPixelRatio: { value: pixelRatio },
      uColorScheme: { value: colorScheme }
    },
    vertexShader: renderVertexShader,
    fragmentShader: renderFragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false
  });

  const mesh = new THREE.Points(particleGeo, renderMaterial);
  mesh.scale.set(5, -5, 5);
  scene.add(mesh);

  /* ── Mouse interaction ── */
  const mousePos = new THREE.Vector2(0, 0);
  let pulseProgress = 0;
  let pulseActive = false;
  let pulseStart = 0;

  window.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width * 2 - 1;
    const my = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mousePos.set(mx * 0.175, my * 0.175);
  });

  /* ── Animation loop ── */
  const clock = new THREE.Clock();
  let lastTime = 0;

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();
    const dt = elapsed - lastTime;
    lastTime = elapsed;

    // Pulse wave
    if (pulseActive) {
      pulseProgress = (elapsed - pulseStart) / 2;
      if (pulseProgress > 1) {
        pulseActive = false;
        pulseProgress = 0;
      }
    }

    // Update simulation uniforms
    simMaterial.uniforms.uPosition.value = rt1.texture;
    simMaterial.uniforms.uTime.value = elapsed;
    simMaterial.uniforms.uDeltaTime.value = dt;
    simMaterial.uniforms.uRingRadius.value = 0.175 + Math.sin(elapsed) * 0.03 + Math.cos(elapsed * 3) * 0.02;
    simMaterial.uniforms.uMousePos.value = mousePos;

    // GPGPU simulation pass
    renderer.setRenderTarget(rt2);
    renderer.render(simScene, simCamera);
    renderer.setRenderTarget(null);

    // Update render uniforms
    renderMaterial.uniforms.uPosition.value = rt2.texture;
    renderMaterial.uniforms.uTime.value = elapsed;
    renderMaterial.uniforms.uMousePos.value = mousePos;
    renderMaterial.uniforms.uPulseProgress.value = pulseProgress;

    // Render particles
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene, camera);

    // Ping-pong swap
    const tmp = rt1;
    rt1 = rt2;
    rt2 = tmp;
  }

  animate();

  // Trigger initial pulse
  pulseActive = true;
  pulseStart = clock.getElapsedTime();

  /* ── Resize handler ── */
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderMaterial.uniforms.uRez.value.set(w * pixelRatio, h * pixelRatio);
    renderMaterial.uniforms.uPixelRatio.value = pixelRatio;
    renderMaterial.uniforms.uParticleScale.value = (w / pixelRatio) / 2000 * CONFIG.particlesScale;
  });
}

document.addEventListener('DOMContentLoaded', initBackground);
