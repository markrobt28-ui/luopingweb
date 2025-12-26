import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvValidationService {
  constructor(private configService: ConfigService) {}

  validateRequiredEnvVars(): void {
    const requiredVars = [
      'DATABASE_URL',
      'JWT_SECRET',
    ];

    const missingVars = requiredVars.filter(
      (varName) => !this.configService.get(varName),
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`,
      );
    }

    // 验证 JWT_SECRET 强度（生产环境）
    if (process.env.NODE_ENV === 'production') {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (jwtSecret && jwtSecret.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters in production');
      }
    }
  }
}
