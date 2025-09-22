
import React from 'react';

import type { AppearancePreset } from '../types';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

interface PresetItemProps {
    preset: AppearancePreset;
    isLoaded: boolean;
    isDisabled: boolean;
    onLoad: (preset: AppearancePreset) => void;
    onEdit: (preset: AppearancePreset) => void;
    onDelete: (id: number) => void;
}

// FIX: Refactored to a plain function to avoid React.FC type conflicts.
const PresetItem = ({ preset, isLoaded, isDisabled, onLoad, onEdit, onDelete }: PresetItemProps) => {
    return (
        <div className={`flex items-center gap-2 p-2 bg-base-800 rounded-lg hover:bg-base-700/50 transition-all duration-200 ${isLoaded ? 'ring-2 ring-primary/80' : 'ring-0'}`}>
            <img src={preset.imageUrl} className="w-10 h-10 rounded-md object-cover flex-shrink-0 bg-base-900" alt={preset.name} />
            <span className="flex-1 text-sm font-medium text-base-200 truncate" title={preset.name}>{preset.name}</span>
            <button 
                onClick={() => onLoad(preset)} 
                disabled={isDisabled} 
                title="Load Preset" 
                className="px-3 py-1.5 text-xs font-semibold bg-secondary/20 hover:bg-secondary/40 text-secondary-light rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Load
            </button>
            <button 
                onClick={() => onEdit(preset)} 
                disabled={isDisabled} 
                title="Edit Preset" 
                className="p-2 text-base-400 hover:text-secondary-light rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <EditIcon className="w-4 h-4" />
            </button>
            <button 
                onClick={() => onDelete(preset.id)} 
                title="Delete Preset" 
                className="p-2 text-base-400 hover:text-red-400 rounded-md transition disabled:opacity-50"
            >
                <TrashIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export default PresetItem;
