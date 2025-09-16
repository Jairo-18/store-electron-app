import { Injectable } from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
  PaginatedListUsersParamsDto,
  PaginatedUserSelectParamsDto,
} from '../dtos/user.dto';

@Injectable()
export class UserUC {
  constructor(private _userService: UserService) {}

  async getRelatedDataToCreate() {
    return await this._userService.getRelatedDataToCreate();
  }

  async paginatedList(params: PaginatedListUsersParamsDto) {
    return await this._userService.paginatedList(params);
  }

  async paginatedPartialUser(params: PaginatedUserSelectParamsDto) {
    return await this._userService.paginatedUserSelect(params);
  }
}
