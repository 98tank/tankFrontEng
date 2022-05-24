import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActiveMissionsPage } from './active-missions.page';

describe('ActiveMissionsPage', () => {
  let component: ActiveMissionsPage;
  let fixture: ComponentFixture<ActiveMissionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveMissionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveMissionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
