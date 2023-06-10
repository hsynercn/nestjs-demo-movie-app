import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const filteredMethods = new Set(['PATCH', 'PUT', 'DELETE']);
    if (filteredMethods.has(req.method)) {
      console.log(req.method, req.url, 'userId:' + req.user.userId);
    }

    return next.handle();
  }
}
