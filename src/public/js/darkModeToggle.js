const toggleBtn = document.getElementById('darkModeBtn');

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        console.log("Dark mode toggled!");
    });
}