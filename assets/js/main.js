// ===== PRO PAGE: copy-to-clipboard =====
        (function () {
            const promoParams = new URLSearchParams(window.location.search);
            if (promoParams.get('pro') === '1') {
                const copyButton = document.getElementById('copyPromoCode');
                const promoCode = document.getElementById('promoCode');
                if (copyButton && promoCode) {
                    copyButton.addEventListener('click', async () => {
                        try {
                            await navigator.clipboard.writeText(promoCode.textContent.trim());
                            copyButton.textContent = 'Copied!';
                            setTimeout(() => { copyButton.textContent = 'Copy'; }, 1800);
                        } catch (_) {
                            copyButton.textContent = 'Select code';
                        }
                    });
                }
            }
        })();

        // ===== HEADER SCROLL STATE =====
        const header = document.getElementById('header');
        if (header) {
            window.addEventListener('scroll', () => {
                header.classList.toggle('scrolled', window.pageYOffset > 60);
            });
        }

        // ===== LIVE CLOCK =====
        (function () {
            const clock = document.getElementById('navClock');
            if (!clock) return;
            function tick() {
                const now = new Date();
                const hh = String(now.getHours()).padStart(2, '0');
                const mm = String(now.getMinutes()).padStart(2, '0');
                const ss = String(now.getSeconds()).padStart(2, '0');
                clock.textContent = `${hh}:${mm}:${ss}`;
            }
            tick();
            setInterval(tick, 1000);
        })();

        // ===== SMOOTH SCROLL =====
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const href = a.getAttribute('href');
                if (href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });

        // ===== SECTION REVEAL (orchestrated once per section, not per card) =====
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
        document.querySelectorAll('.reveal-section').forEach(el => revealObs.observe(el));

        // ===== AMBIENT PARTICLE FIELD =====
        (function () {
            const canvas = document.getElementById('bgFX');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            let w, h, particles;

            function resize() {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
            }
            window.addEventListener('resize', resize);
            resize();

            const count = Math.max(24, Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 18000)));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
            }));

            function draw() {
                ctx.clearRect(0, 0, w, h);
                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0 || p.x > w) p.vx *= -1;
                    if (p.y < 0 || p.y > h) p.vy *= -1;
                });
                for (let i = 0; i < particles.length; i++) {
                    const a = particles[i];
                    ctx.beginPath();
                    ctx.arc(a.x, a.y, 1.4, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(156,140,255,0.5)';
                    ctx.fill();
                    for (let j = i + 1; j < particles.length; j++) {
                        const b = particles[j];
                        const dx = a.x - b.x, dy = a.y - b.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 130) {
                            ctx.beginPath();
                            ctx.moveTo(a.x, a.y);
                            ctx.lineTo(b.x, b.y);
                            ctx.strokeStyle = `rgba(108,92,231,${0.12 * (1 - dist / 130)})`;
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                    }
                }
                if (!reduceMotion) requestAnimationFrame(draw);
            }
            draw();
        })();

        // ===== PHONE TIMELINE DEMO =====
        const demoBlocks = [
            { time: '7 AM', title: 'Morning Workout', dur: '1h', color: 'var(--coral)', height: 44 },
            { time: '9 AM', title: 'Deep Work', dur: '2h', color: 'var(--violet)', height: 60 },
            { time: '11 AM', title: 'Team Standup', dur: '30m', color: 'var(--sky)', height: 28 },
            { time: '12 PM', title: 'Lunch Break', dur: '1h', color: 'var(--mint)', height: 34 },
            { time: '2 PM', title: 'Focus Session', dur: '2h', color: 'var(--amber)', height: 60 },
            { time: '5 PM', title: 'Review & Plan', dur: '30m', color: 'var(--rose)', height: 28 },
        ];
        const phoneUI = document.getElementById('phoneUI');
        const now = new Date();
        document.getElementById('phoneDate').textContent =
            now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        let bi = 0;
        function addNextBlock() {
            if (bi >= demoBlocks.length) {
                bi = 0;
                phoneUI.querySelectorAll('.time-row').forEach(r => r.remove());
            }
            const b = demoBlocks[bi++];
            const row = document.createElement('div');
            row.className = 'time-row';
            row.innerHTML = `
                <span class="time-label">${b.time}</span>
                <div class="time-line">
                    <div class="t-block" style="background:${b.color};height:${b.height}px">
                        <div class="t-block-title">${b.title}</div>
                        <div class="t-block-dur">${b.dur}</div>
                    </div>
                    <div class="time-divider"></div>
                </div>`;
            phoneUI.appendChild(row);
        }
        addNextBlock();
        setInterval(addNextBlock, 1800);

        // ===== PHONE TILT ON CURSOR =====
        const phoneStage = document.getElementById('phoneStage');
        const phoneFrame = document.getElementById('phoneFrame');
        if (phoneStage && phoneFrame && window.matchMedia('(pointer: fine)').matches) {
            phoneStage.addEventListener('mousemove', (e) => {
                const rect = phoneStage.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                phoneFrame.style.transform =
                    `rotateY(${(-10 + x * 16).toFixed(2)}deg) rotateX(${(5 - y * 12).toFixed(2)}deg)`;
            });
            phoneStage.addEventListener('mouseleave', () => {
                phoneFrame.style.transform = '';
            });
        }

        // ===== BENTO CARD TILT + SPOTLIGHT ON CURSOR =====
        if (window.matchMedia('(pointer: fine)').matches) {
            document.querySelectorAll('.bento-item').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    card.style.transform =
                        `perspective(700px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-3px)`;
                    card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
                    card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
                });
                card.addEventListener('mouseleave', () => { card.style.transform = ''; });
            });
        }

        // ===== WIDGET: LIVE DRAG & RESIZE =====
        (function () {
            const track = document.getElementById('dragTrack');
            if (!track) return;
            const trackHeight = 175;
            const minH = 24, maxH = 90;

            track.querySelectorAll('.drag-block').forEach(block => {
                let dragging = false, resizing = false, startY = 0, startTop = 0, startH = 0;

                block.addEventListener('pointerdown', (e) => {
                    if (e.target.classList.contains('resize-handle')) return;
                    dragging = true;
                    startY = e.clientY;
                    startTop = parseFloat(block.style.top);
                    block.style.zIndex = 5;
                    block.setPointerCapture(e.pointerId);
                });
                block.addEventListener('pointermove', (e) => {
                    if (!dragging) return;
                    const dy = e.clientY - startY;
                    const h = parseFloat(block.style.height);
                    let newTop = Math.max(0, Math.min(trackHeight - h, startTop + dy));
                    block.style.top = newTop + 'px';
                });
                block.addEventListener('pointerup', () => { dragging = false; block.style.zIndex = ''; });
                block.addEventListener('pointercancel', () => { dragging = false; block.style.zIndex = ''; });

                const handle = block.querySelector('.resize-handle');
                if (handle) {
                    handle.addEventListener('pointerdown', (e) => {
                        e.stopPropagation();
                        resizing = true;
                        startY = e.clientY;
                        startH = parseFloat(block.style.height);
                        handle.setPointerCapture(e.pointerId);
                    });
                    handle.addEventListener('pointermove', (e) => {
                        if (!resizing) return;
                        e.stopPropagation();
                        const dy = e.clientY - startY;
                        const top = parseFloat(block.style.top);
                        let newH = Math.max(minH, Math.min(maxH, startH + dy));
                        if (top + newH <= trackHeight) block.style.height = newH + 'px';
                    });
                    handle.addEventListener('pointerup', (e) => { e.stopPropagation(); resizing = false; });
                    handle.addEventListener('pointercancel', (e) => { e.stopPropagation(); resizing = false; });
                }
            });
        })();

        // ===== WIDGET: HEATMAP =====
        (function () {
            const grid = document.getElementById('heatmapGrid');
            if (!grid) return;
            const alphas = [0.06, 0.35, 0.65, 1];
            for (let i = 0; i < 28; i++) {
                const cell = document.createElement('button');
                cell.type = 'button';
                cell.className = 'heat-cell';
                cell.setAttribute('aria-label', 'Toggle day');
                let level = Math.random() < 0.55 ? Math.floor(Math.random() * 4) : 0;
                cell.dataset.level = level;
                cell.style.background = `rgba(47, 217, 138, ${alphas[level]})`;
                cell.addEventListener('click', () => {
                    level = (parseInt(cell.dataset.level, 10) + 1) % 4;
                    cell.dataset.level = level;
                    cell.style.background = `rgba(47, 217, 138, ${alphas[level]})`;
                });
                grid.appendChild(cell);
            }
        })();

        // ===== WIDGET: STREAK =====
        (function () {
            const container = document.getElementById('streakDays');
            const numEl = document.getElementById('streakNum');
            if (!container || !numEl) return;
            const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
            const state = labels.map(() => false);
            labels.forEach((label, i) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'streak-day';
                dot.textContent = label;
                dot.addEventListener('click', () => {
                    state[i] = !state[i];
                    dot.classList.toggle('done', state[i]);
                    let count = 0;
                    for (let j = 0; j < state.length; j++) {
                        if (state[j]) count++; else break;
                    }
                    numEl.textContent = count;
                });
                container.appendChild(dot);
            });
        })();

        // ===== WIDGET: REUSE ROUTINE (drag chip onto drop zone) =====
        (function () {
            const chip = document.getElementById('routineChip');
            const drop = document.getElementById('routineDrop');
            if (!chip || !drop) return;
            let ghost = null;

            function moveGhost(x, y) {
                if (ghost) { ghost.style.left = x + 'px'; ghost.style.top = y + 'px'; }
            }
            function isOver(x, y) {
                const rect = drop.getBoundingClientRect();
                return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
            }

            chip.addEventListener('pointerdown', (e) => {
                chip.classList.add('dragging');
                ghost = document.createElement('div');
                ghost.className = 'routine-chip-ghost';
                ghost.textContent = chip.textContent;
                document.body.appendChild(ghost);
                moveGhost(e.clientX, e.clientY);
                chip.setPointerCapture(e.pointerId);
            });
            chip.addEventListener('pointermove', (e) => {
                if (!ghost) return;
                moveGhost(e.clientX, e.clientY);
                drop.classList.toggle('over', isOver(e.clientX, e.clientY));
            });
            chip.addEventListener('pointerup', (e) => {
                chip.classList.remove('dragging');
                if (isOver(e.clientX, e.clientY)) {
                    drop.textContent = '🌅 Morning Routine added';
                    drop.classList.add('filled');
                    setTimeout(() => {
                        drop.classList.remove('filled', 'over');
                        drop.textContent = 'Drop on a day';
                    }, 1800);
                }
                drop.classList.remove('over');
                if (ghost) { ghost.remove(); ghost = null; }
            });
            chip.addEventListener('pointercancel', () => {
                chip.classList.remove('dragging');
                drop.classList.remove('over');
                if (ghost) { ghost.remove(); ghost = null; }
            });
        })();

        // ===== WIDGET: OFFLINE TOGGLE =====
        (function () {
            const toggle = document.getElementById('offlineToggle');
            const label = document.getElementById('offlineToggleLabel');
            if (!toggle || !label) return;
            toggle.addEventListener('click', () => {
                const isOffline = toggle.getAttribute('aria-pressed') === 'true';
                toggle.setAttribute('aria-pressed', String(!isOffline));
                label.textContent = isOffline ? 'Wi-Fi on' : 'Wi-Fi off';
            });
        })();

        // ===== WIDGET: PLANNED VS ACTUAL SLIDER =====
        (function () {
            const demoEl = document.getElementById('compareDemo');
            const actual = document.getElementById('compareActual');
            const handle = document.getElementById('compareHandle');
            if (!demoEl || !actual || !handle) return;
            let dragging = false;

            function setPos(clientX) {
                const rect = demoEl.getBoundingClientRect();
                let pct = ((clientX - rect.left) / rect.width) * 100;
                pct = Math.max(0, Math.min(100, pct));
                handle.style.left = pct + '%';
                actual.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
            }
            handle.addEventListener('pointerdown', (e) => { dragging = true; handle.setPointerCapture(e.pointerId); });
            handle.addEventListener('pointermove', (e) => { if (dragging) setPos(e.clientX); });
            handle.addEventListener('pointerup', () => { dragging = false; });
            demoEl.addEventListener('pointerdown', (e) => {
                if (e.target === handle) return;
                setPos(e.clientX);
            });
        })();

        // ===== HOW IT WORKS SCRUBBER =====
        (function () {
            const track = document.getElementById('scrubberTrack');
            const handle = document.getElementById('scrubberHandle');
            const fill = document.getElementById('scrubberFill');
            const numEl = document.getElementById('scrubberNum');
            const titleEl = document.getElementById('scrubberTitle');
            const bodyEl = document.getElementById('scrubberBody');
            if (!track || !handle) return;
            const stops = track.querySelectorAll('.scrubber-stop');

            const steps = [
                { title: 'Open the app', body: 'No sign-up, no account. Add your first block in seconds — name it, color it, place it on the timeline.' },
                { title: 'Drag your day into place', body: 'Move blocks to rearrange, drag an edge to resize. Build the whole day visually — no typing required.' },
                { title: 'Watch it play out', body: 'Follow your streak, then check the daily summary to see how the real day compared to the plan.' }
            ];

            let dragging = false;

            function render(index, pct) {
                handle.style.left = pct + '%';
                fill.style.width = pct + '%';
                stops.forEach(s => s.classList.toggle('active', parseInt(s.dataset.index, 10) <= index));
                if (numEl) numEl.textContent = index + 1;
                if (titleEl) titleEl.textContent = steps[index].title;
                if (bodyEl) bodyEl.textContent = steps[index].body;
            }

            function setFromClientX(clientX, snap) {
                const rect = track.getBoundingClientRect();
                let pct = ((clientX - rect.left) / rect.width) * 100;
                pct = Math.max(0, Math.min(100, pct));
                let index = Math.round(pct / 50);
                if (snap) pct = index * 50;
                render(index, pct);
            }

            handle.addEventListener('pointerdown', (e) => { dragging = true; handle.setPointerCapture(e.pointerId); });
            handle.addEventListener('pointermove', (e) => { if (dragging) setFromClientX(e.clientX, false); });
            handle.addEventListener('pointerup', (e) => { dragging = false; setFromClientX(e.clientX, true); });

            stops.forEach(stop => {
                stop.addEventListener('click', () => {
                    const index = parseInt(stop.dataset.index, 10);
                    render(index, index * 50);
                });
            });
        })();

        // ===== HERO: INTERACTIVE 3D BLOCK CLUSTER =====
        (function () {
            const canvas = document.getElementById('heroCanvas');
            if (!canvas || typeof THREE === 'undefined') return;

            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
            camera.position.set(0, 0.9, 8.5);
            camera.lookAt(0, 0, 0);

            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

            const group = new THREE.Group();
            scene.add(group);

            const blockDefs = [
                { h: 1.15, color: 0xFF6B5E },
                { h: 1.85, color: 0x6C5CE7 },
                { h: 0.75, color: 0x4FB8F0 },
                { h: 1.35, color: 0x2FD98A },
                { h: 0.95, color: 0xF5B942 },
                { h: 1.55, color: 0xF0629A },
                { h: 1.05, color: 0x9C8CFF },
            ];

            const meshes = [];
            blockDefs.forEach((def, i) => {
                const geo = new THREE.BoxGeometry(1.05, def.h, 1.05);
                const mat = new THREE.MeshStandardMaterial({ color: def.color, roughness: 0.4, metalness: 0.08 });
                const mesh = new THREE.Mesh(geo, mat);
                const angle = (i / blockDefs.length) * Math.PI * 2;
                const radius = 2.1;
                mesh.position.x = Math.cos(angle) * radius;
                mesh.position.z = Math.sin(angle) * radius;
                const baseY = def.h / 2 - 1.3 + (i % 2) * 0.2;
                mesh.position.y = baseY;
                mesh.userData.baseY = baseY;
                mesh.userData.floatOffset = i * 0.9;
                group.add(mesh);
                meshes.push(mesh);
            });

            scene.add(new THREE.AmbientLight(0xffffff, 0.55));
            const key = new THREE.DirectionalLight(0xffffff, 0.85);
            key.position.set(4, 6, 5);
            scene.add(key);
            const rim = new THREE.PointLight(0x9c8cff, 1.6, 24);
            rim.position.set(-5, 2, -3);
            scene.add(rim);
            const fillLight = new THREE.PointLight(0xff6b5e, 0.5, 20);
            fillLight.position.set(4, -2, 3);
            scene.add(fillLight);

            function resize() {
                const parent = canvas.parentElement;
                const w = parent.clientWidth || 1;
                const h = parent.clientHeight || 1;
                renderer.setSize(w, h, false);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            }
            window.addEventListener('resize', resize);
            resize();

            let targetRotY = 0.55, currentRotY = 0.55;
            let targetRotX = 0, currentRotX = 0;
            let dragging = false, lastX = 0;

            function updateFromPointer(clientX, clientY) {
                const rect = canvas.getBoundingClientRect();
                const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
                const ny = ((clientY - rect.top) / rect.height) * 2 - 1;
                targetRotX = ny * 0.22;
                if (!dragging) targetRotY = 0.55 + nx * 0.35;
            }

            function beginDrag(clientX) {
                dragging = true;
                lastX = clientX;
            }
            function moveDrag(clientX, clientY) {
                updateFromPointer(clientX, clientY);
                if (dragging) {
                    const dx = clientX - lastX;
                    targetRotY += dx * 0.008;
                    lastX = clientX;
                }
            }
            function endDrag() { dragging = false; }

            // Pointer Events (covers mouse, touch and pen on modern browsers)
            canvas.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                beginDrag(e.clientX);
                try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* not critical */ }
            }, { passive: false });
            canvas.addEventListener('pointermove', (e) => {
                if (dragging) e.preventDefault();
                moveDrag(e.clientX, e.clientY);
            }, { passive: false });
            window.addEventListener('pointerup', endDrag);
            window.addEventListener('pointercancel', endDrag);
            canvas.addEventListener('pointerleave', () => { if (!dragging) targetRotX = 0; });

            // Plain touch-event fallback for the rare mobile browser that
            // doesn't implement Pointer Events at all. Guarded so it never
            // double-fires alongside the pointer listeners above.
            if (!window.PointerEvent) {
                canvas.addEventListener('touchstart', (e) => {
                    if (!e.touches || !e.touches.length) return;
                    e.preventDefault();
                    beginDrag(e.touches[0].clientX);
                }, { passive: false });
                canvas.addEventListener('touchmove', (e) => {
                    if (!e.touches || !e.touches.length) return;
                    e.preventDefault();
                    moveDrag(e.touches[0].clientX, e.touches[0].clientY);
                }, { passive: false });
                canvas.addEventListener('touchend', endDrag, { passive: true });
                canvas.addEventListener('touchcancel', endDrag, { passive: true });
            }

            let t = 0;
            function animate() {
                t += 0.016;
                if (!dragging) targetRotY += 0.0022;
                currentRotY += (targetRotY - currentRotY) * 0.06;
                currentRotX += (targetRotX - currentRotX) * 0.06;
                group.rotation.y = currentRotY;
                group.rotation.x = currentRotX * 0.3;
                meshes.forEach((mesh) => {
                    mesh.position.y = mesh.userData.baseY + Math.sin(t + mesh.userData.floatOffset) * 0.09;
                });
                renderer.render(scene, camera);
                if (!reduceMotion) requestAnimationFrame(animate);
            }
            animate();
        })();

        console.log('%cDayBloc 🟣🟡🔴', 'font-size:40px;font-weight:900;background:linear-gradient(135deg,#6C5CE7,#9C8CFF);-webkit-background-clip:text;color:transparent;');
        console.log('%c⏱  Block your day. Own your life.', 'font-size:14px;color:#9C8CFF;');
        console.log('%c📧 dayblocapp@gmail.com', 'font-size:12px;color:#97949F;');
