import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DataRewardComponent } from './data-reward.component';

describe('DataRewardComponent', () => {
  let component: DataRewardComponent;
  let fixture: ComponentFixture<DataRewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataRewardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DataRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
