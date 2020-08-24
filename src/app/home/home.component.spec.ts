import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {RouterTestingModule} from '@angular/router/testing';
import {AppService} from '../app.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {currencyList} from './home.spec.constant';
import {values} from 'lodash';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {CurrencySingleInterface} from '../app.interface';
import {ReactiveFormsModule} from '@angular/forms';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let route: Router;
  let appService: AppService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(Router);
    appService = TestBed.inject(AppService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getCurrencyList service', () => {
      component.currencyList = [];
      const list: CurrencySingleInterface[] = [
        {
          currencyName: 'Albanian Lek',
          currencySymbol: 'Lek',
          id: 'ALL'
        },
        {
          currencyName: 'East Caribbean Dollar',
          currencySymbol: '$',
          id: 'XCD'
        },
        {
          currencyName: 'Euro',
          currencySymbol: '€',
          id: 'EUR'
        }
      ];
      spyOn(appService, 'getCurrencyList').and.returnValue(of(currencyList.results));
      component.ngOnInit();

      expect(component.currencyList).toEqual(list);
    });
  });

  describe('filterCurrencyByQuery', () => {
    it('filter currency list based on id', () => {
      const result = component.filterCurrencyByQuery(values(currencyList.results), 'EUR');
      const expected = [{
        currencyName: 'Euro',
        currencySymbol: '€',
        id: 'EUR'
      }];
      expect(result).toEqual(expected);
    });

    it('filter currency list based on currencyName', () => {
      const result = component.filterCurrencyByQuery(values(currencyList.results), 'East Caribbean Dollar');
      const expected = [{
        currencyName: 'East Caribbean Dollar',
        currencySymbol: '$',
        id: 'XCD'
      }];
      expect(result).toEqual(expected);
    });
  });

  describe('navigateToCurrencyConversion', () => {
    let event;
    beforeEach(() => {
      event = {
        preventDefault: jasmine.createSpy()
      };
    });
    it('should call route navigate with correct params', () => {
      component.currencyForm = {
        valid: true,
        controls: {
          currency: {
            value: 'AUD'
          }
        }
      } as any;
      const state = {
        state: {
          selectedCurrency: 'AUD'
        }
      };

      spyOn(route, 'navigate');
      component.navigateToCurrencyConversion(event);

      expect(route.navigate).toHaveBeenCalledWith(['/currency-conversion'], state);
    });

    it('should not call route navigate', () => {
      component.currencyForm = {
        valid: false
      } as any;
      spyOn(route, 'navigate');
      component.navigateToCurrencyConversion(event);

      expect(route.navigate).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from the getCurrencyList', () => {
      spyOn(component.getCurrencyList, 'unsubscribe');
      component.ngOnDestroy();

      expect(component.getCurrencyList.unsubscribe).toHaveBeenCalled();
    });
  });
});
