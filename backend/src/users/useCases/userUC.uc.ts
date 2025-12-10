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

  async paginatedList(params: PaginatedListUsersParamsDto, hotelId?: string) {
    return await this._userService.paginatedList(params, hotelId);
  }

  async paginatedPartialUser(
    params: PaginatedUserSelectParamsDto,
    hotelId?: string,
  ) {
    return await this._userService.paginatedUserSelect(params, hotelId);
  }

  async paginatedListForAdmin(params: PaginatedListUsersParamsDto) {
    return await this._userService.paginatedListForAdmin(params);
  }

  async paginatedPartialUserForAdmin(params: PaginatedUserSelectParamsDto) {
    return await this._userService.paginatedUserSelectForAdmin(params);
  }
}
