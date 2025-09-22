
import React from 'react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

// FIX: Refactored to a plain function to avoid React.FC type conflicts.
const FeatureCard = ({ title, description, icon: Icon }: FeatureCardProps) => {
    return (
        <div className="p-4 bg-base-800/50 border border-base-700/50 rounded-xl">
             {Icon ? (
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/20 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-semibold text-base-200">{title}</h4>
                        <p className="text-xs text-base-400 mt-1">{description}</p>
                    </div>
                </div>
            ) : (
                <>
                    <h4 className="font-semibold text-base-200">{title}</h4>
                    <p className="text-xs text-base-400 mt-1">{description}</p>
                </>
            )}
        </div>
    );
};

export default FeatureCard;
