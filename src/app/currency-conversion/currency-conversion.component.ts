import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {get, values} from 'lodash';
import {AppService} from '../app.service';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {currencyToConvertTo} from '../app.constants';
import {CurrencyConversionInterface} from '../app.interface';

@Component({
  selector: 'app-currency-conversion',
  templateUrl: './currency-conversion.component.html',
  styleUrls: ['./currency-conversion.component.scss']
})
export class CurrencyConversionComponent implements OnInit, OnDestroy {
  selectedCurrency = '';
  convertedCurrency = '';
  currencyValue = '';
  listOfCurrenciesToConvert: string[] = [];
  currencyType = 'USD';
  showDropDown = false;
  currencyToBeConverted = new FormControl('');
  convertedCurrencyValues: Subscription;

  constructor(private route: Router, private appService: AppService) {
    this.selectedCurrency = get(this.route.getCurrentNavigation(), 'extras.state.selectedCurrency');
  }

  ngOnInit(): void {
    this.listOfCurrenciesToConvert = currencyToConvertTo;
    if (this.selectedCurrency) {
      this.callCurrencyConvertor();
    } else {
      this.route.navigate(['/home']);
    }
  }

  callCurrencyConvertor(): void {
    this.convertedCurrencyValues = this.appService.getConvertedCurrencyValues( this.currencyType, this.selectedCurrency)
      .subscribe((data: CurrencyConversionInterface) => {
      this.currencyToBeConverted.valueChanges.subscribe((val: number = 0) => {
        this.convertedCurrency = this.calculateConvertedCurrency(data, val);
      });
      this.updatedConvertedCurrency(data);
    });
  }

  calculateConvertedCurrency(data, val): string {
    const currencyRate = values(get(data, `${this.selectedCurrency}_${this.currencyType}`));
    return `${((currencyRate[0]) * val).toFixed(2)}`;
  }

  updatedConvertedCurrency(data): void {
    const val = this.currencyToBeConverted.value;
    this.convertedCurrency = val ? this.calculateConvertedCurrency(data, val) : '';
  }

  setCurrencyType(option: string): void {
    this.showDropDown = !this.showDropDown;
    this.currencyType = option;
    this.callCurrencyConvertor();
  }

  navigateToChart(): void {
    this.route.navigate(['/chart'], {
      state: {
        currency: {
          from: this.selectedCurrency,
          to: this.currencyType
        },
      }
    });
  }

  navigateBack(): void {
    this.route.navigate(['/home']);
  }

  ngOnDestroy(): void {
    if (this.convertedCurrencyValues) {
      this.convertedCurrencyValues.unsubscribe();
    }
  }
}
