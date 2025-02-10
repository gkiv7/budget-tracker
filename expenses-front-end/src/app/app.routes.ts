
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { LoginComponent } from './components/login/login.component'; // Εισαγωγή του LoginComponent
import { SignUpComponent } from './components/signup/signup.component'; // Εισαγωγή του SignUpComponent

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'expenses/', component: ExpensesComponent },
  { path: 'expenses/:userId', component: ExpensesComponent },
  { path: 'login', component: LoginComponent }, // Προσθήκη route για Login
  { path: 'signup', component: SignUpComponent } // Προσθήκη route για SignUp
];

