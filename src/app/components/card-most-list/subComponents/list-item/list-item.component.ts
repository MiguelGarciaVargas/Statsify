import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
})
export class ListItemComponent implements OnInit {
  @Input()
  text: string = '';

  input: string = 'HomeArtista';

  ngOnInit() {
    this.input = this.text;
  }

  getFormattedInput(): string {
    this.input = this.input.replace(/\//g, '-');
    return this.input.replace(/ /g, '_');
  }
}
