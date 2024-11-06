import { Component, Input, input } from '@angular/core';
import { TitleBarComponent } from '../../title-bar/title-bar/title-bar.component';
import { Artist } from '../../../interfaces/artist';
import { ListItemComponent } from '../subComponents/list-item/list-item.component';
import { NgFor, NgIf } from '@angular/common';
import { PieChartComponent } from '../subComponents/pie-chart/pie-chart.component';
import { Genre } from '../../../interfaces/genre';
import { Song } from '../../../interfaces/song';
import { LineChartComponent } from '../subComponents/line-chart/line-chart.component';

@Component({
  selector: 'app-card-most-list',
  standalone: true,
  imports: [
    NgFor,
    TitleBarComponent,
    ListItemComponent,
    NgIf,
    PieChartComponent,
    LineChartComponent,
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

  limitedArtist: Artist[] = [];
  limitedGenre: Genre[] = [];
  limitedSong: Song[] = [];

  constructor() {}

  ngOnChanges() {
    if (this.type == 'artist') {
      this.limitedArtist = this.list.slice(0, 4);
    } else if (this.type == 'pie-chart') {
      this.limitedGenre = this.list.slice(0, 5);
    } else if (this.type == 'song') {
      this.limitedSong = this.list.slice(0, 5);
    }
  }
}
