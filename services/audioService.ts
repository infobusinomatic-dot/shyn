import { ambientSounds } from '../assets/audioAssets';
import type { Mood } from '../types';

class AmbientSoundService {
    private sounds: Partial<Record<Mood, HTMLAudioElement>> = {};
    private currentMood: Mood | null = null;
    private currentFadeInterval: number | null = null;

    private preloadSounds() {
        if (Object.keys(this.sounds).length > 0) return;
        (Object.keys(ambientSounds) as Mood[]).forEach(mood => {
            if (!this.sounds[mood]) {
                const audio = new Audio(ambientSounds[mood]);
                audio.loop = true;
                audio.volume = 0;
                this.sounds[mood] = audio;
            }
        });
    }

    private fade(element: HTMLAudioElement, targetVolume: number, duration: number = 1500) {
        if (this.currentFadeInterval) {
            clearInterval(this.currentFadeInterval);
        }

        const startVolume = element.volume;
        const stepTime = 50;
        const steps = duration / stepTime;
        const volumeStep = (targetVolume - startVolume) / steps;
        let currentStep = 0;

        return new Promise<void>((resolve) => {
            this.currentFadeInterval = window.setInterval(() => {
                currentStep++;
                const newVolume = startVolume + (volumeStep * currentStep);
                
                if (currentStep >= steps) {
                    element.volume = targetVolume;
                    if (targetVolume === 0) {
                        element.pause();
                    }
                    clearInterval(this.currentFadeInterval!);
                    this.currentFadeInterval = null;
                    resolve();
                    return;
                }
                
                element.volume = newVolume;
            }, stepTime);
        });
    }

    async play(mood: Mood) {
        this.preloadSounds();
        if (this.currentMood === mood) return;

        const oldMood = this.currentMood;
        const oldSound = oldMood ? this.sounds[oldMood] : null;
        
        this.currentMood = mood;
        const newSound = this.sounds[mood];

        if (oldSound) {
           this.fade(oldSound, 0);
        }

        if (newSound) {
            try {
                // User interaction is required for autoplay
                newSound.currentTime = 0;
                await newSound.play();
                this.fade(newSound, 0.4);
            } catch (error) {
                console.warn("Audio playback failed. User interaction might be required.", error);
            }
        }
    }

    async stop() {
        if (this.currentMood && this.sounds[this.currentMood]) {
            await this.fade(this.sounds[this.currentMood]!, 0);
            this.currentMood = null;
        }
    }
    
    cleanup() {
        if (this.currentFadeInterval) {
            clearInterval(this.currentFadeInterval);
        }
        Object.values(this.sounds).forEach(sound => {
            if(sound) {
                sound.pause();
                sound.src = '';
            }
        });
        this.sounds = {};
        this.currentMood = null;
    }
}

export const ambientSoundService = new AmbientSoundService();
