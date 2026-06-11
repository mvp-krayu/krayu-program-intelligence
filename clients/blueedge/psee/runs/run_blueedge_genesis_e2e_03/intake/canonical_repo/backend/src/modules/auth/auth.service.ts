import { Injectable } from '@nestjs/common';
import { success } from '../../common/dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = MOCK_USERS[email];
    if (!user || password !== 'demo123') throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.sub, email: user.email, role: user.role, orgId: user.orgId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return success({ accessToken, refreshToken, user: { id: user.sub, email: user.email, name: `${user.firstName} ${user.lastName}`, role: user.role }, expiresIn: 900 });
  }

  async refresh(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const { iat, exp, ...user } = payload;
      const accessToken = this.jwtService.sign(user);
      return success({ accessToken, expiresIn: 900 });
    } catch { throw new UnauthorizedException('Invalid refresh token'); }
  }

  async getProfile(user: any) {
    const mockUser = Object.values(MOCK_USERS).find(u => u.sub === user.userId || u.sub === user.sub) || MOCK_USERS['admin@blueedge.com'];
    const role = (mockUser.role || 'viewer') as Role;
    const permissions = ROLE_PERMISSIONS[role] || [];
    return success({ id: mockUser.sub, email: mockUser.email, firstName: mockUser.firstName, lastName: mockUser.lastName, name: `${mockUser.firstName} ${mockUser.lastName}`, role: mockUser.role, orgId: mockUser.orgId, permissions });
  }
}
