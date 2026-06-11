import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional() @IsInt() @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional() @IsInt() @Min(1) @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional() @IsEnum(['ASC', 'DESC'] as const)
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class DateRangeDto {
  @ApiPropertyOptional()
  @IsOptional() @IsString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  endDate?: string;
}

export class FleetFilterDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ['tanker', 'bus', 'taxi', 'all'] })
  @IsOptional() @IsString()
  fleetType?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  region?: string;
}

export class ApiResponse<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data: T;

  @ApiPropertyOptional()
  message?: string;

  @ApiPropertyOptional()
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function paginated<T>(data: T[], total: number, page: number, limit: number): ApiResponse<T[]> {
  return {
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export function success<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message };
}

// Re-export all DTOs
export * from './request.dto';
export * from './response.dto';
