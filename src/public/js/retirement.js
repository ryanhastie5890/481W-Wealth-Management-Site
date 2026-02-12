const addInvestmentsButton = document.getElementById('add-investments-button');
const modal = document.getElementById('investment-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementById('close-modal');

const retirementOptions = {
  "Individual Retirement Accounts": ["IRA", "Roth IRA"],
  "Employer Retirement Accounts": ["401k", "403b"],
  "HSA": ["HSA"]
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// create new rows for retirement-table-body
async function loadRetirementAccounts() {
  const res = await fetch('/api/retirement');
  const accounts = await res.json();

  const tbody = document.getElementById('retirement-table-body');
  tbody.innerHTML = '';

  accounts.forEach(account => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>
        <input
          type="text"
          value="${account.display_name}"
          data-id="${account.id}"
          class="display-name-input"
        />
      </td>

      <td>
        <input
          type="text"
          value="${Number(account.current_balance).toLocaleString()}"
          data-id="${account.id}"
          class="balance-input"
          inputmode="numeric"
        />
      </td>

      <td>
        <button data-id="${account.id}" class="save-btn">Save</button>
      </td>
    `;

    tbody.appendChild(row);
  });

  console.log('Loaded retirement accounts:', accounts);
}

// open modal on button click
addInvestmentsButton.addEventListener('click', () => {
  modal.style.display = 'block';
  showCategoryOptions();
});

// close modal
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// close modal if user clicks outside content
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

function showCategoryOptions() {
  modalBody.innerHTML = '<h3>Select Investment Category:</h3>';
  Object.keys(retirementOptions).forEach(cat => {
    const button = document.createElement('button');
    button.innerText = cat;
    button.style.margin = '5px';
    button.onclick = () => showSubtypeOptions(cat);
    modalBody.appendChild(button);
  });
}

function showSubtypeOptions(category) {
  modalBody.innerHTML = `<h3>${category} Types:</h3>`;
  retirementOptions[category].forEach(sub => {
    const button = document.createElement('button');
    button.innerText = sub;
    button.style.margin = '5px';
    button.onclick = () => showFinalForm(category, sub);
    modalBody.appendChild(button);
  });
}

  function showFinalForm(category, subtype) {
    modalBody.innerHTML = `
      <h3>Add ${subtype}</h3>
      <label>Balance</label>
      <input type="text" id="balance" placeholder="$0" inputmode="numeric" autocomplete="off">
      <br><br>
      <button id="save-account">Save Account</button>
    `;
    // below code handles input for investment accounts.
    const balanceInput = document.getElementById('balance');

    balanceInput.addEventListener('input', (e) => {
      // remove values that are not a digit
      let value = e.target.value.replace(/\D/g, '');

      // add commas if value is large enough. e.g. 1,000 1,000,000
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      e.target.value = value;
    });

    document.getElementById('save-account').onclick = async () => {
      const account_type = subtype;
      const preAmount = balanceInput.value;
      const amount = preAmount.replace(/,/g,'');

      // FIX ME: further test isNAN
      if (!amount || isNaN(amount)) {
        alert('Please enter a valid amount');
        return;
      }

      const res = await fetch('/api/retirement/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_type,
          amount
        })
      });

      const data = await res.json();

      if (data.success) {
        console.log(`Saved ${account_type} with amount ${amount}.`);
        modal.style.display = 'none';
        modalBody.innerHTML = '';
        await loadRetirementAccounts(); // refresh retirement table after adding account
        alert(`Added ${account_type}`);
      } 
      else {
        alert('Error adding account');
      }
    };
  }

document.getElementById('retirement-table-body').addEventListener('click', async (e) => {
  if (!e.target.classList.contains('save-btn')) return;

  const id = e.target.dataset.id;
  const row = e.target.closest('tr');

  const displayName = row.querySelector('.display-name-input').value;
  const rawBalance = row.querySelector('.balance-input').value;
  const balance = rawBalance.replace(/,/g, '');

  if (!displayName || isNaN(balance)) {
    alert('Invalid input');
    return;
  }

  const res = await fetch('/api/retirement/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      display_name: displayName,
      amount: balance
    })
  });

  const data = await res.json();

  if (data.success) {
    console.log('Updated account', id);
    await loadRetirementAccounts();
  } else {
    alert('Update failed');
  }
});


// FIX ME
document.addEventListener('DOMContentLoaded', loadRetirementAccounts);
