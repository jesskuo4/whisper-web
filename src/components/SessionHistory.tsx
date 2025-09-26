import React from "react";

interface Mispronunciation {
    word: string;
    expected: string;
    actual: string;
    position: number;
}

interface PracticeAttempt {
    id: string;
    passageText: string;
    transcription: string;
    accuracyScore: number;
    timestamp: number;
    mispronunciations: Mispronunciation[];
    audioBlob?: Blob;
}

interface SessionHistoryProps {
    attempts: PracticeAttempt[];
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ attempts }) => {
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-green-600 bg-green-100";
        if (score >= 80) return "text-blue-600 bg-blue-100";
        if (score >= 70) return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };

    const truncateText = (text: string, maxLength: number = 50) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const getScoreEmoji = (score: number) => {
        if (score >= 95) return "🏆";
        if (score >= 90) return "🎯";
        if (score >= 80) return "👍";
        if (score >= 70) return "📚";
        return "💪";
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
                Session History
            </h3>

            {attempts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📝</div>
                    <p>No practice attempts yet.</p>
                    <p className="text-sm">Select a passage and start practicing!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {attempts.map((attempt, index) => (
                        <div
                            key={attempt.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg">
                                        {getScoreEmoji(attempt.accuracyScore)}
                                    </span>
                                    <div className="text-sm text-slate-600">
                                        #{attempts.length - index}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(
                                            attempt.accuracyScore,
                                        )}`}
                                    >
                                        {attempt.accuracyScore}%
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {formatTime(attempt.timestamp)}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-2">
                                <p className="text-sm text-slate-700 font-medium">
                                    Passage:
                                </p>
                                <p className="text-sm text-slate-600">
                                    {truncateText(attempt.passageText)}
                                </p>
                            </div>

                            {attempt.transcription && (
                                <div className="mb-2">
                                    <p className="text-sm text-slate-700 font-medium">
                                        You said:
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {truncateText(attempt.transcription)}
                                    </p>
                                </div>
                            )}

                            {attempt.mispronunciations.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-gray-100">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-red-600 font-medium">
                                            {attempt.mispronunciations.length} pronunciation issue{attempt.mispronunciations.length !== 1 ? 's' : ''}:
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                            {attempt.mispronunciations.slice(0, 3).map((issue, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded"
                                                    title={`Expected: ${issue.expected}, You said: ${issue.actual}`}
                                                >
                                                    {issue.expected}
                                                </span>
                                            ))}
                                            {attempt.mispronunciations.length > 3 && (
                                                <span className="text-xs text-slate-500">
                                                    +{attempt.mispronunciations.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {attempt.mispronunciations.length === 0 && attempt.accuracyScore >= 90 && (
                                <div className="mt-2 pt-2 border-t border-gray-100">
                                    <span className="text-xs text-green-600 font-medium">
                                        ✨ Perfect pronunciation!
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {attempts.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-slate-600">
                        <div className="flex justify-between mb-1">
                            <span>Session Summary:</span>
                            <span>{attempts.length} attempts</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span>Average Score:</span>
                            <span className="font-medium">
                                {Math.round(
                                    attempts.reduce((sum, attempt) => sum + attempt.accuracyScore, 0) / 
                                    attempts.length
                                )}%
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Best Score:</span>
                            <span className="font-medium text-green-600">
                                {Math.max(...attempts.map(a => a.accuracyScore))}%
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {attempts.length >= 10 && (
                <div className="mt-4 text-center">
                    <p className="text-xs text-slate-500">
                        Showing last 10 attempts
                    </p>
                </div>
            )}
        </div>
    );
};

export default SessionHistory;