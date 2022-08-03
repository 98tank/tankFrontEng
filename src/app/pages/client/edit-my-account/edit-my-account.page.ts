import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertController, IonContent } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { pluck, take } from 'rxjs/operators';
import { Profile, User } from 'src/app/models';
import { AuthService, ExternalApiService, FirebaseService, MediaService, SharedService } from 'src/app/services';

@Component({
  selector: 'app-edit-my-account',
  templateUrl: './edit-my-account.page.html',
  styleUrls: ['./edit-my-account.page.scss'],
})
export class EditMyAccountPage implements OnInit, OnDestroy {
  creando: any;
  form: UntypedFormGroup;
  mailExists = false;
  imgAvatar: string = null;
  banks$: Observable<string[]>;
  sector$: Observable<string[]>;
  giro$: Observable<string[]>;
  profile: Profile;
  @ViewChild('topPage') content: IonContent;
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();

  constructor(
    private ms: MediaService,
    private auth: AuthService,
    private ss: SharedService,
    private fs: FirebaseService,
    private formBuild: UntypedFormBuilder,
    private eas: ExternalApiService,
    private alertController: AlertController) { }

    ngOnInit() {
      this.getBanks();
      this.getUser();
      // this.update();
    }

  ngOnDestroy(): void {
    this.subscription1.add(this.subscription2);
    this.subscription1.unsubscribe();
  }

  getUser() {
    this.subscription1 = this.auth.getAuth().subscribe(u => {
      if (u?.uid) {
        this.subscription2 = this.fs.getDocObserver(`users/${u.uid}`).pipe(pluck('profile')).subscribe( (p: Profile) => {
          this.profile = p;
          this.imgAvatar = p.avatar;
          this.buildForm();
          this.getGiro();
        });
      }
    });
  }

    getBanks() {
      this.banks$ = this.ss.getDataJsonLocal('', 'assets/data/banks.json').pipe(pluck('banks'));
    }

    getGiro() {
      this.giro$ = this.fs.getDocObserver('utilities/register_client').pipe(pluck('giros'));
    }

    private buildForm() {
      this.form = this.formBuild.group({
        company_name: [this.profile.company_name, [Validators.required, Validators.minLength(2)]],
        email: [this.profile.email],
        business_name: [this.profile.business_name, [Validators.required, Validators.minLength(2)]],
        taxId: [this.profile.taxId, Validators.required],
        address: [this.profile.address, [Validators.required, Validators.minLength(2)]],
        phone_company: [this.profile.phone_company || '', Validators.required],
        extension: [this.profile.extension],
        name_contact: [this.profile.name_contact, Validators.required],
        personal_phone: [this.profile.personal_phone || '', Validators.required],
        giro: [this.profile.giro, Validators.required],
        name_bank: [this.profile.name_bank],
        clabe: [this.profile.clabe, [Validators.pattern(/^[0-9]+$/), Validators.minLength(18), Validators.maxLength(18), Validators.required]],
        account_number: [this.profile.account_number || '', Validators.pattern(/^[0-9]+$/)],
      },
    );
    }

    async uploadImg(img, canvasId) {
      if (img.target.files[0]) {
        this.imgAvatar = await this.ms.onUpload(img, canvasId, 400);
      }
    }

    async rotateImg(canvasId) {
      this.imgAvatar = await this.ms.rotateAvatar(canvasId, 400);
    }

    getDataRegister() {
      this.mailExists = false;
      if (this.form.valid) {
        this.updateData(this.form.value);
      } else {
        this.content.scrollToTop(400);
        this.form.markAllAsTouched();
      }
    }

  updateData(data) {
    const user: User = {
      profile: {
        ...this.profile,
        ...data,
        avatar: this.imgAvatar || '',
        update_Date: this.ss.getDate().getTime(),
        clabe: parseFloat(data.clabe),
        phone_company: parseFloat(data.phone_company) || '',
        personal_phone: parseFloat(data.personal_phone) || '',
        account_number: parseFloat(data.account_number) || ''
      }
    };
    this.fs.updateDoc(`users/${this.profile.uid}`, user).then(() => this.updateSuccess());
  }

  async updateSuccess() {
    const alert = await this.alertController.create({
      cssClass: 'update-alert',
      header: 'Updated profile',
      mode: 'ios',
      message: '<ion-icon class="green" name="checkmark-circle"></ion-icon>',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    });
    await alert.present();
  }


  async resetPassword() {
    const alert = await this.alertController.create({
      header: 'Forgot Password?',
      mode: 'ios',
      cssClass: 'reset-pass',
      message: `Please enter your email to sent instructions <br> <strong>${this.profile.email}</strong>`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Submit',
          handler: () => { this.eas.sendEmailNotification(this.profile.email, 'reset'); }
        },
      ],
    });
    await alert.present();
  }

  update() {
    const ids: string[] = [];
    this.fs.afs.collection('users').get().subscribe(res => {
      const length = res.size;
      let counter = 0;
      res.forEach(d => {
        ++counter;
        const data: User = d.data() as User;
        ids.push(data.profile.uid);
        if (length === counter) {
          ids.forEach(id => {
            this.fs.updateDoc(`users/${id}`, {'profile.clabe': 165416846846468468, 'profile.name_bank': 'BANAMEX', 'profile.account_number': 0});
          });
        }
      });
    });
  }

}
