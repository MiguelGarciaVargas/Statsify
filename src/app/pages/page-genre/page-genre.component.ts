import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleBarComponent } from '../../components/title-bar/title-bar/title-bar.component';

@Component({
  selector: 'app-page-genre',
  standalone: true,
  imports: [TitleBarComponent],
  templateUrl: './page-genre.component.html',
  styleUrl: './page-genre.component.css',
})
export class PageGenreComponent {
  genre: string = 'noGenre'; // Valor predeterminado

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params); // Agrega esto para verificar los parámetros
      this.genre = params['input'] || 'noArtist'; // Asigna directamente el nombre del artista
    });
  }
}
