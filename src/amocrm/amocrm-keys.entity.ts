import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'amocrm_keys' })
export class AmocrmEntity {
  @PrimaryColumn({ nullable: false })
  id: number;

  @Column({ nullable: false })
  token_type: string;

  @Column({ nullable: false })
  expires_in: number;

  @Column({ nullable: false })
  access_token: string;

  @Column({ nullable: false })
  refresh_token: string;
}
