document.addEventListener("DOMContentLoaded", function () {
    // Attach event listeners
    initializeEventListeners();

    function initializeEventListeners() {
        document.getElementById("mySubmit").addEventListener("click", handleFormSubmission);
        document.getElementById("exportButton").addEventListener("click", exportTableToExcel);
        document.getElementById("copyTable").addEventListener("click", copyTableToClipboard);
    }

    function handleFormSubmission() {
        // Fetch and validate user input
        const principal = parseFloat(document.getElementById("P").value);
        const term = parseFloat(document.getElementById("t").value);
        const annualRate = parseFloat(document.getElementById("r").value);
        const startDate = document.getElementById("d").value;

        if (isNaN(principal) || isNaN(term) || isNaN(annualRate) || !startDate) {
            alert("Please enter valid numeric values and a start date.");
            return;
        }

        // Generate and display the amortization table
        const amortizationTable = generateAmortizationTable(principal, annualRate, term, startDate);
        displayAmortizationTable(amortizationTable);

        window.scrollBy({
            top: 500, // Amount to scroll down in pixels
            behavior: "smooth", // Smooth scrolling animation
        });
    } 

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
                date: currentDate.toISOString().split('T')[0],
                payment: monthlyPayment.toFixed(2),
                principal: principalPayment.toFixed(2),
                interest: interest.toFixed(2),
                balance: remainingBalance > 0 ? remainingBalance.toFixed(2) : "0.00",
            });

            currentDate.setMonth(currentDate.getMonth() + 1);
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
            tableContainer.appendChild(rowElement);

            // Smooth animation using CSS class
            setTimeout(() => {
                rowElement.classList.add("visible");
            }, index * 15);
        });
    }

    function exportTableToExcel() {
        const table = document.getElementById("AT");
        if (!table) {
            alert("Please generate the amortization table first.");
            return;
        }

        try {
            const workbook = XLSX.utils.table_to_book(table);
            XLSX.writeFile(workbook, "AmortizationTable.xlsx");
        } catch (error) {
            console.error("Error exporting table:", error);
            alert("Error exporting table. Please try again.");
        }
    }

    function copyTableToClipboard() {
        const table = document.getElementById("AT");
        if (!table) {
            alert("Table not found!");
            return;
        }

        const rows = Array.from(table.rows);
        const tableData = rows
            .map(row =>
                Array.from(row.cells)
                    .map(cell => cell.innerText)
                    .join("\t")
            )
            .join("\n");

        navigator.clipboard.writeText(tableData).then(
            () => alert("Table copied to clipboard!"),
            err => {
                console.error("Failed to copy table:", err);
                alert("Failed to copy table. Please try again.");
            }
        );
    }
});
