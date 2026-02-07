const addInvestmentsButton = document.getElementById('add-investments-button');
const modal = document.getElementById('investment-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementById('close-modal');

const retirementOptions = {
  "Individual Retirement Accounts": ["IRA", "Roth IRA"],
  "Employer Retirement Accounts": ["401k", "403b"],
  "HSA": ["HSA"]
};

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
    <label>Current Balance</label>
    <input type="number" id="current_balance" step="0.01">
    <br><br>
    <button id="save-account">Save Account</button>
  `;

  document.getElementById('save-account').onclick = async () => {
    const amount = document.getElementById('current_balance').value;

    const res = await fetch('/api/retirement/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account_type: subtype,
        amount
      })
    });

    if (res.ok) {
      console.log('Retirement test sent');
      modal.style.display = 'none';
    } 
    else {
      console.log('Error sending retirement test');
    }
  };
}
