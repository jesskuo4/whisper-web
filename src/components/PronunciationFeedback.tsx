import React, { useState } from "react";

interface Mispronunciation {
    word: string;
    expected: string;
    actual: string;
    position: number;
    accuracy?: number;
    type?: string;
}

interface PracticeAttempt {
    id: string;
    passageText: string;
    transcription: string;
    accuracyScore: number;
    timestamp: number;
    mispronunciations: Mispronunciation[];
    pronunciationTips?: string[];
    audioBlob?: Blob;
}

interface PronunciationFeedbackProps {
    attempt: PracticeAttempt;
    onPlayCorrectPronunciation: (text: string) => void;
}

const PronunciationFeedback: React.FC<PronunciationFeedbackProps> = ({
    attempt,
    onPlayCorrectPronunciation,
}) => {
    const [showPhonemeDetails, setShowPhonemeDetails] = useState(false);

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-green-600";
        if (score >= 80) return "text-blue-600";
        if (score >= 70) return "text-yellow-600";
        return "text-red-600";
    };

    const getScoreBackground = (score: number) => {
        if (score >= 90) return "bg-green-100";
        if (score >= 80) return "bg-blue-100";
        if (score >= 70) return "bg-yellow-100";
        return "bg-red-100";
    };

    const renderHighlightedText = () => {
        const expectedWords = attempt.passageText.split(/(\s+)/);
        const actualWords = attempt.transcription.toLowerCase().split(/\s+/);
        const expectedWordsOnly = attempt.passageText.toLowerCase().split(/\s+/);

        return expectedWords.map((segment, index) => {
            // If it's whitespace, return as-is
            if (/^\s+$/.test(segment)) {
                return <span key={index}>{segment}</span>;
            }

            const wordIndex = Math.floor(index / 2); // Account for whitespace segments
            const word = segment.toLowerCase();
            const actualWord = actualWords[wordIndex] || "";

            let className = "px-1 py-0.5 rounded";
            let title = "";

            if (wordIndex < actualWords.length && word === actualWord) {
                className += " bg-green-100 text-green-800";
                title = "Correctly pronounced";
            } else if (wordIndex < actualWords.length) {
                className += " bg-red-100 text-red-800";
                title = `Expected: "${word}", You said: "${actualWord}"`;
            } else {
                className += " bg-yellow-100 text-yellow-800";
                title = "Word not detected in recording";
            }

            return (
                <span key={index} className={className} title={title}>
                    {segment}
                </span>
            );
        });
    };

    const getScoreMessage = (score: number) => {
        if (score >= 90) return "Excellent pronunciation! 🎉";
        if (score >= 80) return "Great job! Minor improvements needed. 👍";
        if (score >= 70) return "Good effort! Keep practicing. 📚";
        return "Needs practice. Don't give up! 💪";
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-slate-900">
                    Pronunciation Feedback
                </h3>
                <div className={`px-4 py-2 rounded-lg ${getScoreBackground(attempt.accuracyScore)}`}>
                    <span className={`text-2xl font-bold ${getScoreColor(attempt.accuracyScore)}`}>
                        {attempt.accuracyScore}%
                    </span>
                </div>
            </div>

            <div className="mb-6">
                <p className={`text-lg font-medium mb-2 ${getScoreColor(attempt.accuracyScore)}`}>
                    {getScoreMessage(attempt.accuracyScore)}
                </p>
            </div>

            {/* Highlighted Text Comparison */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-slate-900">
                    Word-by-Word Analysis
                </h4>
                <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-lg leading-relaxed">
                        {renderHighlightedText()}
                    </div>
                </div>
                <div className="mt-2 text-sm text-slate-600">
                    <span className="inline-block mr-4">
                        <span className="inline-block w-3 h-3 bg-green-100 rounded mr-1"></span>
                        Correct
                    </span>
                    <span className="inline-block mr-4">
                        <span className="inline-block w-3 h-3 bg-red-100 rounded mr-1"></span>
                        Mispronounced
                    </span>
                    <span className="inline-block">
                        <span className="inline-block w-3 h-3 bg-yellow-100 rounded mr-1"></span>
                        Not detected
                    </span>
                </div>
            </div>

            {/* Audio Playback Controls */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-slate-900">
                    Audio Comparison
                </h4>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => onPlayCorrectPronunciation(attempt.passageText)}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 5v10l8-5-8-5z" />
                        </svg>
                        Play Correct Pronunciation
                    </button>
                    
                    {attempt.audioBlob && (
                        <button
                            onClick={() => {
                                if (attempt.audioBlob) {
                                    const audio = new Audio(URL.createObjectURL(attempt.audioBlob));
                                    audio.play();
                                }
                            }}
                            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 5v10l8-5-8-5z" />
                            </svg>
                            Play Your Recording
                        </button>
                    )}
                </div>
            </div>

            {/* Transcription Comparison */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-slate-900">
                    What You Said
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h5 className="font-medium text-slate-700 mb-2">Expected:</h5>
                        <p className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
                            {attempt.passageText}
                        </p>
                    </div>
                    <div>
                        <h5 className="font-medium text-slate-700 mb-2">You said:</h5>
                        <p className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                            {attempt.transcription || "No transcription available"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mispronunciation Details */}
            {attempt.mispronunciations.length > 0 && (
                <div className="mb-6">
                    <button
                        onClick={() => setShowPhonemeDetails(!showPhonemeDetails)}
                        className="flex items-center text-lg font-semibold mb-3 text-slate-900 hover:text-blue-600 transition-colors"
                    >
                        <svg
                            className={`w-5 h-5 mr-2 transition-transform ${
                                showPhonemeDetails ? "rotate-90" : ""
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                        </svg>
                        Pronunciation Details ({attempt.mispronunciations.length} issues)
                    </button>

                    {showPhonemeDetails && (
                        <div className="space-y-3">
                            {attempt.mispronunciations.map((issue, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-red-50 border border-red-200 rounded-lg"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-red-800">
                                            Word: "{issue.expected}"
                                        </span>
                                        <button
                                            onClick={() => onPlayCorrectPronunciation(issue.expected)}
                                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                                        >
                                            Play correct
                                        </button>
                                    </div>
                                    <p className="text-sm text-red-700">
                                        Expected: <span className="font-mono">{issue.expected}</span>
                                        <br />
                                        You said: <span className="font-mono">{issue.actual}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Pronunciation Tips */}
            {attempt.pronunciationTips && attempt.pronunciationTips.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-slate-900">
                        💡 Personalized Tips
                    </h4>
                    <div className="space-y-2">
                        {attempt.pronunciationTips.map((tip, index) => (
                            <div
                                key={index}
                                className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                            >
                                <p className="text-blue-800 text-sm">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {attempt.mispronunciations.length === 0 && attempt.accuracyScore >= 90 && (
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                        Perfect pronunciation! No issues detected. 🎯
                    </p>
                </div>
            )}
        </div>
    );
};

export default PronunciationFeedback;