import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/_services/admin.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  submitted = false;
  loading:boolean=false

  //model
  ValEmail:string=''
  ValPassword:string=''

  errorMsg:string=''
  
  loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    }
  );

  constructor(
    private formBuilder: FormBuilder,
    private adminServices: AdminService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  get f() { return this.loginForm?.controls; }

  onSubmit(){
    this.errorMsg = '';
    this.submitted = true;
    console.log(this.loginForm?.value);
    console.log(this.loginForm);

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      console.log('loginForm invalid');
        return;
    }

    var data:any = {
      email : this.ValEmail,
      password : this.ValPassword
    }
    this.loading=true
    this.adminServices.login(data).subscribe((res) => {
      console.log('res : ',res);
      this.loading=false
      if(res.success){
        localStorage.setItem('token',res.token)
        localStorage.setItem('user',JSON.stringify(res.user))
        if(res.user.role==0){
          this.router.navigate(['/page/admin']);
        } else {
          this.router.navigate(['/page/user']);
        }
        
      } else {
        this.errorMsg = res.message
      }
    },
    (err:any) => {
      this.loading=false
      console.log('err',err?.message);
      alert(err?.message)
    });

  }
}
