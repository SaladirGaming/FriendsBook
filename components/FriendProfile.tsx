
import React, { useState } from 'react';
import { type Friend, type GiftSuggestion } from '../types';
import { generateGiftSuggestions } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface FriendProfileProps {
  friend: Friend;
  onBack: () => void;
}

const InfoPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-slate-100 p-3 rounded-lg">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-slate-800 font-semibold">{value || '-'}</p>
    </div>
);

const FriendProfile: React.FC<FriendProfileProps> = ({ friend, onBack }) => {
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateGifts = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const result = await generateGiftSuggestions(friend);
      setSuggestions(result);
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <header className="flex items-center mb-6">
            <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-200 mr-4"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            </button>
            <h1 className="text-3xl font-bold text-slate-800">{friend.name}</h1>
        </header>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-xl font-bold text-slate-700 mb-4">Profilinformationen</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoPill label="Geburtstag" value={new Date(friend.birthdate).toLocaleDateString('de-DE')} />
            <InfoPill label="Lieblingsfarbe" value={friend.favorite_color} />
            <InfoPill label="Lieblingsessen" value={friend.favorite_food} />
            <div className="col-span-2 md:col-span-3">
                 <InfoPill label="Hobbies" value={friend.hobbies} />
            </div>
            <div className="col-span-2 md:col-span-3">
                 <InfoPill label="Notizen" value={friend.notes} />
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-xl font-bold text-slate-700 mb-2 sm:mb-0">Geschenkvorschläge</h2>
            <button
                onClick={handleGenerateGifts}
                disabled={loading}
                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
                {loading ? <LoadingSpinner className="w-5 h-5" /> : 'Ideen generieren'}
            </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="mt-4 space-y-4">
          {suggestions.length > 0 ? (
            suggestions.map((gift, index) => (
              <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold text-indigo-700">{gift.name} <span className="text-slate-500 font-medium text-sm">({gift.estimated_price})</span></h3>
                <p className="text-slate-600 text-sm mt-1">{gift.reason}</p>
              </div>
            ))
          ) : (
            !loading && <p className="text-slate-500 text-center py-4">Klicke auf "Ideen generieren", um Geschenkvorschläge zu erhalten.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendProfile;
