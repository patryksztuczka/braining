import { Button } from '@/components/ui/button';
import { NOISE_BG } from '@/lib/constants';
import heroImage from '../../assets/hero.webp';
import { signIn } from '@/lib/auth-client';
import { BrainIcon } from 'lucide-react';

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function SignInPage() {
  const callbackURL = new URL('/', window.location.origin).toString();

  return (
    <div className="bg-surface font-dm ml-[calc(50%-50vw)] flex min-h-svh w-screen overflow-hidden border-none text-left max-[900px]:flex-col">
      {/* Left decorative panel */}
      <div className="relative flex max-w-[50%] flex-[0_0_50%] items-end overflow-hidden p-8 max-[900px]:min-h-[300px] max-[900px]:max-w-full max-[900px]:flex-none max-[900px]:p-5">
        <div className="absolute inset-4 overflow-hidden rounded-3xl bg-[#0a0a12] max-[900px]:inset-3 max-[900px]:rounded-[20px]">
          <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.15)_50%,rgba(0,0,0,0.05)_100%)]" />
        </div>
        <div className="motion-safe:animate-panel-fade-up relative z-2 p-6 text-white/92 motion-safe:[animation-delay:0.2s]">
          <p className="mb-6 text-xs font-medium tracking-[2.5px] text-white/55 uppercase">
            A space for your mind
          </p>
          <h2 className="m-0 mb-5 font-serif text-[clamp(40px,5vw,64px)] leading-none font-normal tracking-[-1px] text-white italic max-[900px]:text-4xl">
            Think
            <br />
            Deeper,
            <br />
            Learn
            <br />
            Faster
          </h2>
          <p className="max-w-[320px] text-[15px] leading-[1.55] text-white/50">
            Capture thoughts, connect ideas, and let your knowledge grow organically.
          </p>
        </div>
      </div>

      {/* Right sign-in area */}
      <div className="relative flex min-h-svh flex-1 flex-col overflow-hidden px-12 py-10 max-[900px]:min-h-auto max-[900px]:px-6 max-[900px]:pt-8 max-[900px]:pb-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-glow-pulse absolute top-1/2 left-1/2 h-[560px] w-[560px] transform-[translate(-50%,-50%)] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-[0.08]" />
          <div
            className="absolute inset-0 bg-size-[128px_128px] opacity-[0.08] mix-blend-overlay"
            style={{ backgroundImage: NOISE_BG }}
          />
        </div>

        <div className="flex justify-end max-[900px]:mb-2 max-[900px]:justify-center">
          <div className="text-heading font-dm motion-safe:animate-fade-in flex items-center gap-2.5 text-lg font-medium tracking-[-0.3px] motion-safe:[animation-delay:0.1s]">
            <BrainIcon />
            <span>braining</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-[360px] flex-col items-center text-center">
            <h1 className="text-heading motion-safe:animate-fade-in m-0 mb-3 font-serif text-[42px] leading-[1.1] font-normal tracking-[-0.8px] motion-safe:[animation-delay:0.25s]">
              Welcome back
            </h1>
            <p className="text-text motion-safe:animate-fade-in mb-12 text-[15px] leading-normal motion-safe:[animation-delay:0.35s] max-[900px]:mb-9">
              Sign in to continue to your workspace
            </p>

            <Button
              size="lg"
              className="motion-safe:animate-fade-in w-full gap-3 rounded-[10px] py-2.5 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.06)] motion-safe:[animation-delay:0.45s]"
              onClick={async () => {
                await signIn.social({
                  provider: 'github',
                  callbackURL,
                });
              }}
            >
              <GitHubIcon />
              <span>Sign in with GitHub</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
