import { Component } from '@angular/core';
import { TitleBarComponent } from '../../components/title-bar/title-bar/title-bar.component';
import { CardMostListComponent } from '../../components/card-most-list/card-most-list/card-most-list.component';
import { Genre } from '../../interfaces/genre';
import { Artist } from '../../interfaces/artist';
import { Song } from '../../interfaces/song';

@Component({
  selector: 'app-page-home',
  standalone: true,
  imports: [TitleBarComponent, CardMostListComponent],
  templateUrl: './page-home.component.html',
  styleUrl: './page-home.component.css',
})
export class PageHomeComponent {
  songs: Song[] = [
    { title: 'Hospice', artist: 'Cozy St. Jean', duration: '3:50' },
    { title: 'Foul Void', artist: 'Heriot', duration: '4:07' },
    { title: 'Opaline', artist: 'Heriot', duration: '3:21' },
    {
      title: 'Character Development (Cold Start)',
      artist: '156/Silence',
      duration: '3:21',
    },
    { title: 'Y Lloro', artist: 'Junior H', duration: '2:59' },
    {
      title: 'Pain Remains I: Dancing Like Flames',
      artist: 'Lorna Shore',
      duration: '5:53',
    },
    { title: 'You Can’t Hide', artist: 'Baby Bugs', duration: '3:38' },
    {
      title: 'It Is the End',
      artist:
        'Ice Nine Kills, Less Than Jake, Fenix TX, JR Wasilewski, Buddy Schaub, Will Salazar',
      duration: '4:48',
    },
    { title: 'Harm Sequence', artist: 'Heriot', duration: '1:49' },
    { title: 'Siege Lord', artist: 'Heriot', duration: '3:25' },
  ];

  artists: Artist[] = [
    { artist: '156/Silence', quantity: 48 },
    { artist: 'Junior H', quantity: 91 },
    { artist: 'Heriot', quantity: 42 },
    { artist: 'Ice Nine Kills', quantity: 68 },
    { artist: 'Nicole Dollanganger', quantity: 49 },
    { artist: 'Baby Bugs', quantity: 53 },
    { artist: 'Kublai Khan TX', quantity: 65 },
    { artist: 'Architects', quantity: 64 },
    { artist: 'La Santa Grifa', quantity: 77 },
    { artist: 'Japanese Breakfast', quantity: 57 },
  ];

  genres: Genre[] = [
    { genre: 'Melodic Metalcore', percentage: '28.57%' },
    { genre: 'Metalcore', percentage: '20.41%' },
    { genre: 'Deathcore', percentage: '16.33%' },
    { genre: 'Metallic Hardcore', percentage: '8.16%' },
    { genre: 'Progressive Metalcore', percentage: '8.16%' },
    { genre: 'Mexican Hip Hop', percentage: '8.16%' },
    { genre: 'Mathcore', percentage: '6.12%' },
    { genre: 'UK Metalcore', percentage: '6.12%' },
    { genre: 'Progressive Deathcore', percentage: '6.12%' },
    { genre: 'Symphonic Deathcore', percentage: '6.12%' },
  ];

  stats = [
    { metric: 'Popularity Score', value: '55.76/100' },
    { metric: 'Average Track Age', value: '1.0 YRS' },
    { metric: 'Tempo', value: '76.3 BPM' },
    { metric: 'Happiness', value: '13.20' },
    { metric: 'Danceability', value: '25.30' },
    { metric: 'Energy', value: '2.08' },
    { metric: 'Acousticness', value: '96.90' },
    { metric: 'Instrumentalness', value: '0.05' },
  ];

  weeklyMinutes = [
    { week: 'Week 1', value: 1200 },
    { week: 'Week 2', value: 1350 },
    { week: 'Week 3', value: 1100 },
    { week: 'Week 4', value: 1450 },
    { week: 'Week 5', value: 1250 },
    { week: 'Week 6', value: 1400 },
  ];
}
