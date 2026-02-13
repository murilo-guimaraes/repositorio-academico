// --- 1. MODO ESCURO COM MEMÓRIA (LocalStorage) ---
const btnDark = document.getElementById('dark-mode-toggle');
const body = document.body;

// Verifica preferência salva ao carregar
if (localStorage.getItem('dark-mode') === 'enabled') {
    body.classList.add('dark-mode');
}

btnDark.onclick = function() {
    body.classList.toggle('dark-mode');
    
    // Pequeno efeito de destaque no nome ao trocar
    const nameTitle = document.querySelector('h1');
    nameTitle.style.transform = 'scale(1.02)';
    setTimeout(() => nameTitle.style.transform = 'scale(1)', 200);

    localStorage.setItem('dark-mode', body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
};
// --- 2. NAVEGAÇÃO E ANIMAÇÕES (Scroll) ---
const backToTop = document.getElementById('back-to-top');

window.onscroll = function() {
    // Mostrar/Esconder botão Voltar ao Topo
    if (window.scrollY > 300) {
        backToTop.style.display = "flex";
    } else {
        backToTop.style.display = "none";
    }
};

// Animação de entrada das seções (Fade-in)
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach((section) => {
    observer.observe(section);
});

// --- 3. CONTROLE DOS PROJETOS (Expansão e Scroll Automático) ---

// Função para abrir/fechar card individual
function toggleExpand(btn) {
    const content = btn.nextElementSibling;
    const isOpen = content.classList.toggle('open');
    
    btn.innerHTML = isOpen ? 'Fechar <span>▲</span>' : 'Detalhes <span>▼</span>';

    if (isOpen) {
        setTimeout(() => {
            content.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 150); 
    }
}

// Função Mestre: Expandir ou Recolher tudo simultaneamente
function toggleAll() {
    const allContent = document.querySelectorAll('.extra-content');
    const allButtons = document.querySelectorAll('.expand-btn');
    const masterBtn = document.getElementById('btn-toggle-all'); // Seleciona o botão mestre
    
    const shouldOpen = !allContent[0].classList.contains('open');

    allContent.forEach((content, index) => {
        if (shouldOpen) {
            content.classList.add('open');
            allButtons[index].innerHTML = 'Fechar <span>▲</span>';
        } else {
            content.classList.remove('open');
            allButtons[index].innerHTML = 'Detalhes <span>▼</span>';
        }
    });

    // Linha nova para atualizar o texto do botão principal:
    masterBtn.innerText = shouldOpen ? 'Recolher Tudo' : 'Expandir Tudo';
}

// --- 4. CARROSSEL (Arrastar com Mouse) ---
const slider = document.querySelector('.slider');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
    isDown = false;
});

slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
});

slider.addEventListener('mousemove', (e) => {
    if (!isDown) return; 
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; 
    slider.scrollLeft = scrollLeft - walk;
});