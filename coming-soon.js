// coming-soon.js - логика для страниц с таймерами

document.addEventListener('DOMContentLoaded', function() {
    // Функция для запуска таймера
    function startTimer(targetDate, daysElement, hoursElement, minutesElement, secondsElement) {
        function updateTimer() {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                if (daysElement) daysElement.textContent = '00';
                if (hoursElement) hoursElement.textContent = '00';
                if (minutesElement) minutesElement.textContent = '00';
                if (secondsElement) secondsElement.textContent = '00';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
        }
        
        updateTimer();
        setInterval(updateTimer, 1000);
    }
    
    // Проверяем, на какой странице мы находимся, и запускаем соответствующий таймер
    const isContactsPage = document.querySelector('.coming-soon-icon .fa-envelope');
    const isHelpPage = document.querySelector('.coming-soon-icon .fa-question-circle');
    
    if (isContactsPage || window.location.pathname.includes('contacts.html')) {
        // Таймер для страницы контактов - 14 дней от текущей даты
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 14);
        targetDate.setHours(0, 0, 0, 0);
        
        startTimer(
            targetDate,
            document.getElementById('days'),
            document.getElementById('hours'),
            document.getElementById('minutes'),
            document.getElementById('seconds')
        );
    }
    
    if (isHelpPage || window.location.pathname.includes('help.html')) {
        // Таймер для страницы помощи - 21 день от текущей даты
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 21);
        targetDate.setHours(0, 0, 0, 0);
        
        startTimer(
            targetDate,
            document.getElementById('helpDays'),
            document.getElementById('helpHours'),
            document.getElementById('helpMinutes'),
            document.getElementById('helpSeconds')
        );
    }
});