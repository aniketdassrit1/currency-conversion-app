import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CurrencyConversionInterface, CurrencyListInterface, HistoricalExchangeRate} from './app.interface';
import {format} from 'date-fns';
import {apiKey} from './app.constants';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(public http: HttpClient) { }

  getCurrencyList(): Observable<CurrencyListInterface> {
    return this.http.get<{ results: CurrencyListInterface }>(`https://free.currconv.com/api/v7/currencies?apiKey=${apiKey}`).pipe(
      map(list => list.results)
    );
  }

  getConvertedCurrencyValues(to: string, from: string): Observable<CurrencyConversionInterface> {
    const now = format(new Date(), 'yyyy-MM-dd');
    return this.http.get<CurrencyConversionInterface>(`https://free.currconv.com/api/v7/convert?q=${from}_${to}&compact=ultra&date=${now}&apiKey=${apiKey}`);
  }

  getHistoricalExchangeRate({to, from}, {startDate, endDate}): Observable<HistoricalExchangeRate> {
    return this.http.get<HistoricalExchangeRate>(`https://free.currconv.com/api/v7/convert?q=${from}_${to}&compact=ultra&date=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}&apiKey=${apiKey}`);
  }
}
