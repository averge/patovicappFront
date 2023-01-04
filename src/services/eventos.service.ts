import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EventosService {

 //url =  "https://node-vercel-bay.vercel.app/";
 url="http://localhost:4000/"

 //url="/"
 options: any;
 parameters = new HttpHeaders();
 params =  new HttpParams();  
 
 constructor(private http: HttpClient) { 

   this.options = {
     headers: new HttpHeaders({
       Accept: 'application/json',
       'Content-Type': 'application/json',
       'X-Requested-With': 'XMLHttpRequest'
       })
   };
 }

 eventosDe(id_usuari:any){
    console.log("eventosDe")
    var id_usuario={"id_usuario": id_usuari}

    console.log(id_usuario)
    return this.http.post(this.url+'eventos/eventosde',id_usuario,{headers:this.options});
 }

 agregarEvento(evento:any){
   return this.http.post(this.url+'eventos/add',evento,{headers:this.options});
 }

  agregarAsistente(asistente:any){
    console.log(asistente)
    return this.http.post(this.url+'asistente/add',asistente,{headers:this.options});
  }

  asistentesde(evento:any){
    const id_evento={id_evento:evento}
    return this.http.post(this.url+'asistente/asistentesde',id_evento,{headers:this.options});
  }

  eliminarAsistente(asistente:any){
    const id_asistente={id_asistente:asistente}
    console.log(asistente)
    return this.http.post(this.url+'asistente/delete',id_asistente,{headers:this.options});
  }

  eliminarEvento(evento:any){
    const id_evento={id_evento:evento}
    return this.http.post(this.url+'eventos/delete',id_evento,{headers:this.options});
  }
}
