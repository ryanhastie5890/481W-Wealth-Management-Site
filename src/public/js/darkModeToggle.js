// 1. Check local storage when the page loads
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

const toggleBtn = document.getElementById('darkModeBtn');

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        // Toggle the class on the body
        document.body.classList.toggle('dark-mode');
        
        // 2. Check if the body now has the class, and save the preference
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            console.log("Dark mode enabled and saved!");
        } else {
            localStorage.setItem('theme', 'light');
            console.log("Light mode enabled and saved!");
        }
    });
}