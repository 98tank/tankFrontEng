import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { pluck, take } from 'rxjs/operators';
import { Commissions, MissionData, RequestRefound, Reward, User } from 'src/app/models';
import { AuthService, FirebaseService } from 'src/app/services';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.page.html',
  styleUrls: ['./payment-history.page.scss'],
})
export class PaymentHistoryPage implements OnInit, OnDestroy {
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  subscription3: Subscription = new Subscription();
  subscription4: Subscription = new Subscription();
  subscription5: Subscription = new Subscription();
  c$: Observable<Commissions>;
  user$: Observable<User>;
  paidMissions = {
    quantity: 0,
    amount: 0
  };
  missionPending = {
    quantity: 0,
    amount: 0
  };
  rewardsPagada = {
    quantity: 0,
    amount: 0
  };
  rewardsPendiente = {
    quantity: 0,
    amount: 0
  };
  returnsPending = {
    quantity: 0,
    amount: 0
  };
  returnsPagada = {
    quantity: 0,
    amount: 0
  };

  constructor(
    private auth: AuthService,
    private fs: FirebaseService,
  ) { }

  ngOnInit() {
    this.c$ = this.fs.commission$;
  }

  ionViewWillEnter() {
    this.getUser();
    this.getMissions();
    this.getReturns();
    this.getRewardsComplete();
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
    this.subscription5.unsubscribe();
  }

  getUser() {
    this.subscription5 = this.auth.getAuth().subscribe(u => {
      if (u?.uid) { this.user$ = this.fs.getDocObserver(`users/${u.uid}`); }
    });
  }

  async getMissions() {
    let amount = 0;
    let counter = 0;
    let amount1 = 0;
    let counter1 = 0;
    const dataMission = await this.fs.getCol('missions');
    if (dataMission.size > 0) {
      dataMission.forEach(d => {
        const m: MissionData = d.data() as MissionData;
        if (m.status_payment === 'Pagada'){
          this.paidMissions.quantity = ++counter;
          amount = amount + m.net_salary;
          this.paidMissions.amount = amount;
        }
        if (m.status_payment === 'Pendiente'){
          this.missionPending.quantity = ++counter1;
          amount1 = amount1 + m.net_salary;
          this.missionPending.amount = amount1;
        }
      });
    }
  }

  async getRewardsComplete() {
    this.rewardsPagada.quantity = 0;
    this.rewardsPagada.amount = 0;
    this.rewardsPendiente.quantity = 0;
    this.rewardsPendiente.amount = 0;
    const queryReward = await this.fs.getCol('reward');
    if (!queryReward.empty) {
      queryReward.forEach(async d => {
        const r: Reward = d.data() as Reward;
        const queryMission = await this.fs.getDoc(`missions/${r.mission_id}`);
        const mission: MissionData = queryMission.data() as MissionData;
        if (mission?.reward) {
          if (r.status === 'Pendiente') {
            ++this.rewardsPendiente.quantity;
            this.rewardsPendiente.amount = this.rewardsPendiente.amount + mission.reward;
          } else if (r.status === 'Pagada') {
            ++this.rewardsPagada.quantity;
            this.rewardsPagada.amount = this.rewardsPagada.amount + mission.reward;
          }
        }
      });
    }
  }

  async getReturns() {
    this.returnsPending = {
      quantity: 0,
      amount: 0
    };
    this.returnsPagada = {
      quantity: 0,
      amount: 0
    };
    const queryRF = await this.fs.getCol('request_refound');
    if (!queryRF.empty) {
      queryRF.forEach(d => {
        const rr: RequestRefound = d.data() as RequestRefound;
        if (rr.status === 'Pendiente') {
          this.returnsPending.amount = this.returnsPending.amount + rr.net_salary;
          ++this.returnsPending.quantity;
        } else if (rr.status === 'Pagada') {
          this.returnsPagada.amount = this.returnsPagada.amount + rr.net_salary;
          ++this.returnsPagada.quantity;
        }
      });
    }
  }

}
