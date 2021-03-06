// Nest
import {
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// Prisma
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
// Types
import { CreateUserDto } from '../dto/user/dto/create-user.dto';
import { UserWhereUniqueInput } from '../../@types/models/users.types.dto';
// Tools
import { omit } from '../../utils/objects';
import { BlockedResourceException } from '../../utils/responses/errors';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }
  async findMany() {
    return this.prisma.user.findMany();
  }
  async findUnique(where: UserWhereUniqueInput) {
    return this.prisma.user.findUnique({ where });
  }
  async update(where: UserWhereUniqueInput, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where, data });
  }
  async remove(where: UserWhereUniqueInput) {
    return this.prisma.user.delete({ where });
  }
  async requireRole(
    context: ExecutionContext,
    roles: Role[],
    forbiddenRoles: Role[] = [],
  ) {
    try {
      const { id } = context.switchToHttp().getResponse().locals.user;
      const { blocked, role } = await this.findUnique({ id });

      if (blocked) throw new BlockedResourceException();
      if (!roles.includes(role) || forbiddenRoles.includes(role))
        throw new Error();

      return true;
    } catch (e) {
      if (e instanceof BlockedResourceException) throw e;
      throw new ForbiddenException();
    }
  }

  async checkIfUserExists(where: UserWhereUniqueInput) {
    const user = await this.findUnique(where);
    if (!user) throw new NotFoundException();
    return user;
  }
  async checkEmailAvailability(email: string) {
    const user = await this.findUnique({ email });
    if (user) throw new ConflictException();
    return user;
  }
  async createUserHandler(body: CreateUserDto) {
    await this.checkEmailAvailability(body.email);
    const user = await this.create(omit(body, 'passwordRepetition'));
    return omit(user, 'password');
  }
}
