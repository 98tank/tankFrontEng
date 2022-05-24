import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecruiterPage } from './recruiter.page';

describe('RecruiterPage', () => {
  let component: RecruiterPage;
  let fixture: ComponentFixture<RecruiterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruiterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecruiterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
