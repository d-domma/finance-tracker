import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';// Import OnInit for lifecycle hooks if needed
import { RouterModule } from '@angular/router';  // Import RouterModule to use routerLink


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true, // Mark this component as standalone
  imports: [CommonModule, RouterModule] // Import CommonModule for Angular's core directives
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Any initialization logic can go here if needed
  }
}
