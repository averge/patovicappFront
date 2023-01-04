import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login = new FormGroup(
    {user : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required])}
  )
  error=false

  constructor(private activeoute: ActivatedRoute, private router: Router, private servicio: UsersService) { }

  ngOnInit(): void {
  }
  ingresar(){
    this.error=false
    console.log(this.login.value);
    this.servicio.login(this.login.value).subscribe(
      (data:any)=>{
        console.log(data);
        if (data.length>0){
          localStorage.setItem("id", data[0].id)
          this.router.navigate(['/home']);
        }else{
          this.error=true
        }
      }
    )
  }
  register(){
    this.router.navigate(['/register']);

    console.log("register");
  }
}
