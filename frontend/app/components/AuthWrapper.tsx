// app/components/AuthWrapper.tsx
import { cookies } from 'next/headers';
import HeroPage from './HeroPage';
import { redirect } from 'next/dist/server/api-utils';

async function getUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');
  
  if (!token) {
    return null;
  }

  // Here you would typically validate the token with your backend
  // For this example, we'll just assume the presence of a token means the user is authenticated
  return { authenticated: true };
}

export default async function AuthWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const user = await getUser();

  if (!user) {
    return <HeroPage />;
  }

  return <>{children}</>;
}
