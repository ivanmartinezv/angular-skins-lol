import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})

//CONEXION BDD Y CRUD
export class CampeonService {
  //constructor
  constructor(private afs: AngularFirestore) {
    //vacio
  }

  //(1) Crea un nuevo campeon en firebase
  public createCampeon(data: {
    nombre: string;
    aspectos: []; //era any[], queda RESUELTO
    cont_obtenible: number;
    cont_posesion: number;
    cont_botin: number;
  }) {
    console.log("servicio createCampeon()");
    let datos: any = data;
    return this.afs.collection("campeones").add(datos);
  }

  //(2) Obtiene un campeon
  public getCampeon(documentId: string) {
    return this.afs
      .collection("campeones")
      .doc(documentId)
      .snapshotChanges();
  }

  //(3) Obtiene todos los campeones
  public getCampeones() {
    let champs = this.afs.collection("campeones").snapshotChanges();
    //console.log("servicio: getcampeones() -->", champs);
    return champs;
  }

  //(4) Actualiza un campeon
  //en primera instancia borra los datos diferentes al nombre y url
  public updateCampeon(documentId: string, data: any) {
    //data es any porque podria recibir cualquier json
    let campeonActual = this.getCampeon(documentId);

    //TENDRIA QUE USAR GETCAMPEON CON subscribe
    /*
    let editSubscribe = this.getCampeon(documentId).subscribe(campeon => {
      //CAMBIAR EL INTERRUPTOR A MODO EDICION = 2
      let docId = documentId;
      let nombreCamp = campeon.payload.data()["nombre"]; 
      editSubscribe.unsubscribe();
    });
    */
    console.log(
      "campeon actual (como lo muestra sin suscribe?)): ",
      campeonActual
    );
    console.log("los datos del update son: ", data);
    return this.afs
      .collection("campeones")
      .doc(documentId)
      .set(data);
  }

  //(5) Elimina un campeon
  public deleteCampeon(documentId: string) {
    return this.afs
      .collection("campeones")
      .doc(documentId)
      .delete();
  }
}
