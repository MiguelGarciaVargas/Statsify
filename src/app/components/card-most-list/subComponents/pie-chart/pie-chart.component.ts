import { Component, Input } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
})
export class PieChartComponent {
  @Input()
  data: any[] = [
    { category: 'Electronics', value: 1500 },
    { category: 'Furniture', value: 500 },
    { category: 'Toys', value: 200 },
    { category: 'Clothing', value: 700 },
    { category: 'Others', value: 400 },
  ];

  public doughnutChartLabels: string[] = ['Red', 'Blue', 'Yellow'];
  public doughnutChartData: number[] = [300, 500, 100];
  public doughnutChartType: string = 'doughnut';

  public doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };
}
