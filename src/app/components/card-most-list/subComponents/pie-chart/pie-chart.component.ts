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
import { Router } from '@angular/router'; // Importa el Router de Angular

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('chartCanvas') private chartCanvas!: ElementRef;

  @Input() genres: { genre: string; percentage: string }[] = [];

  public chartType: ChartType = 'doughnut';
  private chart: Chart | undefined;

  public genreLabels: string[] = [];
  public genreData: number[] = [];

  constructor(private router: Router) {
    // Inyecta el Router en el constructor
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    this.processGenresData();
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['genres'] && !changes['genres'].firstChange) {
      this.processGenresData();
      this.updateChart();
    }
  }

  processGenresData() {
    this.genreLabels = this.genres.map((g) => g.genre);
    this.genreData = this.genres.map((g) => parseFloat(g.percentage));
    // Suma los porcentajes de los géneros en el top 5
    const totalPercentage = this.genreData.reduce(
      (sum, value) => sum + value,
      0
    );
    // Calcula el porcentaje para "Others"
    const othersPercentage = 100 - totalPercentage;
    // Si el porcentaje de "Others" es mayor a 0, agrégalo como una nueva entrada
    if (othersPercentage > 0) {
      this.genreLabels.push('Others');
      this.genreData.push(othersPercentage);
    }
  }

  createChart() {
    if (this.chartCanvas) {
      this.chart = new Chart(this.chartCanvas.nativeElement, {
        type: this.chartType,
        data: {
          labels: this.genreLabels,
          datasets: [
            {
              label: 'Top 5 Géneros',
              data: this.genreData,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#E7E9ED', // Color adicional para "Others"
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
          onClick: (event, elements) => this.onChartClick(event, elements), // Agrega el listener de clic
          plugins: {
            legend: {
              position: 'right', // Coloca la leyenda a la derecha de la gráfica
              labels: {
                boxWidth: 20, // Tamaño del cuadro de color en la leyenda
                padding: 15, // Espaciado entre el cuadro de color y el texto
                usePointStyle: true, // Usa un estilo de punto circular (opcional)
                color: '#FFFFFF', // Cambia el color del texto de la leyenda a blanco
              },
            },
          },
        },
      });
    } else {
      console.error('Canvas element not found');
    }
  }

  onChartClick(event: ChartEvent, elements: any[]) {
    if (elements && elements.length) {
      const index = elements[0].index; // Obtén el índice del segmento seleccionado
      const selectedGenre = this.genreLabels[index]; // Obtiene el género correspondiente

      // Redirige a una página específica con el género como parámetro o a una URL fija
      this.router.navigate(['/genre', this.getFormattedInput(selectedGenre)]); // Navega a genre/:input con el género seleccionado
    }
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.labels = this.genreLabels;
      this.chart.data.datasets[0].data = this.genreData;
      this.chart.update();
    }
  }

  getFormattedInput(input: string): string {
    input = input.replace(/\//g, '-');
    return input.replace(/ /g, '_');
  }
}
