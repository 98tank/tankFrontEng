import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllRecruitersPage } from './all-recruiters.page';

describe('AllRecruitersPage', () => {
  let component: AllRecruitersPage;
  let fixture: ComponentFixture<AllRecruitersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllRecruitersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllRecruitersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
