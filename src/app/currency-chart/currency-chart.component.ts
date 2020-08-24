import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from '../app.service';
import {Router} from '@angular/router';
import {get, values, keys} from 'lodash';
import {addDays, format} from 'date-fns';
import * as Highcharts from 'highcharts';
import {OPTION} from '../app.constants';
import {ConversionData, HistoricalExchangeRate} from '../app.interface';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-currency-chart',
  templateUrl: './currency-chart.component.html'
})
export class CurrencyChartComponent implements OnInit, OnDestroy {
  conversionData: ConversionData;
  chartOptions: Highcharts.Options;
  chart: typeof Highcharts;
  getHistoricalExchangeRate: Subscription;
  loading = false;

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
    this.loading = true;
    this.getHistoricalExchangeRate = this.appService.getHistoricalExchangeRate(this.conversionData, { startDate, endDate })
      .subscribe((data: HistoricalExchangeRate) => {
      this.loading = false;
      const exchangeRateData = get(data, `${this.conversionData.from}_${this.conversionData.to}`);
      const historicalData: number[] = values(exchangeRateData);
      const historicalDate: string[] = keys(exchangeRateData);
      this.chartSetup(historicalData, historicalDate);
    }, () => {
      this.loading = false;
    });
  }

  chartSetup(historicalData, historicalDate): void {
    this.chart = Highcharts;
    this.chartOptions = OPTION;
    this.chartOptions.xAxis = {
      ...this.chartOptions.xAxis,
      categories: historicalDate.map(date => format(new Date(date), 'dd MMM'))
    };
    this.chartOptions.series = [{
      type: 'line',
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
