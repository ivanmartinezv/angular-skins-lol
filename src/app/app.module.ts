import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
//importar modulo de formularios
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
//modulos
//import { AppRoutingModule } from "./app-routing.module";
//firebase
import { AngularFireModule } from "@angular/fire";
// if we want to add certain services
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from "../environments/environment";
//componentes
import { CampeonComponent } from "./componentes/campeon.component";
//servicios para BDD
import { CampeonService } from "./servicios/campeon.service";
import { AspectoService } from "./servicios/aspecto.service";

@NgModule({
  declarations: [
    AppComponent,
    //componentes
    CampeonComponent
  ],
  imports: [
    BrowserModule,
    //AppRoutingModule, //no está este
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule, //formularios
    ReactiveFormsModule, //formularios
    AngularFirestoreModule
  ],
  providers: [
    //servicios
    CampeonService,
    AspectoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
