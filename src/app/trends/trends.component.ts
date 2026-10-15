import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Stock {
  company: string;
  symbol: string;
  price: number;
  change: number;
}

interface NewsItem {
  title: string;
  summary: string;
  link: string;
}

interface BusinessUpdate {
  title: string;
  detail: string;
}

interface TaxRate {
  category: string;
  rate: number;
}

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './trends.component.html',
  styleUrl: './trends.component.scss'
})
export class TrendsComponent {
  stockStatus = '';
  stocks: Stock[] = [
    { company: 'Apple', symbol: 'AAPL', price: 0, change: 0 },
    { company: 'Tesla', symbol: 'TSLA', price: 0, change: 0 },
    { company: 'Google', symbol: 'GOOGL', price: 0, change: 0 },
    { company: 'Amazon', symbol: 'AMZN', price: 0, change: 0 }
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      void this.loadStocks();
    }
  }

  private async loadStocks(): Promise<void> {
    this.stockStatus = 'Loading live prices…';
    try {
      const quotes = await Promise.all(this.stocks.map((stock) => this.loadQuote(stock)));
      this.stocks = quotes;
      this.stockStatus = '';
    } catch {
      this.stockStatus = 'Live prices could not be loaded. Try refreshing.';
    }
  }

  private async loadQuote(stock: Stock): Promise<Stock> {
    const response = await fetch(`/api/chart/${stock.symbol}?interval=1d&range=5d`);
    if (!response.ok) {
      throw new Error('quote failed');
    }
    const data = await response.json() as {
      chart?: {
        result?: Array<{
          meta?: {
            shortName?: string;
            regularMarketPrice?: number;
            chartPreviousClose?: number;
            regularMarketChangePercent?: number;
          };
        }>;
      };
    };
    const meta = data.chart?.result?.[0]?.meta;
    const price = meta?.regularMarketPrice;
    if (price == null) {
      throw new Error('missing price');
    }
    const previous = meta?.chartPreviousClose;
    const change = previous
      ? ((price - previous) / previous) * 100
      : (meta?.regularMarketChangePercent ?? 0);
    return {
      company: meta?.shortName || stock.company,
      symbol: stock.symbol,
      price,
      change: Math.round(change * 100) / 100,
    };
  }

  // Mock news data
  news = [
    {
      title: 'Biggest Tech Mergers of the Decade',
      summary: 'Learn how recent mergers are reshaping the tech industry.',
      link: 'https://example.com/mergers'
    },
    {
      title: 'Global Market Trends in 2025',
      summary: 'Experts weigh in on where the economy is heading.',
      link: 'https://example.com/markets'
    },
    {
      title: 'Renewable Energy Stocks Soar',
      summary: 'Renewable energy companies are gaining momentum in the market.',
      link: 'https://example.com/renewable-energy'
    }
  ];

  // Mock business updates
  businessUpdates = [
    { title: 'SpaceX Launch Success', detail: 'SpaceX completed its 20th mission of the year, setting a record.' },
    { title: 'Meta Announces New VR Headset', detail: 'Meta unveils its latest innovation in virtual reality.' },
    { title: 'Coca-Cola Expands Product Line', detail: 'Coca-Cola adds new flavors to its beverage lineup.' }
  ];

  // Mock tax rates
  taxRates = [
    { category: 'Income Tax', rate: 22 },
    { category: 'Corporate Tax', rate: 21 },
    { category: 'Sales Tax', rate: 8.5 },
    { category: 'Capital Gains Tax', rate: 15 }
  ];
}