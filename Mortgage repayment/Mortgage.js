document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mortgage-form');
    const clearBtn = document.getElementById('clear-all');
    const resultsContainer = document.getElementById('results');
    const emptyState = document.getElementById('empty-state');

    // Clear form function
    clearBtn.addEventListener('click', function(e) {
        e.preventDefault();
        form.reset();
        resultsContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const amount = parseFloat(document.getElementById('mortgage-amount').value.replace(/,/g, ''));
        const term = parseInt(document.getElementById('mortgage-term').value);
        const rate = parseFloat(document.getElementById('interest-rate').value);
        const type = document.querySelector('input[name="mortgage-type"]:checked').value;
        
        // Validate inputs
        let isValid = true;
        
        if (isNaN(amount) || amount <= 0) {
            document.getElementById('amount-error').textContent = 'This field is required';
            isValid = false;
        } else {
            document.getElementById('amount-error').textContent = '';
        }
        
        if (isNaN(term) || term <= 0) {
            document.getElementById('term-error').textContent = 'This field is required';
            isValid = false;
        } else {
            document.getElementById('term-error').textContent = '';
        }
        
        if (isNaN(rate) || rate <= 0) {
            document.getElementById('rate-error').textContent = 'This field is required';
            isValid = false;
        } else {
            document.getElementById('rate-error').textContent = '';
        }
        
        if (!isValid) {
            return;
        }
        
        // Calculate mortgage
        let monthlyPayment, totalRepayment;
        
        if (type === 'repayment') {
            monthlyPayment = calculateRepayment(amount, rate, term);
            totalRepayment = monthlyPayment * term * 12;
        } else {
            // Interest-only calculation
            monthlyPayment = (amount * (rate / 100)) / 12;
            totalRepayment = amount + (monthlyPayment * term * 12);
        }
        
        // Display results
        document.getElementById('monthly-payment').textContent = formatCurrency(monthlyPayment);
        document.getElementById('total-repayment').textContent = formatCurrency(totalRepayment);
        
        resultsContainer.classList.remove('hidden');
        emptyState.classList.add('hidden');
    });

    // Format input as currency
    document.getElementById('mortgage-amount').addEventListener('blur', function() {
        const value = this.value.replace(/,/g, '');
        if (!isNaN(value) && value !== '') {
            this.value = parseFloat(value).toLocaleString('en-GB');
        }
    });

    // Helper functions
    function calculateRepayment(principal, annualRate, years) {
        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = years * 12;
        
        return principal * 
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    function formatCurrency(amount) {
        return '£' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    // Keyboard accessibility
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
            e.preventDefault();
            const formElements = Array.from(form.elements);
            const currentIndex = formElements.indexOf(e.target);
            
            if (currentIndex < formElements.length - 2) {
                formElements[currentIndex + 1].focus();
            }
        }
    });
});