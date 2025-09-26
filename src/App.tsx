import PronunciationTrainer from "./components/PronunciationTrainer";
import { useTranscriber } from "./hooks/useTranscriber";

function App() {
    const transcriber = useTranscriber();

    return (
        <div className='min-h-screen bg-slate-50'>
            <div className='container mx-auto py-8'>
                <PronunciationTrainer transcriber={transcriber} />
            </div>

            <div className='text-center py-4 text-slate-600'>
                Made with{" "}
                <a
                    className='underline hover:text-slate-800'
                    href='https://github.com/xenova/transformers.js'
                >
                    🤗 Transformers.js
                </a>
            </div>
        </div>
    );
}

export default App;
