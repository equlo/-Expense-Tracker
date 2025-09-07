const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseList = document.getElementById('expense-list');
const totalDisplay = document.getElementById('total');
const savingsDisplay = document.getElementById('savings');
const usageDisplay = document.getElementById('usage');
const progressBar = document.getElementById('progress');

const budgetInput = document.getElementById('budget-input');
const setBudgetBtn = document.getElementById('set-budget');

let expenses = [];
let budget = 0;

// Set Budget
setBudgetBtn.addEventListener('click', () => {
    const value = parseFloat(budgetInput.value);
    if(!isNaN(value) && value >= 0) {
        budget = value;
        updateSummary();
        budgetInput.value = '';
    } else {
        alert("Please enter a valid budget");
    }
});

// Add Expense
expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);

    if(name !== "" && !isNaN(amount)) {
        const expense = {
            id: Date.now(),
            name,
            amount
        };
        expenses.push(expense);
        renderExpenses();
        expenseForm.reset();
    }
});

// Render Expenses
function renderExpenses() {
    expenseList.innerHTML = '';
    let total = 0;
    expenses.forEach(exp => {
        total += exp.amount;
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${exp.name}: ₹${exp.amount.toFixed(2)}</span>
            <div>
                <button onclick="editExpense(${exp.id})">Edit</button>
                <button onclick="deleteExpense(${exp.id})">Delete</button>
            </div>
        `;
        expenseList.appendChild(li);
    });
    updateSummary(total);
}

// Update Summary
function updateSummary(totalExpenses = null) {
    let total = totalExpenses !== null ? totalExpenses : expenses.reduce((sum, exp) => sum + exp.amount, 0);
    totalDisplay.textContent = total.toFixed(2);

    const savings = budget - total;
    savingsDisplay.textContent = savings >= 0 ? savings.toFixed(2) : "0";

    const usage = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
    usageDisplay.textContent = usage.toFixed(2);
    progressBar.style.width = usage + "%";
    if(usage <= 50) {
        progressBar.style.background = "linear-gradient(90deg, #4caf50, #81c784)";
    } else if(usage <= 80) {
        progressBar.style.background = "linear-gradient(90deg, #ffb74d, #ffa726)";
    } else {
        progressBar.style.background = "linear-gradient(90deg, #f44336, #e57373)";
    }
}

// Delete Expense
function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    renderExpenses();
}

// Edit Expense
function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    expenseNameInput.value = expense.name;
    expenseAmountInput.value = expense.amount;
    deleteExpense(id);
}
