import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { NOISE_BG } from '@/lib/constants';

export function Component() {
  const error = useRouteError();
  const navigate = useNavigate();

  const is404 = isRouteErrorResponse(error) && error.status === 404;

  const statusCode = isRouteErrorResponse(error) ? error.status : 500;
  const title = is404 ? 'Page not found' : 'Something went wrong';
  const description = is404
    ? "The page you're looking for doesn't exist or has been moved."
    : 'An unexpected error occurred. Please try again.';

  return (
    <div className="relative flex items-center justify-center min-h-svh font-dm overflow-hidden w-screen ml-[calc(50%_-_50vw)] text-center border-none bg-surface">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute rounded-full blur-[100px] opacity-25 w-[500px] h-[500px] top-1/2 left-1/2 [transform:translate(-50%,-50%)] bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] animate-error-pulse" />
        <div className="absolute rounded-full blur-[100px] w-[350px] h-[350px] top-1/2 left-1/2 [transform:translate(-40%,-60%)] bg-[radial-gradient(circle,#ec4899_0%,transparent_70%)] opacity-15 animate-error-pulse-2" />
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[length:128px_128px]"
          style={{ backgroundImage: NOISE_BG }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 py-8 max-w-[480px]">
        <p className="font-serif text-[clamp(80px,15vw,140px)] font-normal italic leading-none tracking-[-3px] m-0 mb-2 text-heading opacity-[0.12] motion-safe:animate-error-fade-in motion-safe:[animation-delay:0.1s]">
          {statusCode}
        </p>
        <h1 className="font-serif font-normal text-[clamp(28px,4vw,40px)] tracking-[-0.5px] leading-[1.15] text-heading m-0 mb-3 motion-safe:animate-error-fade-in motion-safe:[animation-delay:0.2s]">
          {title}
        </h1>
        <p className="text-[15px] leading-[1.6] text-text m-0 mb-10 max-w-[340px] motion-safe:animate-error-fade-in motion-safe:[animation-delay:0.3s]">
          {description}
        </p>

        <div className="flex gap-3 max-[480px]:flex-col max-[480px]:w-full motion-safe:animate-error-fade-in motion-safe:[animation-delay:0.4s]">
          <Button
            size="lg"
            className="px-7 py-3 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.06)] max-[480px]:w-full"
            onClick={() => navigate('/')}
          >
            Go home
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-7 py-3 rounded-xl hover:text-heading hover:[border-color:color-mix(in_srgb,var(--border)_100%,var(--text-h)_20%)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] max-[480px]:w-full"
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
