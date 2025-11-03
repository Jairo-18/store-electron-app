import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const HotelId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number | null => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return user?.hotelId || null;
  },
);
