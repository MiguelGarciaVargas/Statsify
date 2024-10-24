import { Component, Input, input, OnInit } from '@angular/core';
import { BackgroundComponent } from '../../../components/background/background.component';
import { TitleBarComponent } from '../../../components/title-bar/title-bar/title-bar.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-artist',
  standalone: true,
  imports: [BackgroundComponent, TitleBarComponent],
  templateUrl: './page-artist.component.html',
  styleUrls: ['./page-artist.component.css'], // Asegúrate de que esto esté escrito correctamente
})
export class PageArtistComponent implements OnInit {
  artist: string = 'noArtist'; // Valor predeterminado

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params); // Agrega esto para verificar los parámetros
      this.artist = params['input'] || 'noArtist'; // Asigna directamente el nombre del artista
    });
  }
}
