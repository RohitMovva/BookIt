// app/page.tsx
import AuthWrapper from './components/AuthWrapper';
import HomePage from './components/HomePage';

export default function RootPage() {
  return (
    <AuthWrapper>
      <HomePage />
    </AuthWrapper>
  );
}
