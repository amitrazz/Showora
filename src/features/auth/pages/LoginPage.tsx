import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bike, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLogin } from '../hooks';
import { LoginFormData, loginSchema } from '../schemas';

export function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  // Extract and format the app name from the URL
  const appName = useMemo(() => {
    if (typeof window === 'undefined') return 'SHOWORA';

    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    // Check if it's a subdomain (e.g., riya-enterprises.amitrazz.in)
    // Ignore 'www' or standard 2-part domains (like amitrazz.in or localhost)
    if (parts.length >= 3 && parts[0] !== 'www') {
      const subdomain = parts[0];

      // Convert 'riya-enterprises' to 'Riya Enterprises'
      return subdomain
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    return 'SHOWORA'; // Fallback
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 selection:bg-orange-500 selection:text-white">
      <div className="flex min-h-screen w-full">

        {/* ================= LEFT SIDE (HERO / BRANDING) ================= */}
        <div className="relative hidden w-full flex-col justify-between overflow-hidden bg-[#020617] p-12 lg:flex lg:w-1/2 xl:p-16">

          {/* Ambient Glowing Orbs */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden mix-blend-screen">
            <div className="absolute -left-[10%] -top-[10%] h-[600px] w-[600px] rounded-full bg-orange-600/15 blur-[120px]" />
            <div className="absolute -bottom-[10%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[130px]" />
          </div>

          {/* SaaS Grid Pattern Overlay */}
          <div
            className="absolute inset-0 z-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at center, #ffffff 1px, transparent 1px)`,
              backgroundSize: '32px 32px'
            }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            {/* Header / Logo */}
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-8 duration-1000">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_0_30px_rgba(249,115,22,0.3)] ring-1 ring-white/10">
                <Bike className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-widest text-white uppercase">
                  {appName}
                </h1>
                <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                  ENTERPRISE DEALERSHIP OS
                </p>
              </div>
            </div>

            {/* Hero Content */}
            <div className="my-auto max-w-xl space-y-10 py-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150 fill-mode-both">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-400 backdrop-blur-md">
                  <span className="mr-2 flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
                  Production-Ready Platform
                </div>
                <h2 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.15]">
                  The operating system for <br />
                  <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    bike dealerships
                  </span>
                </h2>
                <p className="max-w-md text-lg leading-relaxed text-slate-400">
                  Streamline your complete lifecycle—from procurement and VIN tracking to sales, invoicing, and business analytics.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 sm:gap-6">
                {[
                  { value: '9+', label: 'Core Business Modules' },
                  { value: 'Smart', label: 'Dashboard & Analytics' },
                  { value: 'Premium', label: 'UX & Information Density' },
                  { value: 'Enterprise', label: 'Grade Workflows' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md transition-all hover:bg-white/[0.04] hover:border-white/10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <h3 className="relative text-3xl font-bold text-white transition-transform group-hover:-translate-y-1 group-hover:text-orange-400">
                      {stat.value}
                    </h3>
                    <p className="relative mt-1 text-sm font-medium text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-sm font-medium text-slate-500 animate-in fade-in duration-1000 delay-300 fill-mode-both">
              © {new Date().getFullYear()} {appName}. All rights reserved.
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE (LOGIN FORM) ================= */}
        <div className="relative flex w-full items-center justify-center bg-slate-50 p-4 lg:w-1/2">

          {/* Mobile Background Elements */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden lg:hidden">
            <div className="absolute -top-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-orange-400/20 blur-[100px]" />
          </div>

          <Card className="relative z-10 w-full max-w-[440px] border-white/60 bg-white/70 p-6 shadow-2xl shadow-slate-200/50 backdrop-blur-2xl sm:rounded-[2rem] sm:p-10 animate-in zoom-in-95 fade-in duration-500">
            <CardHeader className="px-0 pt-0 text-center sm:text-left">
              {/* Mobile Logo */}
              <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-xl shadow-orange-500/20 lg:hidden">
                <Bike className="h-8 w-8 text-white" />
              </div>

              <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome Back
              </CardTitle>
              <CardDescription className="mt-2 text-base text-slate-500">
                Enter your credentials to access your workspace.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0 pb-0 pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Email Input Group */}
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold tracking-wide text-slate-700">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-500" />
                    <Input
                      type="email"
                      placeholder="admin@dealership.com"
                      className="h-14 w-full rounded-xl border-slate-200 bg-white pl-12 text-base font-medium shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm font-medium text-red-500 animate-in slide-in-from-top-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Input Group */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold tracking-wide text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-sm font-bold text-orange-600 transition-colors hover:text-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-14 w-full rounded-xl border-slate-200 bg-white pl-12 pr-12 text-base font-medium shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                      {...register('password')}
                    />

                    {/* Password Visibility Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm font-medium text-red-500 animate-in slide-in-from-top-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-red-200 bg-red-50/50 p-4 text-center text-sm font-semibold text-red-600 backdrop-blur-sm">
                    Invalid email or password. Please try again.
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="group relative mt-4 h-14 w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-[length:200%_auto] text-base font-bold text-white shadow-[0_8px_20px_-6px_rgba(249,115,22,0.5)] transition-all hover:bg-right hover:shadow-[0_12px_25px_-6px_rgba(249,115,22,0.6)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <span>Sign In to Workspace</span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}