import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) { }

  getCurrencyList() {
    return this.http.get('https://free.currconv.com/api/v7/currencies?apiKey=ebaebcbf804eebbb53c1');
  }
}
