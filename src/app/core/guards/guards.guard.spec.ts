import { TestBed } from '@angular/core/testing';
import { GuardsGuard } from './guards.guard';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

describe('GuardsGuard', () => {
  let guard: GuardsGuard;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      GetRole: jasmine.createSpy()
    };

    routerMock = {
      navigate: jasmine.createSpy()
    };

    TestBed.configureTestingModule({
      providers: [
        GuardsGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(GuardsGuard);
  });

  it('should allow activation if role is admin', () => {
    authServiceMock.GetRole.and.returnValue('admin');
    expect(guard.canActivate()).toBeTrue();
  });

  it('should deny activation and redirect if role is not admin', () => {
    authServiceMock.GetRole.and.returnValue('user');
    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/not-authorized']);
  });
});
