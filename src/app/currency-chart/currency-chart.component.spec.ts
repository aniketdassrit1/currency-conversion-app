import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyChartComponent } from './currency-chart.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Component} from '@angular/core';
import {AppService} from '../app.service';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {EXPECTED_SERIES, EXPECTED_XAXIS, HISTORICAL_RATE} from './currency-chart.spec.constant';

@Component({
  selector: 'app-currency-chart-dummy',
  template: ''
})
class AppCurrencyChartDummyComponent {}

describe('CurrencyChartComponent', () => {
  let component: CurrencyChartComponent;
  let fixture: ComponentFixture<CurrencyChartComponent>;
  let appService: AppService;
  let route: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyChartComponent ],
      imports: [
        RouterTestingModule.withRoutes([{
          path: 'currency-conversion',
          component: AppCurrencyChartDummyComponent
        }]),
        HttpClientTestingModule
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(CurrencyChartComponent);
    component = fixture.componentInstance;
    appService = TestBed.inject(AppService);
    route = TestBed.inject(Router);
    spyOn(route, 'navigate');
    jasmine.clock().install();
    const baseTime = new Date('2020-08-23');
    jasmine.clock().mockDate(baseTime);
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call route navigate', () => {
      component.ngOnInit();

      expect(route.navigate).toHaveBeenCalledWith(['/currency-conversion']);
    });

    it('should call getHistoricalExchangeRate', () => {
      spyOn((appService as any), 'getHistoricalExchangeRate').and.returnValue(of(''));
      component.conversionData = {
        from : 'AUD',
        to: 'GBP'
      };
      component.ngOnInit();

      expect(appService.getHistoricalExchangeRate).toHaveBeenCalledWith({
        from : 'AUD',
        to: 'GBP'
      }, {
        startDate: new Date('2020-08-17'),
        endDate: new Date('2020-08-23')
      });
    });

    it('should call chartSetup with correct params', () => {
      component.conversionData = {
        from : 'AUD',
        to: 'GBP'
      };
      spyOn((appService as any), 'getHistoricalExchangeRate').and.returnValue(of(HISTORICAL_RATE));
      spyOn(component, 'chartSetup');
      const historicalData = [0.547494, 0.548124];
      const historicalDate = ['2020-08-18', '2020-08-19'];
      component.ngOnInit();

      expect(component.chartSetup).toHaveBeenCalledWith(historicalData, historicalDate);
    });

    it('should set loading false if service fails', () => {
      component.conversionData = {
        from : 'AUD',
        to: 'GBP'
      };
      spyOn((appService as any), 'getHistoricalExchangeRate').and.returnValue(throwError(''));
      component.ngOnInit();

      expect(component.loading).toEqual(false);
    });
  });

  describe('chartSetup', () => {
    it('should set correct chart options', () => {
      const historicalData = [0.547494, 0.548124];
      const historicalDate = ['2020-08-18', '2020-08-19'];
      component.conversionData = {
        from : 'AUD',
        to: 'GBP'
      };
      component.chartSetup(historicalData, historicalDate);

      expect(component.chartOptions.xAxis).toEqual(EXPECTED_XAXIS);
      expect((component.chartOptions as any).series).toEqual(EXPECTED_SERIES);
    });
  });

  describe('navigateBackToConversion', () => {
    it('should navigate to currency-conversion screen', () => {
      (component as any).conversionData = {
        from: 'AUD'
      };
      component.navigateBackToConversion();

      expect(route.navigate).toHaveBeenCalledWith(['/currency-conversion'], { state: { selectedCurrency: component.conversionData.from }});
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from getHistoricalExchangeRate', () => {
      (component as any).getHistoricalExchangeRate = {
        unsubscribe: jasmine.createSpy()
      };
      component.ngOnDestroy();

      expect(component.getHistoricalExchangeRate.unsubscribe).toHaveBeenCalled();
    });
  });
});
