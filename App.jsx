import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in when app loads
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle Sign Up
  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) alert(error.message);
    else alert('Check your email or you are signed up!');
  };

  // Handle Sign In
  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) alert(error.message);
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#fff', background: '#121212', minHeight: '100vh' }}>
        <h1>Welcome to Viso! 🎉</h1>
        <p>Logged in as: <strong>{user.email}</strong></p>
        <button 
          onClick={handleSignOut}
          style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '5px' }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#fff', background: '#121212', minHeight: '100vh' }}>
      <h1>Viso Social Platform</h1>
      <p>Log in or sign up to access your live database feed.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', marginTop: '20px' }}>
        <input 
          type="email" 
          placeholder="Email address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff' }}
        />
        
        <button 
          onClick={handleSignIn}
          disabled={loading}
          style={{ padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '5px' }}
        >
          Sign In
        </button>
        <button 
          onClick={handleSignUp}
          disabled={loading}
          style={{ padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '5px' }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}