import React, { useState } from "react";

const PRACTICE_PASSAGES = [
    {
        id: "1",
        title: "Technology in Daily Life",
        text: "Technology has revolutionized the way we communicate and work. From smartphones to artificial intelligence, these innovations continue to shape our modern world.",
        difficulty: "Easy",
    },
    {
        id: "2", 
        title: "The Importance of Reading",
        text: "Reading regularly expands vocabulary and improves comprehension skills. It opens doors to new ideas and perspectives that enrich our understanding of the world.",
        difficulty: "Easy",
    },
    {
        id: "3",
        title: "Environmental Conservation",
        text: "Protecting our environment requires collective action from individuals and governments. Sustainable practices and renewable energy sources are crucial for future generations.",
        difficulty: "Medium",
    },
    {
        id: "4",
        title: "The Art of Communication",
        text: "Effective communication involves both speaking clearly and listening actively. Nonverbal cues often convey more meaning than the words themselves in human interactions.",
        difficulty: "Medium",
    },
    {
        id: "5",
        title: "Scientific Innovation",
        text: "Breakthrough discoveries in medicine and biotechnology continue to extend human lifespan. Research institutions collaborate internationally to accelerate the pace of scientific advancement.",
        difficulty: "Hard",
    },
    {
        id: "6",
        title: "Cultural Heritage",
        text: "Preserving cultural traditions and historical artifacts requires dedicated effort from museums and educational institutions. These treasures provide invaluable insights into humanity's diverse heritage.",
        difficulty: "Hard",
    },
];

interface PracticePassagesProps {
    onPassageSelect: (passage: string) => void;
    selectedPassage: string;
}

const PracticePassages: React.FC<PracticePassagesProps> = ({
    onPassageSelect,
    selectedPassage,
}) => {
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

    const filteredPassages = PRACTICE_PASSAGES.filter(
        (passage) =>
            selectedDifficulty === "All" || passage.difficulty === selectedDifficulty,
    );

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Easy":
                return "bg-green-100 text-green-800";
            case "Medium":
                return "bg-yellow-100 text-yellow-800";
            case "Hard":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4 sm:mb-0">
                    Practice Passages
                </h2>
                
                <div className="flex space-x-2">
                    {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
                        <button
                            key={difficulty}
                            onClick={() => setSelectedDifficulty(difficulty)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                selectedDifficulty === difficulty
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {difficulty}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredPassages.map((passage) => (
                    <div
                        key={passage.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedPassage === passage.text
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => onPassageSelect(passage.text)}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg text-slate-900">
                                {passage.title}
                            </h3>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                    passage.difficulty,
                                )}`}
                            >
                                {passage.difficulty}
                            </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            {passage.text}
                        </p>
                        {selectedPassage === passage.text && (
                            <div className="mt-3 text-sm text-blue-600 font-medium">
                                ✓ Selected for practice
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredPassages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No passages found for the selected difficulty level.
                </div>
            )}
        </div>
    );
};

export default PracticePassages;