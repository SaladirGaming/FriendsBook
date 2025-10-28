
import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import { type Session } from '@supabase/supabase-js';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import FriendProfile from './components/FriendProfile';
import { type Friend, type AppUser } from './types';

type View = 'auth' | 'dashboard' | 'profile';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<View>('auth');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  useEffect(() => {
    if (session) {
        setView('dashboard');
    } else {
        setView('auth');
        setSelectedFriend(null);
    }
  }, [session]);

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    setView('profile');
  };

  const handleBackToDashboard = () => {
    setSelectedFriend(null);
    setView('dashboard');
  };
  
  const handleSignOut = async () => {
      await supabase.auth.signOut();
  }

  const renderContent = () => {
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center"></div>; // Or a loading spinner
    }

    if (view === 'profile' && selectedFriend && session?.user) {
      return <FriendProfile friend={selectedFriend} onBack={handleBackToDashboard} />;
    }

    if (view === 'dashboard' && session?.user) {
      return <Dashboard user={session.user as AppUser} onSelectFriend={handleSelectFriend} onSignOut={handleSignOut} />;
    }

    return <Auth />;
  };

  return (
    <div className="min-h-screen bg-slate-100">
        {renderContent()}
    </div>
  );
};

export default App;
