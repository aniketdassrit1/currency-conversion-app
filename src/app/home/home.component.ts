import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {AppService} from "../app.service";
import {CurrencyListInterface} from "../app.interface";
import {values, filter} from 'lodash';
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  currencyForm = new FormGroup({
    currency: new FormControl('')
  });
  currencyList: CurrencyListInterface[] = [];
  filteredCurrencyList: Observable<CurrencyListInterface[]>;
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

  filterCurrencyByQuery(currencyList: CurrencyListInterface[], query: string) {
    const currencyRegex = new RegExp(query.toLowerCase());
    return filter(currencyList, currency => currencyRegex.test(currency.currencyName.toLowerCase()) || currencyRegex.test(currency.id.toLowerCase()));
  }

  navigateToCurrencyConversion(event) {
    event.preventDefault();
    if(this.currencyForm.valid) {
      this.route.navigate([
        '/currency-conversion'], {
        state: {
          selectedCurrency: this.currencyForm.controls.currency.value
        }
      });
      return false;
    }
  }

  ngOnDestroy(): void {
    this.getCurrencyList.unsubscribe();
  }
}
