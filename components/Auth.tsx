
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import LoadingSpinner from './LoadingSpinner';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Prüfe deine E-Mails für den Bestätigungslink!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-600">Freundebuch</h1>
            <p className="text-slate-500 mt-2">Dein digitales Buch für Freunde.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">{isSignUp ? 'Konto erstellen' : 'Anmelden'}</h2>
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                E-Mail Adresse
              </label>
              <input
                id="email"
                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                type="email"
                placeholder="deine.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password"  className="block text-sm font-medium text-slate-700">
                Passwort
              </label>
              <input
                id="password"
                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {message && <p className="text-green-500 text-sm text-center">{message}</p>}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {loading ? <LoadingSpinner /> : (isSignUp ? 'Registrieren' : 'Anmelden')}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setMessage(null);
              }}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isSignUp ? 'Du hast bereits ein Konto? Anmelden' : 'Noch kein Konto? Registrieren'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
