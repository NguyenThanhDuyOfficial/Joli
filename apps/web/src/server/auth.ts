import 'server-only';
import { headers } from 'next/headers';
// import { auth } from '@joli/auth'; // Better Auth instance

export type Session = {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
} | null;

/**
 * Lấy session hiện tại từ Better Auth.
 * TODO: Tích hợp Better Auth — hiện tại là stub.
 */
export async function getSession(): Promise<Session> {
  // const session = await auth.api.getSession({ headers: await headers() });
  // return session;
  return null;
}

/**
 * Lấy session, throw UnauthorizedError nếu chưa đăng nhập.
 */
export async function requireSession(): Promise<NonNullable<Session>> {
  const session = await getSession();
  if (!session) {
    const { UnauthorizedError } = await import('./error');
    throw new UnauthorizedError();
  }
  return session;
}
