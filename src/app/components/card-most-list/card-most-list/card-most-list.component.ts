import { Component, Input, input } from '@angular/core';
import { TitleBarComponent } from '../../title-bar/title-bar/title-bar.component';
import { Artist } from '../../../interfaces/artist';
import { ListItemComponent } from '../subComponents/list-item/list-item.component';
import { NgFor, NgIf } from '@angular/common';
import { PieChartComponent } from '../subComponents/pie-chart/pie-chart.component';

@Component({
  selector: 'app-card-most-list',
  standalone: true,
  imports: [
    NgFor,
    TitleBarComponent,
    ListItemComponent,
    NgIf,
    PieChartComponent,
  ],
  templateUrl: './card-most-list.component.html',
  styleUrl: './card-most-list.component.css',
})
export class CardMostListComponent {
  @Input()
  title: string = '';

  @Input()
  type: string = '';

  @Input()
  list: any[] = [];

  limitedList: Artist[] = [];

  ngOnChanges() {
    if (this.list.length >= 4) {
      this.limitedList = this.list.slice(0, 4);
    } else {
      this.limitedList = this.list;
    }
  }
}
