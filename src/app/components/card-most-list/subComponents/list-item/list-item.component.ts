import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { Item } from '../../../../interfaces/item';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
})
export class ListItemComponent implements OnInit {
  @Input()
  item: Item = { name: '', id: '' };
  @Input()
  extraText: string = '';

  isClickable: boolean = true;
  isSelected: boolean = false;

  input: string = 'List-Item-Text';

  constructor(private location: Location) {}

  ngOnInit() {
    if (this.extraText == 'notClickable') {
      this.isClickable = false;
      this.isSelected = this.isElementInURL() ? true : false;
    }

    if (this.extraText != '' && this.extraText != 'notClickable') {
      this.input = this.extraText;
    } else {
      this.input = this.item.name;
    }
  }

  isElementInURL(): boolean {
    // Obtener el nombre del artista de la URL
    const currentPath = this.location.path();
    const artistNameFromURL = currentPath.split('/')[2]; // Obtener la parte después de /artist/

    // console.log('Artist Name from URL:', artistNameFromURL);

    // Obtener el nombre del artista de la variable text
    const parts = this.item.name.split(' - '); // Separar por '_-_'
    const artistNameFromText = parts[1]; // Obtener la segunda parte (el nombre del artista)

    // console.log('Artist Name from text:', artistNameFromText);

    // Comparar ambos nombres y devolver true si son iguales
    if (artistNameFromURL === artistNameFromText) {
      return true;
    } else {
      return false;
    }
  }

  getFormattedInput(): string {
    this.input = this.input.replace(/\//g, '-');
    return this.input.replace(/ /g, '_');
  }
}
