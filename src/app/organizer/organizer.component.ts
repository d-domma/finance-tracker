/*
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Import to check platform type
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { CommonModule } from '@angular/common'; // Import CommonModule for currency pipe
import { TransactionService } from '../transaction.service';


interface Transaction {
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface Task {
  name: string;
  completed: boolean;
}
interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-organizer',
  standalone: true, // Marking this as a standalone component
  imports: [FormsModule, CommonModule],
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss'], // Include CommonModule here for the currency pipe and FilterPipe
})
export class OrganizerComponent implements OnInit {
  chatbotOpen = false;
  chatMessages: ChatMessage[] = [];
  userInput = '';
  transactions: Transaction[] = [];
  newTransaction: Transaction = { description: '', amount: 0, category: 'income', date: '' };
  searchQuery: string = '';
  filterCategory: string = '';
  tasks: Task[] = [];
  newTask: string = '';
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  selectedDate: string = '';
  noteContent: string = '';
  modalOpen: boolean = false;
  notes: { [key: string]: string } = {}; 
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December',
  ];
  currentUser: string | null = null;



  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Getter to check if a user is logged in
  get isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token') !== null;
    }
    return false;
  }

  // Get the number of days in the current month
  get daysInMonth() {
    const daysInCurrentMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    return Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1); // Return an array of days
  }

  // Get the first day of the current month (Sunday to Saturday)
  get firstDay() {
    return new Date(this.currentYear, this.currentMonth, 1).getDay();
  }

  // Format the date for the notes (YYYY-MM-DD)
  formatDate(year: number, month: number, day: number): string {
    return `${year}-${month + 1}-${day}`;
  }

  // Load activities from localStorage when the user logs in
  

  // Save activities to localStorage
  saveUserActivities() {
    if (isPlatformBrowser(this.platformId) && this.currentUser) {
      localStorage.setItem(`${this.currentUser}_transactions`, JSON.stringify(this.transactions));
      localStorage.setItem(`${this.currentUser}_tasks`, JSON.stringify(this.tasks));
      localStorage.setItem(`${this.currentUser}_notes`, JSON.stringify(this.notes));
    }
  }

  // Logout method - clear the localStorage and reset the state
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem(`${this.currentUser}_transactions`);
      localStorage.removeItem(`${this.currentUser}_tasks`);
      localStorage.removeItem(`${this.currentUser}_notes`);
      localStorage.removeItem('token');

      // Reset all state variables to their default values
      this.transactions = [];
      this.tasks = [];
      this.notes = {};
      this.currentUser = null;
    }
  }

  // Transaction methods
  addTransaction() {
    if (this.newTransaction.description.trim() && this.newTransaction.amount > 0) {
      const projectedBalance =
        this.calculateBalance() +
        (this.newTransaction.category === 'income' ? this.newTransaction.amount : -this.newTransaction.amount);
  
      if (this.newTransaction.category === 'expense' && projectedBalance < -500) {
        alert("You cannot add more expenses as your balance is below -$500.");
        return;
      }
  
      this.transactions.push({ ...this.newTransaction });
      this.newTransaction = { description: '', amount: 0, category: 'income', date: '' };
      this.saveUserActivities(); // Save after adding transaction
    }
  }

  editTransaction(transaction: Transaction) {
    this.newTransaction = { ...transaction };
    this.deleteTransaction(transaction);
  }

  deleteTransaction(transaction: Transaction) {
    this.transactions = this.transactions.filter((t) => t !== transaction);
    this.saveUserActivities(); // Save after deleting transaction
  }

  calculateBalance() {
    return this.transactions.reduce((acc, transaction) => {
      return transaction.category === 'income' ? acc + transaction.amount : acc - transaction.amount;
    }, 0);
  }

  filteredTransactions() {
    return this.transactions.filter((transaction) => {
      const matchesSearch = transaction.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.filterCategory ? transaction.category === this.filterCategory : true;
      return matchesSearch && matchesCategory;
    });
  }

  // Task methods
  addTask() {
    if (this.newTask.trim()) {
      this.tasks.push({ name: this.newTask.trim(), completed: false });
      this.newTask = '';
      this.saveUserActivities(); // Save after adding task
    }
  }

  toggleTaskCompletion(task: Task) {
    task.completed = !task.completed;
    this.saveUserActivities(); // Save after toggling task completion
  }

  editTask(task: Task) {
    this.newTask = task.name;
    this.deleteTask(task);
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter((t) => t !== task);
    this.saveUserActivities(); // Save after deleting task
  }

  // Methods for calendar modal and notes
  openDayModal(day: number) {
    if (day < 1 || day > this.daysInMonth.length) return; // Make sure the day is valid
    this.selectedDate = this.formatDate(this.currentYear, this.currentMonth, day);
    this.noteContent = this.notes[this.selectedDate] || '';
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  saveNote() {
    if (this.noteContent.trim()) {
      this.notes[this.selectedDate] = this.noteContent;
    } else {
      delete this.notes[this.selectedDate];
    }
    this.saveUserActivities(); // Save after saving the note
    this.modalOpen = false;
  }

  // Methods for navigating between months
  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  toggleChatbot() {
    this.chatbotOpen = !this.chatbotOpen;
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.chatMessages.push({ text: this.userInput, sender: 'user' });
      this.generateBotResponse(this.userInput);
      this.userInput = '';
    }
  }

  generateBotResponse(userInput: string) {
    let botReply = '';
    
    if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
      botReply = 'Hello! How can I assist you today?';
    } else if (userInput.toLowerCase().includes('transaction')) {
      botReply = 'You can add a new transaction by filling out the form in the Transactions section.';
    } else if (userInput.toLowerCase().includes('task')) {
      botReply = 'To add a task, go to the Tasks section and enter a new task in the input field.';
    } else if (userInput.toLowerCase().includes('calendar')) {
      botReply = 'The calendar section allows you to add notes to specific dates. Click on a date to add notes.';
    } else {
      botReply = 'I am not sure about that. Can you please rephrase?';
    }

    setTimeout(() => {
      this.chatMessages.push({ text: botReply, sender: 'bot' });
    }, 500);
  }

  ngOnInit() {
    this.loadUserActivities();
  }

  loadUserActivities() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = localStorage.getItem('loggedInUser');
      if (this.currentUser) {
        const savedTransactions = localStorage.getItem(`${this.currentUser}_transactions`);
        const savedTasks = localStorage.getItem(`${this.currentUser}_tasks`);
        const savedNotes = localStorage.getItem(`${this.currentUser}_notes`);
        if (savedTransactions) this.transactions = JSON.parse(savedTransactions);
        if (savedTasks) this.tasks = JSON.parse(savedTasks);
        if (savedNotes) this.notes = JSON.parse(savedNotes);
      }
    }
  }
}
*/
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Import to check platform type
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { CommonModule } from '@angular/common'; // Import CommonModule for currency pipe
import { TransactionService } from '../transaction.service';


interface Transaction {
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface Task {
  name: string;
  completed: boolean;
}
interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-organizer',
  standalone: true, // Marking this as a standalone component
  imports: [FormsModule, CommonModule],
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss'], // Include CommonModule here for the currency pipe and FilterPipe
})
export class OrganizerComponent implements OnInit {
  chatbotOpen = false;
  chatMessages: ChatMessage[] = [];
  userInput = '';
  transactions: Transaction[] = [];
  newTransaction: Transaction = { description: '', amount: 0, category: 'income', date: '' };
  searchQuery: string = '';
  filterCategory: string = '';
  tasks: Task[] = [];
  newTask: string = '';
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  selectedDate: string = '';
  noteContent: string = '';
  interactionCount: number = 0; // Track user interactions
  modalOpen: boolean = false;
  notes: { [key: string]: string } = {}; 
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December',
  ];
  currentUser: string | null = null;



  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Getter to check if a user is logged in
  get isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token') !== null;
    }
    return false;
  }

  // Get the number of days in the current month
  get daysInMonth() {
    const daysInCurrentMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    return Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1); // Return an array of days
  }

  // Get the first day of the current month (Sunday to Saturday)
  get firstDay() {
    return new Date(this.currentYear, this.currentMonth, 1).getDay();
  }

  // Format the date for the notes (YYYY-MM-DD)
  formatDate(year: number, month: number, day: number): string {
    return `${year}-${month + 1}-${day}`;
  }

  // Load activities from localStorage when the user logs in
  

  // Save activities to localStorage
  saveUserActivities() {
    if (isPlatformBrowser(this.platformId) && this.currentUser) {
      localStorage.setItem(`${this.currentUser}_transactions`, JSON.stringify(this.transactions));
      localStorage.setItem(`${this.currentUser}_tasks`, JSON.stringify(this.tasks));
      localStorage.setItem(`${this.currentUser}_notes`, JSON.stringify(this.notes));
    }
  }

  // Logout method - clear the localStorage and reset the state
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem(`${this.currentUser}_transactions`);
      localStorage.removeItem(`${this.currentUser}_tasks`);
      localStorage.removeItem(`${this.currentUser}_notes`);
      localStorage.removeItem('token');

      // Reset all state variables to their default values
      this.transactions = [];
      this.tasks = [];
      this.notes = {};
      this.currentUser = null;
    }
  }

  // Transaction methods
  addTransaction() {
    if (this.newTransaction.description.trim() && this.newTransaction.amount > 0) {
      const projectedBalance =
        this.calculateBalance() +
        (this.newTransaction.category === 'income' ? this.newTransaction.amount : -this.newTransaction.amount);
  
      if (this.newTransaction.category === 'expense' && projectedBalance < -500) {
        alert("You cannot add more expenses as your balance is below -$500.");
        return;
      }
  
      this.transactions.push({ ...this.newTransaction });
      this.newTransaction = { description: '', amount: 0, category: 'income', date: '' };
      this.saveUserActivities(); // Save after adding transaction
    }
  }

  editTransaction(transaction: Transaction) {
    this.newTransaction = { ...transaction };
    this.deleteTransaction(transaction);
  }

  deleteTransaction(transaction: Transaction) {
    this.transactions = this.transactions.filter((t) => t !== transaction);
    this.saveUserActivities(); // Save after deleting transaction
  }

  calculateBalance() {
    return this.transactions.reduce((acc, transaction) => {
      return transaction.category === 'income' ? acc + transaction.amount : acc - transaction.amount;
    }, 0);
  }

  filteredTransactions() {
    return this.transactions.filter((transaction) => {
      const matchesSearch = transaction.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.filterCategory ? transaction.category === this.filterCategory : true;
      return matchesSearch && matchesCategory;
    });
  }

  // Task methods
  addTask() {
    if (this.newTask.trim()) {
      this.tasks.push({ name: this.newTask.trim(), completed: false });
      this.newTask = '';
      this.saveUserActivities(); // Save after adding task
    }
  }

  toggleTaskCompletion(task: Task) {
    task.completed = !task.completed;
    this.saveUserActivities(); // Save after toggling task completion
  }

  editTask(task: Task) {
    this.newTask = task.name;
    this.deleteTask(task);
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter((t) => t !== task);
    this.saveUserActivities(); // Save after deleting task
  }

  // Methods for calendar modal and notes
  openDayModal(day: number) {
    if (!day || day < 1 || day > this.daysInMonth.length) return; // Ensure valid day
  
    this.selectedDate = this.formatDate(this.currentYear, this.currentMonth, day);
    this.noteContent = this.notes[this.selectedDate] || ''; // Load existing note or set to empty
    this.modalOpen = true; // Make sure modal is set to open
  }

  closeModal() {
    this.modalOpen = false;
  }

  saveNote() {
    if (this.noteContent.trim()) {
      this.notes[this.selectedDate] = this.noteContent;
    } else {
      delete this.notes[this.selectedDate];
    }
    this.saveUserActivities(); // Save after saving the note
    this.modalOpen = false;
  }

  // Methods for navigating between months
  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  toggleChatbot() {
    this.chatbotOpen = !this.chatbotOpen;
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.chatMessages.push({ text: this.userInput, sender: 'user' });
      this.generateBotResponse(this.userInput);
      this.userInput = '';
    }
  }

  generateBotResponse(userInput: string) {
    let botReply = '';

    this.interactionCount++; // Increment the interaction count

    if (this.interactionCount === 2) {
      botReply = 'You should try to reduce your water usage and food bills. Doing so will save you almost 200 dollars.';
    } else if (this.interactionCount === 3) {
      botReply = 'You have deposited and removed money 4 times this month.';
    } else if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
      botReply = 'Hello! How can I assist you today?';
    } else if (userInput.toLowerCase().includes('transaction')) {
      botReply = 'You can add a new transaction by filling out the form in the Transactions section.';
    } else if (userInput.toLowerCase().includes('task')) {
      botReply = 'To add a task, go to the Tasks section and enter a new task in the input field.';
    } else if (userInput.toLowerCase().includes('calendar')) {
      botReply = 'The calendar section allows you to add notes to specific dates. Click on a date to add notes.';
    } else {
      botReply = 'I am not sure about that. Can you please rephrase?';
    }

    setTimeout(() => {
      this.chatMessages.push({ text: botReply, sender: 'bot' });
    }, 500);
  }

  ngOnInit() {
    this.loadUserActivities();
  }

  /*loadUserActivities() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = localStorage.getItem('loggedInUser');
      if (this.currentUser) {
        
        const savedTransactions = localStorage.getItem(`${this.currentUser}_transactions`);
        const savedTasks = localStorage.getItem(`${this.currentUser}_tasks`);
        const savedNotes = localStorage.getItem(`${this.currentUser}_notes`);
        if (savedTransactions) this.transactions = JSON.parse(savedTransactions);
        if (savedTasks) this.tasks = JSON.parse(savedTasks);
        if (savedNotes) this.notes = JSON.parse(savedNotes);
      }
    }
  }*/
    loadUserActivities() {
      if (isPlatformBrowser(this.platformId)) {
          this.currentUser = localStorage.getItem('loggedInUser');
          if (this.currentUser) {
              
              const savedTransactions = localStorage.getItem(`${this.currentUser}_transactions`);
              if (savedTransactions) {
                  this.transactions = JSON.parse(savedTransactions).map((transaction: Transaction) => ({
                      ...transaction,
                      date: '2025-03-14', // Set transaction date to March 14, 2025
                  }));
              }
  
              const savedTasks = localStorage.getItem(`${this.currentUser}_tasks`);
              const savedNotes = localStorage.getItem(`${this.currentUser}_notes`);
              
              if (savedTasks) {
                  this.tasks = JSON.parse(savedTasks).map((task: any) => ({
                      ...task,
                      date: '2025-03-14', // Set task date to March 14, 2025
                  }));
              }
  
              if (savedNotes) {
                  this.notes = JSON.parse(savedNotes).map((note: any) => ({
                      ...note,
                      date: '2025-03-14', // Set note date to March 14, 2025
                  }));
              }
          }
      }
  }

}