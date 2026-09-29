/* ==========================================================================
   KESAR SMART - Interactive Logic & Glitter Particle Canvas Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initGlitterCanvas();
    initIoTSimulator();
    initMarketplace();
    initCartSystem();
    initYieldCalculator();
    initDealerForm();
});

/* ==========================================================================
   0. Mobile Navigation Drawer & Hamburger Controller
   ========================================================================== */
function initMobileNav() {
    const mobileToggleBtn = document.getElementById('mobileToggleBtn');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const navLinks = document.getElementById('navLinks');
    const links = navLinks ? navLinks.querySelectorAll('.nav-link') : [];

    function openMobileMenu() {
        if (navLinks) navLinks.classList.add('active');
        if (mobileNavOverlay) mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (navLinks) navLinks.classList.remove('active');
        if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileToggleBtn) {
        mobileToggleBtn.addEventListener('click', openMobileMenu);
    }

    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileMenu);
    }

    // Auto close when any nav link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    const mobileMenuQuoteBtn = document.querySelector('.mobile-menu-quote-btn');
    if (mobileMenuQuoteBtn) {
        mobileMenuQuoteBtn.addEventListener('click', closeMobileMenu);
    }
}

/* ==========================================================================
   1. Cybernetic Circuit Movement & Interactive Energy Pulse Engine
   ========================================================================== */
function initGlitterCanvas() {
    initCircuitBackgroundEngine();
}

function initCircuitBackgroundEngine() {
    const canvas = document.getElementById('circuitCanvas') || document.getElementById('glitterCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const bgImage = document.getElementById('circuitBgImage');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Smooth Mouse Tracking & Parallax
    let mouse = { x: width * 0.5, y: height * 0.5, targetX: 0, targetY: 0, currentX: 0, currentY: 0, active: false };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.targetX = (e.clientX / width - 0.5) * -16;
        mouse.targetY = (e.clientY / height - 0.5) * -16;
        mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.targetX = 0;
        mouse.targetY = 0;
        mouse.active = false;
    });

    // Touch support for mobile parallax
    window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length > 0) {
            const touch = e.touches[0];
            mouse.x = touch.clientX;
            mouse.y = touch.clientY;
            mouse.targetX = (touch.clientX / width - 0.5) * -12;
            mouse.targetY = (touch.clientY / height - 0.5) * -12;
            mouse.active = true;
        }
    }, { passive: true });

    // Click/Tap Energy Pulse shockwave
    window.addEventListener('click', (e) => {
        spawnClickShockwave(e.clientX, e.clientY);
    });

    // Palette matching the combined image sectors:
    // Saffron Amber Gold (Center), Cyan Blue (Left), Neon Purple / Magenta (Right)
    const COLOR_GOLD = { stroke: 'rgba(245, 158, 11, ', glow: 'rgba(245, 158, 11, 0.95)', head: '#fff4cc' };
    const COLOR_CYAN = { stroke: 'rgba(6, 182, 212, ', glow: 'rgba(6, 182, 212, 0.95)', head: '#e0f9ff' };
    const COLOR_VIOLET = { stroke: 'rgba(168, 85, 247, ', glow: 'rgba(168, 85, 247, 0.95)', head: '#f5e8ff' };
    const COLOR_MAGENTA = { stroke: 'rgba(236, 72, 153, ', glow: 'rgba(236, 72, 153, 0.95)', head: '#ffe4f1' };

    // Circuit Network: Traces, Nodes, and Pulses
    let traces = [];
    let nodes = [];
    let pulses = [];
    let sparkles = [];
    let shockwaves = [];

    // Helper: calculate total length and segments of a polyline
    function processTrace(points, style) {
        let totalLength = 0;
        const segments = [];
        for (let i = 0; i < points.length - 1; i++) {
            const dx = points[i + 1].x - points[i].x;
            const dy = points[i + 1].y - points[i].y;
            const len = Math.hypot(dx, dy);
            segments.push({
                x1: points[i].x,
                y1: points[i].y,
                x2: points[i + 1].x,
                y2: points[i + 1].y,
                length: len,
                startDist: totalLength,
                endDist: totalLength + len
            });
            totalLength += len;
        }
        return { points, segments, totalLength, style, dashOffset: Math.random() * 100 };
    }

    // Helper to get {x, y, angle} at a given distance along trace
    function getPointAtDistance(trace, dist) {
        if (dist <= 0) return { x: trace.points[0].x, y: trace.points[0].y, angle: 0 };
        if (dist >= trace.totalLength) {
            const last = trace.points[trace.points.length - 1];
            return { x: last.x, y: last.y, angle: 0 };
        }
        for (let seg of trace.segments) {
            if (dist >= seg.startDist && dist <= seg.endDist) {
                const ratio = (dist - seg.startDist) / (seg.length || 1);
                return {
                    x: seg.x1 + (seg.x2 - seg.x1) * ratio,
                    y: seg.y1 + (seg.y2 - seg.y1) * ratio,
                    angle: Math.atan2(seg.y2 - seg.y1, seg.x2 - seg.x1)
                };
            }
        }
        const last = trace.points[trace.points.length - 1];
        return { x: last.x, y: last.y, angle: 0 };
    }

    // Generate responsive circuit board paths aligned with the background image
    function buildCircuitNetwork() {
        traces = [];
        nodes = [];
        pulses = [];

        const W = width;
        const H = height;

        // 1. Central Processor Pins & Saffron Bus Tracks (Clean, spaced, medium density)
        const chipCX = W * 0.50;
        const chipCY = H * 0.48;
        const chipW = Math.min(W * 0.24, 250);
        const chipH = Math.min(H * 0.20, 160);

        // 5 cleanly spaced traces on each side (eliminates crowded lines in the middle)
        const pinCount = Math.max(4, Math.min(6, Math.floor(H / 160)));
        
        // Left bus lines (Cyan sector) - smooth, long tracks extending outward
        for (let i = 0; i < pinCount; i++) {
            const startY = chipCY - chipH * 0.35 + (i / (pinCount - 1 || 1)) * chipH * 0.7;
            const startX = chipCX - chipW * 0.45;
            const midX1 = startX - (80 + i * 40);
            const midY1 = startY + ((i % 2 === 0) ? -45 : 45);
            const midX2 = Math.max(30, W * 0.16 - i * 15);
            const endX = 0;

            const pts = [
                { x: startX, y: startY },
                { x: midX1, y: startY },
                { x: midX1 - 45, y: midY1 },
                { x: midX2, y: midY1 },
                { x: endX, y: midY1 }
            ];
            traces.push(processTrace(pts, COLOR_CYAN));
            nodes.push({ x: startX, y: startY, r: 2.8, style: COLOR_GOLD, flash: 0, phase: i * 0.6 });
            nodes.push({ x: midX2, y: midY1, r: 2.8, style: COLOR_CYAN, flash: 0, phase: i * 0.8 });
        }

        // Right bus lines (IoT Neon Purple/Magenta sector) - smooth, long tracks
        for (let i = 0; i < pinCount; i++) {
            const startY = chipCY - chipH * 0.35 + (i / (pinCount - 1 || 1)) * chipH * 0.7;
            const startX = chipCX + chipW * 0.45;
            const midX1 = startX + (80 + i * 40);
            const midY1 = startY + ((i % 2 === 0) ? 45 : -45);
            const midX2 = Math.min(W - 30, W * 0.84 + i * 15);
            const endX = W;

            const style = (i % 2 === 0) ? COLOR_VIOLET : COLOR_MAGENTA;
            const pts = [
                { x: startX, y: startY },
                { x: midX1, y: startY },
                { x: midX1 + 45, y: midY1 },
                { x: midX2, y: midY1 },
                { x: endX, y: midY1 }
            ];
            traces.push(processTrace(pts, style));
            nodes.push({ x: startX, y: startY, r: 2.8, style: COLOR_GOLD, flash: 0, phase: i * 0.5 });
            nodes.push({ x: midX2, y: midY1, r: 3.0, style: style, flash: 0, phase: i * 0.9 });
        }

        // Top & Bottom Gold Saffron Power Rails (Spaced across outer perimeter)
        for (let i = 0; i < 4; i++) {
            // Top sector
            const topY = 45 + i * (H * 0.08);
            const ptsTop = [
                { x: 0, y: topY },
                { x: W * 0.28 + (i * 70), y: topY },
                { x: W * 0.33 + (i * 70), y: topY + 25 },
                { x: W * 0.67 - (i * 60), y: topY + 25 },
                { x: W * 0.72 - (i * 60), y: topY },
                { x: W, y: topY }
            ];
            traces.push(processTrace(ptsTop, COLOR_GOLD));
            nodes.push({ x: W * 0.33 + (i * 70), y: topY + 25, r: 2.5, style: COLOR_GOLD, flash: 0, phase: i * 0.7 });

            // Bottom sector
            const btmY = H - 55 - i * (H * 0.08);
            const ptsBtm = [
                { x: W, y: btmY },
                { x: W * 0.72 - (i * 70), y: btmY },
                { x: W * 0.67 - (i * 70), y: btmY - 30 },
                { x: W * 0.33 + (i * 60), y: btmY - 30 },
                { x: W * 0.28 + (i * 60), y: btmY },
                { x: 0, y: btmY }
            ];
            traces.push(processTrace(ptsBtm, i % 2 === 0 ? COLOR_GOLD : COLOR_CYAN));
            nodes.push({ x: W * 0.33 + (i * 60), y: btmY - 30, r: 2.5, style: COLOR_CYAN, flash: 0, phase: i * 0.9 });
        }

        // Vertical connecting buses (outer columns only, keeping middle part open and calm)
        for (let i = 0; i < 5; i++) {
            const xPos = W * 0.12 + i * (W * 0.19);
            // Leave the middle 30% area free of vertical cross-traffic
            if (Math.abs(xPos - chipCX) < W * 0.15) continue;

            const y1 = 40;
            const y2 = H * 0.35 + (i % 2) * 50;
            const y3 = H * 0.65 - (i % 2) * 40;
            const y4 = H - 40;

            const style = xPos < W * 0.4 ? COLOR_CYAN : COLOR_VIOLET;
            const ptsV = [
                { x: xPos, y: y1 },
                { x: xPos, y: y2 },
                { x: xPos + 25, y: y2 + 25 },
                { x: xPos + 25, y: y3 },
                { x: xPos, y: y3 + 25 },
                { x: xPos, y: y4 }
            ];
            traces.push(processTrace(ptsV, style));
            nodes.push({ x: xPos, y: y2, r: 2.6, style: style, flash: 0, phase: i });
            nodes.push({ x: xPos + 25, y: y3, r: 2.6, style: style, flash: 0, phase: i + 0.6 });
        }

        // Seed balanced moving pulses along traces at a steady medium speed
        const initialPulseCount = Math.min(traces.length, 26);
        for (let i = 0; i < initialPulseCount; i++) {
            const tIdx = i % traces.length;
            const tr = traces[tIdx];
            pulses.push({
                traceIndex: tIdx,
                distance: Math.random() * tr.totalLength,
                speed: 0.85 + Math.random() * 0.45, // Balanced medium speed
                length: 35 + Math.random() * 45,
                direction: Math.random() > 0.3 ? 1 : -1,
                style: tr.style,
                thickness: 1.8 + Math.random() * 0.8
            });
        }
    }

    // Sparkles / Pollen Dust
    function initSparkles() {
        sparkles = [];
        const count = 45;
        for (let i = 0; i < count; i++) {
            sparkles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 0.6,
                color: Math.random() > 0.4 ? 'rgba(245, 158, 11, ' : 'rgba(56, 189, 248, ',
                alpha: Math.random() * 0.7 + 0.2,
                speedY: -(Math.random() * 0.25 + 0.1), // Gentle slow upward drift
                speedX: (Math.random() - 0.5) * 0.2,
                twinkleSpeed: Math.random() * 0.015 + 0.004,
                twinkleDir: 1
            });
        }
    }

    function spawnClickShockwave(clickX, clickY) {
        shockwaves.push({
            x: clickX,
            y: clickY,
            radius: 5,
            maxRadius: Math.min(width, height) * 0.35,
            alpha: 1,
            color: 'rgba(245, 158, 11, '
        });

        // Trigger excitation in nearby nodes
        nodes.forEach(n => {
            const d = Math.hypot(n.x - clickX, n.y - clickY);
            if (d < 300) {
                n.flash = 1;
            }
        });

        // Spawn smooth burst pulses on nearby traces
        traces.forEach((tr, idx) => {
            const p = tr.points[0];
            if (Math.hypot(p.x - clickX, p.y - clickY) < 350) {
                pulses.push({
                    traceIndex: idx,
                    distance: 0,
                    speed: 1.2 + Math.random() * 0.6, // Calm shockwave speed
                    length: 45,
                    direction: 1,
                    style: tr.style,
                    thickness: 2.2
                });
            }
        });
    }

    // Initialize Network & Sparkles
    buildCircuitNetwork();
    initSparkles();

    // Window Resize Handler with Debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            buildCircuitNetwork();
            initSparkles();
        }, 150);
    });

    let lastTime = performance.now();

    // Main Render Loop (Smooth 60 FPS)
    function render(currentTime) {
        lastTime = currentTime;

        ctx.clearRect(0, 0, width, height);

        // 1. Smooth Background Image Parallax Damping
        if (bgImage) {
            mouse.currentX += (mouse.targetX - mouse.currentX) * 0.05;
            mouse.currentY += (mouse.targetY - mouse.currentY) * 0.05;
            bgImage.style.transform = `translate3d(${mouse.currentX.toFixed(2)}px, ${mouse.currentY.toFixed(2)}px, 0) scale(1.04)`;
        }

        // 2. Draw Circuit Base Traces & Animated Dash Current Flow
        traces.forEach(tr => {
            tr.dashOffset -= 0.28; // Balanced medium electrical current movement

            // Base trace line (soft subtle cyber glow)
            ctx.beginPath();
            ctx.moveTo(tr.points[0].x, tr.points[0].y);
            for (let i = 1; i < tr.points.length; i++) {
                ctx.lineTo(tr.points[i].x, tr.points[i].y);
            }
            ctx.strokeStyle = tr.style.stroke + '0.12)';
            ctx.lineWidth = 1.4;
            ctx.setLineDash([]);
            ctx.stroke();

            // Animated current flow dash stream
            ctx.beginPath();
            ctx.moveTo(tr.points[0].x, tr.points[0].y);
            for (let i = 1; i < tr.points.length; i++) {
                ctx.lineTo(tr.points[i].x, tr.points[i].y);
            }
            ctx.strokeStyle = tr.style.stroke + '0.28)';
            ctx.lineWidth = 1.0;
            ctx.setLineDash([6, 18]);
            ctx.lineDashOffset = tr.dashOffset;
            ctx.stroke();
            ctx.setLineDash([]); // reset
        });

        // 3. Draw & Update Moving Electrical Pulses (Data Photons)
        for (let i = pulses.length - 1; i >= 0; i--) {
            const p = pulses[i];
            const tr = traces[p.traceIndex];
            if (!tr) {
                pulses.splice(i, 1);
                continue;
            }

            p.distance += p.speed * p.direction;

            // Check if pulse has reached trace boundary
            if (p.distance > tr.totalLength || p.distance < 0) {
                // Flash the terminal node
                const endPt = p.direction > 0 ? tr.points[tr.points.length - 1] : tr.points[0];
                nodes.forEach(n => {
                    if (Math.hypot(n.x - endPt.x, n.y - endPt.y) < 25) {
                        n.flash = 1;
                    }
                });

                // Recycle pulse to a random or connected trace
                if (Math.random() > 0.25) {
                    p.traceIndex = Math.floor(Math.random() * traces.length);
                    const newTr = traces[p.traceIndex];
                    p.distance = p.direction > 0 ? 0 : newTr.totalLength;
                    p.style = newTr.style;
                    p.speed = 0.85 + Math.random() * 0.45; // Balanced medium recycle speed
                } else {
                    // Loop along same trace
                    p.distance = p.direction > 0 ? 0 : tr.totalLength;
                }
                continue;
            }

            // Draw glowing light pulse trail
            const head = getPointAtDistance(tr, p.distance);
            const tailDist = p.distance - (p.length * p.direction);
            const tail = getPointAtDistance(tr, tailDist);

            const midDist = p.distance - (p.length * 0.5 * p.direction);
            const mid = getPointAtDistance(tr, midDist);

            const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
            grad.addColorStop(0, p.style.stroke + '0)');
            grad.addColorStop(0.5, p.style.stroke + '0.5)');
            grad.addColorStop(1, p.style.head);

            ctx.beginPath();
            ctx.moveTo(tail.x, tail.y);
            ctx.lineTo(mid.x, mid.y);
            ctx.lineTo(head.x, head.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = p.thickness;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.style.glow;
            ctx.stroke();

            // Blazing photon head
            ctx.beginPath();
            ctx.arc(head.x, head.y, p.thickness + 0.8, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 14;
            ctx.shadowColor = p.style.glow;
            ctx.fill();

            ctx.shadowBlur = 0; // reset
        }

        // 4. Draw & Animate Circuit Nodes (Solder Pads & Junction Rings)
        const timeSec = currentTime * 0.002;
        nodes.forEach(n => {
            // Decay flash
            if (n.flash > 0) n.flash -= 0.035;
            if (n.flash < 0) n.flash = 0;

            const pulseScale = 1 + 0.25 * Math.sin(timeSec * 2.5 + n.phase) + n.flash * 1.5;
            const currentR = n.r * pulseScale;

            // Outer junction ring
            ctx.beginPath();
            ctx.arc(n.x, n.y, currentR * 1.6, 0, Math.PI * 2);
            ctx.strokeStyle = n.style.stroke + (0.2 + n.flash * 0.6) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Inner solid solder pad
            ctx.beginPath();
            ctx.arc(n.x, n.y, currentR, 0, Math.PI * 2);
            ctx.fillStyle = n.flash > 0.3 ? '#ffffff' : n.style.stroke + (0.5 + n.flash * 0.5) + ')';
            if (n.flash > 0.2) {
                ctx.shadowBlur = 12;
                ctx.shadowColor = n.style.glow;
            }
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        });

        // 5. Draw Expanding Click Shockwaves
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const sw = shockwaves[i];
            sw.radius += 5.5;
            sw.alpha -= 0.02;

            if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
                shockwaves.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.strokeStyle = sw.color + sw.alpha + ')';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = sw.color + '0.8)';
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // 6. Draw Ambient Saffron Gold Sparkles / Pollen Dust
        sparkles.forEach(s => {
            s.y += s.speedY;
            s.x += s.speedX;

            s.alpha += s.twinkleSpeed * s.twinkleDir;
            if (s.alpha >= 0.85) s.twinkleDir = -1;
            if (s.alpha <= 0.15) s.twinkleDir = 1;

            if (s.y < 0) {
                s.y = height;
                s.x = Math.random() * width;
            }
            if (s.x < 0) s.x = width;
            if (s.x > width) s.x = 0;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fillStyle = s.color + s.alpha + ')';
            ctx.shadowBlur = s.radius * 5;
            ctx.shadowColor = s.color + '0.7)';
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

/* ==========================================================================
   2. Real-time ESP32 IoT Microclimate Simulator
   ========================================================================== */
function initIoTSimulator() {
    const tempSlider = document.getElementById('tempSlider');
    const humiditySlider = document.getElementById('humiditySlider');
    const co2Slider = document.getElementById('co2Slider');

    const tempDisplay = document.getElementById('tempDisplay');
    const humidityDisplay = document.getElementById('humidityDisplay');
    const co2Display = document.getElementById('co2Display');

    const fanActuator = document.getElementById('fanActuator');
    const fanStatus = document.getElementById('fanStatus');
    const mistActuator = document.getElementById('mistActuator');
    const mistStatus = document.getElementById('mistStatus');

    const soundToggle = document.getElementById('soundToggle');
    const soundActuator = document.getElementById('soundActuator');
    const soundStatus = document.getElementById('soundStatus');
    const soundFreqLabel = document.getElementById('soundFreqLabel');

    const ledToggle = document.getElementById('ledToggle');
    const ledActuator = document.getElementById('ledActuator');
    const ledStatus = document.getElementById('ledStatus');

    const consoleBody = document.getElementById('consoleBody');
    const resetSimBtn = document.getElementById('resetSimBtn');

    function updateSimulation() {
        const temp = parseFloat(tempSlider.value);
        const humidity = parseInt(humiditySlider.value);
        const co2 = parseInt(co2Slider.value);

        tempDisplay.textContent = temp.toFixed(1) + ' °C';
        humidityDisplay.textContent = humidity + ' %';
        co2Display.textContent = co2 + ' ppm';

        // Fan Logic (> 24°C)
        if (temp > 24.0) {
            fanActuator.classList.add('active');
            fanStatus.textContent = 'ON (COOLING)';
        } else {
            fanActuator.classList.remove('active');
            fanStatus.textContent = 'OFF';
        }

        // Mist Maker Logic (< 40%)
        if (humidity < 40) {
            mistActuator.classList.add('active');
            mistStatus.textContent = 'ON (MISTING)';
        } else {
            mistActuator.classList.remove('active');
            mistStatus.textContent = 'OFF';
        }

        // Sound Toggle
        if (soundToggle.checked) {
            soundActuator.classList.add('active');
            const selectedFreq = document.querySelector('input[name="freq"]:checked')?.value || '432';
            soundStatus.textContent = 'ACTIVE (' + selectedFreq + ' Hz)';
            soundFreqLabel.textContent = selectedFreq + ' Hz Sound Wave Active';
        } else {
            soundActuator.classList.remove('active');
            soundStatus.textContent = 'MUTED';
            soundFreqLabel.textContent = 'Sound Inactive';
        }

        // LED Toggle
        if (ledToggle.checked) {
            ledActuator.classList.add('active');
            ledStatus.textContent = 'ON (80% PWM)';
        } else {
            ledActuator.classList.remove('active');
            ledStatus.textContent = 'OFF';
        }
    }

    function appendConsoleLog(message, type = 'info') {
        if (!consoleBody) return;
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        const timeStr = new Date().toLocaleTimeString();
        entry.textContent = `[${timeStr}] ${message}`;
        consoleBody.appendChild(entry);
        consoleBody.scrollTop = consoleBody.scrollHeight;

        // Keep last 15 entries
        while (consoleBody.children.length > 15) {
            consoleBody.removeChild(consoleBody.firstChild);
        }
    }

    tempSlider.addEventListener('input', () => {
        updateSimulation();
        const t = parseFloat(tempSlider.value);
        if (t > 24) appendConsoleLog(`DHT11 Alert: Temp ${t}°C > 24.0°C. Cooler Fan Engaged!`, 'warn');
        else if (t < 18) appendConsoleLog(`DHT11: Temp ${t}°C < 18.0°C. Cold stimulus active for bloom.`, 'success');
    });

    humiditySlider.addEventListener('input', () => {
        updateSimulation();
        const h = parseInt(humiditySlider.value);
        if (h < 40) appendConsoleLog(`DHT11 Alert: Humidity ${h}% < 40%. Ultrasonic Mist Maker ON!`, 'warn');
    });

    co2Slider.addEventListener('input', () => {
        updateSimulation();
    });

    soundToggle.addEventListener('change', () => {
        updateSimulation();
        appendConsoleLog(`Acoustic System: Sound frequency wave generator ${soundToggle.checked ? 'ENABLED' : 'DISABLED'}`, 'info');
    });

    document.querySelectorAll('input[name="freq"]').forEach(radio => {
        radio.addEventListener('change', () => {
            updateSimulation();
            appendConsoleLog(`Acoustic Frequency switched to ${radio.value} Hz tuning`, 'success');
        });
    });

    ledToggle.addEventListener('change', () => {
        updateSimulation();
        appendConsoleLog(`PWM Grow Lights ${ledToggle.checked ? 'TURNED ON' : 'TURNED OFF'}`, 'info');
    });

    if (resetSimBtn) {
        resetSimBtn.addEventListener('click', () => {
            tempSlider.value = 22;
            humiditySlider.value = 52;
            co2Slider.value = 500;
            soundToggle.checked = true;
            ledToggle.checked = true;
            updateSimulation();
            appendConsoleLog(`Simulator reset to default microclimate conditions.`, 'info');
        });
    }

    updateSimulation();
}

/* ==========================================================================
   3. Marketplace Category Filtering
   ========================================================================== */
function initMarketplace() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   4. Kesar Corm Cart & Quote Drawer System
   ========================================================================== */
let cart = [];

function initCartSystem() {
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartCount = document.getElementById('cartCount');
    const cartBody = document.getElementById('cartBody');
    const cartTotalItems = document.getElementById('cartTotalItems');
    const checkoutQuoteBtn = document.getElementById('checkoutQuoteBtn');

    function toggleCart(show) {
        if (show) {
            cartOverlay.classList.add('active');
            cartDrawer.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            cartOverlay.classList.remove('active');
            cartDrawer.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (cartBtn) cartBtn.addEventListener('click', () => toggleCart(true));
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
    if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

    // Add to Cart buttons
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const unit = btn.getAttribute('data-unit');

            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ id, name, unit, qty: 1 });
            }

            updateCartUI();
            toggleCart(true);
        });
    });

    function updateCartUI() {
        if (!cartCount) return;
        const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.textContent = totalCount;
        if (cartTotalItems) cartTotalItems.textContent = cart.length;

        if (cart.length === 0) {
            cartBody.innerHTML = `
                <div class="empty-cart-msg">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <p>Your quote cart is empty. Browse items from the Kesar Corm Marketplace.</p>
                </div>
            `;
            return;
        }

        let html = '';
        cart.forEach(item => {
            html += `
                <div class="cart-item">
                    <div>
                        <strong style="color:var(--text-primary); font-size:0.95rem;">${item.name}</strong>
                        <div style="font-size:0.8rem; color:var(--text-muted);">Quantity: ${item.qty} ${item.unit}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <button class="btn btn-outline btn-xs" onclick="changeCartQty('${item.id}', -1)">-</button>
                        <span style="font-weight:700;">${item.qty}</span>
                        <button class="btn btn-outline btn-xs" onclick="changeCartQty('${item.id}', 1)">+</button>
                    </div>
                </div>
            `;
        });
        cartBody.innerHTML = html;
    }

    window.changeCartQty = (id, delta) => {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
        }
        updateCartUI();
    };

    if (checkoutQuoteBtn) {
        checkoutQuoteBtn.addEventListener('click', () => {
            toggleCart(false);
            const dealerSection = document.getElementById('dealer-portal');
            if (dealerSection) {
                dealerSection.scrollIntoView({ behavior: 'smooth' });
                // Fill message
                const msgBox = document.getElementById('buyerMessage');
                if (msgBox) {
                    const itemNames = cart.map(i => `${i.name} (${i.qty} ${i.unit})`).join(', ');
                    msgBox.value = `Selected Cart Items for Quotation: ${itemNames}`;
                }
            }
        });
    }
}

/* ==========================================================================
   5. Interactive Yield & ROI Calculator
   ========================================================================== */
function initYieldCalculator() {
    const cormInput = document.getElementById('cormCountInput');
    const chamberSelect = document.getElementById('chamberTypeSelect');

    const resFlowers = document.getElementById('resFlowers');
    const resStigma = document.getElementById('resStigma');
    const resDaughters = document.getElementById('resDaughters');

    function calculateYield() {
        if (!cormInput || !chamberSelect) return;

        const corms = Math.max(10, parseInt(cormInput.value) || 0);
        const multiplier = parseFloat(chamberSelect.value) || 1.0;

        // Calculations based on agricultural saffron literature
        // 1 Corm yields approx 1.2 to 1.8 flowers in indoor microclimate
        const flowers = Math.round(corms * 1.25 * multiplier);

        // 1 Flower produces approx 7 mg (0.007g) of dry stigma threads
        const stigmaGrams = (flowers * 0.007).toFixed(2);

        // Corm multiplication: 1 mother bulb yields 2-4 daughter corms
        const daughters = Math.round(corms * 3);

        if (resFlowers) resFlowers.textContent = flowers.toLocaleString();
        if (resStigma) resStigma.textContent = `${stigmaGrams} grams`;
        if (resDaughters) resDaughters.textContent = `${daughters.toLocaleString()} Corms`;
    }

    if (cormInput) cormInput.addEventListener('input', calculateYield);
    if (chamberSelect) chamberSelect.addEventListener('change', calculateYield);

    calculateYield();
}

/* ==========================================================================
   6. B2B Dealer Form Submission & Automatic Email Dispatcher
   ========================================================================== */
function initDealerForm() {
    const dealerForm = document.getElementById('dealerForm');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (dealerForm) {
        dealerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('buyerName')?.value || 'Client';
            const phone = document.getElementById('buyerPhone')?.value || '+91 9148164252';
            const email = document.getElementById('buyerEmail')?.value || 'N/A';
            const category = document.getElementById('buyerType')?.value || 'Dealer';
            const quantity = document.getElementById('cormQuantity')?.value || 'Not specified';
            const message = document.getElementById('buyerMessage')?.value || 'None';

            const subject = encodeURIComponent(`🚨 New Wholesale Kesar Saffron Quote Request from ${name}`);
            const body = encodeURIComponent(
                `Hello Praveen Patil,\n\nYou have received a new Wholesale Saffron & Corm Quotation Request:\n\n` +
                `👤 Name / Business: ${name}\n` +
                `📞 Contact Phone: ${phone}\n` +
                `✉️ Email Address: ${email}\n` +
                `🏷️ Category: ${category}\n` +
                `📦 Required Quantity: ${quantity}\n` +
                `📝 Inquiry Details: ${message}\n\n` +
                `-----------------------------------------\n` +
                `Sent via Smart Saffron Cultivation Web Portal`
            );

            // 1. Send via background FormSubmit API to praveenkpatil08@gmail.com
            fetch('https://formsubmit.co/ajax/praveenkpatil08@gmail.com', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `New Wholesale Saffron Quote Request from ${name}`,
                    Name: name,
                    Phone: phone,
                    Email: email,
                    Category: category,
                    Quantity: quantity,
                    Message: message
                })
            }).catch(err => console.log('FormSubmit background dispatch:', err));

            // 2. Open client mailto as instant backup
            setTimeout(() => {
                window.location.href = `mailto:praveenkpatil08@gmail.com?subject=${subject}&body=${body}`;
            }, 300);

            // 3. Display confirmation modal
            if (modalOverlay) {
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            dealerForm.reset();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (modalOverlay) modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}
