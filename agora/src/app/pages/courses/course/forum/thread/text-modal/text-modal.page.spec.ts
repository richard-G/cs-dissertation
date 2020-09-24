import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TextModalPage } from './text-modal.page';

describe('TextModalPage', () => {
  let component: TextModalPage;
  let fixture: ComponentFixture<TextModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TextModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
