import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {Component} from '@angular/core';
import {Routes} from '@angular/router';

@Component({
  selector: 'app-dummy',
  template: ''
})
class AppDummyComponent {}

const appRoutes: Routes = [{
  path: 'home',
  component: AppDummyComponent
}, {
  path: 'currency-conversion',
  component: AppDummyComponent
}, {
  path: 'chart',
  component: AppDummyComponent
}, {
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
}, {
  path: '**',
  component: AppDummyComponent
}];

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(appRoutes)
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
