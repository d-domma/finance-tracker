import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kids-mode',
  standalone: true,
  templateUrl: './kids-mode.component.html',
  styleUrls: ['./kids-mode.component.scss'],
  imports: [CommonModule]  // Include CommonModule to use *ngFor and *ngIf
})
export class KidsModeComponent {
  balance = 100; // Starting balance

  // Define products with descriptions and prices
  products = [
    { name: 'Toy Car', price: 10, description: 'A fun little toy car to play with.', image: 'assets/toy-car.jpg' },
    { name: 'Doll', price: 15, description: 'A cute doll to take care of.', image: 'assets/doll.jpg' },
    { name: 'Board Game', price: 29, description: 'A fun board game for family nights.', image: 'assets/board-game.jpg' },
    { name: 'Chocolate', price: 2, description: 'Delicious chocolate bar.', image: 'assets/chocolate.jpg' },
    { name: 'Stuffed Animal', price: 15, description: 'Cuddly stuffed animal.', image: 'assets/stuffed-animal.jpg' },
    { name: 'Lego Set', price: 35, description: 'A set of colorful Legos.', image: 'assets/lego.jpg' },
    { name: 'Backpack', price: 45, description: 'Stylish backpack for school.', image: 'assets/backpack.jpg' },
    { name: 'Bike', price: 150, description: 'Cool bicycle for outdoor adventures.', image: 'assets/bike.jpg' },
  ];

  purchasedItems: { name: string; price: number }[] = [];

  // Define tasks with rewards and timers
  tasks = [
    { name: 'Clean Room', reward: 10, inProgress: false, timeRemaining: 0, duration: 10 },  // 10 seconds for cleaning room
    { name: 'Do Homework', reward: 20, inProgress: false, timeRemaining: 0, duration: 7200 }, // 15 seconds for homework
    { name: 'Help Parents', reward: 15, inProgress: false, timeRemaining: 0, duration: 2700 },  // 8 seconds for helping parents
    { name: 'Read a Book', reward: 5, inProgress: false, timeRemaining: 0, duration: 2700 },    // 7 seconds for reading
    { name: 'Wash Dishes', reward: 10, inProgress: false, timeRemaining: 0, duration: 1200 },  // 12 seconds for washing dishes
    { name: 'Take Out Trash', reward: 5, inProgress: false, timeRemaining: 0, duration: 300 },  // 5 seconds for taking out trash
    { name: 'Feed Pets', reward: 7, inProgress: false, timeRemaining: 0, duration: 300 },      // 3 seconds for feeding pets
    { name: 'Organize Toys', reward: 8, inProgress: false, timeRemaining: 0, duration: 900 },   // 6 seconds for organizing toys
  ];

  buyProduct(product: { name: string; price: number }) {
    if (this.balance >= product.price) {
      this.balance -= product.price;
      this.purchasedItems.push(product);
    } else {
      alert('Not enough balance!');
    }
  }

  startTask(task: { name: string; reward: number; inProgress: boolean; timeRemaining: number; duration: number }) {
    if (task.inProgress) return;

    task.inProgress = true;
    task.timeRemaining = task.duration; // Set the task timer to the task's specific duration

    const interval = setInterval(() => {
      task.timeRemaining--;
      if (task.timeRemaining <= 0) {
        this.balance += task.reward;  // Add the reward to the balance once the task is done
        task.inProgress = false;
        clearInterval(interval);
      }
    }, 1000); // Update every second
  }
}
