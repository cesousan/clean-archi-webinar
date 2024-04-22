import { Model } from 'mongoose';

import { User } from '@webinar/users/entities';
import { IUserRepository } from '@webinar/users/ports';

import { MongoUser } from './mongo-user';

export class MongoUserRepository implements IUserRepository {
  constructor(private readonly model: Model<MongoUser.SchemaClass>) {}

  async create(user: User): Promise<{ id: string }> {
    const record = new this.model(UserMapper.toPersistence(user));
    await record.save();
    return { id: record._id };
  }
  async findByEmailAddress(emailAddress: string): Promise<User | null> {
    const record = await this.model.findOne({ emailAddress });
    if (!record) {
      return null;
    }
    return UserMapper.toDomain(record);
  }
  async findById(id: string): Promise<User | null> {
    const record = await this.model.findById(id);
    if (!record) {
      return null;
    }
    return UserMapper.toDomain(record);
  }
}

export class UserMapper {
  static toDomain(record: MongoUser.SchemaClass): User {
    return new User({
      id: record._id,
      email: record.emailAddress,
      password: record.password,
    });
  }
  static toPersistence(user: User): MongoUser.SchemaClass {
    return {
      _id: user.props.id,
      emailAddress: user.props.email,
      password: user.props.password,
    };
  }
}
