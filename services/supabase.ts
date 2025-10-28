import { createClient } from '@supabase/supabase-js';

// --- IMPORTANT ---
// Replace these placeholders with your actual Supabase project URL and Anon Key.
// You can find these in your Supabase project settings under "API".
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

// This check prevents the app from crashing and guides the user to configure their credentials.
if (supabaseUrl.includes('your-project-id') || supabaseAnonKey.includes('your-supabase-anon-key')) {
  const errorMessage = "Supabase URL and Anon Key are required. Please replace the placeholder values in 'services/supabase.ts' with your actual Supabase credentials.";
  console.error(errorMessage);

  // To make the error highly visible, we display it directly in the UI.
  // This will halt the React app from rendering.
  const rootEl = document.getElementById('root');
  if (rootEl) {
    rootEl.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div class="w-full max-w-2xl bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md" role="alert">
          <h2 class="font-bold text-xl mb-2">Konfigurationsfehler</h2>
          <p>${errorMessage}</p>
          <p class="mt-2">You can find the required keys in your Supabase project's dashboard under <strong>Settings &gt; API</strong>.</p>
        </div>
      </div>
    `;
    throw new Error("Supabase not configured. Please update services/supabase.ts");
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
