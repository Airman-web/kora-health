import { SetMetadata } from '@nestjs/common';

export type Role = 'PATIENT' | 'THERAPIST';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
