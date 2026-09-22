import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardContent } from '../components/ui/Card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role) => {
    if (role === 'merchandiser') {
      setEmail('alex@merch.ai');
      setPassword('password');
    } else {
      setEmail('sarah@merch.ai');
      setPassword('password');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center items-center gap-3 text-primary mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
            <ScanLine className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-text tracking-tight">Merchandise AI</h1>
        </div>
        <h2 className="text-text-secondary">AI-assisted retail merchandising</h2>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-[400px]">
        <Card className="shadow-lg shadow-gray-200/50">
          <CardContent className="pt-8 px-6 pb-6 sm:px-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-3 bg-error/10 text-error rounded-lg text-sm font-medium border border-error/20">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    required
                    className="pl-10 h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <button type="button" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    required
                    className="pl-10 h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-base font-semibold mt-2" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-text-secondary font-medium mb-4 text-center">Demo Accounts</p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" size="sm" onClick={() => fillDemoAccount('merchandiser')}>
                  Merchandiser
                </Button>
                <Button variant="secondary" size="sm" onClick={() => fillDemoAccount('retail_ops_head')}>
                  Retail Ops Head
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
