import { TestBed } from '@angular/core/testing';

import { AppService } from './app.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {of} from 'rxjs';
import {apiKey} from "./app.constants";

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppService]
    });
    service = TestBed.inject(AppService);
    jasmine.clock().install();
    const baseTime = new Date('2020-08-23');
    jasmine.clock().mockDate(baseTime);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrencyList', () => {
    it('should call currencies api with correct end point', () => {
      const testObservable = of({
        results: 'test-response'
      });
      spyOn(service.http, 'get').and.returnValue(testObservable);

      service.getCurrencyList();

      expect(service.http.get).toHaveBeenCalledWith(`https://free.currconv.com/api/v7/currencies?apiKey=${apiKey}`);
    });
  });

  describe('getConvertedCurrencyValues', () => {
    it('should call conversion api with correct end point', () => {
      const testObservable = of({
        results: 'test-response'
      });
      const to = 'AUD';
      const from = 'USD';
      const now = '2020-08-23';
      spyOn(service.http, 'get').and.returnValue(testObservable);

      service.getConvertedCurrencyValues(to, from);

      expect(service.http.get).toHaveBeenCalledWith(`https://free.currconv.com/api/v7/convert?q=${from}_${to}&compact=ultra&date=${now}&apiKey=${apiKey}`)
    });
  });

  describe('getHistoricalExchangeRate', () => {
    it('should call historical data with correct end point', () => {
      const toAndFrom = {
        to: 'AUD',
        from: 'USD'
      };
      const dates = {
        startDate: new Date('2020-08-16'),
        endDate: new Date('2020-08-23')
      };
      const testObservable = of({
        results: 'test-response'
      });
      spyOn(service.http, 'get').and.returnValue(testObservable);
      service.getHistoricalExchangeRate(toAndFrom, dates);

      expect(service.http.get).toHaveBeenCalledWith(`https://free.currconv.com/api/v7/convert?q=USD_AUD&compact=ultra&date=2020-08-16&endDate=2020-08-23&apiKey=${apiKey}`);
    });
  });
});
