import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {get, values} from 'lodash';
import {AppService} from '../app.service';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {currencyToConvertTo} from '../app.constants';
import {CurrencyConversionInterface} from "../app.interface";

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
  currencyType: string = 'USD';
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
    this.convertedCurrencyValues = this.appService.getConvertedCurrencyValues( this.currencyType, this.selectedCurrency).subscribe((data: CurrencyConversionInterface) => {
      this.currencyToBeConverted.valueChanges.subscribe(rate => {
        const currencyRate = values(get(data, `${this.selectedCurrency}_${this.currencyType}`));
        this.convertedCurrency = `${((currencyRate[0]) * rate).toFixed(2)}`;
      });
    });
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
