import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {AppService} from '../app.service';
import {CurrencyListInterface, CurrencySingleInterface} from '../app.interface';
import {values, filter} from 'lodash';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  currencyForm = new FormGroup({
    currency: new FormControl('')
  });
  currencyList: CurrencySingleInterface[] = [];
  filteredCurrencyList: Observable<CurrencySingleInterface[]>;
  getCurrencyList: Subscription;

  constructor(private appService: AppService, private route: Router) { }

  ngOnInit(): void {
    this.filteredCurrencyList = this.currencyForm.valueChanges.pipe(
      map(formData => {
        const searchQuery: string = formData.currency;
        return this.filterCurrencyByQuery([...this.currencyList], searchQuery);
      })
    );

    this.getCurrencyList = this.appService.getCurrencyList().subscribe((data: CurrencyListInterface) => {
      this.currencyList = values(data);
    });
  }

  filterCurrencyByQuery(currencyList: CurrencySingleInterface[], query: string): CurrencySingleInterface[] {
    const currencyRegex = new RegExp(query.toLowerCase());
    return filter(currencyList, currency => {
      const currencyName = currencyRegex.test(currency.currencyName.toLowerCase());
      const currencyId = currencyRegex.test(currency.id.toLowerCase());
      return currencyName || currencyId;
    });
  }

  navigateToCurrencyConversion(event): void {
    event.preventDefault();
    if (this.currencyForm.valid) {
      this.route.navigate([
        '/currency-conversion'], { state: { selectedCurrency: this.currencyForm.controls.currency.value }});
    }
  }

  ngOnDestroy(): void {
    this.getCurrencyList.unsubscribe();
  }
}
