document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("stockChart").getContext("2d");
    let stockChart;
    let companyData = {};

    fetch('https://raw.githubusercontent.com/shaktids/stock_app_test/main/dump.csv')
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true, skipEmptyLines: true,
                complete: results => processCSV(results.data)
            });
        });

    function processCSV(data) {
        companyData = {}; document.getElementById("companyList").innerHTML = "";
        data.forEach(row => {
            const company = row.index_name;
            if (!companyData[company]) companyData[company] = [];
            companyData[company].push({
                date: row.index_date,
                open: parseFloat(row.open_index_value),
                high: parseFloat(row.high_index_value),
                low: parseFloat(row.low_index_value),
                close: parseFloat(row.closing_index_value)
            });
        });
        Object.keys(companyData).forEach(company => {
            let li = document.createElement("li");
            li.textContent = company;
            li.classList.add("list-group-item");
            li.onclick = () => drawChart(company);
            document.getElementById("companyList").appendChild(li);
        });
    }

    function drawChart(company) {
        const data = companyData[company];
        const labels = data.map(item => item.date);
        const datasets = [
            { label: "Open", data: data.map(item => item.open), borderColor: "#ffcc00", fill: false },
            { label: "High", data: data.map(item => item.high), borderColor: "#ff5733", fill: false },
            { label: "Low", data: data.map(item => item.low), borderColor: "#33b5e5", fill: false },
            { label: "Close", data: data.map(item => item.close), borderColor: "#2ecc71", fill: false }
        ];
        if (stockChart) stockChart.destroy();
        stockChart = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Stock Price Trends for ${company}`
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        },
                        ticks: { color: "#000" }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price'
                        },
                        ticks: { color: "#000" }
                    }
                }
            }
        });
    }

    function filterCompanies() {
        let filter = document.getElementById("searchBar").value.toUpperCase();
        document.querySelectorAll("#companyList li").forEach(item => {
            item.style.display = item.textContent.toUpperCase().includes(filter) ? "" : "none";
        });
    }

    function toggleTheme() {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
        }
    });

    function downloadChart() {
        let link = document.createElement('a');
        link.href = stockChart.toBase64Image();
        link.download = 'stock_chart.png';
        link.click();
    }

    function filterByDate() {
        let startDate = document.getElementById("startDate").value;
        let endDate = document.getElementById("endDate").value;
        alert(`Filtering from ${startDate} to ${endDate}`);
    }
});
