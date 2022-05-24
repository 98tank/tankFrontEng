import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllCandidatesPage } from './all-candidates.page';

describe('AllCandidatesPage', () => {
  let component: AllCandidatesPage;
  let fixture: ComponentFixture<AllCandidatesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllCandidatesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllCandidatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
