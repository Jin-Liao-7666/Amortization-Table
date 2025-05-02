document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("mySubmit").onclick = function () {
        const principal = parseFloat(document.getElementById("P").value);
        const term = parseFloat(document.getElementById("t").value);
        const annualRate = parseFloat(document.getElementById("r").value);
        const startDate = document.getElementById("d").value;

        if (isNaN(principal) || isNaN(term) || isNaN(annualRate) || !startDate) {
            alert("Please enter valid numeric values and a start date.");
            return;
        }

        const amortizationTable = generateAmortizationTable(principal, annualRate, term, startDate);
        displayAmortizationTable(amortizationTable);
          
    };

    function generateAmortizationTable(principal, annualRate, term, startDate) {
        const monthlyRate = annualRate / 12 / 100;
        const totalPayments = term * 12;
        const monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));

        let remainingBalance = principal;

        const table = [];
        let currentDate = new Date(startDate);

        for (let i = 1; i <= totalPayments; i++) {
            const interest = remainingBalance * monthlyRate;
            const principalPayment = monthlyPayment - interest;
            remainingBalance -= principalPayment;

            table.push({
                date:currentDate.toISOString().split('T')[0],
                payment: monthlyPayment.toFixed(2),
                principal: principalPayment.toFixed(2),
                interest: interest.toFixed(2),
                balance: remainingBalance > 0 ? remainingBalance.toFixed(2) : "0.00",
            });

            currentDate = new Date(new Date(currentDate).setMonth(currentDate.getMonth() + 1));
    }

        return table;
    }
   
    function displayAmortizationTable(table) {
        const tableContainer = document.getElementById("AT");
        tableContainer.innerHTML = "";
        table.forEach((row, index) => {
            const rowElement = document.createElement("tr");
            rowElement.classList.add("smooth-row");
            rowElement.innerHTML = `
                <td>${row.date}</td>
                <td>${row.payment}</td>
                <td>${row.principal}</td>
                <td>${row.interest}</td>
                <td>${row.balance}</td>
            `;
            //rowElement.style.display = "none"; 
            tableContainer.appendChild(rowElement);
            //$(rowElement).delay(index * 100).slideDown(3000);
            setTimeout(() => {
                rowElement.classList.add("visible");
            }, index * 15);
        });
    }

            });
