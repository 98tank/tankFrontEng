import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MissionUnderReviewPage } from './mission-under-review.page';

describe('MissionUnderReviewPage', () => {
  let component: MissionUnderReviewPage;
  let fixture: ComponentFixture<MissionUnderReviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionUnderReviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MissionUnderReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
