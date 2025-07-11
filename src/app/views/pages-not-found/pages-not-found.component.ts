import { Component } from '@angular/core';
import { Location } from '@angular/common';



@Component({
  selector: 'app-pages-not-found',
  imports: [],
  templateUrl: './pages-not-found.component.html',
  styleUrl: './pages-not-found.component.scss'
})
export class PagesNotFoundComponent {

  constructor(private location: Location) { }

  public goBack(): void {
    this.location.back();
  }

}
