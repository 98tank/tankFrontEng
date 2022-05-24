import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MissionData, Reward, User } from 'src/app/models';
import { FirebaseService, SharedService } from 'src/app/services';
import { DataRewardComponent } from './components/data-reward/data-reward.component';

@Component({
  selector: 'app-payment-history-rewards',
  templateUrl: './payment-history-rewards.page.html',
  styleUrls: ['./payment-history-rewards.page.scss'],
})
export class PaymentHistoryRewardsPage implements OnInit {
  buttonPrevious = false;
  lastDocument: any = null;
  firstDocument: any = null;
  rewards: any[] = [];

  constructor(
    private fs: FirebaseService,
    private ss: SharedService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getRewards();
  }

  trackByFn(index: number): number {
    return index;
  }

  getRewards(action?: string) {
    let document;
    const date: number = this.ss.getDate().getTime();
    if (action === 'previous') {
      document = this.firstDocument;
      if (document) {
        this.fs.getColFilter('reward', 'create_date', '<=', date).orderBy('create_date', 'desc').endBefore(document)
          .limitToLast(40)
          .get().then((res) => {
            this.firstDocument = res.docs[0];
            this.lastDocument = res.docs[res.docs.length - 1];
            this.LoadDataUser(res);
          });
      } else {
        this.fs.getColFilter('reward', 'create_date', '<=', date).orderBy('create_date', 'desc')
          .limit(40)
          .get().then((res) => {
            this.firstDocument = res.docs[0];
            this.lastDocument = res.docs[res.docs.length - 1];
            this.LoadDataUser(res);
          });
      }
    } else {
      document = this.lastDocument;
      if (document) {
        this.fs.getColFilter('reward', 'create_date', '<=', date).orderBy('create_date', 'desc').startAfter(document)
          .limit(40)
          .get().then((res) => {
            this.firstDocument = res.docs[0];
            this.lastDocument = res.docs[res.docs.length - 1];
            if (this.lastDocument) {
              this.LoadDataUser(res);
            } else {
              this.getRewards('next');
            }
          });
      } else {
        this.fs.getColFilter('reward', 'create_date', '<=', date).orderBy('create_date', 'desc')
          .limit(40)
          .get().then((res) => {
            this.firstDocument = res.docs[0];
            this.lastDocument = res.docs[res.docs.length - 1];
            this.LoadDataUser(res);
          });
      }
    }
  }

  LoadDataUser(data: any) {
    let counter = 0;
    const temp: any[] = [];
    if (data.size > 0) {
      data.forEach(d => {
        const r: Reward = d.data() as Reward;
        this.fs.afs.doc(`users/${r.uid_recruiter}`).get().subscribe(res => {
          if (res.exists) {
            const rec: User = res.data() as User;
            this.fs.afs.doc(`missions/${r.mission_id}`).get().subscribe(mission => {
              ++counter;
              const m: MissionData = mission.data() as MissionData;
              if (m) {
                const nerReward = {
                  status: r.status,
                  reward: m.reward,
                  id_reward: r.id_reward,
                  name_candidate: r.name,
                  mission_id: m.mission_id,
                  net_salary: m.net_salary,
                  clabe: rec.profile.clabe,
                  email: rec.profile.email,
                  create_date: r.create_date,
                  update_date: r.update_date,
                  recruiter: rec.profile.name,
                  seen_by_admin: r.seen_by_admin,
                  name_position: m.name_position,
                  name_bank: rec.profile.name_bank,
                  contract_type: m.type_contract || '',
                  account_number: rec.profile.account_number || '',
                  pay: r.pay || null
                };
                temp.push(nerReward);
              }
              if (counter === data.size) {
                this.rewards = temp;
              }
            });
          } else {
            ++counter;
            if (counter === data.size) { this.rewards = temp; }
          }
        });
      });
    }
  }

  pagination(action: string) {
    this.getRewards(action);
    if (action === 'next') { this.buttonPrevious = true; }
  }

  async more(d) {
    const modal = await this.modalController.create({
      component: DataRewardComponent,
      componentProps: { data: d },
      backdropDismiss: false
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data.reload) { this.getRewards(); }
  }
}
