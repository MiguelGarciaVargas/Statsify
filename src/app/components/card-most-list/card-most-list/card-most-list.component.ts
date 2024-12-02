import {
  Component,
  Input,
  input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TitleBarComponent } from '../../title-bar/title-bar/title-bar.component';
import { ListItemComponent } from '../subComponents/list-item/list-item.component';
import { NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { PieChartComponent } from '../subComponents/pie-chart/pie-chart.component';
import { Porcentage } from '../../../interfaces/porcentage';
import { LineChartComponent } from '../subComponents/line-chart/line-chart.component';
import { AlbumswiperComponent } from '../subComponents/albumswiper/albumswiper.component';
import { WeeklyData } from '../../../interfaces/weekly-data';
import { Item } from '../../../interfaces/item';
import { ArtistTableComponent } from '../subComponents/artist-table/artist-table.component';
import { Artist } from '../../../interfaces/artist-api';

@Component({
  selector: 'app-card-most-list',
  standalone: true,
  imports: [
    NgFor,
    TitleBarComponent,
    ListItemComponent,
    PieChartComponent,
    LineChartComponent,
    NgSwitch,
    NgSwitchCase,
    AlbumswiperComponent,
    ArtistTableComponent,
  ],
  templateUrl: './card-most-list.component.html',
  styleUrl: './card-most-list.component.css',
})
export class CardMostListComponent implements OnChanges {
  @Input() title: string = '';
  @Input() type: string = '';
  @Input() list: Item[] = [];
  @Input() percentages: Porcentage[] = [];
  @Input() linearData: WeeklyData[] = []; // Recibimos el dataset
  @Input() artist!: Artist;

  // User pic case
  userImg: string = '';

  constructor() {}

  ngOnChanges() {
    if (this.type == 'artist' || this.type == 'artist-notClickable') {
      this.list = this.list.slice(0, 5);
    } else if (
      this.type == 'pie-chart-artist' ||
      this.type == 'pie-chart-genre'
    ) {
      this.list = this.list.slice(0, 5);
    } else if (this.type == 'song') {
      this.list = this.list.slice(0, 5);
    } else if (this.type == 'user') {
      this.userImg = this.list[0].name;
    } else if (this.type == 'line-chart') {
      console.log('Card:', this.linearData);
    }
  }
}
