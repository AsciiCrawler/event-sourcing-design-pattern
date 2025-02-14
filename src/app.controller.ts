import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { createAccountDTO, depositAndWithdrawDTO } from './app.dto';
import { EventService } from './event.service';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly eventService: EventService) {}

  @Post('/create-account')
  @ApiOperation({ summary: 'Create a new account' })
  async createAccount(@Body() body: createAccountDTO) {
    return await this.eventService.createAccount(body.username);
  }

  @Post('/deposit')
  @ApiOperation({ summary: 'Deposit funds into an account' })
  async deposit(@Body() body: depositAndWithdrawDTO) {
    return await this.eventService.deposit(body.username, body.amount);
  }

  @Post('/withdraw')
  @ApiOperation({ summary: 'Withdraw funds from an account' })
  async withdraw(@Body() body: depositAndWithdrawDTO) {
    return await this.eventService.withdraw(body.username, body.amount);
  }

  @Get('/get-account/:username')
  @ApiOperation({ summary: 'Get account details by username' })
  @ApiParam({ name: 'username', required: true, example: 'AsciiCrawler' })
  async getAccount(@Param('username') username: string) {
    return await this.eventService.getAccount(username);
  }

  @Get('/debug/get-all-events/:username')
  @ApiOperation({ summary: 'Get all events for a specific user (debug endpoint)' })
  @ApiParam({ name: 'username', required: true, example: 'AsciiCrawler' })
  async getAllEventsByUser(@Param('username') username: string) {
    return await this.eventService.getAllEventsByUser(username);
  }

  @Get('/debug/get-all-events')
  @ApiOperation({ summary: 'Get all events (debug endpoint)' })
  async getAllEvents() {
    return await this.eventService.getAllEvents();
  }
}
