import heroImage from '../../assets/hero.webp';
import './sign-in.css';

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
    <div className="signin-page">
      {/* Left decorative panel */}
      <div className="signin-panel">
        <div className="signin-panel-bg">
          <img src={heroImage} alt="" className="signin-panel-img" />
          <div className="signin-panel-overlay" />
        </div>
        <div className="signin-panel-content">
          <p className="signin-panel-label">A space for your mind</p>
          <h2 className="signin-panel-heading">
            Think
            <br />
            Deeper,
            <br />
            Learn
            <br />
            Faster
          </h2>
          <p className="signin-panel-sub">
            Capture thoughts, connect ideas, and let your knowledge grow organically.
          </p>
        </div>
      </div>

      {/* Right sign-in area */}
      <div className="signin-form-area">
        <div className="signin-ambient-glow" />

        <div className="signin-form-top">
          <div className="signin-brand">
            <BrainIcon />
            <span>braining</span>
          </div>
        </div>

        <div className="signin-form-center">
          <div className="signin-form-inner">
            <h1 className="signin-heading">Welcome back</h1>
            <p className="signin-subtitle">Sign in to continue to your workspace</p>

            <button type="button" className="signin-github-btn">
              <GitHubIcon />
              <span>Sign in with GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
