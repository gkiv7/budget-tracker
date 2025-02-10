
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getExpenses(userId: string): Observable<any> {
    const token = this.authService.getToken();  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    console.log('Token being sent to backend:', token);  // Ελέγχει το token που στέλνεται
  
    return this.http.get(`${this.apiUrl}/expenses/${userId}`, { headers }); // Προσθέτει το userId στο URL
  }

  getExpenseById(id: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/expenses/${id}`, { headers }); // Εδώ παίρνουμε ένα μεμονωμένο έξοδο από το id του
  }
  
  addExpense(description: string, amount: number, category: string, userId: string): Observable<any> {
    const expense = { description, amount, category, userId };
    
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post(`${this.apiUrl}/expenses`, expense, { headers });
  }
  
  deleteExpense(id: string): Observable<void> {
    const token = this.authService.getToken();
    if (!token) {
      console.log('No token found');
      return of();  // Αν δεν υπάρχει token, επιστρέφουμε null ή κάνουμε κάτι άλλο για να το διαχειριστούμε
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/expenses/${id}`, { headers });
  }
}
