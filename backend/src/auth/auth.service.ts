import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { FirebaseAuthService } from './firebase-auth.service';
import { PrismaService } from '../database/prisma.service';

export interface UserEntity {
  id: string;
  email: string;
  passwordHash?: string;
  fullName: string;
  roleType: string;
  photoUrl?: string;
  provider: 'local' | 'google';
  createdAt: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private users: Map<string, UserEntity> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly firebaseAuthService: FirebaseAuthService,
    private readonly prisma: PrismaService,
  ) {
    // Seed in-memory demo account as reliable local fallback
    const demoPasswordHash = bcrypt.hashSync('CandidatePass123!', 10);
    this.users.set('demo@anvesh.ai', {
      id: 'usr_demo_001',
      email: 'demo@anvesh.ai',
      passwordHash: demoPasswordHash,
      fullName: 'Goutam Anvesh',
      roleType: 'candidate',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      provider: 'local',
      createdAt: new Date().toISOString(),
    });
  }

  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    // Check database if available
    try {
      const existingDbUser = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existingDbUser) {
        throw new ConflictException('An account with this email address already exists.');
      }
    } catch (e: any) {
      if (e instanceof ConflictException) throw e;
      // Fallback to in-memory check
      if (this.users.has(normalizedEmail)) {
        throw new ConflictException('An account with this email address already exists.');
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const newUser: UserEntity = {
      id: 'usr_' + Math.random().toString(36).substring(2, 11),
      email: normalizedEmail,
      passwordHash,
      fullName: dto.full_name,
      roleType: dto.role_type || 'candidate',
      provider: 'local',
      createdAt: new Date().toISOString(),
    };

    // Save to PostgreSQL if connected
    try {
      const dbUser = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          hashedPassword: passwordHash,
          fullName: dto.full_name,
          roleType: dto.role_type || 'candidate',
          provider: 'local',
          profile: {
            create: {
              headline: 'Software Engineer & AI Enthusiast',
              yearsOfExperience: 3.0,
              preferredWorkMode: 'REMOTE',
            },
          },
        },
      });
      newUser.id = dbUser.id;
    } catch (e: any) {
      this.logger.debug(`Saving user to in-memory cache (${e.message})`);
    }

    this.users.set(normalizedEmail, newUser);

    const token = this.generateToken(newUser);
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.fullName,
        role_type: newUser.roleType,
        provider: newUser.provider,
        created_at: newUser.createdAt,
      },
      access_token: token,
      token_type: 'bearer',
      expires_in: 86400,
    };
  }

  async login(dto: LoginDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    let user = this.users.get(normalizedEmail);

    // Try finding in database
    try {
      const dbUser = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (dbUser) {
        user = {
          id: dbUser.id,
          email: dbUser.email,
          passwordHash: dbUser.hashedPassword,
          fullName: dbUser.fullName,
          roleType: dbUser.roleType,
          photoUrl: dbUser.photoUrl || undefined,
          provider: dbUser.provider as any,
          createdAt: dbUser.createdAt.toISOString(),
        };
      }
    } catch (_) {}

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password credentials.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password credentials.');
    }

    const token = this.generateToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        role_type: user.roleType,
        photo_url: user.photoUrl,
        provider: user.provider,
        created_at: user.createdAt,
      },
      access_token: token,
      token_type: 'bearer',
      expires_in: 86400,
    };
  }

  async googleAuth(dto: GoogleAuthDto) {
    const decoded = await this.firebaseAuthService.verifyIdToken(dto.token, {
      email: dto.email,
      full_name: dto.full_name,
      photo_url: dto.photo_url,
    });

    const normalizedEmail = decoded.email.toLowerCase().trim();
    let user = this.users.get(normalizedEmail);

    // Check database
    try {
      const dbUser = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (dbUser) {
        user = {
          id: dbUser.id,
          email: dbUser.email,
          fullName: dbUser.fullName,
          roleType: dbUser.roleType,
          photoUrl: dbUser.photoUrl || undefined,
          provider: 'google',
          createdAt: dbUser.createdAt.toISOString(),
        };
      }
    } catch (_) {}

    if (!user) {
      user = {
        id: 'usr_g_' + (decoded.uid || Math.random().toString(36).substring(2, 11)),
        email: normalizedEmail,
        fullName: decoded.name || dto.full_name || 'Google User',
        roleType: 'candidate',
        photoUrl: decoded.picture || dto.photo_url,
        provider: 'google',
        createdAt: new Date().toISOString(),
      };

      try {
        const created = await this.prisma.user.create({
          data: {
            email: normalizedEmail,
            hashedPassword: '',
            fullName: user.fullName,
            roleType: 'candidate',
            photoUrl: user.photoUrl,
            provider: 'google',
            profile: {
              create: {
                headline: 'AI & Machine Learning Engineer',
                yearsOfExperience: 3.5,
                preferredWorkMode: 'REMOTE',
              },
            },
          },
        });
        user.id = created.id;
      } catch (_) {}

      this.users.set(normalizedEmail, user);
    } else {
      if (decoded.picture) user.photoUrl = decoded.picture;
      if (decoded.name) user.fullName = decoded.name;
    }

    const token = this.generateToken(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        role_type: user.roleType,
        photo_url: user.photoUrl,
        provider: user.provider,
        created_at: user.createdAt,
      },
      access_token: token,
      token_type: 'bearer',
      expires_in: 86400,
    };
  }

  async getUserById(id: string) {
    try {
      const dbUser = await this.prisma.user.findUnique({ where: { id } });
      if (dbUser) {
        return {
          id: dbUser.id,
          email: dbUser.email,
          full_name: dbUser.fullName,
          role_type: dbUser.roleType,
          photo_url: dbUser.photoUrl,
          provider: dbUser.provider,
          created_at: dbUser.createdAt.toISOString(),
        };
      }
    } catch (_) {}

    for (const user of this.users.values()) {
      if (user.id === id) {
        return {
          id: user.id,
          email: user.email,
          full_name: user.fullName,
          role_type: user.roleType,
          photo_url: user.photoUrl,
          provider: user.provider,
          created_at: user.createdAt,
        };
      }
    }
    return null;
  }

  private generateToken(user: UserEntity): string {
    const payload = {
      sub: user.id,
      email: user.email,
      full_name: user.fullName,
      role_type: user.roleType,
      provider: user.provider,
    };
    return this.jwtService.sign(payload);
  }
}
