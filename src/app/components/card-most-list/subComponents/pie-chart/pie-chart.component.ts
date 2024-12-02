import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Chart, ChartType, registerables, ChartEvent } from 'chart.js';
import { Router } from '@angular/router';
import { Porcentage } from '../../../../interfaces/porcentage';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('chartCanvas') private chartCanvas!: ElementRef;

  @Input() data: Porcentage[] = []; // Datos genéricos
  @Input() itemType: string = ''; //Indica tipo de redireccion

  public chartType: ChartType = 'doughnut';
  private chart: Chart | undefined;

  public chartLabels: string[] = [];
  public chartData: number[] = [];

  constructor(private router: Router) {
    Chart.register(...registerables); // Registrar los elementos necesarios de Chart.js
  }

  ngAfterViewInit() {
    this.processData();
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.processData();
      this.updateChart();
    }
  }

  // Procesa los datos para obtener las etiquetas y los porcentajes
  processData() {
    this.chartLabels = this.data.map((item) => item.item.name); // Extrae las etiquetas (nombres de los artistas)
    // Extrae los porcentajes y los convierte a números (float)
    this.chartData = this.data.map((item) => parseFloat(item.percentage));

    // Sumar los porcentajes
    const totalPercentage = this.chartData.reduce(
      (sum, value) => sum + value,
      0
    );

    // Si la suma de porcentajes es menor a 100, agregar la categoría "Others"
    const othersPercentage = 100 - totalPercentage;
    if (othersPercentage > 0) {
      this.chartLabels.push('Others');
      this.chartData.push(othersPercentage);
    }
  }

  // Crea el gráfico con los datos procesados
  createChart() {
    if (this.chartCanvas) {
      this.chart = new Chart(this.chartCanvas.nativeElement, {
        type: this.chartType,
        data: {
          labels: this.chartLabels,
          datasets: [
            {
              label: 'Porcentage',
              data: this.chartData,
              backgroundColor: [
                '#FF6384', // Rojo
                '#36A2EB', // Azul
                '#F39C12', // Amarillo dorado
                '#4BC0C0', // Verde agua
                '#9966FF', // Violeta
                '#7D8A92', // Gris azulado
                '#FF5733', // Naranja
                '#33FF57', // Verde brillante
                '#8E44AD', // Púrpura
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 1.5,
          layout: {
            padding: 0,
          },
          onClick: (event, elements) => this.onChartClick(event, elements),
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 20,
                padding: 15,
                usePointStyle: true,
                color: '#FFFFFF',
              },
            },
          },
        },
      });
    } else {
      console.error('Canvas element not found');
    }
  }

  // Manejador de clic en el gráfico
  onChartClick(event: ChartEvent, elements: any[]) {
    if (elements && elements.length) {
      const index = elements[0].index;
      const selectedItem = this.data[index]; // Obtiene el item completo que fue clickeado
      const artistId = selectedItem.item.id; // Aquí tomamos el artistId del item

      // Lógica para decidir la ruta a la que navegar
      if (this.itemType === 'artist') {
        this.router.navigate(['/artist', artistId]); // Redirige a la página del artista con el nombre formateado
      }
    }
  }

  // Actualiza el gráfico cuando cambian los datos
  updateChart() {
    if (this.chart) {
      this.chart.data.labels = this.chartLabels;
      this.chart.data.datasets[0].data = this.chartData;
      this.chart.update();
    }
  }
}
