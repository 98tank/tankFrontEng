import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Commissions, MissionData, File, Reward } from 'src/app/models';
import { AuthService, FirebaseService } from 'src/app/services';
import { SeeAttachedComponent } from 'src/app/shared/see-attached/see-attached.component';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.page.html',
  styleUrls: ['./payment-history.page.scss'],
})
export class PaymentHistoryPage implements OnInit, OnDestroy {
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  rewardPending: Reward[] = [];
  rewardComplete: Reward[] = [];
  c$: Observable<Commissions>;

  constructor(
    private auth: AuthService,
    private fs: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getUser();
    this.c$ = this.fs.commission$;
    this.fs.getDoc('utilities/notifications').then(rest => {
      console.log(rest);
      this.fs.setDoc('emails/generic', rest.data()) 
    } )
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
  }

  getUser() {
    this.subscription1 = this.auth.getAuth().subscribe(u => {
      if (u?.uid) { this.getMyRewards(u.uid); }
    });
  }

  getMyRewards(uid: string) {
    this.fs.getColFilter('reward', 'uid_recruiter', '==', uid).orderBy('update_date', 'desc').get().then(r => {
      this.rewardPending = [];
      this.rewardComplete = [];
      if (r.size > 0) {
        r.docs.forEach(async (d, idx, arr) => {
          let reward: Reward = d.data() as Reward;
          if (reward.status === 'Pending') {
            await this.fs.updateDoc(`reward/${reward.id_reward}`, { seen_by_admin: true });
            this.subscription2 = this.fs.getDocObserver(`missions/${reward.mission_id}`).pipe(take(1)).subscribe((m: MissionData) => {
              reward = {
                ...reward,
                name_position: m.name_position,
                amount: m.reward
              };
              this.rewardPending.push(reward);
            });
          }
          if (reward.status === 'Paid') {
            this.subscription2 = this.fs.getDocObserver(`missions/${reward.mission_id}`).pipe(take(1)).subscribe((m: MissionData) => {
              reward = {
                ...reward,
                name_position: m.name_position,
                amount: m.reward,
                pay: reward.pay
              };
              this.rewardComplete.push(reward);
            });
          }
          if (idx + 1 === arr.length) {
            const snapShot = await this.fs.getDoc(`users/${uid}`);
            if (snapShot.data().statistics.pending_rewards > 0) {
              this.fs.updateDoc(`users/${uid}`, { 'statistics.pending_rewards': 0 });
            }
          }
        });
      }
    });
  }

  async openPeyment(pay: File) {
    const modal = await this.modalController.create({
      component: SeeAttachedComponent,
      componentProps: {pay}
    });
    return await modal.present();
  }

}
