import React from "react";

interface GameState {
    score: number;
    streak: number;
    totalAttempts: number;
    bestScore: number;
    averageScore: number;
    completedPassages: number;
}

interface GameStatsProps {
    gameState: GameState;
}

const GameStats: React.FC<GameStatsProps> = ({ gameState }) => {
    const progressPercentage = Math.min((gameState.completedPassages / 5) * 100, 100);

    const getStreakEmoji = (streak: number) => {
        if (streak >= 5) return "🔥";
        if (streak >= 3) return "⭐";
        if (streak >= 1) return "✨";
        return "💪";
    };

    const stats = [
        {
            label: "Current Score",
            value: `${gameState.score}%`,
            color: gameState.score >= 80 ? "text-green-600" : "text-blue-600",
            background: gameState.score >= 80 ? "bg-green-100" : "bg-blue-100",
        },
        {
            label: "Best Score",
            value: `${gameState.bestScore}%`,
            color: "text-purple-600",
            background: "bg-purple-100",
        },
        {
            label: "Average",
            value: `${gameState.averageScore}%`,
            color: "text-orange-600",
            background: "bg-orange-100",
        },
        {
            label: "Total Attempts",
            value: gameState.totalAttempts.toString(),
            color: "text-gray-600",
            background: "bg-gray-100",
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
                Session Progress
            </h3>

            {/* Streak Display */}
            <div className="mb-6 text-center">
                <div className="text-3xl mb-2">{getStreakEmoji(gameState.streak)}</div>
                <div className="text-2xl font-bold text-slate-900">
                    {gameState.streak} Streak
                </div>
                <p className="text-sm text-slate-600">
                    {gameState.streak > 0
                        ? "Keep it up! You're on fire!"
                        : "Get 80%+ accuracy to start a streak"}
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">
                        Session Goal
                    </span>
                    <span className="text-sm text-slate-600">
                        {gameState.completedPassages}/5 passages
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                {progressPercentage === 100 && (
                    <p className="text-sm text-green-600 font-medium mt-2 text-center">
                        🎉 Session Complete! Great job!
                    </p>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg ${stat.background}`}
                    >
                        <div className="text-center">
                            <div className={`text-lg font-bold ${stat.color}`}>
                                {stat.value}
                            </div>
                            <div className="text-xs text-slate-600 mt-1">
                                {stat.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Achievements */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">
                    Session Achievements
                </h4>
                <div className="space-y-2">
                    {gameState.bestScore >= 95 && (
                        <div className="flex items-center text-sm text-yellow-600">
                            <span className="mr-2">🏆</span>
                            Near Perfect Score!
                        </div>
                    )}
                    {gameState.streak >= 3 && (
                        <div className="flex items-center text-sm text-orange-600">
                            <span className="mr-2">🔥</span>
                            Hot Streak!
                        </div>
                    )}
                    {gameState.totalAttempts >= 5 && (
                        <div className="flex items-center text-sm text-blue-600">
                            <span className="mr-2">📚</span>
                            Dedicated Learner
                        </div>
                    )}
                    {gameState.averageScore >= 85 && gameState.totalAttempts >= 3 && (
                        <div className="flex items-center text-sm text-green-600">
                            <span className="mr-2">⭐</span>
                            Consistent Excellence
                        </div>
                    )}
                    {gameState.completedPassages >= 5 && (
                        <div className="flex items-center text-sm text-purple-600">
                            <span className="mr-2">🎯</span>
                            Goal Achieved!
                        </div>
                    )}
                </div>

                {gameState.totalAttempts === 0 && (
                    <p className="text-sm text-slate-500 italic">
                        Complete your first practice to unlock achievements!
                    </p>
                )}
            </div>

            {/* Tips */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">
                    💡 Tips for Better Pronunciation
                </h4>
                <ul className="text-xs text-slate-600 space-y-1">
                    <li>• Speak clearly and at a moderate pace</li>
                    <li>• Practice problematic words separately</li>
                    <li>• Listen to the correct pronunciation examples</li>
                    <li>• Use headphones for better audio quality</li>
                </ul>
            </div>
        </div>
    );
};

export default GameStats;