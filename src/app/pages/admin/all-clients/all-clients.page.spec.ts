import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllClientsPage } from './all-clients.page';

describe('AllClientsPage', () => {
  let component: AllClientsPage;
  let fixture: ComponentFixture<AllClientsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllClientsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllClientsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
