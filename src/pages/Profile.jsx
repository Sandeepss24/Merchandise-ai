import { Hash, Key, Mail, MapPin, Phone, Shield } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Profile Settings</h1>
        <p className="text-text-secondary mt-1 text-sm md:text-base">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Overview */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <div className="absolute inset-0 rounded-full bg-primary/10 -m-2"></div>
                <img 
                  src={user?.avatar} 
                  alt="Profile" 
                  className="w-full h-full rounded-full border-4 border-surface shadow-md relative"
                />
              </div>
              <h2 className="text-xl font-bold text-text">{user?.firstName} {user?.lastName}</h2>
              <Badge variant="primary" className="mt-2 text-xs tracking-wider uppercase">
                {user?.role.replace('_', ' ')}
              </Badge>
              <div className="mt-6 pt-6 border-t border-border flex justify-center">
                <Button variant="outline" className="w-full">Upload new photo</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 p-3 rounded-xl bg-gray-50/50 border border-border">
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">First Name</p>
                <p className="font-semibold text-text">{user?.firstName}</p>
              </div>
              <div className="space-y-1.5 p-3 rounded-xl bg-gray-50/50 border border-border">
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Last Name</p>
                <p className="font-semibold text-text">{user?.lastName}</p>
              </div>
              <div className="space-y-1.5 p-3 rounded-xl bg-gray-50/50 border border-border sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </p>
                <p className="font-semibold text-text">{user?.email}</p>
              </div>
              <div className="space-y-1.5 p-3 rounded-xl bg-gray-50/50 border border-border sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </p>
                <p className="font-semibold text-text">{user?.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Work Information */}
          <Card>
            <CardHeader>
              <CardTitle>Work Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 p-3 rounded-xl bg-gray-50/50 border border-border">
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> Role Level
                </p>
                <p className="font-semibold text-text">{user?.role.replace('_', ' ')}</p>
              </div>
              <div className="space-y-1.5 p-3 rounded-xl bg-gray-50/50 border border-border">
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5" /> Employee ID
                </p>
                <p className="font-semibold text-text">{user?.employeeId}</p>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Locations */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned Locations</CardTitle>
            </CardHeader>
            <CardContent>
              {user?.assignedLocations.includes('all') ? (
                <div className="flex items-center gap-2 p-3 bg-primary-surface border border-primary/20 rounded-lg text-primary font-medium">
                  <MapPin className="w-5 h-5" /> All Network Locations
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user?.assignedLocations.map(loc => (
                    <Badge key={loc} variant="default" className="text-sm px-3 py-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {loc === 'store1' ? 'FairPrice Tampines Mall' : loc === 'store2' ? 'Cold Storage VivoCity' : 'Sheng Siong Jurong Point'}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border border-border rounded-xl">
                <div>
                  <p className="font-semibold text-text flex items-center gap-2"><Key className="w-4 h-4"/> Password</p>
                  <p className="text-sm text-text-secondary mt-1">Last changed 3 months ago</p>
                </div>
                <Button variant="secondary">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
