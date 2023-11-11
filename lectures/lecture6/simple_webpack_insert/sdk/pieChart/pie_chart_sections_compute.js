function createPieChart(divId) {
    fetch('http://localhost:8080/pie-chart', {
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*'
            },
        }
    )
        .then(response => response.text())
        .then(pieChartHtmlRaw => {
            fetch('http://localhost:8080/pie-chart/5', {
                headers: {
                    'Content-Type': '*/*',
                    Accept: '*/*'
                },
            })
                .then(response => response.json())
                .then(pieChartJson => {
                    document.getElementById(divId).innerHTML = pieChartHtmlRaw;
                    updateSections(pieChartJson.percentages, pieChartJson.colors);
                });
        });
}

function updateSections(sections, colors) {
    const pieChart = document.getElementById('sdkPieChart');
    const legendContainer = document.getElementById('sdkLegend');

    // Update conic-gradient for the pie chart
    pieChart.style.background = `conic-gradient(${colors
        .map((color, i) => `${color} 0% ${sections.slice(0, i + 1).reduce((acc, val) => acc + val, 0)}%`)
        .join(', ')}, ${colors[0]} 100%)`;

    // Update legend
    legendContainer.innerHTML = '';
    sections.forEach((percentage, index) => {
        const color = colors[index];
        const legendItem = document.createElement('div');
        legendItem.innerHTML = `<span style="background-color: ${color};"></span> Section ${index + 1}`;
        legendContainer.appendChild(legendItem);
    });
}

module.exports = {createPieChart};