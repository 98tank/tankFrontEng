import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsersAdminPage } from './users-admin.page';

describe('UsersAdminPage', () => {
  let component: UsersAdminPage;
  let fixture: ComponentFixture<UsersAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAdminPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
