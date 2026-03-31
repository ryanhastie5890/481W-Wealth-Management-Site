// reusing much from retirement.js just want a separate file for calrity and readability

const savingsTableBody = document.getElementById('savings-table-body');
const addSavingsButton = document.getElementById('add-savings-button');
const accountHeader = document.getElementById('savings-account-header');
const balanceHeader = document.getElementById('savings-balance-header');
const actionsHeader = document.getElementById('savings-actions-header');

/*
* Load savings accounts
*/
async function loadSavingsAccounts() {
  const res = await fetch('/api/retirement');
  const accounts = await res.json();

  const savingsAccounts = accounts.filter(acc => acc.account_type === "Savings");

  savingsTableBody.innerHTML = '';

  if (!savingsAccounts || savingsAccounts.length === 0) {
    accountHeader.style.display = 'none';
    balanceHeader.style.display = 'none';
    actionsHeader.style.display = 'none';

    savingsTableBody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center; color:white;">
          No savings accounts present
        </td>
      </tr>
    `;
    } else {
      accountHeader.style.display = '';
      balanceHeader.style.display = '';
      actionsHeader.style.display = '';
    }

  savingsAccounts.forEach(account => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>
        <input type="text" value="${account.display_name || 'Savings'}"
          data-id="${account.id}" class="display-name-input" />
      </td>

      <td>
        <input type="text"
          value="${Number(account.current_balance).toLocaleString()}"
          data-id="${account.id}" class="balance-input" />
      </td>

      <td>
        <button data-id="${account.id}" class="save-button" style="border-radius: 5px;">Save</button>
        <button data-id="${account.id}" class="delete-button" style="border-radius: 5px;">Delete</button>
      </td>
    `;
    savingsTableBody.appendChild(row);
  });
}

/*
* Add Savings (uses same modal as retirement accounts)
*/
addSavingsButton.addEventListener('click', () => {
  modal.classList.add('show');

  modalBody.innerHTML = `
    <h3>Add Savings Account</h3>

    <label>Account Name</label>
    <input type="text" id="savings-name" placeholder="Savings Account"><br><br>

    <label>Balance</label>
    <input type="text" id="savings-balance" placeholder="$0"><br><br>

    <button id="save-savings">Save</button>
  `;

  const balanceInput = document.getElementById('savings-balance');

  balanceInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    e.target.value = value;
  });

  document.getElementById('save-savings').onclick = async () => {
    const name = document.getElementById('savings-name').value || "Savings";
    const amountRaw = balanceInput.value.replace(/,/g, '');

    if (!amountRaw || isNaN(amountRaw)) {
      alert('Enter valid amount');
      return;
    }

    const res = await fetch('/api/retirement/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account_type: "Savings",
        amount: amountRaw,
        display_name: name
      })
    });

    const data = await res.json();

    if (data.success) {
      modal.classList.remove('show');
      await loadSavingsAccounts();
    } else {
      alert('Error adding savings');
    }
  };
});

/*
* Save / Delete (reuse logic)
*/
savingsTableBody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains('save-button')) {
    const row = e.target.closest('tr');
    const name = row.querySelector('.display-name-input').value;
    const balance = row.querySelector('.balance-input').value.replace(/,/g, '');

    const res = await fetch('/api/retirement/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        display_name: name,
        amount: balance
      })
    });

    const data = await res.json();
    if (data.success) loadSavingsAccounts();
  }

  if (e.target.classList.contains('delete-button')) {
    if (!confirm('Delete this savings account?')) return;

    const res = await fetch(`/api/retirement/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    if (data.success) loadSavingsAccounts();
  }
});

/*
* Load when tab is opened
*/
document.addEventListener('DOMContentLoaded', loadSavingsAccounts);