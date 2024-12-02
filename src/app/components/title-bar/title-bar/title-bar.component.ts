import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-title-bar',
  standalone: true,
  imports: [NgIf, RouterLink, NgClass],
  templateUrl: './title-bar.component.html',
  styleUrl: './title-bar.component.css',
})
export class TitleBarComponent implements OnInit {
  //Input sirve para meter parametros;
  @Input() title: string = '';
  @Input() fontSize: string = '50';
  @Input() type: string = 'header';
  @Input() extraInput: string = '';

  ngOnInit() {
    if (this.type === 'artist') {
      this.extraInput = this.formatExtraInput(this.extraInput);
      this.title = `Statsify | ${this.extraInput}`;
    } else if (this.type === 'genre') {
      this.title = `Statsify | ${this.title}`;
    }
  }

  formatExtraInput(name: string): string {
    name = name
      .replace(/_/g, ' ') // Reemplaza espacios por '/'
      .replace(/-/g, '/');
    return this.capitalizeExtraInput(name);
  }

  capitalizeExtraInput(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
