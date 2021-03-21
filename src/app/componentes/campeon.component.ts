import { Component, OnInit } from "@angular/core";
//formularios
import {
  FormControl,
  FormGroup,
  Validators /*, FormBuilder*/
} from "@angular/forms";
//import {FormsModule,ReactiveFormsModule} from '@angular/forms';

//modelos

//servicios

@Component({
  selector: "app-campeon",
  templateUrl: "../vistas/campeon.component.html",
  styleUrls: ["../css/campeon.component.css"]
})

//COMPONENTE CREADO PARA IMPLEMENTAR UN MODELO NO RELACIONAL DE DATOS
export class CampeonComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log("ngOnInit()");
  }
}
