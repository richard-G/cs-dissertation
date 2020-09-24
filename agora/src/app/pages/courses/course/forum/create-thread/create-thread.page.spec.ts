import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateThreadPage } from './create-thread.page';

describe('CreateThreadPage', () => {
  let component: CreateThreadPage;
  let fixture: ComponentFixture<CreateThreadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateThreadPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateThreadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
