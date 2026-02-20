import { Radio } from 'lucide-react';

export default function RapidaVoiceAI() {
  // Rapida tables not yet implemented in database
  return (
    <div className="p-12 bg-gray-800 rounded-lg text-center">
      <Radio className="w-20 h-20 text-gray-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Rapida Voice AI</h2>
      <p className="text-gray-400 mb-4">
        Rapida Voice AI orchestrator is currently being configured.
      </p>
      <p className="text-sm text-gray-500">
        Database tables for rapida_orchestrators, rapida_call_sessions, and related entities will be added in the next update.
      </p>
    </div>
  );
}
