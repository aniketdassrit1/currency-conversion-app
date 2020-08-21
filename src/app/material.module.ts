import {NgModule} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatGridListModule,
    MatButtonModule
  ]
})
export class MaterialModule {}
