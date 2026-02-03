const addInvestmentsButton = document.getElementById('add-investments-button');
const modal = document.getElementById('investment-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementById('close-modal');

const retirementOptions = {
  "IRA": ["IRA", "Roth IRA"],
  "ERA": ["401k", "403b"],
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
    <br>
    <label>Annual Contribution</label>
    <input type="number" id="annual_contribution" step="0.01">
    <br>
    <label>Expected Return (%)</label>
    <input type="number" id="expected_return" step="0.01">
    <br>
    <label>Years to Retirement</label>
    <input type="number" id="years_to_retirement">
    <br><br>
    <button id="save-account">Save Account</button>
  `;

  document.getElementById('save-account').onclick = async () => {
    const account_type = subtype;
    const current_balance = document.getElementById('current_balance').value;
    const annual_contribution = document.getElementById('annual_contribution').value;
    const expected_return = document.getElementById('expected_return').value;
    const years_to_retirement = document.getElementById('years_to_retirement').value;

    // FIX ME: temp log information, setup connection to server later
    console.log({ account_type, current_balance, annual_contribution, expected_return, years_to_retirement });

    // clear modal
    modal.style.display = 'none';
    modalBody.innerHTML = '';
    alert(`Added ${account_type}!`);
  };
}
