
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { type AppUser, type Friend } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface DashboardProps {
  user: AppUser;
  onSelectFriend: (friend: Friend) => void;
  onSignOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onSelectFriend, onSignOut }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formState, setFormState] = useState({
    name: '',
    birthdate: '',
    hobbies: '',
    favorite_color: '',
    favorite_food: '',
    notes: '',
  });

  const fetchFriends = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      setFriends(data || []);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Laden der Freunde.');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFriend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsAdding(true);
      setError(null);
      const { data, error } = await supabase
        .from('friends')
        .insert([{ ...formState, user_id: user.id }])
        .select();

      if (error) throw error;

      if(data) {
        setFriends(prev => [...prev, data[0]].sort((a,b) => a.name.localeCompare(b.name)));
      }
      
      setFormState({ name: '', birthdate: '', hobbies: '', favorite_color: '', favorite_food: '', notes: '' });
    } catch (err: any) {
      setError(err.message || 'Fehler beim Hinzufügen des Freundes.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800">Meine Freunde</h1>
            <button 
                onClick={onSignOut}
                className="px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Abmelden
            </button>
        </header>

        {/* Add Friend Form */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
            <h2 className="text-xl font-bold text-slate-700 mb-4">Neuen Freund hinzufügen</h2>
            <form onSubmit={handleAddFriend} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={formState.name} onChange={handleInputChange} placeholder="Name" required className="p-2 border rounded-md" />
                <input name="birthdate" value={formState.birthdate} onChange={handleInputChange} type="date" className="p-2 border rounded-md" />
                <input name="hobbies" value={formState.hobbies} onChange={handleInputChange} placeholder="Hobbies" className="p-2 border rounded-md" />
                <input name="favorite_color" value={formState.favorite_color} onChange={handleInputChange} placeholder="Lieblingsfarbe" className="p-2 border rounded-md" />
                <input name="favorite_food" value={formState.favorite_food} onChange={handleInputChange} placeholder="Lieblingsessen" className="p-2 border rounded-md" />
                <textarea name="notes" value={formState.notes} onChange={handleInputChange} placeholder="Notizen..." className="p-2 border rounded-md md:col-span-2" rows={2}></textarea>
                <button type="submit" disabled={isAdding} className="md:col-span-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                    {isAdding ? <LoadingSpinner className="w-5 h-5"/> : 'Hinzufügen'}
                </button>
                {error && <p className="text-red-500 text-sm md:col-span-2 text-center">{error}</p>}
            </form>
        </div>

        {/* Friends List */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
             <h2 className="text-xl font-bold text-slate-700 mb-4">Freundesliste</h2>
            {loading ? (
                <div className="flex justify-center p-8"><LoadingSpinner /></div>
            ) : friends.length === 0 ? (
                <p className="text-slate-500 text-center py-4">Du hast noch keine Freunde hinzugefügt.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {friends.map(friend => (
                        <div key={friend.id} onClick={() => onSelectFriend(friend)} className="bg-slate-50 p-4 rounded-lg cursor-pointer border border-transparent hover:border-indigo-500 hover:shadow-md transition-all">
                            <h3 className="font-bold text-slate-800">{friend.name}</h3>
                            <p className="text-sm text-slate-500">{new Date(friend.birthdate).toLocaleDateString('de-DE', { day: '2-digit', month: 'long' })}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default Dashboard;
