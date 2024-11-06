import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import { Chart, ChartType, Legend, registerables } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements AfterViewInit {
  @ViewChild('chartCanvas') private chartCanvas!: ElementRef;

  @Input() data: { week: string; value: number }[] = []; // Array de datos con label y valor
  @Input() title: string = 'Line Chart'; // Título opcional

  private chart: Chart | undefined;

  constructor() {
    Chart.register(...registerables); // Registra los componentes de Chart.js
  }

  ngAfterViewInit() {
    console.log(this.data);

    this.createChart();
  }

  createChart() {
    if (this.chartCanvas) {
      const labels = this.data.map((item) => item.week); // Extrae etiquetas
      const values = this.data.map((item) => item.value); // Extrae valores

      this.chart = new Chart(this.chartCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: this.title,
              data: values,
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: '#4CAF50',
              pointBorderColor: '#FFFFFF',
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Weeks',
                color: '#FFFFFF',
              },
              border: {
                color: '#FFFFFF',
              },
              ticks: {
                color: '#FFFFFF',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Minutes',
                color: '#FFFFFF',
              },
              border: {
                color: '#FFFFFF',
              },
              ticks: {
                color: '#FFFFFF',
              },
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false, // Desactiva la leyenda
            },
          },
        },
      });
    } else {
      console.error('Canvas element not found');
    }
  }
}
