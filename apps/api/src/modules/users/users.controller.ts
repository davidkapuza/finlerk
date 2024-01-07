import { Roles } from '@decorators/roles.decorator';
import { RolesEnum } from '@enums/roles.enum';
import { RolesGuard } from '@guards/roles.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  Request,
  SerializeOptions,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { QueryUserDto } from './dtos/query-user.dto';
import { InfinityPaginationResultType } from '../../shared/types/infinity-pagination-result.type';
import { infinityPagination } from '@utils/infinity-pagination';
import { NullableType } from '../../shared/types/nullable.type';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './domain/user';

@ApiCookieAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Get('my-profile')
  @HttpCode(HttpStatus.OK)
  getMyProfile(@Request() request): Promise<NullableType<User>> {
    return this.usersService.findOneById(request.user.id);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('my-profile')
  @HttpCode(HttpStatus.OK)
  updateMyProfile(
    @Request() request,
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.usersService.update(request.user.id, updateProfileDto);
  }

  @Roles(RolesEnum.admin)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProfileDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createProfileDto);
  }

  @Roles(RolesEnum.admin)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryUserDto,
  ): Promise<InfinityPaginationResultType<User>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.usersService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Roles(RolesEnum.admin)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: User['id']): Promise<NullableType<User>> {
    return this.usersService.findOneById(id);
  }

  @Roles(RolesEnum.admin)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: User['id'],
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.usersService.update(id, updateProfileDto);
  }

  @Roles(RolesEnum.admin)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: User['id']): Promise<void> {
    return this.usersService.softDelete(id);
  }
}
