'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function LoginCharacter({ coverEyes, hasError }: { coverEyes: boolean; hasError: boolean }) {
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (coverEyes) {
      setPupil({ x: 0, y: 0 });
      return;
    }

    function onMouseMove(e: MouseEvent) {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width * 0.5;
      const eyeCenterY = rect.top + rect.height * 0.45;
      const dx = e.clientX - eyeCenterX;
      const dy = e.clientY - eyeCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const maxOffset = 3.5;
      setPupil({
        x: (dx / dist) * Math.min(maxOffset, dist / 15),
        y: (dy / dist) * Math.min(maxOffset, dist / 15),
      });
    }

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [coverEyes]);

  return (
    <div className="flex justify-center mb-1 relative z-10 select-none">
      <svg
        ref={svgRef}
        width="100"
        height="100"
        viewBox="0 0 100 100"
        style={{ overflow: 'visible' }}
        className="drop-shadow-lg"
      >
        {/* Head */}
        <circle cx="50" cy="50" r="42" fill="#f0d0a0" stroke="#d4a870" strokeWidth="1.5" />

        {/* Ears */}
        <ellipse cx="8" cy="50" rx="7" ry="10" fill="#f0d0a0" stroke="#d4a870" strokeWidth="1.5" />
        <ellipse cx="92" cy="50" rx="7" ry="10" fill="#f0d0a0" stroke="#d4a870" strokeWidth="1.5" />

        {/* Eyebrows */}
        <path
          d={hasError ? 'M 24 29 Q 31 24 38 29' : 'M 24 31 Q 31 26 38 31'}
          fill="none" stroke="#7a5c2e" strokeWidth="2.5" strokeLinecap="round"
        />
        <path
          d={hasError ? 'M 62 29 Q 69 24 76 29' : 'M 62 31 Q 69 26 76 31'}
          fill="none" stroke="#7a5c2e" strokeWidth="2.5" strokeLinecap="round"
        />

        {/* Eyes */}
        {!coverEyes ? (
          <>
            <circle cx="31" cy="47" r="9" fill="white" />
            <circle cx={31 + pupil.x} cy={47 + pupil.y} r="4.5" fill="#222" />
            <circle cx={31 + pupil.x + 1.5} cy={47 + pupil.y - 1.5} r="1.5" fill="white" />

            <circle cx="69" cy="47" r="9" fill="white" />
            <circle cx={69 + pupil.x} cy={47 + pupil.y} r="4.5" fill="#222" />
            <circle cx={69 + pupil.x + 1.5} cy={47 + pupil.y - 1.5} r="1.5" fill="white" />
          </>
        ) : (
          <>
            <path d="M 22 47 Q 31 54 40 47" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 60 47 Q 69 54 78 47" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="50" cy="57" rx="3" ry="2.5" fill="#d4a870" />

        {/* Mouth */}
        <path
          d={hasError ? 'M 38 65 Q 50 60 62 65' : 'M 38 65 Q 50 71 62 65'}
          fill="none" stroke="#b07840" strokeWidth="2" strokeLinecap="round"
        />

        {/* Hands — slide up to cover eyes when password is focused */}
        <g
          style={{
            transform: coverEyes ? 'translateY(0px)' : 'translateY(58px)',
            transition: 'transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1)',
          }}
        >
          <ellipse cx="19" cy="47" rx="15" ry="12" fill="#f0d0a0" stroke="#d4a870" strokeWidth="1.5" />
          <ellipse cx="81" cy="47" rx="15" ry="12" fill="#f0d0a0" stroke="#d4a870" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('Incorrect username or password.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        {/* Logo / title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pieno</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Restaurant Schedule Manager</p>
        </div>

        <LoginCharacter coverEyes={passwordFocused} hasError={!!error} />

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 space-y-5"
        >
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
