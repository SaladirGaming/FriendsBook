
import { createClient } from '@supabase/supabase-js';

// --- IMPORTANT ACTION REQUIRED ---
// You must replace these placeholder values with your actual Supabase project credentials.
// Follow the instructions shown on the screen if the app fails to load.
const supabaseUrl = 'PASTE_YOUR_URL_HERE';
const supabaseAnonKey = 'PASTE_YOUR_ANON_KEY_HERE';

// This check prevents the app from being used without proper configuration
// and displays a helpful guide to the user.
if (supabaseUrl.includes('PASTE_YOUR_URL_HERE') || supabaseAnonKey.includes('PASTE_YOUR_ANON_KEY_HERE')) {
  const rootEl = document.getElementById('root');
  if (rootEl) {
    rootEl.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
        <div class="w-full max-w-3xl bg-white border border-yellow-400 text-slate-800 p-8 rounded-lg shadow-lg" role="alert">
          <h2 class="font-bold text-2xl mb-3 text-yellow-600">Action Required: Configure Supabase</h2>
          <p class="mb-4 text-slate-700">
            This application requires a Supabase backend for authentication and data storage. Please follow these steps to connect your own Supabase project:
          </p>
          <ol class="list-decimal list-inside space-y-3 mb-6 text-slate-600">
            <li>
              Go to <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:underline font-semibold">Supabase.com</a> and create a free account if you don't have one.
            </li>
            <li>
              Create a new Project in your Supabase dashboard.
            </li>
            <li>
              In your project dashboard, navigate to <strong>Settings</strong> <span class="font-sans">&rarr;</span> <strong>API</strong>.
            </li>
            <li>
              Find your <strong>Project URL</strong> and your <strong>Project API key</strong> (use the one labeled <code>anon</code> and <code>public</code>).
            </li>
            <li>
              Copy these two values and paste them into the <code>services/supabase.ts</code> file, replacing the placeholder values.
            </li>
          </ol>
          <div class="bg-slate-800 text-white p-4 rounded-md font-mono text-sm overflow-x-auto">
            <p><span class="text-slate-400">// file: services/supabase.ts</span></p>
            <p>const supabaseUrl = '<span class="text-red-400">${supabaseUrl}</span>'; <span class="text-slate-400">// &lt;-- Replace this</span></p>
            <p>const supabaseAnonKey = '<span class="text-red-400">${supabaseAnonKey}</span>'; <span class="text-slate-400">// &lt;-- Replace this</span></p>
          </div>
          <p class="mt-4 text-sm text-slate-500">
            After updating the file, the application will automatically reload with your new configuration.
          </p>
        </div>
      </div>
    `;
    // Throw an error to stop further script execution.
    throw new Error("Supabase not configured. Please update services/supabase.ts with your project credentials.");
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
