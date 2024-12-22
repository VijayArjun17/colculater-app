
// script.js
document.addEventListener('DOMContentLoaded', () => {
  const descriptionInput = document.getElementById('description');
  const amountInput = document.getElementById('amount');
  const addButton = document.getElementById('add-button');
  const resetButton = document.getElementById('reset-button');
  const entriesList = document.getElementById('entries-list');
  const totalIncomeEl = document.getElementById('total-income');
  const totalExpensesEl = document.getElementById('total-expenses');
  const netBalanceEl = document.getElementById('net-balance');
  const filterRadioButtons = document.querySelectorAll('input[name="filter"]');

  let entries = JSON.parse(localStorage.getItem('entries')) || [];

  const updateSummary = () => {
    const totalIncome = entries.filter(entry => entry.type === 'income')
                               .reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = entries.filter(entry => entry.type === 'expense')
                                .reduce((sum, entry) => sum + entry.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    totalIncomeEl.textContent = totalIncome;
    totalExpensesEl.textContent = totalExpenses;
    netBalanceEl.textContent = netBalance;
  };

  const renderEntries = () => {
    const selectedFilter = document.querySelector('input[name="filter"]:checked').value;
    const filteredEntries = selectedFilter === 'all' ? entries
                          : entries.filter(entry => entry.type === selectedFilter);
    
    entriesList.innerHTML = '';
    filteredEntries.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.description}: ${entry.amount} (${entry.type})`;
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.onclick = () => editEntry(entry);
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteEntry(entry);
      li.append(editButton, deleteButton);
      entriesList.appendChild(li);
    });
  };

  const addEntry = () => {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());
    const type = document.querySelector('input[name="filter"]:checked').value;

    if (description && !isNaN(amount) && (type === 'income' || type === 'expense')) {
      const newEntry = { description, amount, type };
      entries.push(newEntry);
      localStorage.setItem('entries', JSON.stringify(entries));
      descriptionInput.value = '';
      amountInput.value = '';
      updateSummary();
      renderEntries();
    } else {
      alert('Please enter valid details.');
    }
  };

  const editEntry = (entry) => {
    const description = prompt('Edit description', entry.description);
    const amount = parseFloat(prompt('Edit amount', entry.amount));
    if (description && !isNaN(amount)) {
      entry.description = description;
      entry.amount = amount;
      localStorage.setItem('entries', JSON.stringify(entries));
      updateSummary();
      renderEntries();
    }
  };

  const deleteEntry = (entry) => {
    entries = entries.filter(e => e !== entry);
    localStorage.setItem('entries', JSON.stringify(entries));
    updateSummary();
    renderEntries();
  };

  filterRadioButtons.forEach(button => button.addEventListener('change', renderEntries));
  addButton.addEventListener('click', addEntry);
  resetButton.addEventListener('click', () => {
    descriptionInput.value = '';
    amountInput.value = '';
  });

  // Initial render
  updateSummary();
  renderEntries();
});




