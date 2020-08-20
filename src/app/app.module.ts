import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { CurrencyConversionComponent } from './currency-conversion/currency-conversion.component';
import { CurrencyChartComponent } from './currency-chart/currency-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CurrencyConversionComponent,
    CurrencyChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
