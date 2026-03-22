// settings.js - логика для страницы настроек

document.addEventListener('DOMContentLoaded', function() {
    // Обновление отображения активного цвета
    function updateActiveColorDisplay() {
        const savedColor = localStorage.getItem('themeColor') || '#2ecc71';
        const savedColorName = localStorage.getItem('themeColorName') || 'green';
        const colorNames = {
            'green': 'Зеленый', 'blue': 'Синий', 'purple': 'Фиолетовый',
            'red': 'Красный', 'orange': 'Оранжевый', 'teal': 'Бирюзовый',
            'pink': 'Розовый', 'yellow': 'Желтый', 'cyan': 'Голубой',
            'lime': 'Лайм', 'indigo': 'Индиго', 'crimson': 'Малиновый'
        };
        
        const colorNameDisplay = document.getElementById('activeColorName');
        const colorPreview = document.getElementById('activeColorPreview');
        
        if (colorNameDisplay) {
            colorNameDisplay.textContent = colorNames[savedColorName] || savedColorName;
        }
        if (colorPreview) {
            colorPreview.style.backgroundColor = savedColor;
        }
    }
    
    // Обновление отображения активного декора
    function updateActiveDecorDisplay() {
        const savedDecor = localStorage.getItem('activeDecor') || 'leaves';
        const decorNames = {
            'leaves': 'Листья',
            'diamonds': 'Алмазы',
            'bananas': 'Яблоки',
            'lightning': 'Молнии',
            'sparkles': 'Блестки'
        };
        
        const decorNameDisplay = document.getElementById('activeDecorName');
        if (decorNameDisplay) {
            decorNameDisplay.textContent = decorNames[savedDecor] || 'Листья';
        }
    }
    
    // Обновление активного состояния кнопок
    function updateSettingsPaletteActive(colorName) {
        document.querySelectorAll('.palette-color-large').forEach(btn => {
            if (btn.getAttribute('data-color') === colorName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Обновление активного состояния кнопок декора
    function updateDecorButtonsActive(decorType) {
        document.querySelectorAll('.decor-option').forEach(btn => {
            if (btn.getAttribute('data-decor') === decorType) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Предпросмотр декора
    function updateDecorPreview(decorType) {
        const preview = document.getElementById('decorPreview');
        if (!preview) return;
        
        const decorIcons = {
            'leaves': ['fa-leaf', 'fa-leaf', 'fa-leaf'],
            'diamonds': ['fa-gem', 'fa-gem', 'fa-gem'],
            'bananas': ['fa-apple-alt', 'fa-apple-alt', 'fa-apple-alt'],
            'lightning': ['fa-bolt', 'fa-bolt', 'fa-bolt'],
            'sparkles': ['fa-star', 'fa-star', 'fa-star']
        };
        
        const icons = decorIcons[decorType] || decorIcons['leaves'];
        const decorTexts = {
            'leaves': 'Листья парят в воздухе',
            'diamonds': 'Алмазы сверкают',
            'bananas': 'Яблоки качаются',
            'lightning': 'Молнии пронзают пространство',
            'sparkles': 'Блестки переливаются'
        };
        
        preview.innerHTML = `
            <div class="preview-animation">
                ${icons.map(icon => `<i class="fas ${icon}"></i>`).join('')}
            </div>
            <p>${decorTexts[decorType] || decorTexts['leaves']}</p>
        `;
    }
    
    // Обработчики для выбора цвета
    document.querySelectorAll('.palette-color-large').forEach(color => {
        color.addEventListener('click', () => {
            const colorName = color.getAttribute('data-color');
            const accentColor = color.getAttribute('data-accent');
            if (typeof setThemeColor === 'function') {
                setThemeColor(accentColor, colorName);
            }
            updateSettingsPaletteActive(colorName);
            updateActiveColorDisplay();
            if (typeof showNotification === 'function') {
                showNotification(`Цвет изменен на ${colorName}`);
            }
        });
    });
    
    // Обработчики для выбора декора
    const decorOptions = document.querySelectorAll('.decor-option');
    decorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const decorType = option.getAttribute('data-decor');
            localStorage.setItem('activeDecor', decorType);
            updateDecorButtonsActive(decorType);
            updateDecorPreview(decorType);
            updateActiveDecorDisplay();
            
            // Применяем декор на всех страницах через глобальную функцию
            if (typeof window.applyDecorToAllCards === 'function') {
                window.applyDecorToAllCards(decorType);
            }
            
            if (typeof showNotification === 'function') {
                const decorNames = {
                    'leaves': 'Листья', 'diamonds': 'Алмазы', 'bananas': 'Яблоки',
                    'lightning': 'Молнии', 'sparkles': 'Блестки'
                };
                showNotification(`Декор изменен на ${decorNames[decorType]}`);
            }
        });
    });
    
    // Кнопка сброса
    const resetBtn = document.getElementById('settingsResetPalette');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (typeof resetPalette === 'function') {
                resetPalette();
            } else {
                const defaultColor = '#2ecc71';
                const defaultColorName = 'green';
                if (typeof setThemeColor === 'function') {
                    setThemeColor(defaultColor, defaultColorName);
                }
            }
            updateSettingsPaletteActive('green');
            updateActiveColorDisplay();
            if (typeof showNotification === 'function') {
                showNotification('Цветовая палитра сброшена к стандартной');
            }
        });
    }
    
    // Кнопка сохранения
    const saveBtn = document.getElementById('settingsSavePalette');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (typeof savePalette === 'function') {
                savePalette();
            } else {
                const currentColor = document.documentElement.style.getPropertyValue('--accent-color') || '#2ecc71';
                const colorName = localStorage.getItem('themeColorName') || 'green';
                localStorage.setItem('savedPaletteColor', currentColor);
                localStorage.setItem('savedPaletteName', colorName);
                if (typeof showNotification === 'function') {
                    showNotification('Цветовая палитра сохранена');
                }
            }
        });
    }
    
    // Настройки анимаций
    const animationsToggle = document.getElementById('toggleAnimations');
    const neonGlowToggle = document.getElementById('toggleNeonGlow');
    const animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
    const neonGlowEnabled = localStorage.getItem('neonGlowEnabled') !== 'false';
    
    if (animationsToggle) {
        animationsToggle.checked = animationsEnabled;
        animationsToggle.addEventListener('change', (e) => {
            const isEnabled = e.target.checked;
            localStorage.setItem('animationsEnabled', isEnabled);
            if (isEnabled) {
                document.body.classList.remove('no-animations');
                if (typeof createFloatingLeaves === 'function') {
                    createFloatingLeaves();
                }
            } else {
                document.body.classList.add('no-animations');
            }
            if (typeof showNotification === 'function') {
                showNotification(isEnabled ? 'Анимации включены' : 'Анимации отключены');
            }
        });
    }
    
    if (neonGlowToggle) {
        neonGlowToggle.checked = neonGlowEnabled;
        neonGlowToggle.addEventListener('change', (e) => {
            const isEnabled = e.target.checked;
            localStorage.setItem('neonGlowEnabled', isEnabled);
            
            // Применяем изменение свечения глобально
            if (typeof window.applyGlowEffect === 'function') {
                window.applyGlowEffect(isEnabled);
            } else {
                // Фолбэк: просто добавляем/удаляем класс
                if (isEnabled) {
                    document.body.classList.remove('no-neon');
                } else {
                    document.body.classList.add('no-neon');
                }
            }
            
            if (typeof showNotification === 'function') {
                showNotification(isEnabled ? 'Свечение включено' : 'Свечение отключено');
            }
        });
    }
    
    if (!animationsEnabled) document.body.classList.add('no-animations');
    if (!neonGlowEnabled) document.body.classList.add('no-neon');
    
    // Настройки загрузок
    const autoStartDownload = document.getElementById('autoStartDownload');
    const showProgressNotification = document.getElementById('showProgressNotification');
    
    if (autoStartDownload) {
        autoStartDownload.checked = localStorage.getItem('autoStartDownload') !== 'false';
        autoStartDownload.addEventListener('change', (e) => {
            localStorage.setItem('autoStartDownload', e.target.checked);
            if (typeof showNotification === 'function') {
                showNotification(e.target.checked ? 'Автозагрузка включена' : 'Автозагрузка отключена');
            }
        });
    }
    
    if (showProgressNotification) {
        showProgressNotification.checked = localStorage.getItem('showProgressNotification') === 'true';
        showProgressNotification.addEventListener('change', (e) => {
            localStorage.setItem('showProgressNotification', e.target.checked);
            if (typeof showNotification === 'function') {
                showNotification(e.target.checked ? 'Уведомления включены' : 'Уведомления отключены');
            }
        });
    }
    
    // Очистка настроек
    const clearStorageBtn = document.getElementById('clearLocalStorage');
    if (clearStorageBtn) {
        clearStorageBtn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите очистить все сохраненные настройки?')) {
                localStorage.removeItem('themeColor');
                localStorage.removeItem('themeColorName');
                localStorage.removeItem('savedPaletteColor');
                localStorage.removeItem('savedPaletteName');
                localStorage.removeItem('animationsEnabled');
                localStorage.removeItem('neonGlowEnabled');
                localStorage.removeItem('autoStartDownload');
                localStorage.removeItem('showProgressNotification');
                localStorage.removeItem('activeDecor');
                if (typeof showNotification === 'function') {
                    showNotification('Настройки очищены. Страница будет перезагружена.');
                }
                setTimeout(() => location.reload(), 1500);
            }
        });
    }
    
    // Инициализация
    const savedColorName = localStorage.getItem('themeColorName') || 'green';
    const savedDecor = localStorage.getItem('activeDecor') || 'leaves';
    
    updateSettingsPaletteActive(savedColorName);
    updateActiveColorDisplay();
    updateDecorButtonsActive(savedDecor);
    updateDecorPreview(savedDecor);
    updateActiveDecorDisplay();
});
