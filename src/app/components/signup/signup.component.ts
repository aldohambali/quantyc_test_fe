import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'src/app/_services/admin.services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  submitted = false;

  ValUsername:string=''
  ValEmail:string=''
  ValPassword:string=''
  ValRole:string='1'

  @ViewChild('content') modalRef = {} as ElementRef;
  private modalService = inject(NgbModal);
  
  signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
    }
  );

  loading:boolean=false
	errorMsg:any=[]
  modalSuccess:any

  constructor(
    private formBuilder: FormBuilder,
    private adminServices: AdminService,
    private router:Router
  ) { }

  ngOnInit(): void {

  }

  get f() { return this.signupForm?.controls; }

  onSubmit(){

    this.submitted = true;
    console.log(this.signupForm?.value);
    console.log(this.signupForm);

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      console.log('signupForm invalid');
        return;
    }

    var prepareData:any = {}
		prepareData['username'] = this.ValUsername;
		prepareData['role'] = this.ValRole;
    prepareData['email'] = this.ValEmail;
    prepareData['password'] = this.ValPassword;
    prepareData['password_confirmation'] = this.ValPassword;
    

		this.errorMsg=[]
		this.loading=true
		this.adminServices.postRegis(prepareData).subscribe(
			(res:any) => {
				
				this.loading=false
				console.log('res ::',res)
				if(res.success){
					this.openModalSuccess()
				}else {
					this.errorMsg = res.message
				}	
			}
		);

  }

  gotoLogin(){
    this.modalSuccess.close();
    this.router.navigate(['/login']);
  }

  openModalSuccess(){
    this.modalSuccess = this.modalService.open(this.modalRef,{ centered: true, backdrop:'static',size:'sm' });
  }
}
