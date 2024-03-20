import { Component, TemplateRef, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'src/app/_services/admin.services';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
	private modalService = inject(NgbModal);
	closeResult = '';

	users:any=[]
	loadingUser:boolean=false
	detail:any=null

	ValUsername:string=''
	ValName:string=''
	ValEmail:string=''
	ValPassword:string=''
	ValRole:string='1'
	
	updateForm = this.formBuilder.group({
		name: [''],
		username: [''],
		email: ['', Validators.email],
		password: [''],
		role: ['', Validators.required],
	  }
	);
	loading:boolean=false
	submitted:boolean=false
	modalUpdate:any
	successMsg:string=''
	errorMsg:any=[]

	modalDelete:any
	ValPasswordAdmin:string=''

	currentUserId:any

	constructor(
		private adminServices: AdminService,
		private formBuilder: FormBuilder
	) {}
	ngOnInit(): void {
		this.getUsers()
		this.currentUser()
	}
	currentUser(){
		var dataUser = localStorage.getItem('user')
		if(dataUser){
		  var user = JSON.parse(dataUser);
		  if(user.id){
			this.currentUserId=user.id
		  } 
		}
	}

	getUsers(){
		this.loadingUser=true
		this.adminServices.getUsers().subscribe(
			(res:any) => {
				this.loadingUser=false
				if(res.success){
					this.users=res.data
				} 	
			}
		);
	}

	delete(content: TemplateRef<any>,data:any) {
		this.detail = data
		this.modalDelete = this.modalService.open(content,{ size: 'sm' });
		this.successMsg=''
		this.ValPasswordAdmin=''
		this.errorMsg=[]
	}
	closeDelete(){
		this.modalDelete.close();
	}
	submitDelete(){
		// alert('alert')
		// this.modalDelete.close();

		var prepareData:any = {}
		prepareData['id'] = this.detail.id;
		prepareData['password'] = this.ValPasswordAdmin;

		this.errorMsg=[]
		this.loading=true
		this.adminServices.postDelete(prepareData).subscribe(
			(res:any) => {
				this.loading=false
				console.log('res ::',res)
				if(res.success){
					this.resetForm()
					this.getUsers()
					this.successMsg = 'success_delete'
					this.modalDelete.close();
				}else {
					this.errorMsg = res.message
				}	
			}
		);

	}

	edit(content: TemplateRef<any>,data:any) {
		this.detail = data

		this.ValUsername	= data.username
		this.ValName		= data.name
		this.ValEmail 		= data.email
		this.ValRole		= data.role

		this.modalUpdate = this.modalService.open(content,{ ariaLabelledBy: 'modal-basic-title' });

		this.successMsg=''
		this.errorMsg=[]
	}

	get f() { return this.updateForm?.controls; }

	onSubmitUpdate(){
		this.submitted = true;
		console.log(this.updateForm?.value);
		console.log(this.updateForm);
	
		// stop here if form is invalid
		if (this.updateForm.invalid) {
		  console.log('signupForm invalid');
			return;
		}

		var prepareData:any = {}
		if(this.ValEmail!==this.detail.email){
			prepareData['email'] = this.ValEmail;
		}
		if(this.ValName!==this.detail.name){
			prepareData['name'] = this.ValName;
		}
		if(this.ValUsername!==this.detail.username){
			prepareData['username'] = this.ValUsername;
		}
		if(this.ValPassword!==''){
			prepareData['password'] = this.ValPassword;
		}
	
		prepareData['id'] = this.detail.id;
		prepareData['role'] = this.ValRole;


		this.updateData(prepareData)
		
		console.log('prepareData : ',prepareData)
	}
	updateData(data:any){
		this.errorMsg=[]
		this.loading=true
		this.adminServices.postUpdateUser(data).subscribe(
			(res:any) => {
				
				this.loading=false
				console.log('res ::',res)
				if(res.success){
					this.resetForm()
					this.getUsers()
					this.successMsg = 'success_update'
					this.modalUpdate.close();
				}else {
					this.errorMsg = res.message
				}	

				
			}
		);
	}
	resetForm(){
		this.ValEmail=''
		this.ValName=''
		this.ValPassword=''
		this.ValRole='1'
		this.ValUsername=''
		this.submitted=false
	}

  open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}

}
