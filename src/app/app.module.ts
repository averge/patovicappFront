import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AppComponent } from './app.component';
import { ScannerComponent } from './scanner/scanner.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NuevaPersonaComponent } from './nueva-persona/nueva-persona.component';
import {MatSortModule} from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { NeweventComponent } from './eventos/newevent/newevent.component';
import {MatTabsModule} from '@angular/material/tabs'
import { HashLocationStrategy, LocationStrategy } from '@angular/common'

@NgModule({
  declarations: [AppComponent, ScannerComponent, NuevaPersonaComponent, HomeComponent, LoginComponent, RegisterComponent, NeweventComponent],
  imports: [MatTabsModule,MatSelectModule,MatSortModule,MatPaginatorModule,MatTableModule,HttpClientModule,MatInputModule,ReactiveFormsModule,MatFormFieldModule,MatCardModule,MatButtonModule,MatDialogModule,BrowserModule, ZXingScannerModule, FormsModule, BrowserAnimationsModule, AppRoutingModule],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {}
