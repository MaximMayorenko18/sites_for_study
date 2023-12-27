document.addEventListener('DOMContentLoaded', () => {
    loadComponents(); // Загрузка компонентов при открытии страницы

    document.getElementById('add-component').addEventListener('click', () => {
        const componentName = document.getElementById('new-component-name').value.trim();
        if (componentName) {
            const componentCount = 0; // Начальное количество компонента
            addComponentToList(componentName, componentCount);
            document.getElementById('new-component-name').value = '';
            saveComponents();
        }
    });
    
    // Установка таймера на полночь для очистки localStorage
    scheduleMidnightClear();
});

function addComponentToList(name, count) {
    const list = document.getElementById('components');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span>${name}</span>
        <button onclick="changeComponentCount(this, -1)">-</button>
        <input type="number" value="${count}" min="0" oninput="updateComponentCount(this)">
        <button onclick="changeComponentCount(this, 1)">+</button>
    `;
    list.appendChild(listItem);
}

function updateComponentCount(input) {
    const newValue = input.value;
    input.value = newValue.replace(/\D/g, ''); // Убедимся, что значение числовое
    saveComponents();
}

function changeComponentCount(button, delta) {
    const input = button.parentNode.querySelector('input[type="number"]');
    let currentValue = parseInt(input.value, 10);
    currentValue = isNaN(currentValue) ? 0 : currentValue;
    currentValue += delta;
    currentValue = currentValue < 0 ? 0 : currentValue; // Не позволяем отрицательные значения
    input.value = currentValue;
    saveComponents();
}

function saveComponents() {
    const listItems = document.querySelectorAll('#components li');
    const components = Array.from(listItems).map(item => {
        const name = item.querySelector('span').textContent;
        const count = item.querySelector('input[type="number"]').value;
        return { name, count };
    });
    localStorage.setItem('components', JSON.stringify(components));
}

function loadComponents() {
    const components = JSON.parse(localStorage.getItem('components')) || [];
    components.forEach(({ name, count }) => addComponentToList(name, count));
}

function scheduleMidnightClear() {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const millisTillMidnight = midnight.getTime() - now.getTime();
    setTimeout(() => {
        localStorage.removeItem('components');
        location.reload(); // Перезагрузить страницу для отображения очищенных данных
    }, millisTillMidnight);
}