import { LoginForm } from "./login-form";

export default function LoginPage() {
  const googleEnabled = !!(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
  );

  return <LoginForm googleEnabled={googleEnabled} />;
}
