import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';


import {AppComponent, InfoDialogComponent} from './app.component';
import {MatToolbarModule, MatButtonModule, MatMenuModule, MatCardModule, MatIconModule,
  MatListModule, MatDialogModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { NgxSpinnerModule } from 'ngx-spinner';
import { OrderModule } from 'ngx-order-pipe';
import {RatingModule} from "ngx-rating";


@NgModule({
  declarations: [
    AppComponent,
    InfoDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RatingModule,
    OrderModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    NgxSpinnerModule,
    MatDialogModule,
  ],
  providers: [],
  entryComponents: [InfoDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
