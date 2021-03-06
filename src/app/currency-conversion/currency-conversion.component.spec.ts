import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyConversionComponent } from './currency-conversion.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Router} from '@angular/router';
import {AppService} from '../app.service';
import {of} from 'rxjs';
import {ReactiveFormsModule} from '@angular/forms';
import {HomeComponent} from '../home/home.component';
import {Component} from '@angular/core';

@Component({
  selector: 'app-currency-conversion-dummy',
  template: ''
})
class AppCurrencyConversionDummyComponent {}

describe('CurrencyConversionComponent', () => {
  let component: CurrencyConversionComponent;
  let fixture: ComponentFixture<CurrencyConversionComponent>;
  let route: Router;
  let appService: AppService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyConversionComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([{
          path: 'home',
          component: AppCurrencyConversionDummyComponent
        }, {
          path: 'chart',
          component: AppCurrencyConversionDummyComponent
        }]),
        ReactiveFormsModule
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(CurrencyConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    route = TestBed.inject(Router);
    appService = TestBed.inject(AppService);
    spyOn(route, 'navigate').and.callThrough();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call callCurrencyConvertor when selectedCurrency is true', () => {
      spyOn(component, 'callCurrencyConvertor');
      component.selectedCurrency = 'AUD';
      component.ngOnInit();

      expect(component.callCurrencyConvertor).toHaveBeenCalled();
    });

    it('should call route navigate when selectedCurrency is false', () => {
      component.selectedCurrency = null;
      component.ngOnInit();

      expect(route.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('callCurrencyConvertor', () => {
    it('should call getConvertedCurrencyValues service', () => {
      spyOn(appService, 'getConvertedCurrencyValues').and.returnValue(of('') as any);
      spyOn(component, 'calculateConvertedCurrency');
      component.callCurrencyConvertor();

      expect(appService.getConvertedCurrencyValues).toHaveBeenCalled();
    });

    it('should call updatedConvertedCurrency', () => {
      spyOn(appService, 'getConvertedCurrencyValues').and.returnValue(of('1') as any);
      spyOn(component, 'calculateConvertedCurrency');
      component.currencyToBeConverted = {
        valueChanges: of('1')
      } as any;
      component.callCurrencyConvertor();

      expect(component.calculateConvertedCurrency).toHaveBeenCalled();
    });

    it('should set convertedCurrency', () => {
      component.selectedCurrency = 'AUD';
      component.currencyType = 'USD';
      const rate = {
        AUD_USD: {
          '2020-08-23': 0.7162
        }
      };
      spyOn(appService, 'getConvertedCurrencyValues').and.returnValue(of(rate) as any);
      spyOn(component, 'calculateConvertedCurrency').and.returnValue('0.72');
      spyOn(component, 'updatedConvertedCurrency');
      component.currencyToBeConverted = {
        valueChanges: of('1')
      } as any;
      component.callCurrencyConvertor();

      expect(component.convertedCurrency).toEqual('0.72');
    });
  });

  describe('calculateConvertedCurrency', () => {
    it('should return the calculated currency value', () => {
      const data = {
        AUD_USD: {
          '2020-08-18': 0.547494
        }
      };
      const val = 2;
      component.selectedCurrency = 'AUD';
      component.currencyType = 'USD';
      const result = component.calculateConvertedCurrency(data, val);

      expect(result).toEqual('1.09');
    });
  });

  describe('updatedConvertedCurrency', () => {
    it('should set convertedCurrency', () => {
      const data = 'test-response';
      spyOn(component, 'calculateConvertedCurrency').and.returnValue('test-converted-currency');
      (component as any).currencyToBeConverted = {
        value: 'test-value'
      };
      component.updatedConvertedCurrency(data);

      expect(component.calculateConvertedCurrency).toHaveBeenCalled();
      expect(component.convertedCurrency).toEqual('test-converted-currency');
    });

    it('should set convertedCurrency with empty string', () => {
      const data = 'test-response';
      (component as any).currencyToBeConverted = {
        value: null
      };
      component.updatedConvertedCurrency(data);

      expect(component.convertedCurrency).toEqual('');
    });
  });

  describe('setCurrencyType', () => {
    it('should set proper attribute and call callCurrencyConvertor', () => {
      const option = 'USD';
      component.showDropDown = false;
      spyOn(component, 'callCurrencyConvertor');
      component.setCurrencyType(option);

      expect(component.showDropDown).toEqual(true);
      expect(component.currencyType).toEqual('USD');
      expect(component.callCurrencyConvertor).toHaveBeenCalled();
    });
  });

  describe('navigateToChart', () => {
    it('should call route navigate with proper params', () => {
      component.selectedCurrency = 'AUD';
      component.currencyType = 'USD';
      component.navigateToChart();

      expect(route.navigate).toHaveBeenCalledWith(['/chart'], {
        state: {
          currency: {
            from: 'AUD',
            to: 'USD'
          },
        }
      });
    });
  });

  describe('navigateBack', () => {
    it('should navigate to home', () => {
      component.navigateBack();

      expect(route.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from convertedCurrencyValues', () => {
      (component as any).convertedCurrencyValues = {
        unsubscribe: jasmine.createSpy()
      };
      component.ngOnDestroy();

      expect(component.convertedCurrencyValues.unsubscribe).toHaveBeenCalled();
    });
  });
});
