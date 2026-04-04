const plansContainer = document.getElementById('plans-container');
const addPlanButton = document.getElementById('add-plan-button');
const planFormContainer = document.getElementById('plan-form-container');
// modal variables used are declared in retirement.js
let growthChart = null;

/*
*   Fetches all retirement plans from the server and renders them in the plans container
*   Maximum of 5 plans by disabling the Add Plan button when the limit is reached
*/
async function loadPlans() {
  try {
    const res = await fetch('/api/retirementPlans');
    const plans = await res.json();

    plansContainer.innerHTML = '';

    // limit plans to just 5
    if (plans.length >= 5) {
    addPlanButton.disabled = true;
    addPlanButton.innerText = "Max 5 Plans Reached";
    } else {
    addPlanButton.disabled = false;
    addPlanButton.innerText = "Add Plan";
    }

    // do not display a line if no plans are present
    if (!plans || plans.length === 0) {
      plansContainer.innerHTML = `
        <div style="text-align:center; color:white; margin-top:10px;">
          No retirement plans present
        </div>
      `;
      renderGrowthChart([], []);
      return;
    }

    const initialBalance = await getExistingRetirementBalance(true);

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
        <strong>Contribution:</strong> $${Number(plan.annual_contribution).toLocaleString()} | <strong>Expected Return:</strong> ${plan.expected_return || '5.5%'}% |
        <strong>Projected Balance:</strong> $${Number(projected).toLocaleString()}
        <button class="delete-plan" data-id="${plan.id}" style="border-radius: 5px">Delete</button>
      `;
      plansContainer.appendChild(planDiv);
    });

    if (plans.length > 0) {
    const datasets = [];
    let labels = [];

    plans.slice(0, 5).forEach((plan, index) => {
        const growth = generateGrowthData(
        initialBalance,
        plan.current_age,
        plan.retirement_age,
        plan.annual_contribution,
        plan.expected_return
        );

        // Use labels from first plan
        if (index === 0) {
        labels = growth.labels;
        }

        datasets.push({
        label: plan.name,
        data: growth.data,
        tension: 0.3
        });
    });

      renderGrowthChart(labels, datasets);
    }
  } 
  catch (err) {
    console.error('Failed to load plans:', err);
  }
}

/*
*   Opens the Add Plan modal and renders a form for the user to input plan details
*   On save strips commas before submitting data to the server then refreshes the plans list
*/
addPlanButton.addEventListener('click', () => {
  modal.classList.add('show');

  modalBody.innerHTML = `
    <h3>Add Retirement Plan: Limit 5.</h3>

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

  document.getElementById('annual-contribution').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    e.target.value = value;
  });

  document.getElementById('save-plan').addEventListener('click', async () => {
    const name = document.getElementById('plan-name').value;
    const current_age = document.getElementById('current-age').value;
    const retirement_age = document.getElementById('retirement-age').value;
    const annual_contribution = document.getElementById('annual-contribution').value.replace(/,/g, '');
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
*   Handle delete button clicks
*   Prompts the user for confirmation
*   Refreshes the plans list after a successful deletion
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
*   Calculates projected balance with defaults
*   current_age, retirement_age, annual_contribution are required
*   expected_return is optional. if not provided, default is 5.5% real return
*   (7.0% stock growth + 1.5% dividend yield - 3.0% inflation)
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
*   Fetches all retirement and savings accounts from the server and sums their balances.
*   Defaults to false (savings excluded) unless explicitly passed as true.
*/
async function getExistingRetirementBalance(includeSavings = false) {
  try {
    const res = await fetch('/api/retirement');
    const accounts = await res.json();

    if (!accounts || accounts.length === 0) return 0;

    // sum any / all account balances
    return accounts
      .filter(acc => includeSavings || acc.account_type !== "Savings")
      .reduce((sum, acc) => {
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
*   Generates year-by-year balance data for the growth chart between current_age and retirement_age.
*   Returns an object containing labels (ages) and data (balances) arrays for use with Chart.js.
*/
function generateGrowthData(initialBalance, current_age, retirement_age, annual_contribution, expected_return) {
  const r = expected_return ? expected_return / 100 : 0.055; // FIX ME: possible fix for NaN bug
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
*   Renders || re-renders the projected balance line chart using Chart.js.
*   Accepts labels (ages) and datasets (one per plan) to support multiple plans.
*/
function renderGrowthChart(labels, datasets) {
  const ctx = document.getElementById('planGrowthChart').getContext('2d');

  if (growthChart) {
    growthChart.destroy();
  }

  growthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: { 
            display: true, 
            labels: {
                boxWidth: 12,
                boxHeight: 12,
                padding: 10
            }
        }
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
*   Initializes plans list after DOM is fully loaded
*/
document.addEventListener('DOMContentLoaded', loadPlans);

/*
*   Re-fetches and re-renders plans when an account is deleted
*/
document.addEventListener('accountDeleted', loadPlans);