import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleBarComponent } from '../../components/title-bar/title-bar/title-bar.component';
import { Porcentage } from '../../interfaces/porcentage';
import { CardMostListComponent } from '../../components/card-most-list/card-most-list/card-most-list.component';
import { WeeklyData } from '../../interfaces/weekly-data';
import { Item } from '../../interfaces/item';

@Component({
  selector: 'app-page-genre',
  standalone: true,
  imports: [TitleBarComponent, CardMostListComponent],
  templateUrl: './page-genre.component.html',
  styleUrl: './page-genre.component.css',
})
export class PageGenreComponent {
  titleString: string = 'Genre Visualization'; // Valor predeterminado

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}

  weeklyMinutes: Item[] = [
    { name: 'All genres', id: '-1' },
    { name: 'Week 1', id: '1200' },
    { name: 'Week 2', id: '1350' },
    { name: 'Week 3', id: '1100' },
    { name: 'Week 4', id: '1450' },
    { name: 'Week 5', id: '1250' },
    { name: 'Week 6', id: '1400' },
  ];
}
