import React from "react";
import { calculateOverallAccuracy, analyzePronunciationIssues, getPronunciationTips } from "../utils/PhonemeUtils";

interface DemoModeProps {
    onDemoResult: (result: any) => void;
    currentPassage: string;
}

const DemoMode: React.FC<DemoModeProps> = ({ onDemoResult, currentPassage }) => {
    const runDemo = (scenario: string) => {
        if (!currentPassage) return;
        
        let simulatedTranscription = "";
        
        switch (scenario) {
            case "perfect":
                simulatedTranscription = currentPassage;
                break;
            case "r_l_confusion":
                simulatedTranscription = currentPassage.replace(/r/g, "l").replace(/R/g, "L");
                break;
            case "th_issues":
                simulatedTranscription = currentPassage
                    .replace(/th/g, "d")
                    .replace(/Th/g, "D");
                break;
            case "minor_errors":
                simulatedTranscription = currentPassage
                    .replace("revolutionized", "levolutionized")
                    .replace("artificial", "altificial");
                break;
            default:
                return;
        }
        
        // Analyze the simulated pronunciation
        const pronunciationIssues = analyzePronunciationIssues(currentPassage, simulatedTranscription);
        const accuracyScore = calculateOverallAccuracy(currentPassage, simulatedTranscription);
        const tips = getPronunciationTips(pronunciationIssues);
        
        const demoResult = {
            id: Date.now().toString(),
            passageText: currentPassage,
            transcription: simulatedTranscription,
            accuracyScore,
            timestamp: Date.now(),
            mispronunciations: pronunciationIssues,
            pronunciationTips: tips,
        };
        
        onDemoResult(demoResult);
    };
    
    if (!currentPassage) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800">
                    📝 Select a passage first to try the demo!
                </p>
            </div>
        );
    }
    
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="text-lg font-semibold mb-3 text-blue-900">
                🎯 Demo Mode - Try Different Scenarios
            </h4>
            <p className="text-blue-700 text-sm mb-4">
                Test the pronunciation analysis system with different simulated pronunciations:
            </p>
            
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => runDemo("perfect")}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                    ✅ Perfect Pronunciation
                </button>
                
                <button
                    onClick={() => runDemo("r_l_confusion")}
                    className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                    🔄 R/L Confusion
                </button>
                
                <button
                    onClick={() => runDemo("th_issues")}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                    👅 TH Sound Issues
                </button>
                
                <button
                    onClick={() => runDemo("minor_errors")}
                    className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                >
                    ⚠️ Minor Errors
                </button>
            </div>
            
            <p className="text-blue-600 text-xs mt-3">
                💡 This demo shows how the system would analyze different pronunciation patterns.
                In the real app, this would use actual audio recording and Whisper.js transcription.
            </p>
        </div>
    );
};

export default DemoMode;