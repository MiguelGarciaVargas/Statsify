import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { WeeklyData } from '../../../../interfaces/weekly-data';
import { Item } from '../../../../interfaces/item';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('chartCanvas') private chartCanvas!: ElementRef;

  @Input() datasets: WeeklyData[] = []; // Array of datasets
  @Input() title: string = 'Line Chart'; // Optional title

  private chart: Chart | undefined;

  constructor() {
    Chart.register(...registerables); // Register Chart.js components
  }

  ngAfterViewInit() {
    console.log('DATASETS->', this.datasets);
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Check if datasets has changed
    if (changes['datasets'] && !changes['datasets'].firstChange) {
      this.createChart(); // Update the chart when datasets change
    }
  }

  createChart() {
    const color = this.getColor();
    if (this.chartCanvas) {
      // Extrae las etiquetas (semanas) del primer dataset
      const labels = this.datasets[0]?.data.map((item) => item.id) || []; // Extrae las fechas del primer dataset

      // Mapea los datasets a un formato que Chart.js entienda
      const chartDatasets = this.datasets.map((dataset) => ({
        label: dataset.datasetName, // Nombre del dataset (por ejemplo, "Tiempo de Escucha Diario")
        data: dataset.data.map((item) => parseFloat(item.name)), // Usamos `name` como el tiempo de escucha (eje Y)
        borderColor: color, // Color aleatorio para la línea
        backgroundColor: `${color}33`, // Color de fondo con opacidad
        fill: true, // Relleno bajo la línea
        tension: 0.4, // Curvatura de la línea
        borderWidth: 2, // Grosor de la línea
      }));

      // Crea el gráfico
      this.chart = new Chart(this.chartCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: labels, // Las etiquetas son las fechas
          datasets: chartDatasets,
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              labels: {
                color: '#FFFFFF',
              },
            },
            tooltip: {
              enabled: true, // Asegúrate de que los tooltips estén habilitados

              mode: 'index', // Cambiar el modo de activación para que se active al pasar sobre un punto
              intersect: false, // Hace que el tooltip aparezca incluso si el puntero no está directamente sobre un punto

              callbacks: {
                label: function (tooltipItem) {
                  // Formato personalizado para los tooltips
                  return `Tiempo de Escucha: ${tooltipItem.raw} minutos`;
                },
              },
            },
          },

          scales: {
            x: {
              type: 'time', // Usamos el tipo `time` para el eje X
              time: {
                unit: 'day', // Usamos "day" para mostrar solo día, mes y año
                tooltipFormat: 'll', // Formato para los tooltips
                displayFormats: {
                  day: 'dd MMM yyyy', // Formato de fecha en el eje X (día, mes y año)
                },
              },
              title: {
                display: true,
                text: 'Fecha', // Título del eje X
              },
            },
            y: {
              title: {
                display: true,
                text: 'Minutes',
              },
              beginAtZero: true,
            },
          },
        },
      });
    }
  }

  // Método auxiliar para definir colores aleatorios
  getColor(): string {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return randomColor; // Retorna un color aleatorio en formato hexadecimal
  }
}
