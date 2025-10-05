import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Farm = Database['public']['Tables']['farms']['Row'];
type Plot = Database['public']['Tables']['plots']['Row'];
type Crop = Database['public']['Tables']['crops']['Row'];
type Livestock = Database['public']['Tables']['livestock']['Row'];

interface GameContextType {
  profile: Profile | null;
  farm: Farm | null;
  plots: Plot[];
  crops: Crop[];
  livestock: Livestock[];
  loading: boolean;
  initializeFarm: (farmName: string) => Promise<void>;
  refreshGameData: () => Promise<void>;
  plantCrop: (plotId: string, cropId: string) => Promise<void>;
  irrigatePlot: (plotId: string) => Promise<void>;
  fertilizePlot: (plotId: string) => Promise<void>;
  harvestPlot: (plotId: string) => Promise<void>;
  addLivestock: (type: string, name: string) => Promise<void>;
  feedLivestock: (livestockId: string) => Promise<void>;
  updateResources: (water?: number, fertilizer?: number, money?: number) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [farm, setFarm] = useState<Farm | null>(null);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadGameData();
      loadCrops();
    } else {
      setProfile(null);
      setFarm(null);
      setPlots([]);
      setLivestock([]);
      setLoading(false);
    }
  }, [user]);

  const loadGameData = async () => {
    if (!user) return;

    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);

        const { data: farmData } = await supabase
          .from('farms')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (farmData) {
          setFarm(farmData);
          await loadFarmData(farmData.id);
        }
      }
    } catch (error) {
      console.error('Error loading game data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFarmData = async (farmId: string) => {
    const { data: plotsData } = await supabase
      .from('plots')
      .select('*')
      .eq('farm_id', farmId)
      .order('plot_number');

    const { data: livestockData } = await supabase
      .from('livestock')
      .select('*')
      .eq('farm_id', farmId);

    setPlots(plotsData || []);
    setLivestock(livestockData || []);
  };

  const loadCrops = async () => {
    const { data } = await supabase
      .from('crops')
      .select('*')
      .order('name');

    setCrops(data || []);
  };

  const initializeFarm = async (farmName: string) => {
    if (!user) return;

    const { data: newFarm, error: farmError } = await supabase
      .from('farms')
      .insert({
        user_id: user.id,
        name: farmName,
        location_lat: 37.7749,
        location_lng: -122.4194,
      })
      .select()
      .single();

    if (farmError) throw farmError;

    const plotsToCreate = Array.from({ length: 12 }, (_, i) => ({
      farm_id: newFarm.id,
      plot_number: i,
      position_x: (i % 4) * 100,
      position_y: Math.floor(i / 4) * 100,
    }));

    await supabase.from('plots').insert(plotsToCreate);

    await loadGameData();
  };

  const refreshGameData = async () => {
    if (farm) {
      await loadFarmData(farm.id);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle();

      if (profileData) setProfile(profileData);

      const { data: farmData } = await supabase
        .from('farms')
        .select('*')
        .eq('id', farm.id)
        .maybeSingle();

      if (farmData) setFarm(farmData);
    }
  };

  const plantCrop = async (plotId: string, cropId: string) => {
    const crop = crops.find(c => c.id === cropId);
    if (!crop || !farm) return;

    await supabase
      .from('plots')
      .update({
        crop_id: cropId,
        planted_at: new Date().toISOString(),
        growth_stage: 0,
        health: 100,
      })
      .eq('id', plotId);

    await logGameEvent('planted', { plotId, cropId, cropName: crop.name }, 5);
    await refreshGameData();
  };

  const irrigatePlot = async (plotId: string) => {
    if (!farm || farm.water_level < 10) return;

    await supabase
      .from('plots')
      .update({
        is_irrigated: true,
        last_watered: new Date().toISOString(),
        soil_moisture: 100,
      })
      .eq('id', plotId);

    await supabase
      .from('farms')
      .update({ water_level: farm.water_level - 10 })
      .eq('id', farm.id);

    await logGameEvent('irrigated', { plotId }, 10);
    await refreshGameData();
  };

  const fertilizePlot = async (plotId: string) => {
    if (!farm || farm.fertilizer_stock < 5) return;

    await supabase
      .from('plots')
      .update({ is_fertilized: true })
      .eq('id', plotId);

    await supabase
      .from('farms')
      .update({ fertilizer_stock: farm.fertilizer_stock - 5 })
      .eq('id', farm.id);

    await logGameEvent('fertilized', { plotId }, -5);
    await refreshGameData();
  };

  const harvestPlot = async (plotId: string) => {
    const plot = plots.find(p => p.id === plotId);
    if (!plot || !plot.crop_id || plot.growth_stage < 4) return;

    const crop = crops.find(c => c.id === plot.crop_id);
    if (!crop || !profile) return;

    const yield_amount = crop.base_yield * (plot.health / 100);
    const earnings = yield_amount * crop.price_per_unit;

    await supabase
      .from('plots')
      .update({
        crop_id: null,
        planted_at: null,
        growth_stage: 0,
        health: 100,
        is_irrigated: false,
        is_fertilized: false,
      })
      .eq('id', plotId);

    await supabase
      .from('profiles')
      .update({
        money: profile.money + earnings,
        total_score: profile.total_score + crop.sustainability_score
      })
      .eq('id', user!.id);

    await logGameEvent('harvested', { plotId, cropName: crop.name, earnings }, crop.sustainability_score);
    await refreshGameData();
  };

  const addLivestock = async (type: string, name: string) => {
    if (!farm || !profile) return;

    const cost = type === 'cow' ? 500 : type === 'sheep' ? 300 : 150;
    if (profile.money < cost) return;

    await supabase
      .from('livestock')
      .insert({
        farm_id: farm.id,
        type,
        name,
        health: 100,
        happiness: 100,
      });

    await supabase
      .from('profiles')
      .update({ money: profile.money - cost })
      .eq('id', user!.id);

    await logGameEvent('livestock_added', { type, name, cost }, 5);
    await refreshGameData();
  };

  const feedLivestock = async (livestockId: string) => {
    if (!profile || profile.money < 10) return;

    await supabase
      .from('livestock')
      .update({
        last_fed: new Date().toISOString(),
        health: 100,
        happiness: 100,
      })
      .eq('id', livestockId);

    await supabase
      .from('profiles')
      .update({ money: profile.money - 10 })
      .eq('id', user!.id);

    await logGameEvent('livestock_fed', { livestockId }, 3);
    await refreshGameData();
  };

  const updateResources = async (water?: number, fertilizer?: number, money?: number) => {
    if (!farm || !profile) return;

    const updates: any = {};
    if (water !== undefined) updates.water_level = water;
    if (fertilizer !== undefined) updates.fertilizer_stock = fertilizer;

    if (Object.keys(updates).length > 0) {
      await supabase
        .from('farms')
        .update(updates)
        .eq('id', farm.id);
    }

    if (money !== undefined) {
      await supabase
        .from('profiles')
        .update({ money })
        .eq('id', user!.id);
    }

    await refreshGameData();
  };

  const logGameEvent = async (eventType: string, details: any, scoreImpact: number) => {
    if (!user || !farm) return;

    await supabase
      .from('game_events')
      .insert({
        user_id: user.id,
        farm_id: farm.id,
        event_type: eventType,
        details,
        score_impact: scoreImpact,
      });
  };

  return (
    <GameContext.Provider
      value={{
        profile,
        farm,
        plots,
        crops,
        livestock,
        loading,
        initializeFarm,
        refreshGameData,
        plantCrop,
        irrigatePlot,
        fertilizePlot,
        harvestPlot,
        addLivestock,
        feedLivestock,
        updateResources,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
