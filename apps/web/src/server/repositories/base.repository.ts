import 'server-only';
import { z } from 'zod';

export abstract class BaseRepository {
  protected parse<T extends z.ZodType>(schema: T, data: unknown): z.infer<T> {
    if (process.env.NODE_ENV === 'production') {
      return data as z.infer<T>;
    }
    return schema.parse(data);
  }

  protected toNumber(value: unknown): number {
    return typeof value === 'number' ? value : Number(value);
  }
}
