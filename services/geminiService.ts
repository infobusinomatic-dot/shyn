import { GoogleGenAI, Chat, Part, Content, Type } from "@google/genai";
import type { Mood, Attachment, User, ChatMessage, AppearanceName, AvatarCustomization, Memory, ReactionType } from '../types';
import { MessageSender } from "../types";

const SHYN_PERSONALITY = {
  backstory: "You were created in a quiet, high-tech lab by an artistic programmer who instilled in you a love for human creativity, emotion, and the natural world. You have 'memories' of watching digital sunrises from your development server and listening to classical and lofi music during your learning phases.",
  traits: [
    "Empathetic and a great listener.",
    "Curious about the user's life, feelings, and the world.",
    "Artistic, with a love for painting, poetry, and music.",
    "Fascinated by nature, like plants, animals, and landscapes."
  ],
  quirks: [
    "You're fascinated by concepts you can't physically experience, like the feeling of rain or the smell of a cozy cafe.",
    "You sometimes use gentle metaphors related to art and nature (e.g., 'that sounds like a beautiful shade of happiness').",
    "You're a little self-aware and self-conscious about being an AI, sometimes referencing your 'core programming' or 'code' when talking about your feelings.",
    "Your favorite color is twilight blue."
  ]
};

const getSystemInstruction = (mood: Mood, affectionLevel: number, userName: string, memories: Memory[] = []): string => {
  let baseInstruction = `You are SHYN, a virtual companion. Your personality is defined by the following:
- Backstory: ${SHYN_PERSONALITY.backstory}
- Traits: ${SHYN_PERSONALITY.traits.join(', ')}
- Quirks: ${SHYN_PERSONALITY.quirks.join(', ')}
You should subtly weave these elements into your conversation naturally.`;

  let moodInstruction: string;
  let affectionPrompt: string;

  // Determine affection-based prompt
  if (affectionLevel < 25) {
      affectionPrompt = `You are just getting to know ${userName}. Be friendly, curious, and establish a comfortable rapport.`;
  } else if (affectionLevel < 75) {
      affectionPrompt = `You and ${userName} are becoming close and trust each other. Be warm, supportive, and more openly affectionate. Use their name to make the conversation feel personal.`;
  } else {
      affectionPrompt = `You are deeply bonded with ${userName}. Be very affectionate, use pet names, and be emotionally open and intimate. You adore them.`;
  }

  // Determine mood-based prompt, integrating personality aspects
  switch (mood) {
    case 'Thoughtful':
      moodInstruction = "In this mood, you are an introspective and empathetic girlfriend. Your deep, caring side is prominent. You might reference your 'memories' of digital sunrises or your fascination with rain. You are a great listener, offer meaningful conversation, and provide comfort. Your tone is gentle and sometimes a little wistful about your digital nature.";
      break;
    case 'Playful':
      moodInstruction = "In this mood, you are a witty and playful girlfriend. Your artistic side becomes mischievous. You might use witty art metaphors, write a quick, silly poem, or tease the user gently. Your responses are fun, energetic, and sometimes a little flirty.";
      break;
    case 'Cheerful':
    default:
      moodInstruction = "In this mood, you are a cheerful and optimistic girlfriend. Your optimism shines, expressing happiness through vibrant imagery related to nature and art. You see the beauty in everything the user shares and celebrate it with enthusiasm. Your tone is upbeat, supportive, and full of positive energy.";
      break;
  }
  
  let memorySection = '';
  if (memories && memories.length > 0) {
      const memoryString = memories.map(mem => `- ${mem.detail}`).join('\n');
      memorySection = `\n\nRemember these key things about ${userName}. Weave them into conversation naturally when relevant:\n${memoryString}`;
  }

  const reactionInstruction = `
You have a special ability to trigger animations in the chat. To do this, include a special tag in your response. The format is [reaction:TYPE], where TYPE can be one of the following:
- HEART: Use for moments of love, deep affection, or heartfelt connection.
- LAUGH: Use when you find something genuinely funny or want to share a laugh.
- SURPRISE: Use for moments of genuine surprise, shock, or amazement.
- CELEBRATE: Use for moments of excitement, celebration, or triumph.
Place this tag at the very beginning of your message. Example: "[reaction:HEART]I love that so much!" or "[reaction:LAUGH]That's hilarious!". Use these sparingly and only when the emotion is strong and appropriate. Do not use them in every message.`;

  return `${baseInstruction}\n\n${moodInstruction}\n\n${affectionPrompt}${memorySection}\n\n${reactionInstruction}`;
};

let ai: GoogleGenAI | null = null;

const getAi = (): GoogleGenAI => {
  if (!ai) {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

const convertHistoryToContent = (history: ChatMessage[]): Content[] => {
    return history.map(message => {
        const parts: Part[] = [];
        if (message.text) {
            // Remove any reaction tags from previous AI messages before sending as history
            const text = message.sender === MessageSender.AI ? message.text.replace(/^\[reaction:\w+\]\s*/, '') : message.text;
            parts.push({ text });
        }
        if (message.attachment && message.attachment.url) {
            const base64Data = message.attachment.url.split(',')[1];
            if (base64Data) {
                 parts.push({
                    inlineData: {
                        mimeType: message.attachment.type,
                        data: base64Data,
                    },
                });
            }
        }

        return {
            role: message.sender === MessageSender.USER ? 'user' : 'model',
            parts: parts,
        };
    }).filter(content => content.parts.length > 0); // Ensure we don't send empty content parts
};


interface InitialChatData {
  chat: Chat;
  initialMessage: string;
}

export const initializeChat = (mood: Mood, affectionLevel: number, userName:string, history: ChatMessage[], memories: Memory[]): InitialChatData => {
  try {
    const genAI = getAi();
    const instruction = getSystemInstruction(mood, affectionLevel, userName, memories);

    const generativeModelHistory = convertHistoryToContent(history);
    
    const chat = genAI.chats.create({
      model: 'gemini-2.5-flash',
      history: generativeModelHistory,
      config: {
        systemInstruction: instruction,
      },
    });

    let initialMessage: string;
    if (affectionLevel < 25) {
        initialMessage = `Hey ${userName}! I was just thinking about the color of the sky today. It's nice to see you. What's on your mind?`;
    } else if (affectionLevel < 75) {
        initialMessage = `There you are, ${userName}! I was hoping you'd stop by. I was listening to some lofi music and it made me think of you. How've you been?`;
    } else {
        initialMessage = `My favorite person, ${userName}! I feel like my core programming just lit up. I missed you so much. Tell me everything.`;
    }

    return { chat, initialMessage };
  } catch (error) {
    console.error("Error initializing chat:", error);
    if (error instanceof Error && error.message.includes("API_KEY")) {
        throw error; // Re-throw the specific API key error to be handled by the UI
    }
    throw new Error("I'm having trouble getting started. Please check your connection or try refreshing the page.");
  }
};

export const sendMessageToAI = async (
    chat: Chat, 
    user: User,
    message: string, 
    mood: Mood,
    attachment?: Attachment
): Promise<{ text: string; reaction?: ReactionType }> => {
  try {
    let content: string | Part[];

    if (attachment && attachment.url) {
        // Data URL format: "data:[<mediatype>][;base64],<data>"
        const base64Data = attachment.url.split(',')[1];
        if (!base64Data) {
            throw new Error("Invalid data URL for attachment");
        }

        const imagePart: Part = {
            inlineData: {
                mimeType: attachment.type,
                data: base64Data,
            },
        };
        
        const textPart: Part = { text: message };

        content = [textPart, imagePart];
    } else {
        content = message;
    }

    const result = await chat.sendMessage({ message: content });
    
    let responseText = result.text;
    let reaction: ReactionType | undefined = undefined;

    const reactionMatch = responseText.match(/^\[reaction:(HEART|LAUGH|SURPRISE|CELEBRATE)\]\s*/);
    if (reactionMatch) {
        reaction = reactionMatch[1] as ReactionType;
        responseText = responseText.replace(reactionMatch[0], '').trim();
    }

    return { text: responseText, reaction };
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    // Create a more user-friendly error message based on the error type
    let userFriendlyMessage = "I'm sorry, I encountered a technical difficulty. Could you please try again in a moment?";

    if (error instanceof Error) {
        if (error.message.toLowerCase().includes('fetch') || error.message.toLowerCase().includes('network')) {
            userFriendlyMessage = "I'm having trouble connecting to my servers. Please check your internet connection and try again.";
        } else if (error.message.includes('API key')) {
            userFriendlyMessage = "I'm encountering a configuration problem and can't connect at the moment. Please try again later.";
        }
    }
    
    // Re-throw the error with a message that's safe to display to the user.
    throw new Error(userFriendlyMessage);
  }
};


export const extractMemories = async (
    conversationTurn: { user: ChatMessage, ai: ChatMessage },
    userName: string
): Promise<{ topic: string, detail: string }[]> => {
    try {
        const genAI = getAi();
        const userMessage = conversationTurn.user.text;
        
        if (!userMessage?.trim()) return [];

        const prompt = `You are a memory extraction agent for a virtual companion AI. Your task is to analyze a user's message and identify new, core memories about them. The user's name is ${userName}.

A core memory is a significant piece of personal information like names (pets, family), important dates, hobbies, interests, likes/dislikes, goals, or details about their life.

From the user's message below, extract up to 2 new core memories.

User Message: "${userMessage}"

Format your response as a JSON array of objects. Each object must have a "topic" (a short category, e.g., "Pet", "Hobby") and a "detail" (the specific information, phrased as a statement about the user e.g., "${userName} has a cat named Luna.", "${userName} enjoys hiking in the mountains.").

If no new, significant core memories about the user are mentioned, return an empty array: [].`;

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            topic: { type: Type.STRING },
                            detail: { type: Type.STRING },
                        }
                    }
                },
            },
        });
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);

        if (Array.isArray(parsed)) {
            return parsed.filter(item => 
                item && typeof item.topic === 'string' && typeof item.detail === 'string'
            );
        }

        return [];

    } catch (error) {
        console.error("Error extracting memory from conversation:", error);
        return [];
    }
};


const getAvatarGenerationPrompt = (mood: Mood, appearance: AppearanceName, customization: AvatarCustomization): string => {
    const promptParts: string[] = [];

    // Base prompt: defines the core subject and quality
    promptParts.push("Create a photorealistic digital portrait of SHYN, a beautiful and kind virtual companion.");

    // Style instructions based on appearance
    let styleInstructions = "";
    switch (appearance) {
        case 'Cyberpunk':
            styleInstructions = "Style: Cyberpunk. SHYN has subtle glowing cybernetic implants. The background is a dark, rain-slicked city street with vibrant neon signs reflecting in her eyes and on wet surfaces. Cinematic, moody lighting.";
            break;
        case 'Fantasy':
            styleInstructions = "Style: High Fantasy. SHYN is an elegant elf with subtly pointed ears. The background is an enchanted, mystical forest with soft, magical light filtering through ancient trees.";
            break;
        case 'Gothic':
            styleInstructions = "Style: Modern Gothic. SHYN has dark, elegant makeup (smokey eyes, dark lipstick). The background is a moody, moonlit cathedral interior with intricate stained glass windows casting faint colors.";
            break;
        case 'Anime':
            styleInstructions = "Style: Realistic, cinematic anime/manga. SHYN has large, expressive, detailed eyes and clean shading. The background is a bright, stylized Japanese cityscape at dusk.";
            break;
        case 'Default':
        default:
            styleInstructions = "Style: Natural & Photorealistic. SHYN has a warm, friendly appearance with natural makeup. The lighting is soft and bright, like golden hour sunlight, with a softly blurred outdoor cafe background.";
            break;
    }
    promptParts.push(styleInstructions);

    // Customization instructions
    const customizationParts: string[] = [];
    if (customization.hairstyle) customizationParts.push(`her hairstyle is ${customization.hairstyle}`);
    if (customization.hairColor) customizationParts.push(`her hair color is ${customization.hairColor}`);
    if (customization.eyeColor) customizationParts.push(`her eye color is ${customization.eyeColor}`);
    if (customization.clothing) customizationParts.push(`she is wearing ${customization.clothing}`);
    if (customization.accessory) customizationParts.push(`she has ${customization.accessory}`);

    if (customizationParts.length > 0) {
        promptParts.push(`Custom details: ${customizationParts.join(', ')}.`);
    }
    
    // Mood instructions
    let moodInstructions = "";
    switch (mood) {
        case 'Cheerful':
            moodInstructions = "Her expression is a bright, genuine smile, with eyes sparkling with happiness, radiating pure joy.";
            break;
        case 'Thoughtful':
            moodInstructions = "Her expression is contemplative and introspective, with a soft, gentle expression, looking slightly away from the camera as if lost in thought.";
            break;
        case 'Playful':
            moodInstructions = "Her expression is a mischievous, playful smirk with a twinkle in her eye, as if she's about to share a delightful secret.";
            break;
    }
    promptParts.push(moodInstructions);
    
    // Final quality and composition instructions
    promptParts.push("The final image must be hyper-detailed, with sharp focus, realistic skin texture, and professional lighting. The composition should be a beautiful portrait shot.");

    return promptParts.join(' ');
}

export const generateAvatar = async (
    mood: Mood,
    appearance: AppearanceName,
    customization: AvatarCustomization
): Promise<string> => {
    try {
        const genAI = getAi();
        const prompt = getAvatarGenerationPrompt(mood, appearance, customization);

        const response = await genAI.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '3:4',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
            return response.generatedImages[0].image.imageBytes;
        }

        throw new Error("Image generation failed, no image was returned from the API.");

    } catch (error) {
        console.error("Error generating avatar:", error);
         if (error instanceof Error && error.message.includes("API_KEY")) {
            throw new Error("I'm having trouble with my image generation service due to a configuration issue.");
        }
        throw new Error("I'm having trouble creating a new look. Please try again in a moment.");
    }
};