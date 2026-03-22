// Функция для создания плавающих листиков на карточке
function createFloatingLeaves(containerId = null) {
    let containers = [];
    
    if (containerId) {
        const container = document.getElementById(containerId);
        if (container) containers = [container];
    } else {
        // Если ID не указан, создаем листики для всех карточек
        containers = document.querySelectorAll('.floating-leaves');
    }
    
    containers.forEach(leavesContainer => {
        if (!leavesContainer) return;
        
        // Очищаем предыдущие листики
        leavesContainer.innerHTML = '';
        
        // Создаем 8 плавающих листиков для каждой карточки
        for (let i = 0; i < 8; i++) {
            const leaf = document.createElement('div');
            leaf.classList.add('floating-leaf');
            leaf.innerHTML = '<i class="fas fa-leaf"></i>';
            
            // Случайная позиция внутри карточки
            const top = Math.random() * 90;
            const left = Math.random() * 90;
            
            // Случайная анимация
            const animationType = Math.floor(Math.random() * 3) + 1;
            const animationDuration = 15 + Math.random() * 10;
            const animationDelay = Math.random() * 5;
            
            // Случайный размер
            const size = 0.5 + Math.random() * 0.8;
            
            leaf.style.top = `${top}%`;
            leaf.style.left = `${left}%`;
            leaf.style.fontSize = `${size}rem`;
            leaf.style.animation = `float${animationType} ${animationDuration}s ease-in-out ${animationDelay}s infinite`;
            
            leavesContainer.appendChild(leaf);
        }
    });
}

// Функция для преобразования hex в rgb
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
        : '46, 204, 113';
}

// Функция для настройки цвета
function adjustColor(colorHex, percent) {
    const num = parseInt(colorHex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return "#" + (
        0x1000000 +
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
}

// Функция для установки цвета темы (только тёмная)
function setThemeColor(colorHex, colorName) {
    const root = document.documentElement;
    const rgb = hexToRgb(colorHex);
    
    // Устанавливаем основной цвет акцента
    root.style.setProperty('--accent-color', colorHex);
    
    // Устанавливаем RGB версию для использования в rgba
    root.style.setProperty('--accent-rgb', rgb);
    
    // Устанавливаем связанные цвета (тёмная тема)
    root.style.setProperty('--accent-light', `rgba(${rgb}, 0.1)`);
    root.style.setProperty('--border-color', `rgba(${rgb}, 0.2)`);
    root.style.setProperty('--shadow-color', `rgba(${rgb}, 0.1)`);
    root.style.setProperty('--neon-glow', `0 0 10px rgba(${rgb}, 0.3), 0 0 20px rgba(${rgb}, 0.2)`);
    
    // Обновляем градиенты для кнопок и декоративных элементов
    updateGradients(colorHex);
    
    // Обновляем активный цвет в палитре
    const paletteColors = document.querySelectorAll('.palette-color');
    paletteColors.forEach(color => {
        color.classList.remove('active');
        if (color.getAttribute('data-color') === colorName) {
            color.classList.add('active');
        }
    });
    
    // Сохраняем выбранный цвет
    localStorage.setItem('themeColor', colorHex);
    localStorage.setItem('themeColorName', colorName);
    
    // Обновляем неоновые эффекты
    updateNeonEffects(colorHex, rgb);
}

// Функция обновления градиентов
function updateGradients(colorHex) {
    const root = document.documentElement;
    const darkerColor = adjustColor(colorHex, -15);
    const lighterColor = adjustColor(colorHex, 15);
    
    // Градиент для разделительной линии
    root.style.setProperty('--divider-gradient', `linear-gradient(to right, transparent 0%, ${colorHex}80 20%, ${colorHex} 50%, ${colorHex}80 80%, transparent 100%)`);
    
    // Градиент для верхней полоски карточек
    root.style.setProperty('--card-stripe', `linear-gradient(to right, transparent, ${colorHex}CC, ${darkerColor}, ${colorHex}, ${colorHex}CC, transparent)`);
    
    // Градиент для кнопок
    root.style.setProperty('--button-gradient', `linear-gradient(to right, ${darkerColor}, ${colorHex})`);
    
    // Градиент для прогресс-бара
    root.style.setProperty('--progress-gradient', `linear-gradient(to right, ${darkerColor}, ${colorHex})`);
}

// Функция обновления неоновых эффектов
function updateNeonEffects(colorHex, rgb) {
    // Обновляем свечение иконок
    const icons = document.querySelectorAll('.file-icon i, .logo-icon i, .feature-icon i');
    icons.forEach(icon => {
        icon.style.filter = `drop-shadow(0 0 8px rgba(${rgb}, 0.5))`;
    });
    
    // Обновляем свечение угловых листиков
    const cornerLeaves = document.querySelectorAll('.corner-leaf i');
    cornerLeaves.forEach(leaf => {
        leaf.style.filter = `drop-shadow(0 0 8px rgba(${rgb}, 0.4))`;
    });
    
    // Обновляем свечение плавающих листиков
    const floatingLeaves = document.querySelectorAll('.floating-leaf');
    floatingLeaves.forEach(leaf => {
        leaf.style.filter = `drop-shadow(0 0 5px rgba(${rgb}, 0.3))`;
    });
    
    // Обновляем тени карточек
    const cards = document.querySelectorAll('.file-card, .feature-card');
    cards.forEach(card => {
        card.style.boxShadow = `0 15px 35px rgba(${rgb}, 0.2)`;
    });
}

// Функция сброса цветовой палитры
function resetPalette() {
    const defaultColor = '#2ecc71';
    const defaultColorName = 'green';
    setThemeColor(defaultColor, defaultColorName);
    showNotification('Цветовая палитра сброшена');
}

// Функция сохранения цветовой палитры
function savePalette() {
    const currentColor = document.documentElement.style.getPropertyValue('--accent-color') || '#2ecc71';
    const colorName = localStorage.getItem('themeColorName') || 'green';
    
    localStorage.setItem('savedPaletteColor', currentColor);
    localStorage.setItem('savedPaletteName', colorName);
    
    showNotification('Цветовая палитра сохранена');
}

// Функция показа уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'palette-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 2000;
        font-weight: 500;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Функция имитации загрузки файла
function simulateDownload(button, progressContainer, progressFill, progressText) {
    // Показать индикатор загрузки
    progressContainer.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.innerHTML = 'Подготовка к загрузке...';
    
    // Скрыть кнопку на время загрузки
    button.style.display = 'none';
    
    // Имитация процесса загрузки
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 8 + 2;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
            progressFill.style.background = `linear-gradient(to right, ${adjustColor(accentColor, -10)}, ${accentColor})`;
            progressText.innerHTML = '<i class="fas fa-check-circle"></i> Загрузка завершена!';
            
            // Создаем новые листики при завершении
            setTimeout(() => {
                createFloatingLeaves();
            }, 500);
            
            // Через 1.5 секунды "скачиваем" файл
            setTimeout(() => {
                progressText.innerHTML = '<i class="fas fa-check-circle"></i> Файл успешно скачан!';
                
                setTimeout(() => {
                    button.style.display = 'inline-flex';
                    progressContainer.style.display = 'none';
                    progressFill.style.width = '0%';
                }, 2000);
            }, 1500);
        } else {
            progressText.innerHTML = `Загрузка: <span class="progress-percentage">${Math.round(progress)}%</span>`;
        }
        progressFill.style.width = `${progress}%`;
    }, 150);
}

// Управление выдвижным меню и палитрой цветов
function setupMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const themePaletteToggle = document.getElementById('themePaletteToggle');
    const themePaletteDropdown = document.getElementById('themePaletteDropdown');
    
    if (!sidebarMenu) return;
    
    // Обработчик для кнопки меню
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebarMenu.classList.toggle('active');
            
            if (window.innerWidth <= 768) {
                if (sidebarMenu.classList.contains('active')) {
                    sidebarMenu.classList.add('mobile-open');
                } else {
                    sidebarMenu.classList.remove('mobile-open');
                }
            }
        });
    }
    
    // Управление палитрой цветов
    if (themePaletteToggle && themePaletteDropdown) {
        themePaletteToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            themePaletteDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', (e) => {
            if (!themePaletteDropdown.contains(e.target) && 
                !themePaletteToggle.contains(e.target) && 
                themePaletteDropdown.classList.contains('show')) {
                themePaletteDropdown.classList.remove('show');
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && themePaletteDropdown.classList.contains('show')) {
                themePaletteDropdown.classList.remove('show');
            }
        });
        
        // Обработчики для выбора цвета
        const paletteColors = document.querySelectorAll('.palette-color');
        paletteColors.forEach(color => {
            color.addEventListener('click', () => {
                const colorName = color.getAttribute('data-color');
                const accentColor = color.getAttribute('data-accent');
                setThemeColor(accentColor, colorName);
                
                if (window.innerWidth <= 768) {
                    themePaletteDropdown.classList.remove('show');
                }
                
                showNotification(`Цвет изменен на ${colorName}`);
            });
        });
        
        const resetPaletteBtn = document.getElementById('resetPalette');
        const savePaletteBtn = document.getElementById('savePalette');
        
        if (resetPaletteBtn) {
            resetPaletteBtn.addEventListener('click', resetPalette);
        }
        
        if (savePaletteBtn) {
            savePaletteBtn.addEventListener('click', savePalette);
        }
    }
    
    // Закрытие меню при клике вне его на мобильных
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            sidebarMenu.classList.contains('active') && 
            !sidebarMenu.contains(e.target) && 
            (!menuToggle || !menuToggle.contains(e.target))) {
            sidebarMenu.classList.remove('active');
            sidebarMenu.classList.remove('mobile-open');
        }
    });
    
    // Закрытие меню через Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebarMenu.classList.contains('active')) {
            sidebarMenu.classList.remove('active');
            sidebarMenu.classList.remove('mobile-open');
        }
    });
    
    // Обработка ресайза окна
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebarMenu.classList.remove('active');
            sidebarMenu.classList.remove('mobile-open');
        }
        
        if (window.innerWidth <= 768 && themePaletteDropdown && themePaletteDropdown.classList.contains('show')) {
            themePaletteDropdown.classList.remove('show');
        }
    });
    
    // Активация пунктов меню
    const menuLinks = document.querySelectorAll('.menu-nav a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
            
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            if (window.innerWidth <= 768) {
                sidebarMenu.classList.remove('active');
                sidebarMenu.classList.remove('mobile-open');
            }
        });
    });
    
    // Восстанавливаем сохранённый цвет
    const savedColor = localStorage.getItem('themeColor') || '#2ecc71';
    const savedColorName = localStorage.getItem('themeColorName') || 'green';
    setThemeColor(savedColor, savedColorName);
    
    // Инициализация первого активного пункта меню
    const firstMenuLink = document.querySelector('.menu-nav a.active');
    if (!firstMenuLink && menuLinks.length > 0) {
        menuLinks[0].classList.add('active');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Создаем листики для всех карточек
    createFloatingLeaves();
    
    // Настраиваем меню
    setupMenu();
    
    // Обновляем листики каждые 40 секунд
    setInterval(createFloatingLeaves, 40000);
    
    // Обработчики для кнопок загрузки в карточках
    const downloadButtons = document.querySelectorAll('.card-download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const fileCard = this.closest('.file-card');
            const progressContainer = fileCard.querySelector('.card-progress');
            const progressFill = fileCard.querySelector('.progress-fill');
            const progressText = fileCard.querySelector('.progress-text');
            
            simulateDownload(this, progressContainer, progressFill, progressText);
        });
    });
});

// Экспорт функций для использования в settings.js
window.setThemeColor = setThemeColor;
window.resetPalette = resetPalette;
window.savePalette = savePalette;
window.showNotification = showNotification;
window.createFloatingLeaves = createFloatingLeaves;
window.simulateDownload = simulateDownload;

// Функции для работы с декором карточек
function getDecorIcon(decorType, index) {
    const icons = {
        'leaves': ['fa-leaf', 'fa-leaf', 'fa-leaf', 'fa-leaf', 'fa-leaf'],
        'diamonds': ['fa-gem', 'fa-gem', 'fa-gem', 'fa-gem', 'fa-gem'],
        'bananas': ['fa-apple-alt', 'fa-apple-alt', 'fa-apple-alt', 'fa-apple-alt', 'fa-apple-alt'],
        'lightning': ['fa-bolt', 'fa-bolt', 'fa-bolt', 'fa-bolt', 'fa-bolt'],
        'sparkles': ['fa-star', 'fa-star', 'fa-star', 'fa-star', 'fa-star']
    };
    const decorIcons = icons[decorType] || icons['leaves'];
    return decorIcons[index % decorIcons.length];
}

function getCornerDecorIcon(decorType, corner) {
    const icons = {
        'leaves': 'fa-leaf',
        'diamonds': 'fa-gem',
        'bananas': 'fa-apple-alt',
        'lightning': 'fa-bolt',
        'sparkles': 'fa-star'
    };
    return icons[decorType] || 'fa-leaf';
}

// Создание плавающих элементов декора
function createFloatingDecor(containerId = null) {
    let containers = [];
    const activeDecor = localStorage.getItem('activeDecor') || 'leaves';
    
    if (containerId) {
        const container = document.getElementById(containerId);
        if (container) containers = [container];
    } else {
        containers = document.querySelectorAll('.floating-leaves');
    }
    
    containers.forEach(leavesContainer => {
        if (!leavesContainer) return;
        
        leavesContainer.innerHTML = '';
        
        for (let i = 0; i < 8; i++) {
            const decor = document.createElement('div');
            decor.classList.add('floating-leaf');
            const iconClass = getDecorIcon(activeDecor, i);
            decor.innerHTML = `<i class="fas ${iconClass}"></i>`;
            
            const top = Math.random() * 90;
            const left = Math.random() * 90;
            const animationType = Math.floor(Math.random() * 3) + 1;
            const animationDuration = 15 + Math.random() * 10;
            const animationDelay = Math.random() * 5;
            const size = 0.5 + Math.random() * 0.8;
            
            decor.style.top = `${top}%`;
            decor.style.left = `${left}%`;
            decor.style.fontSize = `${size}rem`;
            decor.style.animation = `float${animationType} ${animationDuration}s ease-in-out ${animationDelay}s infinite`;
            
            leavesContainer.appendChild(decor);
        }
    });
}

// Обновление угловых элементов декора
function updateCornerDecor() {
    const activeDecor = localStorage.getItem('activeDecor') || 'leaves';
    const cornerIcons = document.querySelectorAll('.corner-leaf i');
    
    cornerIcons.forEach(icon => {
        const iconClass = getCornerDecorIcon(activeDecor);
        icon.className = `fas ${iconClass}`;
    });
}

// Применение декора ко всем карточкам
function applyDecorToAllCards(decorType) {
    localStorage.setItem('activeDecor', decorType);
    createFloatingLeaves();
    updateCornerDecor();
}

// Переопределяем createFloatingLeaves для работы с декором
const originalCreateFloatingLeaves = createFloatingLeaves;
window.createFloatingLeaves = function(containerId = null) {
    const activeDecor = localStorage.getItem('activeDecor') || 'leaves';
    
    let containers = [];
    if (containerId) {
        const container = document.getElementById(containerId);
        if (container) containers = [container];
    } else {
        containers = document.querySelectorAll('.floating-leaves');
    }
    
    containers.forEach(leavesContainer => {
        if (!leavesContainer) return;
        
        leavesContainer.innerHTML = '';
        
        for (let i = 0; i < 8; i++) {
            const decor = document.createElement('div');
            decor.classList.add('floating-leaf');
            const iconClass = getDecorIcon(activeDecor, i);
            decor.innerHTML = `<i class="fas ${iconClass}"></i>`;
            
            const top = Math.random() * 90;
            const left = Math.random() * 90;
            const animationType = Math.floor(Math.random() * 3) + 1;
            const animationDuration = 15 + Math.random() * 10;
            const animationDelay = Math.random() * 5;
            const size = 0.5 + Math.random() * 0.8;
            
            decor.style.top = `${top}%`;
            decor.style.left = `${left}%`;
            decor.style.fontSize = `${size}rem`;
            decor.style.animation = `float${animationType} ${animationDuration}s ease-in-out ${animationDelay}s infinite`;
            
            leavesContainer.appendChild(decor);
        }
    });
};

// Экспорт функции для применения декора
window.applyDecorToAllCards = applyDecorToAllCards;
window.updateCornerDecor = updateCornerDecor;

// Обновляем DOMContentLoaded для применения сохраненного декора
document.addEventListener('DOMContentLoaded', function() {
    const savedDecor = localStorage.getItem('activeDecor') || 'leaves';
    updateCornerDecor();
    
    // Переопределяем обработчики для кнопок загрузки, чтобы обновлять декор
    const originalSetupMenu = setupMenu;
    window.setupMenu = function() {
        originalSetupMenu();
        updateCornerDecor();
    };
});

// Функция для применения эффекта свечения (глобально)
function applyGlowEffect(enabled) {
    if (enabled) {
        document.body.classList.remove('no-neon');
        
        // Восстанавливаем свечение из CSS переменных
        const rgb = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb');
        
        // Обновляем свечение иконок
        document.querySelectorAll('.file-icon i, .logo-icon i, .feature-icon i').forEach(icon => {
            icon.style.filter = `drop-shadow(0 0 8px rgba(${rgb}, 0.5))`;
        });
        
        // Обновляем свечение угловых листиков
        document.querySelectorAll('.corner-leaf i').forEach(leaf => {
            leaf.style.filter = `drop-shadow(0 0 8px rgba(${rgb}, 0.4))`;
        });
        
        // Обновляем свечение плавающих листиков
        document.querySelectorAll('.floating-leaf').forEach(leaf => {
            leaf.style.filter = `drop-shadow(0 0 5px rgba(${rgb}, 0.3))`;
        });
        
        // Обновляем тени карточек
        document.querySelectorAll('.file-card, .feature-card').forEach(card => {
            card.style.boxShadow = `0 15px 35px rgba(${rgb}, 0.2)`;
        });
        
        // Обновляем неон-glow для разделителя
        const divider = document.querySelector('.section-divider');
        if (divider) {
            divider.style.boxShadow = `0 0 15px rgba(${rgb}, 0.5), 0 0 30px rgba(${rgb}, 0.3)`;
        }
        
        // Обновляем свечение кнопок палитры
        document.querySelectorAll('.palette-color, .palette-color-large').forEach(btn => {
            btn.style.boxShadow = `0 0 15px rgba(${rgb}, 0.5), 0 0 30px rgba(${rgb}, 0.3)`;
        });
        
    } else {
        document.body.classList.add('no-neon');
        
        // Убираем все фильтры и тени
        document.querySelectorAll('.file-icon i, .logo-icon i, .feature-icon i, .corner-leaf i, .floating-leaf').forEach(el => {
            el.style.filter = 'none';
        });
        
        document.querySelectorAll('.file-card, .feature-card, .palette-color, .palette-color-large').forEach(card => {
            card.style.boxShadow = 'none';
        });
        
        const divider = document.querySelector('.section-divider');
        if (divider) {
            divider.style.boxShadow = 'none';
        }
    }
}

// Переопределяем updateNeonEffects для учета настройки свечения
const originalUpdateNeonEffects = updateNeonEffects;
window.updateNeonEffects = function(colorHex, rgb) {
    const neonEnabled = localStorage.getItem('neonGlowEnabled') !== 'false';
    
    if (neonEnabled) {
        originalUpdateNeonEffects(colorHex, rgb);
    } else {
        // Если свечение отключено, просто сохраняем цвета без эффектов
        const root = document.documentElement;
        root.style.setProperty('--accent-color', colorHex);
        root.style.setProperty('--accent-rgb', rgb);
        root.style.setProperty('--accent-light', `rgba(${rgb}, 0.1)`);
        root.style.setProperty('--border-color', `rgba(${rgb}, 0.2)`);
        root.style.setProperty('--shadow-color', `rgba(${rgb}, 0.1)`);
        root.style.setProperty('--neon-glow', 'none');
        updateGradients(colorHex);
        
        // Убираем все свечения
        document.querySelectorAll('.file-icon i, .logo-icon i, .feature-icon i, .corner-leaf i, .floating-leaf').forEach(el => {
            el.style.filter = 'none';
        });
        document.querySelectorAll('.file-card, .feature-card').forEach(card => {
            card.style.boxShadow = 'none';
        });
    }
};

// Экспортируем функцию
window.applyGlowEffect = applyGlowEffect;

// Обновляем DOMContentLoaded для применения сохраненного состояния свечения
document.addEventListener('DOMContentLoaded', function() {
    const neonEnabled = localStorage.getItem('neonGlowEnabled') !== 'false';
    if (!neonEnabled) {
        applyGlowEffect(false);
    }
});

