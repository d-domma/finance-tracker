import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Finance Tracker';

  // Track if we're in "Kids Mode" or "Parent Mode"
  isKidsMode = false;
  isParentMode = false;

  // Handle logout
  logout() {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.clear();
    window.location.reload(); // Refresh to reflect logout status
  }

  // Check if user is logged in
  get isLoggedIn(): boolean {
    return typeof localStorage !== 'undefined' && localStorage.getItem('loggedInUser') !== null;
  }

  // Set mode to Kids Mode
  setKidsMode() {
    this.isKidsMode = true;
    this.isParentMode = false;
  }

  // Set mode to Parent Mode and show all links
  setParentMode() {
    this.isParentMode = true;
    this.isKidsMode = false;
  }

  // Reset to default when switching to Parent Mode
  resetToDefault() {
    this.isKidsMode = false;
    this.isParentMode = false;
  }
}
