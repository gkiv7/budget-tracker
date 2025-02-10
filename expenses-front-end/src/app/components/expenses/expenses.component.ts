

import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpensesService } from '../../services/expenses.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface Expense {
  _id?: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

@Component({
  selector: 'app-expenses',
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  standalone: true,
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
  providers: [ExpensesService]
})

export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  categories = ['Food', 'Transport', 'Entertainment', 'Utilities'];
  selectedCategory: string = '';
  newExpense: Expense = {
    description: '',
    amount: 0,
    date: '',
    category: ''
  };
  allExpenses: any[] = [];

  constructor(
    private expensesService: ExpensesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    const userId = this.authService.getUserIdFromToken(); // Παίρνουμε το userId από το token
    console.log(userId);

    if (userId) {
      this.expensesService.getExpenseById(userId).subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.allExpenses = data; // Αποθηκεύουμε όλα τα έξοδα
            this.expenses = [...data]; // Τα εξόδα για εμφάνιση
            console.log('Loaded expenses:', this.expenses);
          } else {
            // Αν δεν υπάρχουν δεδομένα, ορίστε το expenses ως κενό πίνακα
            this.allExpenses = [];
            this.expenses = [];
            console.log('No expenses found for this user');
          }
        },
        error: (err) => {
          console.error('Error loading expenses:', err);
          this.allExpenses = [];
          this.expenses = [];
        }
      });
    } else {
      console.log('User is not authenticated');
    }
  }

  onSubmit(): void {
    const userId = this.authService.getUserIdFromToken(); // Πάρε το userId από το token
    if (!userId) {
      console.error("User ID not found");
      return;
    }

    const { description, amount, category } = this.newExpense;
    const expenseToAdd = { description, amount, category, userId };

    console.log(expenseToAdd); // Δες αν το userId είναι σωστά περασμένο εδώ

    this.expensesService.addExpense(expenseToAdd.description, expenseToAdd.amount, expenseToAdd.category, expenseToAdd.userId).subscribe({
      next: (expense) => {
        if (!Array.isArray(this.expenses)) {
          this.expenses = [];  // Επανεκκίνηση του πίνακα αν δεν είναι σωστός
        }
        this.expenses.push(expense);
        this.resetForm();
      },
      error: (err) => {
        console.error('Error adding expense:', err);
      }
    });
  }

  logout(): void {
    this.authService.removeToken(); // Αφαίρεση του token
    localStorage.removeItem('user'); // Αφαίρεση των δεδομένων του χρήστη
    this.router.navigate(['/login']); // Ανακατεύθυνση στη σελίδα σύνδεσης
  }


  resetForm(): void {
    this.newExpense = {
      description: '',
      amount: 0,
      date: '',
      category: ''
    };
  }

  deleteExpense(id: string): void {
    this.expensesService.deleteExpense(id).subscribe(
      () => {
        // Αφαιρούμε το διαγραμμένο έξοδο από τη λίστα τοπικά
        this.expenses = this.expenses.filter(expense => expense._id !== id);
        console.log('Expense deleted');
      },
      (error) => {
        console.log('Error deleting expense:', error);
      }
    );
  }
}
