const plansContainer = document.getElementById('plans-container');
const addPlanButton = document.getElementById('add-plan-button');
const planFormContainer = document.getElementById('plan-form-container');
// modal variables used are declared in retirement.js
let growthChart = null;

/*
*   load plans on page load
*/
async function loadPlans() {
  try {
    const res = await fetch('/api/retirementPlans');
    const plans = await res.json();

    plansContainer.innerHTML = '';

    if (!plans || plans.length === 0) {
      plansContainer.innerHTML = '<p>No plans yet.</p>';
      renderGrowthChart([], []);
      return;
    }

    const initialBalance = await getExistingRetirementBalance();

    plans.forEach(plan => {
      const projected = calculateProjectedBalance(
        initialBalance,
        plan.current_age,
        plan.retirement_age,
        plan.annual_contribution,
        plan.expected_return
      );

      const planDiv = document.createElement('div');
      planDiv.className = 'plan';
      planDiv.innerHTML = `
        <strong>${plan.name}</strong> | <strong>Current Age:</strong> ${plan.current_age} | <strong>Retirement Age:</strong> ${plan.retirement_age} | 
        <strong>Contribution:</strong> $${plan.annual_contribution} | <strong>Expected Return:</strong> ${plan.expected_return || '5.5%'}% |
        <strong>Projected Balance:</strong> $${projected}
        <button class="delete-plan" data-id="${plan.id}" style="border-radius: 5px">Delete</button>
      `;
      plansContainer.appendChild(planDiv);
    });
    // FIX ME: BUG will only display for 1 plan. if multiple are added, it will not work.
    if (plans.length > 0) {
      const firstPlan = plans[0];

      const growth = generateGrowthData(
        initialBalance,
        firstPlan.current_age,
        firstPlan.retirement_age,
        firstPlan.annual_contribution,
        firstPlan.expected_return
      );

      renderGrowthChart(growth.labels, growth.data);
    }
  } 
  catch (err) {
    console.error('Failed to load plans:', err);
  }
}

/*
*   show form to add new plan
*/
addPlanButton.addEventListener('click', () => {
  modal.classList.add('show');

  modalBody.innerHTML = `
    <h3>Add Retirement Plan</h3>

    <div class="modal-field">
      <label>Plan Name</label>
      <input type="text" id="plan-name" placeholder="Plan Name"><br>
    </div>

    <div class="modal-field">
      <label>Current Age</label>
      <input type="text" id="current-age" placeholder="Current Age" inputmode="numeric" autocomplete="off"><br>
    </div>

    <div class="modal-field">
      <label>Retirement Age</label>
      <input type="text" id="retirement-age" placeholder="Retirement Age" inputmode="numeric" autocomplete="off"><br>
    </div>

    <div class="modal-field">
      <label>Annual Contribution</label>
      <input type="text" id="annual-contribution" placeholder="Annual Contribution" inputmode="numeric" autocomplete="off"><br>
    </div>

    <div class="modal-field">
      <label>Expected Return (%)</label>
      <input type="test" id="expected-return" placeholder="0.0" inputmode="numeric" autocomplete="off"><br><br>
    </div>

    <button id="save-plan" style="border-radius: 5px">Save Plan</button>
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

      modal.classList.remove('show');
      modalBody.innerHTML = '';
      loadPlans();
    } 
    catch (err) {
      alert('Error saving plan: ' + err.message);
    }
  });
});

/*
*   handle delete button clicks
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
*   calculates projected balance with defaults
*   current_age, retirement_age, annual_contribution are required
*   expected_return is optional. if not provided, default is 5.5% real return
*/
function calculateProjectedBalance(initialBalance, current_age, retirement_age, annual_contribution, expected_return) {
  const n = retirement_age - current_age;
  let r;
  if (!expected_return) {
    const stockGrowthRate = 7.0;  // default 7.0% for Stock Growth Rate
    const dividendYield = 1.5;  // default 1.5% for Stock Dividend Yield
    const inflation = 3.0;  // default 3.0% for Inflation
    r = (stockGrowthRate + dividendYield - inflation) / 100; // 5.5% default
  } 
  else {
    r = expected_return / 100;
  }
  const P = Number(initialBalance) || 0; 
  const C = Number(annual_contribution);

  const fv = P * Math.pow(1 + r, n) + C * ((Math.pow(1 + r, n) - 1) / r);
  return fv.toFixed(2);  // rounds to 2 decimals
}

/*
*
*/
async function getExistingRetirementBalance() {
  try {
    const res = await fetch('/api/retirement');
    const accounts = await res.json();

    if (!accounts || accounts.length === 0) return 0;

    // sum any / all account balances
    return accounts.reduce((sum, acc) => {
      const value = Number(String(acc.current_balance).replace(/,/g, ''));
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
  } 
  catch (err) {
    console.error('Error fetching existing accounts:', err);
    return 0;
  }
}


/*
*
*/
function generateGrowthData(initialBalance, current_age, retirement_age, annual_contribution, expected_return) {
  const r = expected_return / 100;
  const C = Number(annual_contribution);
  let balance = Number(initialBalance);

  const labels = [];
  const data = [];

  for (let age = current_age; age <= retirement_age; age++) {
    labels.push(age);
    data.push(Number(balance.toFixed(2)));

    // apply growth + contribution for next year
    balance = balance * (1 + r) + C;
  }

  return { labels, data };
}

/*
*
*/
function renderGrowthChart(labels, data) {
  const ctx = document.getElementById('planGrowthChart').getContext('2d');

  if (growthChart) {
    growthChart.destroy();
  }

  growthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Projected Balance Over Time',
        data: data,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

/*
*  Load plans when page is ready
*/
document.addEventListener('DOMContentLoaded', loadPlans);