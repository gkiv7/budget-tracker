
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';
import { catchError } from 'rxjs/operators';


interface LoginResponse {
  token: string;
  // user?: any; // Προαιρετικό πεδίο για τα δεδομένα του χρήστη
}

@Injectable()
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

   // Αποκωδικοποίηση του JWT και εξαγωγή του userId
   getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.userId; // Εξαγωγή του userId από το decoded token
    }
    return null;
  }

  signUp(email: string, password: string): Observable<any> {
    const payload = { email, password };
    return this.http.post(`${this.apiUrl}/signup`, payload);
  }


  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    console.log(email, password);
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        if (response.token) {
          console.log('Token received:', response.token);  // Εκτύπωσε το token για να το ελέγξεις
          this.saveToken(response.token); // Αποθήκευση του token
          
          // Αποθήκευση του userId στο localStorage, αν υπάρχει στο token
          const decoded: any = jwtDecode(response.token);
          console.log('Decoded token:', decoded);  // Δες τι περιέχει το decoded token
          localStorage.setItem('user', JSON.stringify({ _id: decoded.userId }));
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }
  

  // Αποθήκευση του token στο localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Ανάκτηση του token από το localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Αφαίρεση του token από το localStorage (logout)
  removeToken(): void {
    localStorage.removeItem('token');
  }

  // Έλεγχος αν υπάρχει token (δηλαδή αν είναι συνδεδεμένος ο χρήστης)
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getExpenses(): Observable<any> {
    const token = this.getToken();  // Ελέγχει αν το token επιστρέφει σωστά
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    console.log('Token being sent to backend:', token);  // Ελέγχει το token που στέλνεται
  
    return this.http.get(`${this.apiUrl}/expenses`, { headers });
  }
  
  }

