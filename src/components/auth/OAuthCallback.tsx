import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabaseApi } from '../../utils/supabaseApi';
import { supabase } from '../../utils/supabaseClient';
import { LoadingSpinner } from '../LoadingSpinner';
import { motion } from 'motion/react';

export function OAuthCallback() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        setStatus('Processing authentication...');
        
        // Get the session from Supabase after OAuth redirect
        const sessionData = await supabaseApi.getCurrentSession();
        
        if (sessionData && sessionData.user) {
          setStatus('Setting up your account...');
          
          // Ensure user profile exists in database
          try {
            const { data: existingUser } = await supabase
              .from('users')
              .select('*')
              .eq('id', sessionData.user.id)
              .single();

            if (!existingUser) {
              // Create user profile if it doesn't exist
              const { error: insertError } = await supabase
                .from('users')
                .insert([{
                  id: sessionData.user.id,
                  email: sessionData.user.email,
                  full_name: sessionData.user.name || sessionData.user.email?.split('@')[0] || 'User',
                  role: 'student', // Default role for OAuth users
                  profile_completed: false,
                  interests: [],
                  location_preferences: []
                }]);

              if (insertError) {
                console.warn('Could not create user profile:', insertError);
              }
            }
          } catch (dbError) {
            console.warn('Database operation failed, continuing with auth session:', dbError);
          }

          setStatus('Redirecting to dashboard...');
          
          // User is authenticated, redirect to appropriate dashboard
          if (sessionData.user.type === 'student' && !sessionData.user.isOnboarded) {
            navigate('/onboarding');
          } else {
            navigate(`/${sessionData.user.type}-dashboard`);
          }
        } else {
          // No session found, redirect to login
          setStatus('Authentication failed, redirecting...');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('Authentication failed, redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    // Small delay to ensure Supabase has processed the callback
    const timer = setTimeout(handleOAuthCallback, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center p-8"
      >
        <LoadingSpinner />
        <h2 className="text-xl font-semibold mt-4 mb-2">Completing authentication...</h2>
        <p className="text-muted-foreground">{status}</p>
      </motion.div>
    </div>
  );
}