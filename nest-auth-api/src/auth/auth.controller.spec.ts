import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    signup: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const mockLoginDto: LoginDto = {
      mobile: '1234567890',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      name: 'Test User',
      mobile: '1234567890',
    };

    const mockToken = {
      access_token: 'mock.jwt.token',
    };

    it('should successfully login a user', async () => {
      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await controller.login(mockLoginDto);

      expect(result).toEqual(mockToken);
      expect(authService.validateUser).toHaveBeenCalledWith(
        mockLoginDto.mobile,
        mockLoginDto.password,
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an error if user validation fails', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login(mockLoginDto)).rejects.toThrow(
        'Invalid credentials'
      );
      expect(authService.validateUser).toHaveBeenCalledWith(
        mockLoginDto.mobile,
        mockLoginDto.password,
      );
    });
  });

  describe('signup', () => {
    const mockSignupDto: SignupDto = {
      name: 'Test User',
      mobile: '1234567890',
      password: 'password123',
    };

    const mockCreatedUser = {
      id: 1,
      name: 'Test User',
      mobile: '1234567890',
    };

    it('should successfully create a new user', async () => {
      mockAuthService.signup.mockResolvedValue(mockCreatedUser);

      const result = await controller.signup(mockSignupDto);

      expect(result).toEqual(mockCreatedUser);
      expect(authService.signup).toHaveBeenCalledWith(
        mockSignupDto.name,
        mockSignupDto.mobile,
        mockSignupDto.password,
      );
    });

    it('should throw an error if signup fails', async () => {
      mockAuthService.signup.mockRejectedValue(new Error('Signup failed'));

      await expect(controller.signup(mockSignupDto)).rejects.toThrow(
        'Signup failed',
      );
      expect(authService.signup).toHaveBeenCalledWith(
        mockSignupDto.name,
        mockSignupDto.mobile,
        mockSignupDto.password,
      );
    });
  });
});
