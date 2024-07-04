import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownStructHRDetailsComponent } from './dropdown-struct-hr-details.component';


describe('DropdownStructHRDetailsComponent', () => {
  let component: DropdownStructHRDetailsComponent;
  let fixture: ComponentFixture<DropdownStructHRDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownStructHRDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownStructHRDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
