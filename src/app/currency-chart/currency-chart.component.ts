import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from '../app.service';
import {Router} from '@angular/router';
import {get, values, keys} from 'lodash';
import {addDays, format} from 'date-fns';
import * as Highcharts from 'highcharts';
import {option} from '../app.constants';
import {ConversionData} from '../app.interface';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-currency-chart',
  templateUrl: './currency-chart.component.html',
  styleUrls: ['./currency-chart.component.scss']
})
export class CurrencyChartComponent implements OnInit, OnDestroy {
  conversionData: ConversionData;
  chartOptions: Highcharts.Options;
  chart: typeof Highcharts;
  getHistoricalExchangeRate: Subscription;

  constructor(private appService: AppService, private route: Router) {
    this.conversionData = get(this.route.getCurrentNavigation(), 'extras.state.currency');
  }

  ngOnInit(): void | boolean {
    if (!this.conversionData) {
      this.route.navigate(['/currency-conversion']);
      return false;
    }
    const endDate = new Date();
    const startDate = addDays(new Date(), -6);

    this.getHistoricalExchangeRate = this.appService.getHistoricalExchangeRate(this.conversionData, { startDate, endDate }).subscribe(data => {
      const exchangeRateData = get(data, `${this.conversionData.from}_${this.conversionData.to}`);
      const historicalData: number[] = values(exchangeRateData);
      const historicalDate: string[] = keys(exchangeRateData);
      this.chartSetup(historicalData, historicalDate);
    });
  }

  chartSetup(historicalData, historicalDate): void {
    this.chart = Highcharts;
    this.chartOptions = option;
    this.chartOptions.xAxis = {
      ...this.chartOptions.xAxis,
      categories: historicalDate.map(date => format(new Date(date), 'dd MMM'))
    };
    // @ts-ignore
    this.chartOptions.series = [{
      name: `${this.conversionData.from} -> ${this.conversionData.to}`,
      data: historicalData
    }];
  }

  navigateBackToConversion(): void {
    this.route.navigate([
      '/currency-conversion'], { state: { selectedCurrency: this.conversionData.from }});
  }

  ngOnDestroy(): void {
    if (this.getHistoricalExchangeRate) {
      this.getHistoricalExchangeRate.unsubscribe();
    }
  }
}
