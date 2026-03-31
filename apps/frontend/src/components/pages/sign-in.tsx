import { Button } from '@/components/ui/button';
import { NOISE_BG } from '@/lib/constants';
import heroImage from '../../assets/hero.webp';

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2a5 5 0 0 1 4.672 3.23A4 4 0 0 1 20 9a4 4 0 0 1-1.318 2.973A3.5 3.5 0 0 1 20 14.5a3.5 3.5 0 0 1-2.39 3.319A4 4 0 0 1 14 21h-4a4 4 0 0 1-3.61-3.181A3.5 3.5 0 0 1 4 14.5a3.5 3.5 0 0 1 1.318-2.527A4 4 0 0 1 4 9a4 4 0 0 1 3.328-3.77A5 5 0 0 1 12 2z" />
      <path d="M12 2v20" />
      <path d="M8 6.5a3 3 0 0 0-1 2.2" />
      <path d="M16 6.5a3 3 0 0 1 1 2.2" />
      <path d="M7.5 13a2.5 2.5 0 0 0-.5 1.5" />
      <path d="M16.5 13a2.5 2.5 0 0 1 .5 1.5" />
    </svg>
  );
}

export function Component() {
  return (
    <div className="flex min-h-svh bg-surface font-dm overflow-hidden w-screen ml-[calc(50%_-_50vw)] text-left border-none max-[900px]:flex-col">
      {/* Left decorative panel */}
      <div className="relative flex-[0_0_50%] max-w-[50%] flex items-end p-8 overflow-hidden max-[900px]:flex-none max-[900px]:max-w-full max-[900px]:min-h-[300px] max-[900px]:p-5">
        <div className="absolute inset-4 rounded-3xl overflow-hidden bg-[#0a0a12] max-[900px]:inset-3 max-[900px]:rounded-[20px]">
          <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.15)_50%,rgba(0,0,0,0.05)_100%)]" />
        </div>
        <div className="relative z-[2] p-6 text-white/[0.92] motion-safe:animate-panel-fade-up motion-safe:[animation-delay:0.2s]">
          <p className="text-xs font-medium tracking-[2.5px] uppercase text-white/55 mb-6">
            A space for your mind
          </p>
          <h2 className="font-serif font-normal italic text-[clamp(40px,5vw,64px)] leading-none tracking-[-1px] m-0 mb-5 text-white max-[900px]:text-4xl">
            Think
            <br />
            Deeper,
            <br />
            Learn
            <br />
            Faster
          </h2>
          <p className="text-[15px] leading-[1.55] text-white/50 max-w-[320px]">
            Capture thoughts, connect ideas, and let your knowledge grow organically.
          </p>
        </div>
      </div>

      {/* Right sign-in area */}
      <div className="relative flex-1 flex flex-col px-12 py-10 min-h-svh overflow-hidden max-[900px]:[min-height:auto] max-[900px]:px-6 max-[900px]:pt-8 max-[900px]:pb-10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[560px] h-[560px] top-1/2 left-1/2 [transform:translate(-50%,-50%)] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-[0.08] animate-glow-pulse" />
          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[length:128px_128px]"
            style={{ backgroundImage: NOISE_BG }}
          />
        </div>

        <div className="flex justify-end max-[900px]:justify-center max-[900px]:mb-2">
          <div className="flex items-center gap-2.5 text-heading font-dm text-lg font-medium tracking-[-0.3px] motion-safe:animate-fade-in motion-safe:[animation-delay:0.1s]">
            <BrainIcon />
            <span>braining</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[360px] flex flex-col items-center text-center">
            <h1 className="font-serif font-normal text-[42px] tracking-[-0.8px] leading-[1.1] text-heading m-0 mb-3 motion-safe:animate-fade-in motion-safe:[animation-delay:0.25s]">
              Welcome back
            </h1>
            <p className="text-[15px] text-text mb-12 leading-[1.5] max-[900px]:mb-9 motion-safe:animate-fade-in motion-safe:[animation-delay:0.35s]">
              Sign in to continue to your workspace
            </p>

            <Button
              size="lg"
              className="w-full gap-3 rounded-[10px] py-2.5 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.06)] motion-safe:animate-fade-in motion-safe:[animation-delay:0.45s]"
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
