import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent {
  filterPeriod: string = 'monthly';  // Default to 'monthly'
  transactions: { description: string; amount: number; category: string; date: string }[] = [
    { description: 'Salary', amount: 2500, category: 'income', date: '2025-02-01' },  // Example transaction
    { description: 'Water and Food Bills', amount: 400, category: 'expense', date: '2025-02-01' },    // Example expense
    { description: 'Loan Payment', amount: 500, category: 'expense', date: '2025-02-01' }, // Example loan payment
  ];
  reports: string[] = [];
  categories: { [key: string]: number } = {};
  summaryIncome: number = 0;
  summaryExpenses: number = 0;
  summaryGenerated: boolean = false;
  spendingPatternWarning: string = '';

  get categoryKeys() {
    return Object.keys(this.categories);
  }

  // Function to generate summary
  generateSummary() {
    // No filtering based on time period, calculate totals for all transactions
    this.summaryIncome = this.transactions
      .filter(t => t.category === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    this.summaryExpenses = this.transactions
      .filter(t => t.category === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    this.categorizeExpenses(this.transactions);

    // Spending pattern warning if there are constant payments
    if (this.categories['Water and Food Bills'] || this.categories['Loan Payment']) {
      this.spendingPatternWarning = 'You have constant payments on bills and loans, be careful!';
    } else {
      this.spendingPatternWarning = '';
    }

    // Log the summary
    this.logReport(`Income - $${this.summaryIncome}, Expenses - $${this.summaryExpenses}, Period - ${this.filterPeriod}`);
    this.summaryGenerated = true;
  }

  // Categorize expenses based on the transaction description
  categorizeExpenses(transactions: { description: string; amount: number; category: string; date: string }[]) {
    this.categories = {};
    transactions
      .filter(t => t.category === 'expense')
      .forEach(t => {
        this.categories[t.description] = (this.categories[t.description] || 0) + t.amount;
      });
  }

  // Log a report for the summary or other actions
  logReport(message: string) {
    this.reports.push(message);
  }

  // Clear all the reports
  clearReports() {
    this.reports = [];
    this.logReport('Reports cleared.');
  }
}
