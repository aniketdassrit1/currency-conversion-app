import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {CurrencyListInterface} from "./app.interface";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) { }

  getCurrencyList(): Observable<CurrencyListInterface> {
    return this.http.get<{results: CurrencyListInterface}>('https://free.currconv.com/api/v7/currencies?apiKey=ebaebcbf804eebbb53c1').pipe(
      map(list => list.results)
    );
  }
}
