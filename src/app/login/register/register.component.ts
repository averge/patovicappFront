import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  error=false
  
  constructor( private activeoute: ActivatedRoute, private router: Router, private servicio: UsersService) { }
  register = new FormGroup(
    {user : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required]),
    email : new FormControl('', [Validators.required, Validators.email]),}
  )
  ngOnInit(): void {
  }
  save(){
    this.error=false
    console.log(this.register.value);
    this.servicio.registrar(this.register.value).subscribe(
      (data:any)=>{
        if (data==0){
          alert("usuario registrado exitosamente");
          this.router.navigate(['/login']);
        }else{
          this.error=true
        }
      }
    )
  }
  login(){
    this.router.navigate(['/login']);
  }
}
