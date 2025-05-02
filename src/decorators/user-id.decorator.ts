import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { authorizationToPayLoad } from '../utils/base-64-converter';

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const { authorization } = ctx.switchToHttp().getRequest().headers;

  const loginPayload = authorizationToPayLoad(authorization);

  return loginPayload?.id;
});
