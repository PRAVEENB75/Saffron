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
   1. Interactive Glitter & Sparkle Canvas Animation Engine
   ========================================================================== */
function initGlitterCanvas() {
    const canvas = document.getElementById('glitterCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particleCount = 75;
    const particles = [];

    // Particle Object Definition
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.5 + 0.5,
            color: Math.random() > 0.5 ? 'rgba(245, 158, 11, ' : 'rgba(139, 92, 246, ',
            alpha: Math.random(),
            speedY: Math.random() * -0.5 - 0.2,
            speedX: Math.random() * 0.4 - 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            twinkleDir: 1
        });
    }

    function renderParticles() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;

            // Twinkle effect
            p.alpha += p.twinkleSpeed * p.twinkleDir;
            if (p.alpha >= 0.9) p.twinkleDir = -1;
            if (p.alpha <= 0.1) p.twinkleDir = 1;

            // Reset bounds
            if (p.y < 0) {
                p.y = height;
                p.x = Math.random() * width;
            }
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;

            // Draw glowing glitter star
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.shadowBlur = p.radius * 6;
            ctx.shadowColor = p.color + '0.8)';
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        });

        requestAnimationFrame(renderParticles);
    }

    renderParticles();
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
