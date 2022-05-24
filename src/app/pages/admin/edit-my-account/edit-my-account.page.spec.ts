import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditMyAccountPage } from './edit-my-account.page';

describe('EditMyAccountPage', () => {
  let component: EditMyAccountPage;
  let fixture: ComponentFixture<EditMyAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMyAccountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditMyAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
