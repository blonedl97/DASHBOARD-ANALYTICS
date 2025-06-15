const ctx = document.getElementById('realtimeChart').getContext('2d');

let labels = [];
let dataPoints = [];

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Valore in Tempo Reale',
            data: dataPoints,
            borderColor: '#00BFFF',
            backgroundColor: 'rgba(0, 191, 255, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        animation: false,
        plugins: {
            legend: {
                labels: {
                    color: '#00BFFF'
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#00BFFF' },
                title: { display: true, text: 'Tempo', color: '#00BFFF' }
            },
            y: {
                ticks: { color: '#00BFFF' },
                title: { display: true, text: 'Valore', color: '#00BFFF' }
            }
        }
    }
});

async function fetchData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        return data.bitcoin.usd;
    } catch (error) {
        console.error('Errore nel recupero dei dati:', error);
        return null;
    }
}

async function updateDashboard() {
    const now = new Date().toLocaleTimeString();
    const price = await fetchData();

    if (price !== null) {
        if (labels.length > 20) {
            labels.shift();
            dataPoints.shift();
        }

        labels.push(now);
        dataPoints.push(price);

        document.getElementById('current-value').textContent = `$${price}`;

        chart.update();
    }
}

setInterval(updateDashboard, 5000);

