import { Component } from '@angular/core';
import { BackgroundComponent } from '../../components/background/background.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-login',
  standalone: true,
  imports: [BackgroundComponent, RouterLink],
  templateUrl: './page-login.component.html',
  styleUrl: './page-login.component.css',
})
export class PageLoginComponent {}
