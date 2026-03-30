import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router';
import './error.css';

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
    <div className="error-page">
      <div className="error-bg">
        <div className="error-glow error-glow-1" />
        <div className="error-glow error-glow-2" />
        <div className="error-noise" />
      </div>

      <div className="error-content">
        <p className="error-code">{statusCode}</p>
        <h1 className="error-title">{title}</h1>
        <p className="error-description">{description}</p>

        <div className="error-actions">
          <button
            type="button"
            className="error-btn error-btn-primary"
            onClick={() => navigate('/')}
          >
            Go home
          </button>
          <button
            type="button"
            className="error-btn error-btn-secondary"
            onClick={() => navigate(-1)}
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
