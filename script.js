const body = document.body;
const btnDark = document.getElementById('dark-mode-toggle');
const nameTitle = document.querySelector('h1');
const backToTop = document.getElementById('back-to-top');

// --- 1. MODO ESCURO ---
if (localStorage.getItem('dark-mode') === 'enabled') {
    body.classList.add('dark-mode');
}

btnDark?.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (nameTitle) {
        nameTitle.style.transform = 'scale(1.02)';
        setTimeout(() => nameTitle.style.transform = 'scale(1)', 150);
    }
    localStorage.setItem('dark-mode', body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
});

// --- 2. NAVEGAÇÃO E SUMÁRIO ---
const setupSumario = () => {
    const details = document.getElementById('sumario-dropdown');
    let isDraggingMenu = false;

    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.setAttribute('draggable', 'false');
    });

    details?.addEventListener('mousedown', () => isDraggingMenu = false);
    details?.addEventListener('mousemove', () => isDraggingMenu = true);

    document.addEventListener('click', (e) => {
        const link = e.target.closest('.dropdown-content a');
        if (link && !isDraggingMenu) {

const targetId = link.getAttribute('href');
const targetSection = document.querySelector(targetId);

    if (targetSection) {
        e.preventDefault();
        details.removeAttribute('open');
const headerOffset = 100; 
const elementPosition = targetSection.getBoundingClientRect().top;
const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}        }
        if (details && details.hasAttribute('open') && !details.contains(e.target)) {
            details.removeAttribute('open');
        }
    });
};

// --- 3. FILTROS DE PROJETOS ---
window.filterItems = function(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.slider .card').forEach(card => {
        const isMatch = category === 'todos' || card.classList.contains(category);
        card.style.display = isMatch ? "block" : "none";
        isMatch ? card.classList.remove('hidden') : card.classList.add('hidden');
    });
};

// --- 4. EFEITOS DE SCROLL OTIMIZADOS (PARALLAX E TOPO) ---
let lastScrollY = window.scrollY;
let isTicking = false;

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;

    if (!isTicking) {
        window.requestAnimationFrame(() => {
            const headerContainer = document.querySelector('header .container');
            
            if (headerContainer) {
                // Só processa o parallax se estiver nas primeiras 500px de scroll
                if (lastScrollY < 500) {
                    const startMovingAt = window.innerWidth < 768 ? 150 : 50;
                    const yPos = lastScrollY > startMovingAt ? (lastScrollY - startMovingAt) * 0.3 : 0;
                    headerContainer.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            }

            if (backToTop) {
                backToTop.style.display = lastScrollY > 300 ? "flex" : "none";
            }
            
            isTicking = false;
        });
        isTicking = true;
    }
}, { passive: true });

backToTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- 5. CONTROLE DE EXPANSÃO DE CARDS ---
const updateBtnStyle = (btn, isOpen) => {
    if (!btn) return;
    btn.innerHTML = isOpen ? 'Fechar <span>▲</span>' : 'Detalhes <span>▼</span>';
    btn.style.background = isOpen ? 'var(--primary)' : 'var(--accent)';
};

document.querySelectorAll('.expand-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const extra = this.parentElement.querySelector('.extra-content');
        if (extra) {
            const isOpen = extra.classList.toggle('open');
            updateBtnStyle(this, isOpen);
        }
    });
});

window.toggleAll = function() {
    const allContent = document.querySelectorAll('.extra-content');
    const allButtons = document.querySelectorAll('.expand-btn');
    const masterBtn = document.getElementById('btn-toggle-all');
    const anyClosed = Array.from(allContent).some(content => !content.classList.contains('open'));
    
    allContent.forEach((content, i) => {
        content.classList.toggle('open', anyClosed);
        updateBtnStyle(allButtons[i], anyClosed);
    });
    if (masterBtn) masterBtn.innerText = anyClosed ? 'Recolher Tudo' : 'Expandir Tudo';
};

// --- 6. SCROLL DRAG PARA SLIDERS E TABELAS ---
const scrollContainers = document.querySelectorAll('.slider, .table-container, .dropdown-content');

scrollContainers.forEach(container => {
    let isDown = false;
    let startX, startY, scrollLeft, scrollTop;

    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('dragging');
        container.style.userSelect = 'none'; 
        
        startX = e.pageX - container.offsetLeft;
        startY = e.pageY - container.offsetTop;
        scrollLeft = container.scrollLeft;
        scrollTop = container.scrollTop;
    });

    const stopDragging = () => {
        isDown = false;
        container.classList.remove('dragging');
        container.style.userSelect = 'auto';
    };

    container.addEventListener('mouseleave', stopDragging);
    container.addEventListener('mouseup', stopDragging);

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const y = e.pageY - container.offsetTop;
        container.scrollLeft = scrollLeft - (x - startX) * 2;
        container.scrollTop = scrollTop - (y - startY) * 2;
    });
});

// --- 7. ANIMAÇÕES DE ENTRADA ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('section, article.card').forEach(el => observer.observe(el));

document.addEventListener('DOMContentLoaded', setupSumario);