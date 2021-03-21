import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})

//CONEXION BDD Y CRUD
export class AspectoService {
  //constructor
  constructor(private afs: AngularFirestore) {
    //vacio
  }
}
