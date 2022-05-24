import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MissionsCompletedPage } from './missions-completed.page';

describe('MissionsCompletedPage', () => {
  let component: MissionsCompletedPage;
  let fixture: ComponentFixture<MissionsCompletedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionsCompletedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MissionsCompletedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
