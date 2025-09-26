/**
 * Phoneme utilities for pronunciation analysis
 * Uses simple phoneme mapping since full CMU dictionary integration is complex
 */

// Simple phoneme patterns for common English sounds
const PHONEME_PATTERNS: Record<string, string[]> = {
    // Vowels
    'a': ['æ', 'eɪ', 'ɑ', 'ə'], // cat, cake, car, about
    'e': ['ɛ', 'i', 'ə'], // bed, be, the
    'i': ['ɪ', 'aɪ', 'i'], // bit, bite, bee
    'o': ['ɑ', 'oʊ', 'ɔ'], // hot, coat, caught
    'u': ['ʌ', 'u', 'ʊ'], // but, boot, book
    
    // Common consonant clusters
    'th': ['θ', 'ð'], // think, this
    'sh': ['ʃ'], // ship
    'ch': ['tʃ'], // chip
    'ng': ['ŋ'], // sing
    'ph': ['f'], // phone
    'gh': ['f', 'g', ''], // laugh, ghost, though
    
    // Individual consonants
    'b': ['b'], 'c': ['k', 's'], 'd': ['d'], 'f': ['f'], 'g': ['g', 'dʒ'],
    'h': ['h'], 'j': ['dʒ'], 'k': ['k'], 'l': ['l'], 'm': ['m'],
    'n': ['n'], 'p': ['p'], 'q': ['k'], 'r': ['r'], 's': ['s', 'z'],
    't': ['t'], 'v': ['v'], 'w': ['w'], 'x': ['ks'], 'y': ['j', 'ɪ'], 'z': ['z']
};

// Common pronunciation difficulties for learners
const DIFFICULTY_PATTERNS = {
    // R vs L confusion
    'r_l_confusion': {
        'r': 'l', 'l': 'r',
        'red': 'led', 'led': 'red',
        'right': 'light', 'light': 'right'
    },
    
    // TH sounds
    'th_substitution': {
        'th': ['f', 'v', 'd', 't', 's', 'z'],
        'think': ['fink', 'tink', 'sink'],
        'this': ['dis', 'vis']
    },
    
    // Vowel confusion
    'vowel_confusion': {
        'sheep': 'ship', 'ship': 'sheep',
        'beach': 'bitch', 'bitch': 'beach',
        'full': 'fool', 'fool': 'full'
    }
};

/**
 * Simple phoneme similarity score between two words
 */
export function calculatePhonemeAccuracy(expected: string, actual: string): number {
    if (!expected || !actual) return 0;
    
    const expectedLower = expected.toLowerCase().trim();
    const actualLower = actual.toLowerCase().trim();
    
    // Exact match
    if (expectedLower === actualLower) return 100;
    
    // Check for common substitutions
    if (isCommonSubstitution(expectedLower, actualLower)) {
        return 75; // Partial credit for common pronunciation errors
    }
    
    // Basic similarity based on character overlap
    const similarity = calculateStringSimilarity(expectedLower, actualLower);
    return Math.round(similarity * 100);
}

/**
 * Check if the actual pronunciation is a common substitution for expected
 */
function isCommonSubstitution(expected: string, actual: string): boolean {
    // Check R/L confusion
    const rlConfusion = DIFFICULTY_PATTERNS.r_l_confusion as Record<string, string>;
    if (rlConfusion[expected] === actual) {
        return true;
    }
    
    // Check TH substitutions
    for (const [key, substitutions] of Object.entries(DIFFICULTY_PATTERNS.th_substitution)) {
        if (expected.includes(key) && Array.isArray(substitutions)) {
            for (const sub of substitutions) {
                if (actual.includes(sub)) return true;
            }
        }
    }
    
    // Check vowel confusion
    const vowelConfusion = DIFFICULTY_PATTERNS.vowel_confusion as Record<string, string>;
    if (vowelConfusion[expected] === actual) {
        return true;
    }
    
    return false;
}

/**
 * Calculate string similarity using Levenshtein distance
 */
function calculateStringSimilarity(str1: string, str2: string): number {
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;
    
    if (len1 === 0) return len2 === 0 ? 1 : 0;
    if (len2 === 0) return 0;
    
    // Initialize matrix
    for (let i = 0; i <= len2; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= len1; j++) {
        matrix[0][j] = j;
    }
    
    // Fill matrix
    for (let i = 1; i <= len2; i++) {
        for (let j = 1; j <= len1; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }
    
    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len2][len1]) / maxLen;
}

/**
 * Analyze pronunciation issues in a sentence
 */
export function analyzePronunciationIssues(expected: string, actual: string) {
    const expectedWords = expected.toLowerCase().split(/\s+/);
    const actualWords = actual.toLowerCase().split(/\s+/);
    const issues = [];
    
    const maxLength = Math.max(expectedWords.length, actualWords.length);
    
    for (let i = 0; i < maxLength; i++) {
        const expectedWord = expectedWords[i] || '';
        const actualWord = actualWords[i] || '';
        
        if (expectedWord && actualWord) {
            const accuracy = calculatePhonemeAccuracy(expectedWord, actualWord);
            
            if (accuracy < 100) {
                const issue = {
                    word: expectedWord,
                    expected: expectedWord,
                    actual: actualWord,
                    position: i,
                    accuracy,
                    type: determineIssueType(expectedWord, actualWord)
                };
                issues.push(issue);
            }
        } else if (expectedWord && !actualWord) {
            issues.push({
                word: expectedWord,
                expected: expectedWord,
                actual: '',
                position: i,
                accuracy: 0,
                type: 'missing'
            });
        } else if (actualWord && !expectedWord) {
            issues.push({
                word: actualWord,
                expected: '',
                actual: actualWord,
                position: i,
                accuracy: 0,
                type: 'extra'
            });
        }
    }
    
    return issues;
}

/**
 * Determine the type of pronunciation issue
 */
function determineIssueType(expected: string, actual: string): string {
    if (!actual) return 'missing';
    if (!expected) return 'extra';
    
    // Check for specific common errors
    if (isCommonSubstitution(expected, actual)) {
        if (expected.includes('th')) return 'th_sound';
        if ((expected.includes('r') && actual.includes('l')) || 
            (expected.includes('l') && actual.includes('r'))) {
            return 'r_l_confusion';
        }
        return 'vowel_confusion';
    }
    
    // Check if it's close but not exact
    const similarity = calculateStringSimilarity(expected, actual);
    if (similarity > 0.7) return 'slight_mispronunciation';
    
    return 'substitution';
}

/**
 * Calculate overall accuracy score for a sentence
 */
export function calculateOverallAccuracy(expected: string, actual: string): number {
    if (!expected || !actual) return 0;
    
    const expectedWords = expected.toLowerCase().split(/\s+/);
    const actualWords = actual.toLowerCase().split(/\s+/);
    
    if (expectedWords.length === 0) return 0;
    
    let totalScore = 0;
    const maxWords = Math.max(expectedWords.length, actualWords.length);
    
    for (let i = 0; i < maxWords; i++) {
        const expectedWord = expectedWords[i] || '';
        const actualWord = actualWords[i] || '';
        
        if (expectedWord && actualWord) {
            totalScore += calculatePhonemeAccuracy(expectedWord, actualWord);
        } else {
            // Penalty for missing or extra words
            totalScore += 0;
        }
    }
    
    return Math.round(totalScore / maxWords);
}

/**
 * Get pronunciation tips based on common errors
 */
export function getPronunciationTips(issues: any[]): string[] {
    const tips = new Set<string>();
    
    for (const issue of issues) {
        switch (issue.type) {
            case 'th_sound':
                tips.add("Practice 'th' sounds by placing your tongue between your teeth");
                break;
            case 'r_l_confusion':
                tips.add("For 'R' sounds, curl your tongue back; for 'L' sounds, touch the roof of your mouth");
                break;
            case 'vowel_confusion':
                tips.add("Pay attention to vowel length and mouth position");
                break;
            case 'missing':
                tips.add("Try to pronounce all words clearly - some words may be getting lost");
                break;
            case 'slight_mispronunciation':
                tips.add("You're close! Focus on clearer articulation");
                break;
        }
    }
    
    return Array.from(tips);
}