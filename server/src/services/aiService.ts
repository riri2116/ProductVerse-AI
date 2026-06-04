import { OpenAI } from 'openai';

interface AiPalette {
  themeName: string;
  palette: {
    name: string;
    color: string;
    metalness: number;
    roughness: number;
    clearcoat: number;
    opacity?: number;
    emissive?: string;
  }[];
}

interface CriticReview {
  visualScore: number;
  marketAppeal: number;
  feasibility: number;
  luxuryRating: number;
  costEfficiency: number;
  accessibility: number;
  suggestions: string[];
}

export class AiService {
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  // Generates materials and styling configs based on a prompt
  async generateDesignTheme(prompt: string, category: string): Promise<AiPalette> {
    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an AI material design assistant for a 3D product configurator.
Generate a color palette and material specification for a product category (${category}) matching the user's prompt.
Respond STRICTLY with a valid JSON matching this interface:
{
  "themeName": "string describing the design theme",
  "palette": [
    {
      "name": "mesh component name (e.g., body, sole, frame, cushions, accents, metal_trim, base)",
      "color": "HEX color string",
      "metalness": 0.0 to 1.0,
      "roughness": 0.0 to 1.0,
      "clearcoat": 0.0 to 1.0,
      "opacity": 0.0 to 1.0 (optional, default 1.0),
      "emissive": "HEX color string (optional, default #000000)"
    }
  ]
}`
            },
            {
              role: 'user',
              content: `Prompt: ${prompt}`
            }
          ],
          response_format: { type: 'json_object' }
        });

        const resultText = response.choices[0].message?.content || '{}';
        return JSON.parse(resultText) as AiPalette;
      } catch (error) {
        console.error('OpenAI generation failed, falling back to simulated engine:', error);
      }
    }

    // Heuristic simulated AI engine
    return this.simulatePaletteGeneration(prompt, category);
  }

  // Analyzes a materials configuration and generates scoring/feedback
  async criticDesign(configData: any, category: string, prompt?: string): Promise<CriticReview> {
    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert luxury product designer, material scientist, and manufacturing engineer.
Evaluate the given 3D material configuration JSON for a product in category (${category}).
Analyze visual beauty, market viability, production cost, complexity, sustainability, and accessibility.
Provide scores from 0 to 100.
Respond STRICTLY with a valid JSON matching this interface:
{
  "visualScore": 0-100,
  "marketAppeal": 0-100,
  "feasibility": 0-100,
  "luxuryRating": 0-100,
  "costEfficiency": 0-100,
  "accessibility": 0-100,
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}`
            },
            {
              role: 'user',
              content: `Configuration JSON: ${JSON.stringify(configData)}. Context prompt: ${prompt || 'None'}`
            }
          ],
          response_format: { type: 'json_object' }
        });

        const resultText = response.choices[0].message?.content || '{}';
        return JSON.parse(resultText) as CriticReview;
      } catch (error) {
        console.error('OpenAI Critic failed, falling back to simulated engine:', error);
      }
    }

    return this.simulateCritic(configData, category, prompt);
  }

  // Simulates a theme generation locally with rules
  private simulatePaletteGeneration(prompt: string, category: string): AiPalette {
    const query = prompt.toLowerCase();
    const isGold = query.includes('gold') || query.includes('aurum') || query.includes('yellow');
    const isDark = query.includes('dark') || query.includes('black') || query.includes('cyberpunk') || query.includes('stealth') || query.includes('futuristic');
    const isNeon = query.includes('neon') || query.includes('cyber') || query.includes('glow');
    const isRed = query.includes('red') || query.includes('crimson') || query.includes('sport') || query.includes('fire');
    const isMarble = query.includes('marble') || query.includes('luxury') || query.includes('white') || query.includes('stone');

    let themeName = 'ProductVerse Signature Spec';
    let palette: AiPalette['palette'] = [];

    if (category.toLowerCase().includes('car') || category.toLowerCase().includes('auto')) {
      themeName = isDark ? 'Stealth Carbon Hypercar' : isGold ? 'Golden Sovereign GT' : isRed ? 'Scuderia Carbon Sport' : 'Chrono Titanium Roadster';
      palette = [
        { name: 'body', color: isDark ? '#111111' : isGold ? '#d4af37' : isRed ? '#cc1100' : '#4a5568', metalness: 0.9, roughness: 0.1, clearcoat: 1.0 },
        { name: 'wheels', color: '#1a1a1a', metalness: 0.8, roughness: 0.4, clearcoat: 0.5 },
        { name: 'calipers', color: isGold ? '#000000' : '#e53e3e', metalness: 0.9, roughness: 0.1, clearcoat: 0.9 },
        { name: 'glass', color: '#1a202c', metalness: 0.1, roughness: 0.05, clearcoat: 1.0, opacity: 0.4 },
        { name: 'interior', color: isDark ? '#2d3748' : isGold ? '#8b0000' : '#718096', metalness: 0.1, roughness: 0.8, clearcoat: 0.0 }
      ];
    } else if (category.toLowerCase().includes('chair') || category.toLowerCase().includes('furnit')) {
      themeName = isMarble ? 'Monolithic Marble Lounge' : isGold ? 'Imperial Brass Accent' : 'Scandinavian Nordic Fabric';
      palette = [
        { name: 'base', color: isMarble ? '#f7fafc' : '#2d3748', metalness: isGold ? 0.9 : 0.2, roughness: 0.1, clearcoat: isMarble ? 0.9 : 0.1 },
        { name: 'cushions', color: isGold ? '#2d3748' : isMarble ? '#8b0000' : '#e2e8f0', metalness: 0.0, roughness: 0.7, clearcoat: 0.0 },
        { name: 'frame', color: isGold ? '#d4af37' : '#1a202c', metalness: 0.9, roughness: 0.2, clearcoat: 0.8 }
      ];
    } else if (category.toLowerCase().includes('sneaker') || category.toLowerCase().includes('shoes')) {
      themeName = isNeon ? 'Neo-Tokyo Cyber Runner' : isDark ? 'Stealth Triple Black' : 'Chrono Crimson Runner';
      palette = [
        { name: 'sole', color: isNeon ? '#39ff14' : '#111111', metalness: 0.1, roughness: 0.6, clearcoat: 0.0 },
        { name: 'upper', color: isDark ? '#1a1a1a' : '#ffffff', metalness: 0.3, roughness: 0.4, clearcoat: 0.1 },
        { name: 'laces', color: isNeon ? '#ff00ff' : '#e53e3e', metalness: 0.0, roughness: 0.9, clearcoat: 0.0 },
        { name: 'accents', color: isNeon ? '#00ffff' : '#2d3748', metalness: 0.8, roughness: 0.2, clearcoat: 0.9, emissive: isNeon ? '#00ffff' : '#000000' }
      ];
    } else {
      themeName = 'Quantum Matte Edition';
      palette = [
        { name: 'body', color: '#1a202c', metalness: 0.5, roughness: 0.5, clearcoat: 0.5 },
        { name: 'accent', color: '#e53e3e', metalness: 0.9, roughness: 0.2, clearcoat: 0.9 }
      ];
    }

    return { themeName, palette };
  }

  // Simulates design critique scores based on input configuration values
  private simulateCritic(configData: any, category: string, prompt?: string): CriticReview {
    let visualScore = 78;
    let marketAppeal = 82;
    let feasibility = 85;
    let luxuryRating = 70;
    let costEfficiency = 74;
    let accessibility = 80;
    const suggestions: string[] = [];

    // Analyze values
    let totalMaterials = 0;
    let avgMetalness = 0;
    let avgRoughness = 0;
    let hasEmissive = false;
    let hasClearcoat = false;

    try {
      const keys = Object.keys(configData);
      totalMaterials = keys.length;
      let metalSum = 0;
      let roughSum = 0;

      for (const k of keys) {
        const mat = configData[k];
        if (mat) {
          metalSum += mat.metalness ?? 0;
          roughSum += mat.roughness ?? 0.5;
          if (mat.emissive && mat.emissive !== '#000000') hasEmissive = true;
          if (mat.clearcoat && mat.clearcoat > 0.5) hasClearcoat = true;
        }
      }

      avgMetalness = totalMaterials ? metalSum / totalMaterials : 0.5;
      avgRoughness = totalMaterials ? roughSum / totalMaterials : 0.5;
    } catch {
      // Ignore reading issues
    }

    // Heuristics:
    if (avgMetalness > 0.7) {
      luxuryRating += 12;
      feasibility -= 8; // metal takes higher tooling costs
      costEfficiency -= 12;
      suggestions.push('High-shine metal components increase visual prestige, but consider secondary bead-blasted treatments to reduce tool scoring.');
    }
    if (hasClearcoat) {
      luxuryRating += 10;
      visualScore += 8;
      feasibility -= 5; // extra finish process
      suggestions.push('Clearcoat adds depth. Maintain strict environmental control in production to prevent dust inclusions in the polyurethane layer.');
    }
    if (hasEmissive) {
      visualScore += 6;
      marketAppeal -= 5; // niche aesthetic
      accessibility += 4; // visibility
      suggestions.push('Emissive LED piping boosts sci-fi theme. Ensure power integration conforms to regional low-voltage certifications.');
    }
    if (avgRoughness > 0.8) {
      luxuryRating -= 5;
      costEfficiency += 10; // easier finish
      suggestions.push('Matte finishes lower reflection clutter. We recommend blending in standard grip textures for high-touch contact points.');
    }

    // Adjust category constraints
    if (category.toLowerCase().includes('chair') && avgMetalness > 0.8) {
      feasibility -= 10;
      suggestions.push('An all-metal chair base increases stability but might exceed standard residential weight limits. Consider hollow casting or internal ribbing.');
    }

    if (suggestions.length === 0) {
      suggestions.push('The material choices are well-balanced. We suggest introducing slight normal map maps (e.g. brushed grain) to heighten micro-shadowing.');
      suggestions.push('Ensure color temperature matches physical master swatches prior to finalizing production tooling.');
    }

    return {
      visualScore: Math.min(100, Math.max(10, visualScore)),
      marketAppeal: Math.min(100, Math.max(10, marketAppeal)),
      feasibility: Math.min(100, Math.max(10, feasibility)),
      luxuryRating: Math.min(100, Math.max(10, luxuryRating)),
      costEfficiency: Math.min(100, Math.max(10, costEfficiency)),
      accessibility: Math.min(100, Math.max(10, accessibility)),
      suggestions
    };
  }
}

export const aiService = new AiService();
export default aiService;
