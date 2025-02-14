import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Event, Prisma } from '@prisma/client';

export interface Account {
  username: string;
  balance: number;
  version: number;
}

export const TYPE_CREATE_ACCOUNT: string = 'CREATE_ACCOUNT';
export const TYPE_DEPOSIT: string = 'DEPOSIT';
export const TYPE_WITHDRAW: string = 'WITHDRAW';

export interface EventPaylaod {
  type: string;
  amount?: number;
}

const parseAmount = (value: Prisma.JsonValue | undefined): number => {
  if (typeof value !== 'number') {
    return 0;
  }

  return value as number;
};

@Injectable()
export class EventService {
  constructor(private prismaService: PrismaService) {}

  getAllEventsByUser(username: string): Promise<Event[]> {
    return this.prismaService.event.findMany({
      where: {
        username: username,
      },
    });
  }

  getAllEvents(): Promise<Event[]> {
    return this.prismaService.event.findMany({});
  }

  async userExists(username: string) {
    const data = await this.prismaService.event.findFirst({
      where: {
        username: username,
      },
    });

    return data != null;
  }

  async getAccount(username: string): Promise<Account> {
    const events = await this.getAllEventsByUser(username);
    const user: Account = { balance: 0, username: username, version: 0 };
    events.forEach((event) => {
      const payload = event.payload as Prisma.JsonObject;
      user.version = event.version as number;
      switch (payload.type) {
        case TYPE_DEPOSIT: {
          user.balance += parseAmount(payload.amount);
          break;
        }

        case TYPE_WITHDRAW: {
          user.balance -= parseAmount(payload.amount);
          break;
        }
      }
    });

    return user;
  }

  async createAccount(username: string): Promise<Account> {
    const _userExists = await this.userExists(username);
    if (_userExists == true)
      throw new BadRequestException('User already exists');

    await this.prismaService.event.create({
      data: {
        username: username,
        payload: {
          type: TYPE_CREATE_ACCOUNT,
        },
        version: 0,
      },
    });

    return this.getAccount(username);
  }

  async deposit(username: string, amount: number): Promise<Account> {
    const account = await this.getAccount(username);
    if (amount < 0) throw new BadRequestException('No valid amount');

    await this.prismaService.event.create({
      data: {
        username: username,
        payload: { type: TYPE_DEPOSIT, amount: amount },
        version: account.version + 1,
      },
    });

    account.balance += amount;
    return account;
  }

  async withdraw(username: string, amount: number): Promise<Account> {
    const account = await this.getAccount(username);
    if (account.balance < amount)
      throw new BadRequestException('Amount is greater than account balance');

    if (amount < 0) throw new BadRequestException('No valid amount');

    await this.prismaService.event.create({
      data: {
        username: username,
        payload: { type: TYPE_WITHDRAW, amount: amount },
        version: account.version + 1,
      },
    });

    account.balance -= amount;
    return account;
  }
}
