/*!
 * Astra Documentation JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== CODE TABS FUNCTIONALITY =====
    const codeTabs = document.querySelectorAll('.docs-code-tabs .nav-link');
    
    codeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const container = this.closest('.docs-code-example');
            
            // Remove active class from all tabs and content
            container.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
            container.querySelectorAll('.docs-code-tab').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            container.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        });
    });

    // ===== TOAST FUNCTIONALITY =====
    window.showToast = function(type) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toastConfig = {
            success: { icon: '✓', title: 'Success', message: 'Operation completed successfully!', class: 'bg-g text-white' },
            error: { icon: '✗', title: 'Error', message: 'Something went wrong. Please try again.', class: 'bg-r text-white' },
            warning: { icon: '⚠', title: 'Warning', message: 'Please check your input and try again.', class: 'bg-y text-black' },
            info: { icon: 'ℹ', title: 'Info', message: 'Here is some important information for you.', class: 'bg-b text-white' }
        };

        const config = toastConfig[type];
        if (!config) return;

        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="toast-header">
                <span class="badge ${config.class} me-2">${config.icon}</span>
                <strong class="me-auto">${config.title}</strong>
                <small>Just now</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${config.message}
            </div>
        `;

        // Add close functionality
        const closeBtn = toast.querySelector('.btn-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);

        toastContainer.appendChild(toast);
    };

    // ===== RATING FUNCTIONALITY =====
    const ratings = document.querySelectorAll('.rating[data-rating]');
    
    ratings.forEach(rating => {
        const stars = rating.querySelectorAll('.rating-star[data-value]');
        let currentRating = 0;
        
        stars.forEach(star => {
            star.addEventListener('mouseenter', function() {
                const value = parseInt(this.getAttribute('data-value'));
                highlightStars(stars, value);
            });
            
            star.addEventListener('mouseleave', function() {
                highlightStars(stars, currentRating);
            });
            
            star.addEventListener('click', function() {
                const value = parseInt(this.getAttribute('data-value'));
                currentRating = value;
                rating.setAttribute('data-rating', value);
                
                // Update text
                const ratingText = document.getElementById('rating-text');
                if (ratingText) {
                    const texts = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
                    ratingText.textContent = `${value} star${value !== 1 ? 's' : ''} - ${texts[value - 1]}`;
                }
            });
        });
        
        function highlightStars(stars, count) {
            stars.forEach((star, index) => {
                if (index < count) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }
    });

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== COPY CODE FUNCTIONALITY =====
    const codeBlocks = document.querySelectorAll('pre[class*="language-"]');
    
    codeBlocks.forEach(block => {
        const container = block.parentElement;
        if (container.classList.contains('docs-code-tab') || container.classList.contains('docs-example-code')) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'docs-code-copy';
            copyBtn.textContent = 'Copy';
            copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
            
            copyBtn.addEventListener('click', async () => {
                const code = block.querySelector('code').textContent;
                
                try {
                    await navigator.clipboard.writeText(code);
                    copyBtn.textContent = 'Copied!';
                    copyBtn.classList.add('copied');
                    
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = code;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    copyBtn.textContent = 'Copied!';
                    copyBtn.classList.add('copied');
                    
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                }
            });
            
            container.style.position = 'relative';
            container.appendChild(copyBtn);
        }
    });

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observe all cards and major sections
    const animatedElements = document.querySelectorAll('.card, .docs-feature, .docs-component');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // ===== NAVBAR SCROLL EFFECT =====
    const header = document.querySelector('.docs-header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // ===== SEARCH FUNCTIONALITY =====
    const searchInput = document.querySelector('.docs-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const components = document.querySelectorAll('.docs-component');
            
            components.forEach(component => {
                const title = component.querySelector('h3').textContent.toLowerCase();
                const content = component.textContent.toLowerCase();
                
                if (title.includes(query) || content.includes(query)) {
                    component.style.display = 'block';
                } else {
                    component.style.display = query ? 'none' : 'block';
                }
            });
        });
    }

    // ===== THEME SYSTEM ENHANCEMENTS =====
    // Listen for theme changes to update code syntax highlighting
    document.addEventListener('themechange', function(e) {
        // Re-highlight code blocks if needed
        if (window.Prism) {
            setTimeout(() => {
                Prism.highlightAll();
            }, 100);
        }
    });

    // ===== CAROUSEL AUTO-INITIALIZATION =====
    // Initialize any carousels on the page
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        new Astra.Carousel(carousel, {
            interval: 5000,
            keyboard: true,
            pause: 'hover'
        });
    });

    // ===== ACCORDION AUTO-INITIALIZATION =====
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => {
        new Astra.Accordion(accordion);
    });

    // ===== PERFORMANCE MONITORING =====
    // Monitor page load performance
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);
    });

    // ===== EASTER EGG =====
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Easter egg activation
                document.body.classList.add('animate-bounce');
                showToast('success');
                setTimeout(() => {
                    document.body.classList.remove('animate-bounce');
                }, 1000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    console.log('🚀 Astra Documentation loaded successfully!');
    console.log('Framework size: 45KB gzipped');
    console.log('Components: 50+');
    console.log('Accessibility: WCAG AA compliant');
});

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== EXPORT FOR GLOBAL USE =====
window.AstraDocs = {
    showToast: window.showToast,
    debounce,
    throttle
};
