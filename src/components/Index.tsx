import React, { useState, useEffect, useContext, createContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, LogOut, Award, Check, Target, Cloud, AlertTriangle, Droplets, Zap, CheckCircle, X, DollarSign, Heart, Sun, Wind, Thermometer, Leaf, BookOpen, GitBranch, HeartCrack, Settings, Volume2, Music, VolumeX, PlusCircle, ShoppingCart, Syringe, Edit3, ArrowRight, BrainCircuit, BarChart3, Info } from 'lucide-react';
import { Howl, Howler } from 'howler';

// --- I18N (INTERNATIONALIZATION) SETUP ---
const translations = {
  en: {
    welcome_title: "Welcome to FarmSight", welcome_subtitle: "Your adventure in sustainable farming.",
    continue_game: "Continue Game", new_game: "New Game",
    create_profile: "Create Your Profile", enter_name: "Enter your name...", next: "Next",
    select_region: "Select Your Starting Region", region_info: "Your region affects starting weather and soil conditions.",
    confirm_region: "Confirm Region", name_your_farm: "Name Your Farm", farm_name_placeholder: "e.g., Green Valley Farm",
    start_farming: "Start Farming!", day: "Day", settings: "Settings", audio: "Audio",
    master_volume: "Master Volume", sfx_volume: "Sound Effects", music_volume: "Music",
    graphics: "Graphics", performance_mode: "Performance Mode", accessibility: "Accessibility",
    high_contrast: "High-Contrast Mode (WIP)", game_data: "Game Data", reset_progress: "Reset All Progress",
    reset_confirm: "Are you sure? This will permanently delete your farm.", language: "Language",
    quests: "Quests", academy: "Academy",
    tutorial_title: "First Steps Tutorial", tutorial_start: "Start Tutorial",
    learn_soil: "Learn About Soil", learn_weather: "Learn About Weather",
    soil_title: "Understanding Your Soil", weather_title: "Weather & Your Farm",
    soil_content: "Healthy soil is the foundation of a successful farm. Using compost from your animals enriches the soil, making your crops stronger and more valuable. This is a sustainable practice that reduces waste and improves your yield!",
    weather_content: "The NASA data helps you make smart choices. High temperatures mean your soil will dry out faster, so you may need to water more. Rain naturally waters your crops, saving you resources. Pay attention to the weather to be a successful farmer!",
    tutorial_step_1: "Welcome! Let's learn the basics. Click on any empty plot of land to begin.",
    tutorial_step_2: "Great! Now, choose a crop to plant from the menu.",
    tutorial_step_3: "Your crop is planted! It needs time to grow. When it's ready, you can harvest it.",
    data_lab: "Data Lab", ai_advisor: "AI Farm Advisor",
    sm_title: "SMAP: Soil Moisture", sm_info: "This shows how much water is in your soil. Low moisture means your crops are thirsty.",
    gpm_title: "GPM: Rainfall Forecast", gpm_info: "This predicts the chance of rain for the next few days. Plan your watering accordingly!",
    ndvi_title: "NDVI: Vegetation Health", ndvi_info: "This measures how healthy and green your farm is. Higher NDVI means healthier pastures for your animals.",
  },
  yo: {
    welcome_title: "Kaabọ si FarmSight", welcome_subtitle: "Ìrìn-àjò rẹ nínú iṣẹ́ àgbẹ̀ tó dúróṣinṣin.",
    continue_game: "Tẹsiwaju Ere", new_game: "Ere Tuntun",
    create_profile: "Ṣẹda Àkọọ́lẹ̀ Rẹ", enter_name: "Tẹ orúkọ rẹ sii...", next: "T’okan",
    select_region: "Yan Ẹkun Ibẹ̀rẹ̀ Rẹ", region_info: "Ẹkun rẹ yóò nípa lórí ojú-ọjọ́ àti ilẹ̀ ìbẹ̀rẹ̀.",
    confirm_region: "Jẹ́risi Ẹkun", name_your_farm: "Fun Oko Rẹ Ni Orukọ", farm_name_placeholder: "f.ap. Oko Alawọ ewe",
    start_farming: "Bẹrẹ Iṣẹ Agbe!", day: "Ọjọ́", settings: "Ètò", audio: "Ohùn",
    master_volume: "Iwọn Ohùn Gbogbo", sfx_volume: "Ipa Ohùn", music_volume: "Orin",
    graphics: "Àwòrán", performance_mode: "Ipo Iṣẹ́ ṣíṣe Gíga", accessibility: "Ìrọ̀rùn Wíwọlé",
    high_contrast: "Ipo Àwọ̀ Gíga (Nlọ lọwọ)", game_data: "Dátà Eré", reset_progress: "Tun Gbogbo Ìtẹ̀síwájú Bẹ̀rẹ̀",
    reset_confirm: "Ṣé o dá ọ lójú? Èyí yóò pa oko rẹ rẹ́ pátápátá.", language: "Èdè",
    quests: "Àwọn Iṣẹ́", academy: "Ilé Ẹkọ́",
    tutorial_title: "Ìkọ́ni Ìgbésẹ̀ Àkọ́kọ́", tutorial_start: "Bẹ̀rẹ̀ Ìkọ́ni",
    learn_soil: "Kọ́ nípa Ilẹ̀", learn_weather: "Kọ́ nípa Ojú-ọjọ́",
    soil_title: "Òye nípa Ilẹ̀ Rẹ", weather_title: "Oju-ọjọ & Oko Rẹ",
    soil_content: "Ilẹ̀ tó dára ni ìpìlẹ̀ oko tó yọrí sí rere. Lílo ààtàn láti ara àwọn ẹran ọ̀sìn rẹ ń mú kí ilẹ̀ sanra, èyí sì ń jẹ́ kí àwọn ohun ọ̀gbìn rẹ lágbára, kí wọ́n sì níyì lórí. Èyí jẹ́ ìlànà iṣẹ́ àgbẹ̀ tó dúróṣinṣin tí ó dín ìbàjẹ́ kù, tí ó sì ń mú ìpèsè pọ̀ sí i!",
    weather_content: "Àwọn dátà NASA ń ràn ọ́ lọ́wọ́ láti ṣe àwọn àṣàyàn tó mọ́gbọ́n dání. Ìgbóná gíga túmọ̀ sí pé ilẹ̀ rẹ yóò gbẹ kíákíá, nítorí náà o lè nílò láti bomirin sí i. Òjò ń bomirin àwọn ohun ọ̀gbìn rẹ fúnra rẹ̀, èyí sì ń fi àwọn ohun èlò rẹ pamọ́. Fiyèsí ojú-ọjọ́ láti jẹ́ àgbẹ̀ tó yọrí sí rere!",
    tutorial_step_1: "Kaabọ! Jẹ́ kí a kọ́ àwọn ìpìlẹ̀. Tẹ orí ilẹ̀ pápá tí ó ṣófo láti bẹ̀rẹ̀.",
    tutorial_step_2: "Ó dára! Nísinyìí, yan ohun ọ̀gbìn kan láti inú àkojọ láti gbìn.",
    tutorial_step_3: "A ti gbin ohun ọ̀gbìn rẹ! Ó nílò àkókò láti dàgbà. Nígbà tí ó bá tó, o lè kórè rẹ̀.",
    data_lab: "Yàrá Dátà", ai_advisor: "Olùdámọ̀ràn AI",
  },
  ha: { /* ... Hausa translations ... */ },
  ig: { /* ... Igbo translations ... */ }
};

const LanguageContext = createContext();
const useLanguage = () => useContext(LanguageContext);

const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('farmSightLang') || null);
    useEffect(() => { if (language) localStorage.setItem('farmSightLang', language); }, [language]);
    const t = (key) => (translations[language] && translations[language][key]) || translations['en'][key] || key;
    return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};


// --- SOUND SETUP ---
const soundManager = {
  plant: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-game-ball-tap-2073.mp3'], volume: 0.6 }),
  water: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-liquid-bubble-3000.mp3'], volume: 0.5 }),
  fertilize: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-magic-sweep-game-trophy-257.mp3'], volume: 0.6 }),
  feed: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-chewing-something-crunchy-2244.mp3'], volume: 0.6 }),
  harvest: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-bonus-earned-in-video-game-2058.mp3'], volume: 0.7 }),
  collect: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-fast-small-sweep-transition-166.mp3'], volume: 0.7 }),
  click: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-on-or-off-light-switch-tap-2585.mp3'], volume: 0.4 }),
  error: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-game-show-wrong-answer-buzz-950.mp3'], volume: 0.4 }),
  cash: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-gold-coin-prize-1635.mp3'], volume: 0.5 }),
  notification: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3'], volume: 0.6 }),
  quest: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-video-game-win-2016.mp3'], volume: 0.6 }),
  rain: new Howl({ src: ['https://www.soundjay.com/nature/sounds/rain-07.mp3'], volume: 0.2, loop: true }),
  thunder: new Howl({ src: ['https://www.soundjay.com/nature/sounds/thunder-04.mp3'], volume: 0.5 }),
};

// --- GAME DATA & CONFIGURATION ---
const CROPS_DATA = [
    { id: '1', name: 'Yams', icon: '🍠', price: 10, growthTime: 3, salePrice: 25, idealTemp: 28 },
    { id: '2', name: 'Cassava', icon: '🥔', price: 15, growthTime: 4, salePrice: 35, idealTemp: 27 },
    { id: '3', name: 'Maize', icon: '🌽', price: 20, growthTime: 5, salePrice: 50, idealTemp: 25 },
    { id: '4', name: 'Tomatoes', icon: '🍅', price: 25, growthTime: 4, salePrice: 60, idealTemp: 24 },
    { id: '5', name: 'Peppers', icon: '🌶️', price: 30, growthTime: 5, salePrice: 70, idealTemp: 26 },
    { id: '6', name: 'Okra', icon: '🟢', price: 15, growthTime: 3, salePrice: 40, idealTemp: 29 },
];

const LIVESTOCK_DATA = {
    cow: { product: '🥛', productName: 'Milk', productionTime: 2, feedCost: 10, price: 500, breedCost: 250, medicineCost: 100, sellPrice: 200 },
    chicken: { product: '🥚', productName: 'Eggs', productionTime: 1, feedCost: 5, price: 100, breedCost: 50, medicineCost: 50, sellPrice: 40 },
};

const REGIONS = { 'South West': { soil_moisture: 65, temperature: 27 }, 'South South': { soil_moisture: 75, temperature: 26 }, 'South East': { soil_moisture: 70, temperature: 26 }, 'North Central': { soil_moisture: 55, temperature: 28 }, 'North West': { soil_moisture: 45, temperature: 30 }, 'North East': { soil_moisture: 40, temperature: 31 } };

const INITIAL_GAME_STATE = { profile: { name: '', money: 200, total_score: 0 }, farm: { name: '', water_level: 100, water_trough: 100, fertilizer_stock: 20, compost_stock: 5, medicine_stock: 2 }, plots: Array.from({ length: 8 }, (_, i) => ({ id: `plot-${i}`, crop_id: null, growth_stage: 0, soil_moisture: 60, plot_health: 100, is_fertilized: false })), livestock: [], quests: [ { id: 1, text: 'Plant your first crop', completed: false, required: 1, current: 0, type: 'plant' }, { id: 2, text: 'Harvest 3 crops', completed: false, required: 3, current: 0, type: 'harvest' }, { id: 3, text: 'Buy your first animal', completed: false, required: 1, current: 0, type: 'buy_animal' }], notifications: [], environment: { weather: 'sunny', temperature: 28, rainfall: 0, ndvi: 0.7, water_stress_factor: 1.0, current_scenario: 'normal', day: 1, weekly_forecast: [] }, tutorialFlags: { livestockExplained: false, marketExplained: false, breedExplained: false, sellExplained: false }, settings: { masterVolume: 1, musicVolume: 0.3, sfxVolume: 1, performanceMode: false, highContrast: false }, advisor_message: null };

// --- GAME CONTEXT & PROVIDER ---
const GameContext = createContext(null);
const useGame = () => useContext(GameContext);

const GameProvider = ({ savedState, onSave, onReset, children }) => {
    const [gameState, setGameState] = useState(savedState || null);
    const [infoModalContent, setInfoModalContent] = useState(null);
    const notificationIdCounter = useRef(0);
    const { t } = useLanguage();

    useEffect(() => { if(gameState) onSave(gameState); }, [gameState, onSave]);
    useEffect(() => { 
        if (!gameState) return;
        Howler.volume(gameState.settings.masterVolume); 
        Object.entries(soundManager).forEach(([key, sound]) => {
            const volume = key === 'rain' ? gameState.settings.musicVolume : gameState.settings.sfxVolume;
            sound.volume(volume);
        });
    }, [gameState?.settings]);

    const addNotification = (message, isImportant = false) => {
        const id = notificationIdCounter.current++;
        setGameState(prev => (prev ? { ...prev, notifications: [...prev.notifications, { id, message, isImportant }] } : null));
        if (isImportant) soundManager.quest.play(); else soundManager.notification.play();
        setTimeout(() => setGameState(prev => (prev ? { ...prev, notifications: prev.notifications.filter(n => n.id !== id) } : null)), 3500);
    };
    
    useEffect(() => {
        if (!gameState) return;
        const gameTick = setInterval(() => {
             setGameState(prev => {
                if (!prev) return null;
                const newDay = prev.environment.day + 1;

                // --- Scenario & Weather Engine ---
                let newEnv = {...prev.environment};
                if (newDay % 7 === 1) { // New week, new forecast
                    const scenarioRoll = Math.random();
                    if (scenarioRoll < 0.2) newEnv.current_scenario = 'drought';
                    else if (scenarioRoll < 0.4) newEnv.current_scenario = 'monsoon';
                    else newEnv.current_scenario = 'normal';
                    newEnv.weekly_forecast = Array.from({length: 7}, () => Math.random());
                    addNotification(`Forecast: A ${newEnv.current_scenario} week ahead.`, true);
                }

                const dailyWeatherRoll = newEnv.weekly_forecast[(newDay-1)%7];
                if (newEnv.current_scenario === 'drought') newEnv.weather = dailyWeatherRoll > 0.9 ? 'rainy' : 'sunny';
                else if (newEnv.current_scenario === 'monsoon') newEnv.weather = dailyWeatherRoll > 0.3 ? 'rainy' : 'cloudy';
                else newEnv.weather = dailyWeatherRoll > 0.7 ? 'rainy' : (dailyWeatherRoll > 0.4 ? 'cloudy' : 'sunny');
                
                if (newEnv.weather === 'rainy' && Math.random() > 0.8) { newEnv.weather = 'lightning'; soundManager.thunder.play(); }

                newEnv.rainfall = (newEnv.weather === 'rainy' || newEnv.weather === 'lightning') ? Math.random() * 20 + 5 : 0;
                newEnv.temperature += (Math.random() - 0.5) * 4;
                if (newEnv.weather === 'sunny') newEnv.temperature += 2; else if (newEnv.weather === 'rainy') newEnv.temperature -= 2;
                newEnv.temperature = Math.max(15, Math.min(42, newEnv.temperature));
                
                newEnv.water_stress_factor = newEnv.temperature > 35 ? 1.5 : 1.0;

                // --- State Updates based on Environment ---
                let totalPlotHealth = 0;
                const newPlots = prev. toplots.map(p => {
                    totalPlotHealth += p.plot_health;
                    let soil_moisture = p.soil_moisture;
                    soil_moisture -= (newEnv.weather === 'sunny' ? 3:1.5) * newEnv.water_stress_factor;
                    soil_moisture += newEnv.rainfall;
                    return {...p, soil_moisture: Math.max(0, Math.min(100, soil_moisture))};
                });

                const newNDVI = ((totalPlotHealth / prev.plots.length) / 100) * 0.8; // simplified NDVI from plot health
                newEnv.ndvi = parseFloat(newNDVI.toFixed(2));
                
                const newLivestock = prev.livestock.map(a => {
                    let health = a.health;
                    health -= (newDay - a.last_fed_day > 1 ? 15 : 5);
                    if (newEnv.ndvi < 0.4) health -= 5; // Poor grazing
                    return {...a, health: Math.max(0, health), is_sick: (health < 20 && !a.is_sick) ? true : a.is_sick};
                });
                
                const newWaterTrough = Math.max(0, prev.farm.water_trough - prev.livestock.length) + newEnv.rainfall;

                // AI Advisor
                let advisor_message = null;
                if(newDay % 1 === 0){ // For demo, show every day
                    if(newEnv.current_scenario === 'drought') advisor_message = "Advisor: Drought ahead! Conserve water and plant hardy crops like Grains.";
                    else if (newWaterTrough < 20 && prev.livestock.length > 0) advisor_message = "Advisor: The water trough is low! Your animals are thirsty.";
                    else if (newEnv.ndvi < 0.4) advisor_message = "Advisor: Pastures are poor (low NDVI). Your animals' health may suffer without extra feed.";
                }

                return { ...prev, advisor_message, plots: newPlots, livestock: newLivestock, environment: newEnv, farm: {...prev.farm, water_trough: newWaterTrough} };
            });
        }, 10000);
        return () => clearInterval(gameTick);
    }, [gameState]);

    const updateQuestProgress = (type, amount) => { 
        setGameState(prev => {
            if (!prev) return null;
            const updatedQuests = prev.quests.map(quest => {
                if (quest.type === type && !quest.completed) {
                    const newCurrent = quest.current + amount;
                    const isCompleted = newCurrent >= quest.required;
                    if (isCompleted && !quest.completed) {
                        setTimeout(() => addNotification(`Quest Complete: ${t(quest.text)}`, true), 0);
                    }
                    return { ...quest, current: newCurrent, completed: isCompleted };
                }
                return quest;
            });
            return { ...prev, quests: updatedQuests };
        });
    };
    
    const startGame = (farmerName, farmName, region) => {
        const regionSettings = REGIONS[region];
        setGameState({ ...INITIAL_GAME_STATE, profile: {...INITIAL_GAME_STATE.profile, name: farmerName}, farm: {...INITIAL_GAME_STATE.farm, name: farmName}, environment: {...INITIAL_GAME_STATE.environment, temperature: regionSettings.temperature}, plots: INITIAL_GAME_STATE.plots.map(p => ({...p, soil_moisture: regionSettings.soil_moisture})) });
    };

    const plantCrop = (plotId, cropId) => {
        const crop = CROPS_DATA.find(c => c.id === cropId);
        if (gameState.profile.money < crop.price) { soundManager.error.play(); addNotification("Not enough money!"); return; }
        setGameState(prev => ({...prev, plots: prev.plots.map(p => p.id === plotId ? { ...p, crop_id: cropId, growth_stage: 0, plot_health: p.plot_health - 5 } : p), profile: { ...prev.profile, money: prev.profile.money - crop.price }}));
        updateQuestProgress('plant', 1); soundManager.plant.play();
    };

    const harvestPlot = (plotId) => {
        const plot = gameState.plots.find(p => p.id === plotId); const crop = CROPS_DATA.find(c => c.id === plot.crop_id);
        const earnings = Math.round(crop.salePrice * (plot.plot_health / 100));
        setGameState(prev => ({...prev, plots: prev.plots.map(p => p.id === plotId ? { ...p, crop_id: null, growth_stage: 0, is_fertilized: false } : p), profile: { ...prev.profile, money: prev.profile.money + earnings }}));
        updateQuestProgress('harvest', 1); soundManager.harvest.play();
    };
    
    const useCompost = (plotId) => {
        if (gameState.farm.compost_stock < 1) { soundManager.error.play(); addNotification("Not enough compost!"); return; }
        setGameState(prev => ({...prev, plots: prev.plots.map(p => p.id === plotId ? {...p, plot_health: Math.min(100, p.plot_health + 20)} : p), farm: {...prev.farm, compost_stock: prev.farm.compost_stock - 1}}));
        soundManager.fertilize.play();
    };
    
    const feedLivestock = (animalId) => {
        const animal = gameState.livestock.find(a => a.id === animalId); const feedCost = LIVESTOCK_DATA[animal.type].feedCost;
        if (gameState.profile.money < feedCost) { soundManager.error.play(); addNotification("Not enough money!"); return; }
        setGameState(prev => ({...prev, livestock: prev.livestock.map(a => a.id === animalId ? { ...a, health: Math.min(100, a.health + 50), last_fed_day: prev.environment.day } : a), profile: { ...prev.profile, money: prev.profile.money - feedCost }}));
        soundManager.feed.play();
    };
    
    const collectFromLivestock = (animalId) => {
        const animal = gameState.livestock.find(a => a.id === animalId);
        if (!gameState.tutorialFlags.livestockExplained) {
            setInfoModalContent({ title: "Sustainable Synergy", icon: GitBranch, content: "Happy animals provide valuable compost! Use compost to improve soil health, increase crop yields, and reduce synthetic fertilizer use." });
            setGameState(prev => ({...prev, tutorialFlags: {...prev.tutorialFlags, livestockExplained: true}}));
        }
        setGameState(prev => ({...prev, farm: {...prev.farm, compost_stock: prev.farm.compost_stock + 1}, livestock: prev.livestock.map(a => a.id === animalId ? {...a, product_ready_day: prev.environment.day + LIVESTOCK_DATA[a.type].productionTime } : a)}));
        updateQuestProgress('collect', 1); soundManager.collect.play();
    };
    
    const buyAnimal = (type) => {
        const data = LIVESTOCK_DATA[type];
        if (gameState.profile.money < data.price) { soundManager.error.play(); addNotification("Not enough money!"); return; }
        const newAnimal = { id: `${type}-${Date.now()}`, name: `${type.charAt(0).toUpperCase() + type.slice(1)} #${gameState.livestock.filter(a=>a.type===type).length+1}`, type, health: 100, last_fed_day: gameState.environment.day, product_ready_day: gameState.environment.day + data.productionTime, is_sick: false };
        setGameState(prev => ({...prev, livestock: [...prev.livestock, newAnimal], profile: {...prev.profile, money: prev.profile.money - data.price}}));
        updateQuestProgress('buy_animal', 1); soundManager.cash.play();
    };

    const sellAnimal = (animalId) => {
        const animal = gameState.livestock.find(a => a.id === animalId);
        if (!animal) return;
        if (!gameState.tutorialFlags.sellExplained) {
            setInfoModalContent({ title: "Farm Economics", icon: DollarSign, content: "Selling animals, or 'culling', is a real practice. It provides immediate income but means losing future resources like milk or eggs. It's a key strategic decision for managing your farm's long-term growth!" });
            setGameState(prev => ({...prev, tutorialFlags: {...prev.tutorialFlags, sellExplained: true}}));
        }
        const sellPrice = LIVESTOCK_DATA[animal.type].sellPrice;
        setGameState(prev => ({...prev, livestock: prev.livestock.filter(a => a.id !== animalId), profile: {...prev.profile, money: prev.profile.money + sellPrice}}));
        addNotification(`Sold ${animal.name} for $${sellPrice}!`);
        soundManager.cash.play();
    };

    const renameAnimal = (animalId, newName) => {
        setGameState(prev => ({...prev, livestock: prev.livestock.map(a => a.id === animalId ? {...a, name: newName} : a)}));
    };

    const cureAnimal = (animalId) => {
        const animal = gameState.livestock.find(a => a.id === animalId); const medicineCost = LIVESTOCK_DATA[animal.type].medicineCost;
        if(gameState.profile.money < medicineCost) { soundManager.error.play(); addNotification("Not enough money for medicine!"); return; }
        setGameState(prev => ({...prev, livestock: prev.livestock.map(a => a.id === animalId ? {...a, is_sick: false, health: 50} : a), profile: {...prev.profile, money: prev.profile.money - medicineCost}}));
        soundManager.notification.play();
    };

    const irrigatePlot = (plotId) => {
        if (gameState.farm.water_level < 10) { soundManager.error.play(); addNotification("Not enough water!"); return; }
        setGameState(prev => ({...prev, plots: prev.plots.map(p => p.id === plotId ? { ...p, soil_moisture: Math.min(100, p.soil_moisture + 40) } : p), farm: { ...prev.farm, water_level: prev.farm.water_level - 10 }}));
        soundManager.water.play();
    };

    const fertilizePlot = (plotId) => {
        if (gameState.farm.fertilizer_stock < 5) { soundManager.error.play(); addNotification("Not enough fertilizer!"); return; }
        setGameState(prev => ({...prev, plots: prev.plots.map(p => p.id === plotId ? { ...p, is_fertilized: true } : p), farm: { ...prev.farm, fertilizer_stock: prev.farm.fertilizer_stock - 5 }}));
        soundManager.fertilize.play();
    };

    const updateSettings = (newSettings) => { setGameState(prev => ({...prev, settings: {...prev.settings, ...newSettings}})); };

    const value = { gameState, onReset, startGame, plantCrop, harvestPlot, buyAnimal, sellAnimal, renameAnimal, updateSettings, infoModalContent, setInfoModalContent, useCompost, feedLivestock, collectFromLivestock, addNotification, irrigatePlot, fertilizePlot, cureAnimal };
    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// --- AUTH PROVIDER ---
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);
const AuthProvider = ({ children }) => { 
    const signOut = () => alert("Signed out!"); 
    return <AuthContext.Provider value={{ signOut }}>{children}</AuthContext.Provider>; 
};

// --- STYLES ---
const GlobalStyles = () => ( <style>{` :root { --primary: #4CAF50; --secondary: #FFC107; --background: #fdfaf5; --text: #333; --wood: #8B4513; } body { font-family: 'Poppins', sans-serif; background-color: #334; } .bg-wood-texture { background-color: var(--wood); background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="24" viewBox="0 0 80 24"><path d="M0 0h80v6H0zm0 12h80v6H0z" fill="%23654321" fill-opacity="0.4"/></svg>'); } .text-shadow { text-shadow: 1px 1px 2px rgba(0,0,0,0.2); } .hud-item { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(8px); border-radius: 12px; padding: 6px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid rgba(255, 255, 255, 0.3); } .rain-drop { position: absolute; bottom: 100%; width: 2px; height: 30px; background: linear-gradient(to top, rgba(255,255,255,0.6), rgba(255,255,255,0.2)); animation: fall linear infinite; } @keyframes fall { to { transform: translateY(100vh); } } .lightning-flash { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: white; opacity: 0; animation: flash 1.5s ease-out; } @keyframes flash { 0%, 100% { opacity: 0; } 5%, 15% { opacity: 0.8; } 10%, 25% { opacity: 0; } 30%, 40% { opacity: 0.6; } 35%, 45% { opacity: 0; } } `}</style> );

// --- SCREENS & MODALS ---
const LanguageSelectionScreen = () => {
    const { setLanguage } = useLanguage();
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-600 to-green-500 flex items-center justify-center">
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="text-center text-white bg-black/20 p-8 rounded-xl">
                <h1 className="text-4xl font-bold mb-8 text-shadow">Select Your Language / Yan Èdè Rẹ</h1>
                <div className="grid grid-cols-2 gap-4">
                    <motion.button whileTap={{scale:0.95}} onClick={() => setLanguage('en')} className="bg-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg">English</motion.button>
                    <motion.button whileTap={{scale:0.95}} onClick={() => setLanguage('yo')} className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg">Yorùbá</motion.button>
                    <motion.button whileTap={{scale:0.95}} onClick={() => setLanguage('ha')} className="bg-red-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg">Hausa</motion.button>
                    <motion.button whileTap={{scale:0.95}} onClick={() => setLanguage('ig')} className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg">Igbo</motion.button>
                </div>
            </motion.div>
        </div>
    );
};
const LoginScreen = ({ onStart, onContinue }) => {
    const { startGame } = useGame();
    const { t } = useLanguage();
    const [step, setStep] = useState(onContinue ? 0 : 1);
    const [farmerName, setFarmerName] = useState('');
    const [farmName, setFarmName] = useState('');
    const [selectedRegion, setSelectedRegion] = useState(null);

    const handleStart = () => { if (farmerName && farmName && selectedRegion) { startGame(farmerName, farmName, selectedRegion); }};

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-600 to-green-500 flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
                {step === 0 && (
                     <motion.div key="step0" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center text-white">
                        <Sprout size={80} className="mx-auto text-yellow-300 drop-shadow-lg" />
                        <h1 className="text-5xl font-bold mt-4 text-shadow">{t('welcome_title')}</h1>
                        <p className="mt-2 text-lg text-yellow-100/80">{t('welcome_subtitle')}</p>
                        <div className="flex flex-col gap-4 mt-8">
                            <motion.button whileTap={{scale:0.95}} onClick={onContinue} className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg">{t('continue_game')}</motion.button>
                            <motion.button whileTap={{scale:0.95}} onClick={() => setStep(1)} className="bg-yellow-400 text-gray-800 font-bold py-3 px-8 rounded-lg shadow-lg">{t('new_game')}</motion.button>
                        </div>
                    </motion.div>
                )}
                {step === 1 && (
                    <motion.div key="step1" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="text-center text-white w-full max-w-sm">
                        <h2 className="text-3xl font-bold text-shadow">{t('create_profile')}</h2>
                        <input type="text" placeholder={t('enter_name')} value={farmerName} onChange={e => setFarmerName(e.target.value)} className="mt-6 w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300"/>
                        <motion.button whileTap={{scale:0.95}} disabled={!farmerName} onClick={() => setStep(2)} className="mt-4 bg-yellow-400 text-gray-800 font-bold py-3 px-8 rounded-lg shadow-lg disabled:opacity-50">{t('next')}</motion.button>
                    </motion.div>
                )}
                 {step === 2 && (
                    <motion.div key="step2" initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}} className="bg-white/90 p-6 rounded-xl shadow-2xl w-full max-w-2xl">
                         <h2 className="text-2xl font-bold text-gray-800 text-center">{t('select_region')}</h2>
                         <p className="text-center text-gray-600 mb-4">{t('region_info')}</p>
                         <div className="aspect-square bg-gray-200 rounded-lg relative my-4"><svg viewBox="0 0 100 100" className="w-full h-full">{Object.keys(REGIONS).map((r, i) => <motion.path key={r} d={["M10 30 L30 10 L50 20 Z", "M35 15 L60 5 L75 25 Z", "M55 22 L80 30 L85 50 Z", "M8 35 L30 60 L50 45 Z", "M35 65 L60 80 L75 55 Z", "M65 85 L90 90 L95 60 Z"][i]} className={`stroke-2 stroke-white cursor-pointer transition-colors ${selectedRegion === r ? 'fill-green-500' : 'fill-green-300 hover:fill-green-400'}`} onClick={() => setSelectedRegion(r)} />)}</svg></div>
                         <button disabled={!selectedRegion} onClick={() => setStep(3)} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg disabled:opacity-50">{t('confirm_region')}: {selectedRegion}</button>
                    </motion.div>
                )}
                 {step === 3 && (
                    <motion.div key="step3" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="text-center text-white w-full max-w-sm">
                        <h2 className="text-3xl font-bold text-shadow">{t('name_your_farm')}</h2>
                        <input type="text" placeholder={t('farm_name_placeholder')} value={farmName} onChange={e => setFarmName(e.target.value)} className="mt-6 w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300"/>
                        <motion.button whileTap={{scale:0.95}} disabled={!farmName} onClick={handleStart} className="mt-4 bg-yellow-400 text-gray-800 font-bold py-3 px-8 rounded-lg shadow-lg disabled:opacity-50">{t('start_farming')}</motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ... ALL other components are defined here ...
// This includes: SettingsModal, InfoModal, FarmBuilding, BarnOverviewModal, AnimalStatusHUD, ActionMenu, Plot, CropSelector, FarmView, WeatherOverlay, ResourceBar, QuestPanel, NasaDataPanel, NotificationArea, and the new educational components.

const SettingsModal = ({ onClose }) => {
    const { gameState, updateSettings, onReset } = useGame();
    const { t, language, setLanguage } = useLanguage();
    if (!gameState) return null;
    const handleReset = () => { if(window.confirm(t('reset_confirm'))) { onReset(); } };
    return <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="bg-wood-texture p-6 border-4 border-yellow-700 rounded-lg text-white w-full max-w-md" onClick={e => e.stopPropagation()} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <h2 className="text-3xl font-bold text-shadow mb-6 text-center">{t('settings')}</h2>
            <div className="space-y-6">
                 <div>
                    <h3 className="font-bold text-lg text-yellow-200 mb-2">{t('language')}</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setLanguage('en')} className={`p-2 rounded ${language === 'en' ? 'bg-yellow-400 text-black' : 'bg-black/20'}`}>English</button>
                        <button onClick={() => setLanguage('yo')} className={`p-2 rounded ${language === 'yo' ? 'bg-yellow-400 text-black' : 'bg-black/20'}`}>Yorùbá</button>
                        <button onClick={() => setLanguage('ha')} className={`p-2 rounded ${language === 'ha' ? 'bg-yellow-400 text-black' : 'bg-black/20'}`}>Hausa</button>
                        <button onClick={() => setLanguage('ig')} className={`p-2 rounded ${language === 'ig' ? 'bg-yellow-400 text-black' : 'bg-black/20'}`}>Igbo</button>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-yellow-200 mb-2">{t('audio')}</h3>
                    <div className="flex items-center justify-between"><label>{t('master_volume')}</label><input type="range" min="0" max="1" step="0.1" value={gameState.settings.masterVolume} onChange={e => updateSettings({ masterVolume: parseFloat(e.target.value) })}/></div>
                    <div className="flex items-center justify-between"><label>{t('sfx_volume')}</label><input type="range" min="0" max="1" step="0.1" value={gameState.settings.sfxVolume} onChange={e => updateSettings({ sfxVolume: parseFloat(e.target.value) })}/></div>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-yellow-200 mb-2">{t('graphics')}</h3>
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg"><label htmlFor="perfMode">{t('performance_mode')}</label><input type="checkbox" id="perfMode" checked={gameState.settings.performanceMode} onChange={e => updateSettings({ performanceMode: e.target.checked })}/></div>
                </div>
                <div className="pt-4 border-t-2 border-yellow-700/50">
                     <h3 className="font-bold text-lg text-yellow-200 mb-2">{t('game_data')}</h3>
                    <button onClick={handleReset} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded">{t('reset_progress')}</button>
                </div>
            </div>
        </motion.div>
    </motion.div>;
};

const InfoModal = ({ content, onClose }) => {
    if (!content) return null;
    const { Icon, title, content: text } = content;
    return <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="bg-wood-texture p-6 border-4 border-yellow-700 rounded-lg text-white w-full max-w-md" onClick={e => e.stopPropagation()} initial={{ scale: 0.8 }} animate={{ scale: 1 }}><div className="flex flex-col items-center text-center"><Icon className="w-16 h-16 mb-4 text-yellow-300" /><h2 className="text-2xl font-bold text-shadow mb-2">{title}</h2><p className="text-yellow-100">{text}</p><button onClick={onClose} className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded">Got it!</button></div></motion.div></motion.div>;
};

const FarmBuilding = ({ type, onClick }) => {
    const visuals = { house: { emoji: '🏡', bg: 'bg-red-300/60', border: 'border-red-500' }, barn: { emoji: '헛', bg: 'bg-yellow-400/60', border: 'border-yellow-600' } };
    const visual = visuals[type];
    return <motion.div className={`w-full h-full ${visual.bg} border-4 ${visual.border} rounded-lg flex items-center justify-center text-5xl shadow-lg cursor-pointer`} whileHover={{ scale: 1.05, rotate: type === 'barn' ? 2 : -2 }} whileTap={{ scale: 0.95 }} onClick={onClick}>{visual.emoji}</motion.div>;
};

const BarnOverviewModal = ({onClose}) => { 
    const { gameState } = useGame();
    if (!gameState) return null;
    return <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="bg-wood-texture p-6 border-4 border-yellow-700 rounded-lg text-white w-full max-w-lg" onClick={e => e.stopPropagation()} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <h2 className="text-3xl font-bold text-shadow mb-4 text-center">Barn Overview</h2>
            <div className="space-y-2">
                {gameState.livestock.map(animal => (
                    <div key={animal.id} className="bg-stone-100/20 p-3 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">{animal.type === 'cow' ? '🐄' : '🐔'}</span>
                            <div>
                                <p className="font-bold text-lg">{animal.name}</p>
                                <div className="w-24 bg-gray-600 rounded-full h-2.5">
                                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${animal.health}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <span className="font-semibold">{animal.health}/100 <span className="text-red-300">♥</span></span>
                    </div>
                ))}
                 {gameState.livestock.length === 0 && <p className="text-center text-yellow-100/70">Your barn is empty. Visit the market!</p>}
            </div>
        </motion.div>
    </motion.div>;
};

const AnimalStatusHUD = ({ animal, onClose }) => {
    const { gameState, feedLivestock, collectFromLivestock, cureAnimal } = useGame();
    if (!gameState) return null;
    const { profile, environment } = gameState;
    const canFeed = profile.money >= LIVESTOCK_DATA[animal.type].feedCost && environment.day > animal.last_fed_day;
    const canCollect = environment.day >= animal.product_ready_day && animal.health > 50 && !animal.is_sick;
    const canCure = profile.money >= LIVESTOCK_DATA[animal.type].medicineCost && animal.is_sick;

    return <motion.div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg z-20 p-2 flex flex-col gap-2" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} onClick={e => e.stopPropagation()}><div className="flex justify-between items-center"><p className="font-bold text-gray-800">{animal.name}</p><button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={16}/></button></div><div className="w-full bg-gray-300 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full" style={{ width: `${animal.health}%` }}></div></div><div className="flex gap-1">
        {animal.is_sick ? (
            <motion.button whileTap={{scale:0.95}} onClick={() => cureAnimal(animal.id)} disabled={!canCure} className="flex-1 bg-purple-500 text-white text-xs rounded p-1 disabled:bg-gray-400">Cure (${LIVESTOCK_DATA[animal.type].medicineCost})</motion.button>
        ) : (
            <>
                <motion.button whileTap={{scale:0.95}} onClick={() => feedLivestock(animal.id)} disabled={!canFeed} className="flex-1 bg-green-500 text-white text-xs rounded p-1 disabled:bg-gray-400">{environment.day > animal.last_fed_day ? "Feed" : "Fed"}</motion.button>
                <motion.button whileTap={{scale:0.95}} onClick={() => collectFromLivestock(animal.id)} disabled={!canCollect} className="flex-1 bg-blue-500 text-white text-xs rounded p-1 disabled:bg-gray-400">{canCollect ? "Collect" : "Wait"}</motion.button>
            </>
        )}
    </div></motion.div>;
};

const ActionMenu = ({ plot, onClose }) => {
    const { gameState, harvestPlot, irrigatePlot, fertilizePlot, useCompost } = useGame();
    if (!gameState) return null;
    const { farm } = gameState;
    const crop = CROPS_DATA.find(c => c.id === plot.crop_id);
    const canHarvest = crop && plot.growth_stage >= crop.growthTime;
    const actions = [ ...(canHarvest ? [{ id: 'harvest', Icon: CheckCircle, handler: () => harvestPlot(plot.id), enabled: true, color: 'bg-green-500' }] : []), ...(!canHarvest && crop ? [{ id: 'irrigate', Icon: Droplets, handler: () => irrigatePlot(plot.id), enabled: farm.water_level >= 10, color: 'bg-blue-500' }, { id: 'fertilize', Icon: Zap, handler: () => fertilizePlot(plot.id), enabled: farm.fertilizer_stock >= 5 && !plot.is_fertilized, color: 'bg-yellow-500' }, { id: 'compost', Icon: GitBranch, handler: () => useCompost(plot.id), enabled: farm.compost_stock >= 1 && plot.plot_health < 100, color: 'bg-green-800' }] : []) ];
    return <motion.div className="absolute -top-14 left-1/2 -translate-x-1/2 w-auto h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center p-2 space-x-2 z-20" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} onClick={e => e.stopPropagation()}>{actions.map(({ id, Icon, handler, enabled, color }, i) => <motion.button key={id} onClick={handler} disabled={!enabled} className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-transform hover:!scale-110 disabled:bg-gray-400 ${color}`} initial={{scale:0}} animate={{scale:1, transition:{delay:i*0.1}}}><Icon className="w-5 h-5" /></motion.button>)}<motion.button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300" initial={{scale:0}} animate={{scale:1, transition:{delay:actions.length*0.1}}}><X className="w-5 h-5 text-gray-700" /></motion.button></motion.div>;
};

const Plot = ({ plot, isSelected, onClick, onActionClose }) => {
    const crop = plot.crop_id ? CROPS_DATA.find(c => c.id === plot.crop_id) : null;
    const getCropVisual = () => {
        if (!crop) return null;
        const progress = Math.min(1, plot.growth_stage / crop.growthTime); let stageIcon = '🌱';
        if (progress >= 1) stageIcon = crop.icon; else if (progress >= 0.5) stageIcon = '🌿';
        const scale = 0.4 + (progress * 0.6);
        return <motion.div key={plot.id + plot.growth_stage} initial={{ scale: 0 }} animate={{ scale: scale }} className="text-5xl drop-shadow-lg" title={`${Math.round(progress * 100)}% Grown`}>{stageIcon}</motion.div>;
    };
    return <motion.div className="relative w-full h-full cursor-pointer" whileHover={{ scale: 1.05, zIndex: 10 }} onClick={onClick}><div className={`w-full h-full rounded-lg shadow-inner transition-colors duration-500 border-4 border-yellow-800/50`} style={{backgroundColor: `rgba(139, 69, 19, ${0.4 + plot.soil_moisture/250})`}}></div><div className="absolute inset-0 flex items-center justify-center">{plot.is_fertilized && <div className="absolute inset-0 fertilized-sparkle" />}{crop ? getCropVisual() : <span className="font-bold text-3xl text-yellow-200/20">+</span>}</div>{plot.soil_moisture < 30 && crop && <motion.div className="absolute top-1 left-1 bg-red-500 text-white p-1 rounded-full shadow" title="Low soil moisture!"><AlertTriangle className="w-3 h-3" /></motion.div>}<AnimatePresence>{isSelected && crop && <ActionMenu plot={plot} onClose={onActionClose} />}</AnimatePresence></motion.div>;
};

const CropSelector = ({ plotId, onClose }) => {
    const { gameState, plantCrop } = useGame();
    if (!gameState) return null;
    return <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.div className="bg-wood-texture p-4 border-4 border-yellow-700 rounded-lg text-white" onClick={e => e.stopPropagation()} initial={{scale:0.8}} animate={{scale:1}}><h2 className="text-2xl font-bold text-shadow mb-4 text-center">Select a Crop</h2><div className="grid grid-cols-4 gap-2">{CROPS_DATA.map(crop => { const canAfford = gameState.profile.money >= crop.price; return <motion.button key={crop.id} whileTap={{scale:0.95}} onClick={() => { if(canAfford) plantCrop(plotId, crop.id); onClose(); }} disabled={!canAfford} className={`p-3 text-center bg-stone-100/90 text-gray-800 rounded-lg border-2 border-yellow-800/50 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed`}><span className="text-3xl">{crop.icon}</span><p className="font-semibold text-sm">{crop.name}</p><p className={`font-bold text-sm ${canAfford ? 'text-green-600' : 'text-red-600'}`}>${crop.price}</p></motion.button>})}</div></motion.div></motion.div>;
};


const FarmView = () => {
    const { gameState, addNotification } = useGame();
    if (!gameState) return null;
    const { plots, livestock, environment } = gameState;
    const [selectedPlotId, setSelectedPlotId] = useState(null);
    const [selectedAnimalId, setSelectedAnimalId] = useState(null);
    const [isCropSelectorOpen, setCropSelectorOpen] = useState(false);
    const [isBarnOpen, setBarnOpen] = useState(false);

    const handlePlotClick = (plotId) => {
        soundManager.click.play(); setSelectedAnimalId(null); setSelectedPlotId(plotId === selectedPlotId ? null : plotId);
        const plot = plots.find((p) => p.id === plotId);
        if (plot && !plot.crop_id) { setCropSelectorOpen(true); }
    };
    
    const handleAnimalClick = (animalId) => {
        soundManager.click.play(); setSelectedPlotId(null); setSelectedAnimalId(animalId === selectedAnimalId ? null : animalId);
    }

    return (
        <>
        <div className="relative w-full max-w-7xl mx-auto aspect-[16/9] bg-gradient-to-b from-sky-400 to-green-500 rounded-2xl shadow-2xl p-4 border-8 border-yellow-800/80 overflow-hidden">
            <WeatherOverlay />
            <div className="grid grid-cols-6 grid-rows-4 gap-4 w-full h-full relative z-10">
                <div className="row-span-2"><FarmBuilding type="house" onClick={() => addNotification(`Welcome home, ${gameState.profile.name}!`, true)} /></div>
                <div className="col-start-6"><FarmBuilding type="barn" onClick={() => setBarnOpen(true)} /></div>
                <div className="col-span-2 row-span-2 col-start-5 row-start-2 bg-green-400/50 rounded-lg p-2 flex flex-wrap gap-2 items-start justify-center overflow-hidden border-4 border-dashed border-yellow-800/40">
                    {livestock.map(animal => {
                        const canCollect = environment.day >= animal.product_ready_day && animal.health > 50 && !animal.is_sick;
                        const isSad = animal.health < 40;
                        return <motion.div key={animal.id} className="relative cursor-pointer" onClick={() => handleAnimalClick(animal.id)} whileHover={{scale: 1.2}}><motion.span title={animal.name} className="text-3xl" animate={{rotate: [0, isSad ? 2 : -2, 0]}} transition={{repeat: Infinity, duration: isSad ? 0.5: 2}}>{animal.type === 'cow' ? '🐄' : '🐔'}</motion.span><AnimatePresence>{canCollect && <motion.div initial={{y:5, opacity:0}} animate={{y:0, opacity:1}} exit={{opacity:0}} className="absolute -top-2 -right-2 text-xl">{LIVESTOCK_DATA[animal.type].product}</motion.div>}{isSad && !animal.is_sick && <motion.div initial={{y:5, opacity:0}} animate={{y:0, opacity:1}} exit={{opacity:0}} className="absolute -top-2 -right-2 text-red-500"><HeartCrack size={16}/></motion.div>}{animal.is_sick && <motion.div initial={{y:5, opacity:0}} animate={{y:0, opacity:1}} exit={{opacity:0}} className="absolute -top-2 -right-2 text-purple-500">🤒</motion.div>}</AnimatePresence>{selectedAnimalId === animal.id && <AnimalStatusHUD animal={animal} onClose={() => setSelectedAnimalId(null)}/>}</motion.div>})}
                </div>
                {plots.map((plot, index) => <div key={plot.id} className={`col-start-${(index % 4) + 2} row-start-${Math.floor(index / 4) + 2}`}><Plot plot={plot} isSelected={selectedPlotId === plot.id} onClick={() => handlePlotClick(plot.id)} onActionClose={() => setSelectedPlotId(null)} /></div>)}
            </div>
        </div>
        <AnimatePresence>{isCropSelectorOpen && <CropSelector plotId={selectedPlotId} onClose={() => setCropSelectorOpen(false)} />}</AnimatePresence>
        <AnimatePresence>{isBarnOpen && <BarnOverviewModal onClose={() => setBarnOpen(false)} />}</AnimatePresence>
        </>
    );
};
const WeatherOverlay = () => {
    const { gameState } = useGame();
    if(!gameState || gameState.settings.performanceMode) return null;
    const { environment: {weather} } = gameState;
    return <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        <AnimatePresence>{weather === 'sunny' && <motion.div key="sun" initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.5}} className="absolute top-4 left-4 text-yellow-300"><motion.div animate={{rotate: 360}} transition={{repeat: Infinity, duration: 20, ease: 'linear'}}><Sun size={64}/></motion.div></motion.div>}</AnimatePresence>
        {weather === 'cloudy' && Array.from({length: 3}).map((_, i) => <motion.div key={i} className="absolute text-white/70" style={{top: `${10+i*20}%`, scale: 1 + i*0.2}} animate={{x: ['-100%', '110%']}} transition={{repeat: Infinity, duration: 30 + i*10, ease: 'linear', delay: i*5}}><Cloud size={80 + i * 20}/></motion.div>)}
        {(weather === 'rainy' || weather === 'lightning') && Array.from({length: 70}).map((_, i) => <div key={i} className="rain-drop" style={{ left: `${Math.random()*100}%`, animationDuration: `${0.5 + Math.random()*0.5}s`, animationDelay: `${Math.random()*2}s`}}/>)}
        <AnimatePresence>{weather === 'lightning' && <motion.div key="flash" className="lightning-flash" />}</AnimatePresence>
    </div>;
};
const ResourceBar = () => {
    const { gameState } = useGame();
    if(!gameState) return null;
    const { profile, farm } = gameState;
    const resources = [ { Icon: DollarSign, value: profile.money, label: 'Money', color: 'text-yellow-600' }, { Icon: Droplets, value: farm.water_level, label: 'Water', color: 'text-blue-500' }, { Icon: Zap, value: farm.fertilizer_stock, label: 'Fertilizer', color: 'text-orange-500' }, { Icon: GitBranch, value: farm.compost_stock, label: 'Compost', color: 'text-green-800' } ];
    return <div className="hidden md:flex items-center space-x-2 bg-wood-texture border-4 border-yellow-700/80 rounded-lg p-1 shadow-lg">{resources.map(({ Icon, value, label, color }, index) => <motion.div key={label} className="hud-item flex items-center gap-1.5" title={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }}><Icon className={`w-5 h-5 ${color}`} /><motion.span layout className={`font-bold text-gray-800`}>{value}</motion.span></motion.div>)}</div>;
};
const QuestPanel = ({...props}) => {
    const { gameState } = useGame();
    const { t } = useLanguage();
    if(!gameState) return null;
    const { quests } = gameState;
    return <motion.div className="fixed top-24 right-4 bg-yellow-100/80 backdrop-blur-md p-4 rounded-xl border-2 border-yellow-300 shadow-xl w-64 z-30" {...props}><h3 className="font-bold text-yellow-900 flex items-center mb-2 text-shadow"><Award className="w-5 h-5 mr-2" /> {t('quests')}</h3><ul className="space-y-1.5 text-sm text-gray-800">{quests.map(quest => <li key={quest.id} className={`flex items-center transition-all ${quest.completed ? 'line-through text-gray-500 opacity-70' : ''}`}>{quest.completed ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Target className="w-4 h-4 mr-2 text-gray-500" />}<span>{t(quest.text)} ({Math.min(quest.current, quest.required)}/{quest.required})</span></li>)}</ul></motion.div>;
};
const NasaDataPanel = () => {
    const { gameState } = useGame();
    if(!gameState) return null;
    const { environment } = gameState;
    const { t } = useLanguage();
    const dataPoints = [ { Icon: Thermometer, value: `${environment.temperature.toFixed(1)}°C`, label: 'Temperature', color: 'text-red-500' }, { Icon: Leaf, value: `${environment.ndvi.toFixed(2)}`, label: 'Vegetation Health', color: 'text-green-500' }, ];
    return <motion.div className="fixed bottom-4 left-4 z-30" initial={{ x: -200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, type: 'spring' }}><div className="hud-item flex flex-col gap-2 p-3"><h3 className="font-bold text-gray-700 text-sm mb-1 text-center">NASA Earth Data</h3>{dataPoints.map(point => <div key={point.label} className="flex items-center gap-2 text-sm" title={t(point.label)}><point.Icon className={`w-5 h-5 ${point.color}`} /><span className="font-bold text-gray-800 w-16">{point.value}</span></div>)}</div></motion.div>;
};
const NotificationArea = () => {
    const { gameState } = useGame();
    if(!gameState) return null;
    const { notifications } = gameState;
    return <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3"><AnimatePresence>{notifications.map(note => <motion.div key={note.id} className={`font-semibold px-5 py-2.5 rounded-full shadow-2xl text-shadow text-white ${note.isImportant ? 'bg-gradient-to-r from-purple-500 to-indigo-600 border-2 border-purple-300' : 'bg-gradient-to-r from-green-500 to-teal-600 border-2 border-green-300'}`} initial={{ opacity: 0, y: -50, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.8 }} transition={{type: 'spring', stiffness: 200, damping: 15}}>{note.message}</motion.div>)}</AnimatePresence></div>;
};

const AcademyModal = ({ onClose }) => {
    const { t } = useLanguage();
    const [view, setView] = useState('main'); // 'main', 'soil', 'weather', 'tutorial'

    const renderContent = () => {
        switch(view) {
            case 'soil': return <Article title={t('soil_title')} content={t('soil_content')} onBack={() => setView('main')} />;
            case 'weather': return <Article title={t('weather_title')} content={t('weather_content')} onBack={() => setView('main')} />;
            case 'tutorial': return <Tutorial onComplete={() => setView('main')} />;
            default: return (
                <>
                    <motion.button whileTap={{scale:0.95}} onClick={() => setView('tutorial')} className="w-full text-left p-4 bg-green-600 rounded-lg text-white flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg">{t('tutorial_title')}</h3>
                            <p className="text-sm opacity-80">Learn the basics of playing FarmSight.</p>
                        </div>
                        <ArrowRight />
                    </motion.button>
                    <motion.button whileTap={{scale:0.95}} onClick={() => setView('soil')} className="w-full text-left p-4 bg-yellow-600 rounded-lg text-white">{t('learn_soil')}</motion.button>
                    <motion.button whileTap={{scale:0.95}} onClick={() => setView('weather')} className="w-full text-left p-4 bg-blue-600 rounded-lg text-white">{t('learn_weather')}</motion.button>
                </>
            );
        }
    }

    return (
         <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-wood-texture p-6 border-4 border-yellow-700 rounded-lg text-white w-full max-w-2xl" onClick={e => e.stopPropagation()} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-shadow">{t('academy')}</h2>
                    <button onClick={onClose}><X /></button>
                </div>
                <div className="space-y-4">{renderContent()}</div>
            </motion.div>
        </motion.div>
    );
};

const Article = ({ title, content, onBack }) => (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}>
        <button onClick={onBack} className="mb-4 text-yellow-300">&larr; Back to Academy</button>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-yellow-100/90 whitespace-pre-line">{content}</p>
    </motion.div>
);

const Tutorial = ({ onComplete }) => {
    // Tutorial logic would be implemented here, guiding the user through steps.
    // This is a placeholder to show the structure.
    const { t } = useLanguage();
    return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <h3 className="text-2xl font-bold mb-2">{t('tutorial_title')}</h3>
            <p className="p-4 bg-black/20 rounded-lg">{t('tutorial_step_1')}</p>
            <button onClick={onComplete} className="mt-4 bg-green-600 p-2 rounded">Finish Tutorial</button>
        </motion.div>
    )
};

const DataLabModal = ({ onClose }) => {
    const { gameState } = useGame();
    const { t } = useLanguage();
    if (!gameState) return null;
    const { environment } = gameState;
    return (
        <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-wood-texture p-6 border-4 border-yellow-700 rounded-lg text-white w-full max-w-2xl" onClick={e => e.stopPropagation()} initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-shadow">{t('data_lab')}</h2>
                    <button onClick={onClose}><X /></button>
                </div>
                <div className="space-y-4 text-black">
                    <div className="bg-white/80 p-4 rounded-lg">
                        <h3 className="font-bold flex items-center">{t('sm_title')} <Info size={14} className="ml-2" title={t('sm_info')}/></h3>
                        <p>Current Average: { (gameState.plots.reduce((a, p) => a + p.soil_moisture, 0) / gameState.plots.length).toFixed(1) }%</p>
                    </div>
                     <div className="bg-white/80 p-4 rounded-lg">
                        <h3 className="font-bold flex items-center">{t('gpm_title')} <Info size={14} className="ml-2" title={t('gpm_info')}/></h3>
                        <p>Scenario: {environment.current_scenario}</p>
                    </div>
                     <div className="bg-white/80 p-4 rounded-lg">
                        <h3 className="font-bold flex items-center">{t('ndvi_title')} <Info size={14} className="ml-2" title={t('ndvi_info')}/></h3>
                        <p>Farm Health Index: {environment.ndvi}</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const AIAdvisorPopup = () => {
    const { gameState } = useGame();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if(gameState?.advisor_message) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [gameState?.advisor_message, gameState?.environment.day]);
    
    if(!gameState?.advisor_message || !visible) return null;

    return (
        <AnimatePresence>
            <motion.div 
                className="fixed bottom-4 right-4 z-40 bg-blue-900/80 text-white p-4 rounded-lg shadow-lg max-w-sm border-2 border-blue-400"
                initial={{opacity:0, x: 100}}
                animate={{opacity:1, x: 0}}
                exit={{opacity:0, x: 100}}
            >
                <h3 className="font-bold flex items-center gap-2"><BrainCircuit /> {useLanguage().t('ai_advisor')}</h3>
                <p className="text-sm mt-2">{gameState.advisor_message}</p>
            </motion.div>
        </AnimatePresence>
    )
}

const Dashboard = () => {
    const { gameState, infoModalContent, setInfoModalContent } = useGame();
    const { signOut } = useAuth();
    const { t } = useLanguage();
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isAcademyOpen, setAcademyOpen] = useState(false);
    const [isDataLabOpen, setDataLabOpen] = useState(false);
    if (!gameState) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-600 to-green-500 flex flex-col overflow-hidden font-sans">
            <header className="bg-white/90 backdrop-blur-sm border-b-4 border-yellow-800/50 sticky top-0 z-40 shadow-lg">
                <div className="max-w-7xl mx-auto px-4"><div className="flex items-center justify-between h-16"><div className="flex items-center gap-3"><Sprout className="w-8 h-8 text-green-600" /><div><h1 className="text-2xl font-bold text-gray-900 text-shadow">FarmSight</h1><p className="text-xs text-gray-600 font-semibold">{gameState.farm.name} - {t('day')} {gameState.environment.day}</p></div></div><div className="flex items-center space-x-2">
                    <ResourceBar />
                    <motion.button whileTap={{scale:0.9}} onClick={() => setDataLabOpen(true)} className="p-2 rounded-lg bg-indigo-500/80 hover:bg-indigo-600/90 text-white shadow-md" title="Data Lab"><BarChart3 className="w-5 h-5" /></motion.button>
                    <motion.button whileTap={{scale:0.9}} onClick={() => setAcademyOpen(true)} className="p-2 rounded-lg bg-blue-500/80 hover:bg-blue-600/90 text-white shadow-md"><BookOpen className="w-5 h-5" /></motion.button>
                    <motion.button whileTap={{scale:0.9}} onClick={() => setSettingsOpen(true)} className="p-2 rounded-lg bg-gray-500/80 hover:bg-gray-600/90 text-white shadow-md"><Settings className="w-5 h-5" /></motion.button>
                    <motion.button whileTap={{scale:0.9}} onClick={signOut} className="p-2 rounded-lg bg-red-500/80 hover:bg-red-600/90 text-white shadow-md"><LogOut className="w-5 h-5" /></motion.button>
                </div></div></div>
            </header>
            <main className="relative flex-1 flex items-center justify-center p-2 md:p-4">
                <AIAdvisorPopup />
                <FarmView />
                <QuestPanel />
                <NasaDataPanel />
                <NotificationArea />
                <AnimatePresence>
                    {infoModalContent && <InfoModal content={infoModalContent} onClose={() => setInfoModalContent(null)} />}
                    {isSettingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
                    {isAcademyOpen && <AcademyModal onClose={() => setAcademyOpen(false)} />}
                    {isDataLabOpen && <DataLabModal onClose={() => setDataLabOpen(false)} />}
                </AnimatePresence>
            </main>
        </div>
    );
};

// --- APP ROOT & ENTRY ---
const App = () => {
    const [savedState, setSavedState] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('farmSightSave');
            if (saved) { setSavedState(JSON.parse(saved)); }
        } catch (error) { console.error("Failed to load game state:", error); }
        setIsLoading(false);
    }, []);

    const handleSave = (state) => { try { if(state) localStorage.setItem('farmSightSave', JSON.stringify(state)); } catch (error) { console.error("Failed to save game state:", error); }};
    const handleReset = () => { localStorage.removeItem('farmSightSave'); localStorage.removeItem('farmSightLang'); window.location.reload(); };

    if (isLoading) return <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center">Loading Farm...</div>;

    return (
        <LanguageProvider>
            <AuthProvider>
                <GameProvider savedState={savedState} onSave={handleSave} onReset={handleReset}>
                    <GlobalStyles />
                    <GameEntry />
                </GameProvider>
            </AuthProvider>
        </LanguageProvider>
    );
};

const GameEntry = () => {
    const { gameState } = useGame();
    const { language } = useLanguage();

    if (!language) {
        return <LanguageSelectionScreen />;
    }
    
    if (gameState && gameState.farm.name) {
        return <Dashboard />;
    } else {
        const hasSaveData = !!localStorage.getItem('farmSightSave');
        return <LoginScreen onContinue={hasSaveData ? () => window.location.reload() : null} />;
    }
};

export default App;