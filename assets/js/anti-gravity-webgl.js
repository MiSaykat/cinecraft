/**
 * ============================================================================
 * CINECRAFT - ANTI-GRAVITY WEBGL 3D STRUCTURAL POINT-CLOUD ENGINE
 * Real-time 3D Photogrammetry & LiDAR Simulation of Bridge Infrastructure
 * Enhanced Full-Screen Grand Truss Architecture & Ultra-Smooth Microgravity Waves
 * Engineered for LGED, PWD, Bangladesh Railway & RHD High-Level Demonstrations
 * ============================================================================
 */

(function () {
  'use strict';

  class AntiGravityEngine {
    constructor() {
      this.canvas = document.getElementById('antiGravityCanvas');
      if (!this.canvas) return;

      this.gl = this.canvas.getContext('webgl', { antialias: true, alpha: true, depth: false }) ||
                this.canvas.getContext('experimental-webgl', { antialias: true, alpha: true, depth: false });

      this.isWebGL = !!this.gl;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Mouse, Touch & Anti-Gravity State
      this.mouse = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        ndcX: 0,
        ndcY: 0,
        isOver: false,
        lastMoveTime: performance.now()
      };

      // 3D Camera / Rotation Physics (Inertia & Gyroscope)
      this.rot = { x: 0.14, y: -0.22, vx: 0, vy: 0 };
      this.targetRot = { x: 0.14, y: -0.22 };
      this.time = 0;
      this.themeMode = document.documentElement.getAttribute('data-theme') === 'light' ? 1.0 : 0.0;

      // Initialize Geometry & Shaders
      this.initData();
      if (this.isWebGL) {
        this.initWebGL();
      } else {
        this.initCanvas2D();
      }

      this.bindEvents();
      this.onResize();
      this.animate();
    }

    /**
     * Generate 3D Mathematical Model of a Double-Deck Truss Bridge & LiDAR Points
     * Scaled larger & wider to span the entire screen from edge to edge
     */
    initData() {
      const vertices = [];
      const lines = [];

      // Grand structural parameters spanning the whole display
      const spans = 14;           // 14 spans for extensive screen-spanning width
      const spanLength = 64;      // Increased length per span
      const bridgeWidth = 46;     // Wider deck width
      const trussHeight = 52;     // Higher structural arch for majestic presence
      const startX = -((spans * spanLength) / 2); // ~896 units wide

      // Create Truss Chords & Nodes
      // Lower Chord & Deck
      for (let i = 0; i <= spans; i++) {
        const x = startX + i * spanLength;
        const archOffset = Math.sin((i / spans) * Math.PI) * 9; // Structural camber

        // Left lower node
        const idxL = vertices.length / 4;
        vertices.push(x, -14 + archOffset, -bridgeWidth / 2, 1.0); // 1.0 = Lower Chord

        // Right lower node
        const idxR = vertices.length / 4;
        vertices.push(x, -14 + archOffset, bridgeWidth / 2, 1.0);

        // Cross-beam connection
        lines.push(idxL, idxR);

        // Longitudinal lower chord connections
        if (i > 0) {
          lines.push(idxL - 2, idxL);
          lines.push(idxR - 2, idxR);
        }

        // Upper Chord (Pratt / Warren Truss Apexes)
        const upperArch = Math.sin((i / spans) * Math.PI) * trussHeight + 12;
        const idxUL = vertices.length / 4;
        vertices.push(x, upperArch, -bridgeWidth / 2, 2.0); // 2.0 = Upper Chord

        const idxUR = vertices.length / 4;
        vertices.push(x, upperArch, bridgeWidth / 2, 2.0);

        // Top lateral strut
        lines.push(idxUL, idxUR);

        // Top chord longitudinal
        if (i > 0) {
          lines.push(idxUL - 2, idxUL);
          lines.push(idxUR - 2, idxUR);

          // Diagonal web members (Warren truss lattice)
          lines.push(idxL - 2, idxUL);
          lines.push(idxR - 2, idxUR);
          lines.push(idxUL - 2, idxL);
          lines.push(idxUR - 2, idxR);
        }

        // Vertical posts
        lines.push(idxL, idxUL);
        lines.push(idxR, idxUR);

        // Substructure Piers under water
        if (i % 2 === 0) {
          const pierL = vertices.length / 4;
          vertices.push(x, -58, -bridgeWidth / 2, 3.0); // 3.0 = Pier
          const pierR = vertices.length / 4;
          vertices.push(x, -58, bridgeWidth / 2, 3.0);

          lines.push(idxL, pierL);
          lines.push(idxR, pierR);
          lines.push(pierL, pierR);
        }
      }

      // Add 750+ Floating LiDAR Point-Cloud Scan Particles around the structure
      // Spread across the full viewport field for a captivating anti-gravity matrix
      const pointCount = 750;
      for (let p = 0; p < pointCount; p++) {
        const u = Math.random();
        const px = startX * 1.35 + u * (spans * spanLength * 1.35) + (Math.random() - 0.5) * 50;
        const py = (Math.random() - 0.4) * (trussHeight * 2.1);
        const pz = (Math.random() - 0.5) * (bridgeWidth * 3.8);

        vertices.push(px, py, pz, 0.0); // 0.0 = Floating Scan Point
      }

      this.vertices = new Float32Array(vertices);
      this.lines = new Uint16Array(lines);
      this.pointCount = vertices.length / 4;
      this.lineIndexCount = lines.length;
    }

    initWebGL() {
      const gl = this.gl;

      // Vertex Shader
      const vsSource = `
        attribute vec4 aVertex; // x, y, z, type
        uniform mat4 uProj;
        uniform mat4 uView;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uRepelForce;
        uniform float uTheme;
        varying vec4 vColor;
        varying float vType;

        void main() {
          vec3 pos = aVertex.xyz;
          float type = aVertex.w;
          vType = type;

          // Enhanced Smooth Anti-Gravity Levitation (Silky microgravity harmonic undulation)
          float levitate = sin(uTime * 0.75 + pos.x * 0.009 + pos.z * 0.012) * 3.8;
          if (type == 0.0) {
            // Free-floating LiDAR points with ambient photogrammetry drift
            levitate = sin(uTime * 0.90 + pos.x * 0.014 + pos.y * 0.012) * 5.2;
          }
          pos.y += levitate;

          // View Transform
          vec4 viewPos = uView * vec4(pos, 1.0);

          // Projected position
          vec4 projPos = uProj * viewPos;

          // Softened Anti-Gravity Cursor Interaction (Sleek, gentle, non-distracting ripple)
          vec2 screenPos = projPos.xy / projPos.w;
          float distToMouse = distance(screenPos, uMouse);
          if (distToMouse < 0.20 && uRepelForce > 0.01) {
            vec2 dir = normalize(screenPos - uMouse);
            float push = (0.20 - distToMouse) * 0.045 * uRepelForce;
            projPos.xy += dir * push * projPos.w;
          }

          gl_Position = projPos;

          // Point sizes based on type and depth
          float pSize = (type == 0.0) ? 2.8 : 4.2;
          gl_PointSize = max(1.2, pSize * (230.0 / -viewPos.z));

          // Color calculation (Calibrated for a sleek, non-distracting engineering backdrop)
          float depthFactor = clamp((-viewPos.z - 60.0) / 480.0, 0.0, 1.0);
          float alpha = 1.0 - depthFactor * 0.70;

          if (uTheme > 0.5) {
            // Light Theme: Executive Cobalt, Navy & Amber Gold
            if (type == 0.0) {
              vColor = vec4(0.01, 0.52, 0.78, alpha * 0.38);
            } else if (type == 2.0) {
              vColor = vec4(0.85, 0.47, 0.02, alpha * 0.55);
            } else {
              vColor = vec4(0.06, 0.09, 0.16, alpha * 0.45);
            }
          } else {
            // Dark Theme: Subtle Glowing Cyan, Aerospace Azure & Soft Gold
            if (type == 0.0) {
              vColor = vec4(0.22, 0.74, 0.97, alpha * 0.28); // Soft Cyan LiDAR points
            } else if (type == 2.0) {
              vColor = vec4(0.96, 0.62, 0.04, alpha * 0.36); // Subdued Champagne Gold top chord
            } else if (type == 3.0) {
              vColor = vec4(0.08, 0.45, 0.85, alpha * 0.25); // Deep Azure piers
            } else {
              vColor = vec4(0.95, 0.98, 1.0, alpha * 0.28);   // Soft Titanium White lower deck
            }
          }
        }
      `;

      // Fragment Shader
      const fsSource = `
        precision mediump float;
        varying vec4 vColor;
        varying float vType;

        void main() {
          // Circular particle shape with soft edge
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) {
            discard;
          }
          float softGlow = smoothstep(0.5, 0.12, dist);
          gl_FragColor = vec4(vColor.rgb, vColor.a * softGlow);
        }
      `;

      // Line Fragment Shader (Subtle blueprint engineering lines)
      const fsLineSource = `
        precision mediump float;
        varying vec4 vColor;
        void main() {
          gl_FragColor = vec4(vColor.rgb, vColor.a * 0.10);
        }
      `;

      this.programPoints = this.createProgram(gl, vsSource, fsSource);
      this.programLines = this.createProgram(gl, vsSource, fsLineSource);

      // Vertex Buffer
      this.vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
      gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

      // Index Buffer for Structural Lines
      this.ibo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.lines, gl.STATIC_DRAW);

      // Enable Blending for Smooth Transparency
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    createProgram(gl, vsSrc, fsSrc) {
      const vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vs, vsSrc);
      gl.compileShader(vs);

      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fs, fsSrc);
      gl.compileShader(fs);

      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);

      return prog;
    }

    initCanvas2D() {
      this.ctx = this.canvas.getContext('2d');
    }

    bindEvents() {
      const onMove = (clientX, clientY) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        this.mouse.targetX = (x / rect.width) * 2 - 1;
        this.mouse.targetY = -((y / rect.height) * 2 - 1);
        this.mouse.isOver = true;
        this.mouse.lastMoveTime = performance.now();

        // 3D rotation with refined corporate damping
        this.targetRot.y = -0.22 + this.mouse.targetX * 0.22;
        this.targetRot.x = 0.14 - this.mouse.targetY * 0.12;
      };

      window.addEventListener('mousemove', (e) => {
        onMove(e.clientX, e.clientY);
      }, { passive: true });

      // Touch drag support for mobile phones
      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          onMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        this.mouse.isOver = false;
        this.targetRot.x = 0.14;
        this.targetRot.y = -0.22;
      });

      window.addEventListener('resize', () => this.onResize(), { passive: true });

      // Theme toggle observer
      const observer = new MutationObserver(() => {
        this.themeMode = document.documentElement.getAttribute('data-theme') === 'light' ? 1.0 : 0.0;
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    onResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.width = w;
      this.height = h;

      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);

      if (this.gl) {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      }
    }

    // Matrix Math Utilities
    createPerspective(fovy, aspect, near, far) {
      const f = 1.0 / Math.tan(fovy / 2);
      const nf = 1 / (near - far);
      return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, (2 * far * near) * nf, 0
      ]);
    }

    createLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
      let z0 = eyeX - centerX, z1 = eyeY - centerY, z2 = eyeZ - centerZ;
      let len = 1 / Math.hypot(z0, z1, z2);
      z0 *= len; z1 *= len; z2 *= len;

      let x0 = upY * z2 - upZ * z1, x1 = upZ * z0 - upX * z2, x2 = upX * z1 - upY * z0;
      len = 1 / Math.hypot(x0, x1, x2);
      x0 *= len; x1 *= len; x2 *= len;

      let y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0;

      return new Float32Array([
        x0, y0, z0, 0,
        x1, y1, z1, 0,
        x2, y2, z2, 0,
        -(x0 * eyeX + x1 * eyeY + x2 * eyeZ),
        -(y0 * eyeX + y1 * eyeY + y2 * eyeZ),
        -(z0 * eyeX + z1 * eyeY + z2 * eyeZ),
        1
      ]);
    }

    animate() {
      requestAnimationFrame(() => this.animate());

      this.time += 0.006; // Majestic, gentle anti-gravity cadence

      // Inertia & Gyroscopic Damping (Softened, sleek motion without jitter)
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.010;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.010;

      this.rot.x += (this.targetRot.x - this.rot.x) * 0.008;
      this.rot.y += (this.targetRot.y - this.rot.y) * 0.008;

      // Auto-orbit drift when mouse is stationary
      const idleTime = performance.now() - this.mouse.lastMoveTime;
      if (idleTime > 1800) {
        this.rot.y += Math.sin(this.time * 0.25) * 0.0004;
      }

      if (this.isWebGL) {
        this.renderWebGL();
      } else {
        this.renderCanvas2D();
      }
    }

    renderWebGL() {
      const gl = this.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const aspect = this.width / this.height;
      // Wider FOV for full-bleed cinematic span
      const proj = this.createPerspective(Math.PI / 3.4, aspect, 5, 1200);

      // Camera position: Closer & wider perspective so truss fills the entire monitor
      const radius = 235;
      const camX = Math.sin(this.rot.y) * Math.cos(this.rot.x) * radius;
      const camY = Math.sin(this.rot.x) * radius + 12;
      const camZ = Math.cos(this.rot.y) * Math.cos(this.rot.x) * radius;

      const view = this.createLookAt(camX, camY, camZ, 0, 2, 0, 0, 1, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

      // 1. Draw Structural Wireframe Lines
      gl.useProgram(this.programLines);

      let locProj = gl.getUniformLocation(this.programLines, 'uProj');
      let locView = gl.getUniformLocation(this.programLines, 'uView');
      let locTime = gl.getUniformLocation(this.programLines, 'uTime');
      let locMouse = gl.getUniformLocation(this.programLines, 'uMouse');
      let locRepel = gl.getUniformLocation(this.programLines, 'uRepelForce');
      let locTheme = gl.getUniformLocation(this.programLines, 'uTheme');
      let locAttr = gl.getAttribLocation(this.programLines, 'aVertex');

      gl.uniformMatrix4fv(locProj, false, proj);
      gl.uniformMatrix4fv(locView, false, view);
      gl.uniform1f(locTime, this.time);
      gl.uniform2f(locMouse, this.mouse.x, this.mouse.y);
      gl.uniform1f(locRepel, this.mouse.isOver ? 1.0 : 0.0);
      gl.uniform1f(locTheme, this.themeMode);

      gl.enableVertexAttribArray(locAttr);
      gl.vertexAttribPointer(locAttr, 4, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
      gl.drawElements(gl.LINES, this.lineIndexCount, gl.UNSIGNED_SHORT, 0);

      // 2. Draw LiDAR Point Cloud
      gl.useProgram(this.programPoints);

      locProj = gl.getUniformLocation(this.programPoints, 'uProj');
      locView = gl.getUniformLocation(this.programPoints, 'uView');
      locTime = gl.getUniformLocation(this.programPoints, 'uTime');
      locMouse = gl.getUniformLocation(this.programPoints, 'uMouse');
      locRepel = gl.getUniformLocation(this.programPoints, 'uRepelForce');
      locTheme = gl.getUniformLocation(this.programPoints, 'uTheme');
      locAttr = gl.getAttribLocation(this.programPoints, 'aVertex');

      gl.uniformMatrix4fv(locProj, false, proj);
      gl.uniformMatrix4fv(locView, false, view);
      gl.uniform1f(locTime, this.time);
      gl.uniform2f(locMouse, this.mouse.x, this.mouse.y);
      gl.uniform1f(locRepel, this.mouse.isOver ? 1.0 : 0.0);
      gl.uniform1f(locTheme, this.themeMode);

      gl.enableVertexAttribArray(locAttr);
      gl.vertexAttribPointer(locAttr, 4, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, this.pointCount);
    }

    renderCanvas2D() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;
      const scale = 2.4 * this.dpr;

      ctx.fillStyle = this.themeMode > 0.5 ? 'rgba(30, 41, 59, 0.5)' : 'rgba(56, 189, 248, 0.6)';

      for (let i = 0; i < this.vertices.length; i += 4) {
        const x = this.vertices[i];
        const y = this.vertices[i + 1] + Math.sin(this.time * 2.5 + x * 0.03) * 6;
        const z = this.vertices[i + 2];

        // 3D rotation
        const cosY = Math.cos(this.rot.y);
        const sinY = Math.sin(this.rot.y);
        const rx = x * cosY - z * sinY;
        const rz = z * cosY + x * sinY + 235;

        if (rz > 10) {
          const px = cx + (rx * scale * 210) / rz;
          const py = cy - (y * scale * 210) / rz;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // Auto-boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AntiGravityEngine());
  } else {
    new AntiGravityEngine();
  }
})();
