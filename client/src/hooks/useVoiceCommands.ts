import { useState, useEffect, useRef } from 'react';
import { useConfigurator } from '../context/ConfiguratorContext';

export function useVoiceCommands() {
  const { updateMaterial, applyMaterialPreset, setViewMode } = useConfigurator();
  const [isListening, setIsListening] = useState(false);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      setCommandFeedback('Listening for command...');
    };

    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript.toLowerCase();
      setCommandFeedback(`Recognized: "${text}"`);
      parseCommand(text);
    };

    rec.onerror = (e: any) => {
      console.error('Speech recognition error:', e.error);
      setIsListening(false);
      setCommandFeedback(`Error: ${e.error}`);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Speech recognition already started:', err);
      }
    } else {
      alert('Speech recognition is not supported in this browser. Try Chrome.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const parseCommand = (input: string) => {
    const txt = input.toLowerCase();

    // 1. Color commands
    if (txt.includes('make it black') || txt.includes('apply black')) {
      updateMaterial('body', 'color', '#111111');
      updateMaterial('body', 'metalness', 0.9);
      updateMaterial('body', 'roughness', 0.15);
      setCommandFeedback('Command Applied: Body painted Matte Black.');
    } else if (txt.includes('make it red') || txt.includes('apply red')) {
      updateMaterial('body', 'color', '#cc1100');
      updateMaterial('body', 'metalness', 0.95);
      updateMaterial('body', 'roughness', 0.1);
      setCommandFeedback('Command Applied: Body painted Crimson Red.');
    } else if (txt.includes('make it gold') || txt.includes('apply gold')) {
      updateMaterial('body', 'color', '#d4af37');
      updateMaterial('body', 'metalness', 1.0);
      updateMaterial('body', 'roughness', 0.2);
      setCommandFeedback('Command Applied: Body painted Sovereign Gold.');
    } else if (txt.includes('make it blue') || txt.includes('apply blue')) {
      updateMaterial('body', 'color', '#1a3a8f');
      updateMaterial('body', 'metalness', 0.85);
      updateMaterial('body', 'roughness', 0.15);
      setCommandFeedback('Command Applied: Body painted Cobalt Blue.');
    }
    // 2. Preset commands
    else if (txt.includes('apply leather') || txt.includes('leather')) {
      applyMaterialPreset('interior', 'Matte Leather');
      applyMaterialPreset('cushions', 'Matte Leather');
      setCommandFeedback('Command Applied: Presetted soft Burgundy Leather.');
    } else if (txt.includes('carbon fiber') || txt.includes('apply carbon')) {
      applyMaterialPreset('body', 'Carbon Fiber');
      setCommandFeedback('Command Applied: Presetted Carbon Fiber composite panels.');
    } else if (txt.includes('marble') || txt.includes('stone')) {
      applyMaterialPreset('base', 'White Marble');
      setCommandFeedback('Command Applied: Presetted White Carrara Marble.');
    }
    // 3. View commands
    else if (txt.includes('exploded') || txt.includes('explode product') || txt.includes('disassemble')) {
      setViewMode('exploded');
      setCommandFeedback('Command Applied: Exploded structural assemblies.');
    } else if (txt.includes('standard') || txt.includes('assemble product') || txt.includes('reset view')) {
      setViewMode('standard');
      setCommandFeedback('Command Applied: Resetted assemblies to Standard View.');
    } else {
      setCommandFeedback(`Command not matched: "${input}". Try: "make it black", "exploded view", "carbon fiber".`);
    }

    // Auto-clear feedback after 4 seconds
    setTimeout(() => {
      setCommandFeedback(null);
    }, 4500);
  };

  return {
    isListening,
    commandFeedback,
    startListening,
    stopListening
  };
}
export default useVoiceCommands;
