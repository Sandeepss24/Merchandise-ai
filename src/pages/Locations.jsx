import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { MapPin, Search, ChevronRight } from 'lucide-react';
import { useMockData } from '../context/MockDataContext';

export default function Locations() {
  const { stores } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Locations</h1>
          <p className="text-text-secondary mt-1 text-sm md:text-base">Manage and view all retail stores.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border bg-gray-50 flex justify-between items-center rounded-t-xl">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by name or code..." 
                className="pl-9 h-10 w-full bg-surface"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-text-secondary">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold text-text">Store</th>
                  <th className="px-6 py-4 font-semibold text-text">Location</th>
                  <th className="px-6 py-4 font-semibold text-text">Last Visit</th>
                  <th className="px-6 py-4 font-semibold text-text">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {filteredStores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => navigate(`/locations/${store.id}`)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary-surface rounded-lg text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-text group-hover:text-primary transition-colors">{store.name}</p>
                          <p className="text-xs text-text-secondary mt-0.5">{store.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{store.city}, {store.region}</td>
                    <td className="px-6 py-4">{store.lastVisit}</td>
                    <td className="px-6 py-4">
                      <Badge variant={store.status === 'Active' ? 'success' : 'default'}>
                        {store.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-border">
            {filteredStores.map((store) => (
              <div key={store.id} className="p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer flex flex-col gap-3" onClick={() => navigate(`/locations/${store.id}`)}>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-surface rounded-lg text-primary flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-text leading-tight">{store.name}</p>
                      <p className="text-xs text-text-secondary mt-1">{store.code}</p>
                    </div>
                  </div>
                  <Badge variant={store.status === 'Active' ? 'success' : 'default'} className="flex-shrink-0">
                    {store.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mt-1 bg-gray-50 p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-xs text-text-secondary mb-0.5">Location</p>
                    <p className="font-medium text-text">{store.region}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary mb-0.5">Last Visit</p>
                    <p className="font-medium text-text">{store.lastVisit}</p>
                  </div>
                </div>
                <div className="w-full flex items-center justify-center text-xs font-medium text-primary mt-1">
                  View details <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>

          {filteredStores.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-text-secondary font-medium">No locations found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
