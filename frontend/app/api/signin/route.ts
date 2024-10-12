import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.json();
  const { credential } = body;

  // Here you would verify the credential with Google and get user info
  // For this example, we'll just set a cookie

  cookies().set('auth_token', credential, { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600 // 1 hour
  });

  return NextResponse.json({ success: true });
}
