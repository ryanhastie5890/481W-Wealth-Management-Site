const buttons = document.querySelectorAll('.slide-group button');
const sections = document.querySelectorAll('.content-section');

/*
*   Will display or hide tab section depending on which tab is currently active
*/
function showSection(targetId) {
  // hide all
  sections.forEach(sec => sec.classList.remove('active'));

  // remove active button styles
  buttons.forEach(btn => btn.classList.remove('active'));

  // show selected
  const target = document.getElementById(targetId);
  if (target) target.classList.add('active');

  // highlight button
  const activeBtn = document.querySelector(`[data-target="${targetId}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

/*
*   attach listeners to each button (tab)
*/ 
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-target');
    showSection(target);
  });
});

/* 
*   Default view 
*/
document.addEventListener('DOMContentLoaded', () => {
  showSection('plans-section');
});