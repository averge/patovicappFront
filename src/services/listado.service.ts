import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListadoService {
  //url =  "https://node-vercel-bay.vercel.app/";
  url="/"
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

  listado(){
    console.log("listado")
    return this.http.get(this.url+'listado',{headers:this.options});
  }

  agregarPersona(persona:any){
    return this.http.post(this.url+'listado/add',persona,{headers:this.options});
  }

  eliminarPersona(dni:any){
    console.log(dni)
    return this.http.post(this.url+'listado/delete',dni);
  }
  scanPersona(dni:any): Observable<any>{
    console.log(dni)
    return this.http.post<any>(this.url+'listado/scan',dni);
  }

}
