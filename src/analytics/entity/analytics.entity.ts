import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BeforeInsert } from 'typeorm';
import { BeforeUpdate } from 'typeorm/index';

@Entity('users')
export class UserEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  createdOn: Date;

  @Column()
  updatedOn: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeInsert()
  setCreatedOn() {
    this.createdOn = new Date();
  }

  @BeforeUpdate()
  setUpdatedOn() {
    this.updatedOn = new Date();
  }
}
