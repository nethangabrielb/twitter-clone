import { prisma } from '../prisma/client';
import type { RegistrationBody } from '../types/auth';

const UserRepository = {
  createNewUser: (data: RegistrationBody) => prisma.user.create({ data }),
  findById: (id: number) => prisma.user.findUnique({ where: { id } }),
  findByUsername: (username: string) =>
    prisma.user.findUnique({ where: { username } }),
  findAll: () => prisma.user.findMany(),
  updateById: (id: number, data: Partial<RegistrationBody>) =>
    prisma.user.update({ where: { id }, data }),
  deleteById: (id: number) => prisma.user.delete({ where: { id } }),
};

export default UserRepository;
