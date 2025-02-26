// Variable to store company data
let companyData = {};
// Variable to store chart instance
let stockChart;
const ctx = document.getElementById("stockChart").getContext("2d");
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
        li.textContent = company; li.classList.add("list-group-item");
        li.onclick = () => drawChart(company);
        document.getElementById("companyList").appendChild(li);
    });
}
function drawChart(company) {
    const data = companyData[company];
    const labels = data.map(item => item.date);
    const openValues = data.map(item => item.open);
    const highValues = data.map(item => item.high);
    const lowValues = data.map(item => item.low);
    const closeValues = data.map(item => item.close);
    if (stockChart) stockChart.destroy();
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: `Open`, data: openValues, borderColor: "#ffcc00", borderWidth: 2 },
                { label: ` High`, data: highValues, borderColor: "#ff5733", borderWidth: 2 },
                { label: ` Low`, data: lowValues, borderColor: "#33b5e5", borderWidth: 2 },
                { label: ` Close`, data: closeValues, borderColor: "#2ecc71", borderWidth: 2 }
            ]
        },
        options: { responsive: true, scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } } }
    });
}
function filterCompanies() {
    let filter = document.getElementById("searchBar").value.toUpperCase();
    let items = document.getElementById("companyList").getElementsByTagName("li");
    for (let i = 0; i < items.length; i++) {
        let txtValue = items[i].textContent || items[i].innerText;
        items[i].style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? "" : "none";
    }
}
function toggleTheme() { document.body.classList.toggle("dark-mode"); }
function downloadChart() {
    let link = document.createElement('a');
    link.href = stockChart.toBase64Image();
    link.download = 'stock_chart.png';
    link.click();
}
function filterByDate() {
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    alert(`Filtering from ${startDate} to ${endDate}`); // Implement filtering logic
}