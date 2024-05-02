import { SessionEntity } from '@/shared/entities/session.entity';
import { UserEntity } from '@/shared/entities/user.entity';
import { SessionMapper } from '@/shared/mappers/session.mapper';
import { SessionRepositoryInterface } from '@/shared/repositories/session/sessiony-repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { NullableType, Session, User } from '@finlerk/shared';
import { FindOneOptions, Not } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    @Inject('SessionRepositoryInterface')
    private readonly sessionRepository: SessionRepositoryInterface,
  ) {}
  findOne(
    options: FindOneOptions<SessionEntity>,
  ): Promise<NullableType<Session>> {
    return this.sessionRepository.findByCondition(options);
  }

  async createSession(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session> {
    return this.sessionRepository.createSession(data);
  }

  async update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    const entity = await this.sessionRepository.findByCondition({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('Session not found');
    }

    const updatedEntity = await this.sessionRepository.save(
      this.sessionRepository.create(
        SessionMapper.toPersistence({
          ...SessionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SessionMapper.toDomain(updatedEntity);
  }

  async softDelete({
    excludeId,
    ...criteria
  }: {
    id?: Session['id'];
    user?: Pick<User, 'id'>;
    excludeId?: Session['id'];
  }): Promise<void> {
    await this.sessionRepository.softDelete({
      ...(criteria as {
        id?: SessionEntity['id'];
        user?: Pick<UserEntity, 'id'>;
      }),
      id: criteria.id
        ? (criteria.id as SessionEntity['id'])
        : excludeId
        ? Not(excludeId as SessionEntity['id'])
        : undefined,
    });
  }
}
