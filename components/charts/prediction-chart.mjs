import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

customElements.define("prediction-chart", class PredictionChart extends BaseElement {
    static get properties() {
        return {
            data: { type: Array }
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: block;
                    width: 100%;
                }

                canvas {
                    width: 100%;
                    height: 400px;
                }
            `
        ];
    }

    constructor() {
        super();
        this.chart = null;
        this.data = [];
    }

    firstUpdated() {
        super.firstUpdated();
        if (this.data.length) {
            this._renderChart();
        }
    }

    updated(changedProperties) {
        if (changedProperties.has('data') && this.data.length) {
            this._renderChart();
        }
    }

    _renderChart() {
        if (this.chart) {
            this.chart.destroy();
        }
        const ctx = this.renderRoot.querySelector('canvas').getContext('2d');
        const labels = this.data.map(item => 
            new Date(item.date).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        );
        const dataSets = Object.keys(this.data[0]).filter(key => key !== 'date').map(key => {
            return {
                label: key,
                data: this.data.map(item => item[key]),
                fill: false,
                borderColor: this._getRandomColor(),
                tension: 0.1
            }
        });

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: dataSets
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)', // Светлая сетка для оси Y
                            borderDash: [5, 5],
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)', // Цвет подписей к делениям оси Y
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)', // Светлая сетка для оси X
                            borderDash: [5, 5],
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)', // Цвет подписей к делениям оси X
                        }
                    }
                }
            }
        });
    }

    _getRandomColor() {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgb(${r}, ${g}, ${b})`;
    }

    render() {
        return html`
            <canvas></canvas>
        `;
    }
});