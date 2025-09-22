
import { useState, useEffect, useRef } from 'react';

// Define a consistent interface for the SpeechRecognition instance to ensure type safety.
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

// Access the browser's SpeechRecognition API, accounting for vendor prefixes.
// Renamed to `SpeechRecognitionApi` to avoid shadowing the global `SpeechRecognition` type.
const SpeechRecognitionApi = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSupported = !!SpeechRecognitionApi;

interface VoiceRecognitionOptions {
  onTranscript: (text: string) => void;
  onError: (error: string) => void;
}

export const useVoiceRecognition = ({ onTranscript, onError }: VoiceRecognitionOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (!isSupported) {
      onError('Voice recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognitionApi();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      let errorMessage = 'An unknown voice recognition error occurred.';
      switch (event.error) {
          case 'not-allowed':
              errorMessage = 'Microphone access was denied. Please enable it in your browser settings to use voice input.';
              break;
          case 'network':
              errorMessage = 'A network error occurred with the voice recognition service. Please check your connection.';
              break;
          case 'no-speech':
              errorMessage = "I didn't hear anything. Please try speaking again.";
              break;
          case 'service-not-allowed':
              errorMessage = 'Voice recognition service is not allowed. Your browser might be blocking it.';
              break;
          case 'audio-capture':
                errorMessage = 'There was an issue with your microphone. Please ensure it is connected and working correctly.';
                break;
      }
      onError(errorMessage);
      setIsListening(false);
    };
    
    recognition.onend = () => {
        setIsListening(false);
    }

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onTranscript, onError]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setTranscript('');
      } catch (error) {
        console.error("Error starting recognition:", error)
        onError('Could not start voice recognition.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, startListening, stopListening, isSupported };
};