import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url =  "https://node-vercel-bay.vercel.app/";
  //url="/"
  //url="http://localhost:4000/"
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

  registrar(user:any){
    console.log("registrar")
    return this.http.post(this.url+'usuarios/register',user,{headers:this.options});
  }

  login(user:any){
    console.log("login")
    return this.http.post(this.url+'usuarios/login',user,{headers:this.options});
  }

  getUser(id:any){
    const data ={id:id}
    return this.http.post(this.url+'usuarios/getUser',data,{headers:this.options});
  }
}
