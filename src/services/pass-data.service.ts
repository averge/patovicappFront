import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PassDataService {
  private actual:any=null
  constructor() { }

  setActual(actual:any){
    this.actual=actual
  }

  getActual(){
    return this.actual
  }
}
