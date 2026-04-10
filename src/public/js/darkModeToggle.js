const toggleBtn = document.getElementById('darkModeBtn');

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Add your specific logic here
        console.log("Dark mode toggled!");
    });
}