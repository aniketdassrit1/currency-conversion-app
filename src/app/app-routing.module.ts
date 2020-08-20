import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {CurrencyConversionComponent} from "./currency-conversion/currency-conversion.component";
import {CurrencyChartComponent} from "./currency-chart/currency-chart.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

const routes: Routes = [{
  path: 'home',
  component: HomeComponent
}, {
  path: 'currency-conversion',
  component: CurrencyConversionComponent
}, {
  path: 'chart',
  component: CurrencyChartComponent
}, {
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
}, {
  path: '**',
  component: PageNotFoundComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
