import React, { useState, useCallback, useMemo } from "react";
import { Transcriber } from "../hooks/useTranscriber";
import PracticePassages from "./PracticePassages";
import AudioRecorder from "./AudioRecorder";
import PronunciationFeedback from "./PronunciationFeedback";
import SessionHistory from "./SessionHistory";
import GameStats from "./GameStats";
import { calculateOverallAccuracy, analyzePronunciationIssues, getPronunciationTips } from "../utils/PhonemeUtils";

interface PracticeAttempt {
    id: string;
    passageText: string;
    transcription: string;
    accuracyScore: number;
    timestamp: number;
    mispronunciations: Array<{
        word: string;
        expected: string;
        actual: string;
        position: number;
        accuracy?: number;
        type?: string;
    }>;
    pronunciationTips?: string[];
    audioBlob?: Blob;
}

interface GameState {
    score: number;
    streak: number;
    totalAttempts: number;
    bestScore: number;
    averageScore: number;
    completedPassages: number;
}

interface PronunciationTrainerProps {
    transcriber: Transcriber;
}

const PronunciationTrainer: React.FC<PronunciationTrainerProps> = ({
    transcriber,
}) => {
    const [currentPassage, setCurrentPassage] = useState<string>("");

    const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);
    const [currentFeedback, setCurrentFeedback] = useState<PracticeAttempt | null>(null);
    const [gameState, setGameState] = useState<GameState>({
        score: 0,
        streak: 0,
        totalAttempts: 0,
        bestScore: 0,
        averageScore: 0,
        completedPassages: 0,
    });

    const updateGameState = useCallback((newAttempt: PracticeAttempt) => {
        setGameState((prev) => {
            const newTotalAttempts = prev.totalAttempts + 1;
            const newTotalScore = prev.averageScore * prev.totalAttempts + newAttempt.accuracyScore;
            const newAverageScore = newTotalScore / newTotalAttempts;
            const newStreak = newAttempt.accuracyScore >= 80 ? prev.streak + 1 : 0;
            const newBestScore = Math.max(prev.bestScore, newAttempt.accuracyScore);

            return {
                score: newAttempt.accuracyScore,
                streak: newStreak,
                totalAttempts: newTotalAttempts,
                bestScore: newBestScore,
                averageScore: Math.round(newAverageScore),
                completedPassages: prev.completedPassages + (newAttempt.accuracyScore >= 70 ? 1 : 0),
            };
        });
    }, []);

    const handlePassageSelect = useCallback((passage: string) => {
        setCurrentPassage(passage);
        setCurrentFeedback(null);
    }, []);

    const handleRecordingComplete = useCallback(
        async (audioBlob: Blob) => {
            if (!currentPassage) return;

            // Convert blob to audio buffer for transcription
            const arrayBuffer = await audioBlob.arrayBuffer();
            const audioContext = new AudioContext();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Start transcription
            transcriber.start(audioBuffer);
        },
        [currentPassage, transcriber],
    );

    // Listen for transcription results
    React.useEffect(() => {
        if (transcriber.output && currentPassage) {
            const transcribedText = transcriber.output.chunks
                ?.map((chunk) => chunk.text)
                .join("")
                .trim() || "";

            // Create new attempt with enhanced phoneme analysis
            const pronunciationIssues = analyzePronunciationIssues(currentPassage, transcribedText);
            const accuracyScore = calculateOverallAccuracy(currentPassage, transcribedText);
            const tips = getPronunciationTips(pronunciationIssues);
            
            const newAttempt: PracticeAttempt = {
                id: Date.now().toString(),
                passageText: currentPassage,
                transcription: transcribedText,
                accuracyScore,
                timestamp: Date.now(),
                mispronunciations: pronunciationIssues,
                pronunciationTips: tips,
            };

            setAttempts((prev) => [newAttempt, ...prev]);
            setCurrentFeedback(newAttempt);
            updateGameState(newAttempt);
        }
    }, [transcriber.output, currentPassage, updateGameState]);



    return (
        <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    US Accent Pronunciation Trainer
                </h1>
                <p className="text-lg text-slate-600">
                    Practice reading passages and get AI-powered pronunciation feedback
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Practice */}
                <div className="lg:col-span-2 space-y-6">
                    <PracticePassages
                        onPassageSelect={handlePassageSelect}
                        selectedPassage={currentPassage}
                    />

                    {currentPassage && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">Record Your Reading</h3>
                            <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                                <p className="text-lg leading-relaxed">{currentPassage}</p>
                            </div>
                            
                            <AudioRecorder
                                onRecordingComplete={handleRecordingComplete}
                            />
                        </div>
                    )}

                    {currentFeedback && (
                        <PronunciationFeedback
                            attempt={currentFeedback}
                            onPlayCorrectPronunciation={(text) => {
                                // Use Web Speech API for correct pronunciation
                                const utterance = new SpeechSynthesisUtterance(text);
                                utterance.lang = "en-US";
                                utterance.rate = 0.8;
                                speechSynthesis.speak(utterance);
                            }}
                        />
                    )}
                </div>

                {/* Right Column - Stats and History */}
                <div className="space-y-6">
                    <GameStats gameState={gameState} />
                    <SessionHistory attempts={attempts.slice(0, 10)} />
                </div>
            </div>
        </div>
    );
};

export default PronunciationTrainer;