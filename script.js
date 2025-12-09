document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Fade-in animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Scroll Progress
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        document.querySelector('.scroll-progress').style.width = scrolled + '%';
    });

    // Typing Effect
    const heroTitle = document.querySelector('.hero h2');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        setTimeout(() => {
            const interval = setInterval(() => {
                heroTitle.textContent += text.charAt(i);
                i++;
                if (i >= text.length) clearInterval(interval);
            }, 30);
        }, 500);
    }

    // PARTICLE SYSTEM
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Configuration
        const particleCount = 60;
        const connectionDistance = 150;
        const mouseDistance = 200;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            resize();
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        let mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, index) => {
                p.update();
                p.draw();

                // Connect particles
                for (let j = index; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.strokeStyle = `rgba(56, 189, 248, ${1 - distance / connectionDistance})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                if (mouse.x != null) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouseDistance) {
                        ctx.strokeStyle = `rgba(56, 189, 248, ${1 - distance / mouseDistance})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        }

        init();
        animate();
        window.addEventListener('resize', resize);
    }
});
