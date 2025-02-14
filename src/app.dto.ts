import { ApiProperty } from '@nestjs/swagger';

export class createAccountDTO {
  @ApiProperty({ default: 'AsciiCrawler' })
  username: string;
}

export class depositAndWithdrawDTO {
  @ApiProperty({ default: 'AsciiCrawler' })
  username: string;

  @ApiProperty({ default: 100 })
  amount: number;
}
