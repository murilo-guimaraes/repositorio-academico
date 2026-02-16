// --- 1. CONFIGURAÇÕES GERAIS E MODO ESCURO ---
const body = document.body;
const btnDark = document.getElementById('dark-mode-toggle');
const nameTitle = document.querySelector('h1');

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

// --- 2. SUMÁRIO (CLIQUE E NAVEGAÇÃO) ---
const setupSumario = () => {
    const details = document.getElementById('sumario-dropdown');
    let isDraggingMenu = false;

    // Impede que os links fiquem "presos" no mouse (fantasma de arrastar)
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
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
        if (details && details.hasAttribute('open') && !details.contains(e.target)) {
            details.removeAttribute('open');
        }
    });
};

// --- 3. FILTROS DE PROJETOS E PESQUISAS ---
window.filterItems = function(category, btn) {
    // Remove ativo de todos os botões de filtro
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    // Adiciona ativo no botão clicado
    btn.classList.add('active');

    // Filtra os cards no slider
    document.querySelectorAll('.slider .card').forEach(card => {
        const isMatch = category === 'todos' || card.classList.contains(category);
        if (isMatch) {
            card.classList.remove('hidden');
            card.style.display = "block"; // Garante visibilidade
        } else {
            card.classList.add('hidden');
            card.style.display = "none";
        }
    });
};

// --- 4. INTERFACE E SCROLL (PARALLAX E TOPO) ---
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    const headerContainer = document.querySelector('header .container');
    const scrollValue = window.scrollY;
    
    if (headerContainer) {
        const startMovingAt = window.innerWidth < 768 ? 150 : 50;
        if (scrollValue > startMovingAt) {
            headerContainer.style.transform = `translateY(${(scrollValue - startMovingAt) * 0.3}px)`;
        } else {
            headerContainer.style.transform = `translateY(0px)`;
        }
    }
    if (backToTop) {
        backToTop.style.display = scrollValue > 300 ? "flex" : "none";
    }
});

backToTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- 5. CONTROLE DOS CARDS (EXPANDIR) ---
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

// --- 6. SISTEMA DE ARRASTE (COM TRAVA DE SELEÇÃO) ---
const scrollContainers = document.querySelectorAll('.slider, .table-container, .dropdown-content');

scrollContainers.forEach(container => {
    let isDown = false;
    let startX, startY, scrollLeft, scrollTop;

    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('dragging');
        
        // IMPEDE A SELEÇÃO DE TEXTO NO INÍCIO DO ARRASTE
        container.style.userSelect = 'none'; 
        container.style.webkitUserSelect = 'none'; // Safari
        
        startX = e.pageX - container.offsetLeft;
        startY = e.pageY - container.offsetTop;
        scrollLeft = container.scrollLeft;
        scrollTop = container.scrollTop;
    });

    const stopDragging = () => {
        isDown = false;
        if (container.classList.contains('dragging')) {
            container.classList.remove('dragging');
            
            // LIBERA A SELEÇÃO DE TEXTO AO SOLTAR
            container.style.userSelect = 'auto';
            container.style.webkitUserSelect = 'auto';
        }
    };

    container.addEventListener('mouseleave', stopDragging);
    container.addEventListener('mouseup', stopDragging);

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const y = e.pageY - container.offsetTop;
        
        // Multiplicador 2 para um deslize mais ágil
        container.scrollLeft = scrollLeft - (x - startX) * 2;
        container.scrollTop = scrollTop - (y - startY) * 2;
    });
});
// --- 7. ANIMAÇÕES DE ENTRADA E INICIALIZAÇÃO ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('section, article.card').forEach(el => observer.observe(el));

document.addEventListener('DOMContentLoaded', setupSumario);