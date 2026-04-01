import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { NOISE_BG } from '@/lib/constants';

export function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const is404 = isRouteErrorResponse(error) && error.status === 404;

  const statusCode = isRouteErrorResponse(error) ? error.status : 500;
  const title = is404 ? 'Page not found' : 'Something went wrong';
  const description = is404
    ? "The page you're looking for doesn't exist or has been moved."
    : 'An unexpected error occurred. Please try again.';

  return (
    <div className="font-dm bg-surface relative ml-[calc(50%_-_50vw)] flex min-h-svh w-screen items-center justify-center overflow-hidden border-none text-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-error-pulse absolute top-1/2 left-1/2 h-[500px] w-[500px] [transform:translate(-50%,-50%)] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-25 blur-[100px]" />
        <div className="animate-error-pulse-2 absolute top-1/2 left-1/2 h-[350px] w-[350px] [transform:translate(-40%,-60%)] rounded-full bg-[radial-gradient(circle,#ec4899_0%,transparent_70%)] opacity-15 blur-[100px]" />
        <div
          className="absolute inset-0 bg-[length:128px_128px] opacity-[0.08] mix-blend-overlay"
          style={{ backgroundImage: NOISE_BG }}
        />
      </div>

      <div className="relative z-10 flex max-w-[480px] flex-col items-center px-6 py-8">
        <p className="text-heading motion-safe:animate-error-fade-in m-0 mb-2 font-serif text-[clamp(80px,15vw,140px)] leading-none font-normal tracking-[-3px] italic opacity-[0.12] motion-safe:[animation-delay:0.1s]">
          {statusCode}
        </p>
        <h1 className="text-heading motion-safe:animate-error-fade-in m-0 mb-3 font-serif text-[clamp(28px,4vw,40px)] leading-[1.15] font-normal tracking-[-0.5px] motion-safe:[animation-delay:0.2s]">
          {title}
        </h1>
        <p className="text-text motion-safe:animate-error-fade-in m-0 mb-10 max-w-[340px] text-[15px] leading-[1.6] motion-safe:[animation-delay:0.3s]">
          {description}
        </p>

        <div className="motion-safe:animate-error-fade-in flex gap-3 motion-safe:[animation-delay:0.4s] max-[480px]:w-full max-[480px]:flex-col">
          <Button
            size="lg"
            className="rounded-xl px-7 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)] max-[480px]:w-full"
            onClick={() => navigate('/')}
          >
            Go home
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="hover:text-heading rounded-xl px-7 py-3 hover:[border-color:color-mix(in_srgb,var(--border)_100%,var(--text-h)_20%)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] max-[480px]:w-full"
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
