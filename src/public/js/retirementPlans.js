const plansContainer = document.getElementById('plans-container');
const addPlanButton = document.getElementById('add-plan-button');
const planFormContainer = document.getElementById('plan-form-container');

/*
*  Load plans on page load
*/
async function loadPlans() {
  try {
    const res = await fetch('/api/retirementPlans');
    const plans = await res.json();

    plansContainer.innerHTML = '';

    if (!plans || plans.length === 0) {
      plansContainer.innerHTML = '<p>No plans yet.</p>';
      return;
    }

    plans.forEach(plan => {
      const planDiv = document.createElement('div');
      planDiv.className = 'plan';
      planDiv.innerHTML = `
        <strong>${plan.name}</strong> | Current Age: ${plan.current_age} | Retirement Age: ${plan.retirement_age} | Contribution: $${plan.annual_contribution} | Expected Return: ${plan.expected_return}%
        <button class="delete-plan" data-id="${plan.id}">Delete</button>
      `;
      plansContainer.appendChild(planDiv);
    });
  } 
  catch (err) {
    console.error('Failed to load plans:', err);
  }
}

/*
*  Show form to add new plan
*/
addPlanButton.addEventListener('click', () => {
  planFormContainer.innerHTML = `
    <h3>Add New Plan</h3>
    <input type="text" id="plan-name" placeholder="Plan Name"><br>
    <input type="number" id="current-age" placeholder="Current Age"><br>
    <input type="number" id="retirement-age" placeholder="Retirement Age"><br>
    <input type="number" id="annual-contribution" placeholder="Annual Contribution"><br>
    <input type="number" id="expected-return" placeholder="Expected Return (%)"><br><br>
    <button id="save-plan">Save Plan</button>
  `;

  document.getElementById('save-plan').addEventListener('click', async () => {
    const name = document.getElementById('plan-name').value;
    const current_age = document.getElementById('current-age').value;
    const retirement_age = document.getElementById('retirement-age').value;
    const annual_contribution = document.getElementById('annual-contribution').value;
    const expected_return = document.getElementById('expected-return').value;

    try {
      const res = await fetch('/api/retirementPlans/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, current_age, retirement_age, annual_contribution, expected_return })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      planFormContainer.innerHTML = '';
      loadPlans();
    } 
    catch (err) {
      alert('Error saving plan: ' + err.message);
    }
  });
});

/*
*  Handle delete button clicks
*/
plansContainer.addEventListener('click', async (e) => {
  if (!e.target.classList.contains('delete-plan')) return;

  const planId = e.target.dataset.id;
  if (!confirm('Delete this plan?')) return;

  try {
    const res = await fetch(`/api/retirementPlans/${planId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    loadPlans();
  } 
  catch (err) {
    alert('Error deleting plan: ' + err.message);
  }
});

/*
*  Load plans when page is ready
*/
document.addEventListener('DOMContentLoaded', loadPlans);