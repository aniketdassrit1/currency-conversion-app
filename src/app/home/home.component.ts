import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {AppService} from "../app.service";
import {createUrlResolverWithoutPackagePrefix} from "@angular/compiler";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currencyForm = new FormGroup({
    currency: new FormControl('')
  });
  currencyList = [];

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.appService.getCurrencyList().subscribe(data => {
      console.log(data);
    });
  }

}
