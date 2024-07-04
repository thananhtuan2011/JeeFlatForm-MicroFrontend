import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  getTestBed,
} from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ForgotPasswordNewComponent } from './forgot-password-new.component';

const fakeAuth = {
  email: 'admin@demo.com',
  password: 'demo',
};

class FakeAuthService {
  forgotPassword(email: string): Observable<boolean> {
    const isChecked = email.toLowerCase() === fakeAuth.email.toLowerCase();
    return of(isChecked);
  }
}

describe('ForgotPasswordNewComponent', () => {
  let component: ForgotPasswordNewComponent;
  let fixture: ComponentFixture<ForgotPasswordNewComponent>;
  let injector;
  let authService: AuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      declarations: [ForgotPasswordNewComponent],
      providers: [
        {
          provide: AuthService,
          useClass: FakeAuthService,
        },
      ],
    }).compileComponents();

    injector = getTestBed();
    authService = injector.get(AuthService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
