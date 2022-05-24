import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MissionsCanceledPage } from './missions-canceled.page';

describe('MissionsCanceledPage', () => {
  let component: MissionsCanceledPage;
  let fixture: ComponentFixture<MissionsCanceledPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionsCanceledPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MissionsCanceledPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
