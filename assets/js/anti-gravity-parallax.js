/**
 * ============================================================================
 * CINECRAFT - 3D DYNAMIC PARALLAX & ANTI-GRAVITY TILT ENGINE
 * Weightless Floating Telemetry Chips & Gyroscopic 3D Perspective Tilt
 * Engineered for High-End Precision Engineering & Corporate Trust
 * ============================================================================
 */

(function () {
  'use strict';

  class AntiGravityParallax {
    constructor() {
      this.chips = Array.from(document.querySelectorAll('.ag-chip'));
      // Note: .lens-container intentionally excluded so Deep-Zoom Inspection Lens stays completely still
      this.tiltCards = Array.from(document.querySelectorAll('.metric-card, .case-card, .brief-card, .service-card, .biams-module-card, .gis-dossier-panel'));

      this.mouse = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        isActive: false
      };

      this.initParallax();
      this.initCardTilt();
      this.initVideoMissionControl();
      this.animate();
    }

    initParallax() {
      window.addEventListener('mousemove', (e) => {
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;

        this.mouse.targetX = (e.clientX - halfW) / halfW; // -1.0 to 1.0
        this.mouse.targetY = (e.clientY - halfH) / halfH; // -1.0 to 1.0
        this.mouse.isActive = true;
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        this.mouse.targetX = 0;
        this.mouse.targetY = 0;
        this.mouse.isActive = false;
      });
    }

    initCardTilt() {
      this.tiltCards.forEach((card) => {
        card.style.transformStyle = 'preserve-3d';
        card.style.transition = 'transform 0.18s cubic-bezier(0.2, 0.8, 0.4, 1), box-shadow 0.25s ease';

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const normX = (x / rect.width - 0.5) * 2; // -1 to 1
          const normY = (y / rect.height - 0.5) * 2; // -1 to 1

          const maxRot = 5.0; // Subtle, executive corporate tilt
          const rotX = -normY * maxRot;
          const rotY = normX * maxRot;

          card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(6px)`;

          // Specular glass highlight position
          const shineX = (x / rect.width) * 100;
          const shineY = (y / rect.height) * 100;
          card.style.setProperty('--shine-x', `${shineX}%`);
          card.style.setProperty('--shine-y', `${shineY}%`);
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
      });
    }

    initVideoMissionControl() {
      const playerFrame = document.getElementById('theaterPlayerFrame');
      const targetBox = document.getElementById('hudTargetBox');
      const hudAlt = document.getElementById('hudAlt');
      const hudGimbal = document.getElementById('hudGimbal');
      const video = document.getElementById('mainTheaterVideo');

      if (!playerFrame || !targetBox) return;

      playerFrame.addEventListener('mousemove', (e) => {
        const rect = playerFrame.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Bounding box follows cursor smoothly within frame
        const clampX = Math.max(70, Math.min(rect.width - 70, x));
        const clampY = Math.max(50, Math.min(rect.height - 50, y));

        targetBox.style.left = `${clampX}px`;
        targetBox.style.top = `${clampY}px`;

        // Update simulated gimbal pitch based on vertical cursor position
        const pitch = Math.round(-30 - (clampY / rect.height) * 55);
        if (hudGimbal) {
          hudGimbal.textContent = `GIMBAL PITCH: ${pitch}° | ISO 100`;
        }
      });

      if (video && hudAlt) {
        video.addEventListener('timeupdate', () => {
          // Dynamic simulated altitude telemetry
          const alt = (112.5 + Math.sin(video.currentTime * 0.5) * 18.2).toFixed(1);
          hudAlt.textContent = `ALT: ${alt}m AGL`;
        });
      }
    }

    animate() {
      if (this.chips.length === 0) return; // No floating chips to animate; save frame cycles
      requestAnimationFrame(() => this.animate());

      // Lerp mouse coordinates with anti-gravity damping
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

      // Update Floating Telemetry Chips
      this.chips.forEach((chip) => {
        const depth = parseFloat(chip.getAttribute('data-depth')) || 0.22;

        const tx = this.mouse.x * depth * 80;
        const ty = this.mouse.y * depth * 60;
        const tz = depth * 45;
        const rx = -this.mouse.y * depth * 24;
        const ry = this.mouse.x * depth * 24;

        chip.style.transform = `perspective(1000px) translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      });
    }
  }

  // Auto-boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AntiGravityParallax());
  } else {
    new AntiGravityParallax();
  }
})();
