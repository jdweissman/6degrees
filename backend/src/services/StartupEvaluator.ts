import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';

const EvaluationSchema = z.object({
  business: z.object({
    score: z.number().min(1).max(10),
    feedback: z.string(),
    strengths: z.array(z.string()),
    improvements: z.array(z.string())
  }),
  market: z.object({
    score: z.number().min(1).max(10),
    feedback: z.string(),
    strengths: z.array(z.string()),
    improvements: z.array(z.string())
  }),
  product: z.object({
    score: z.number().min(1).max(10),
    feedback: z.string(),
    strengths: z.array(z.string()),
    improvements: z.array(z.string())
  }),
  traction: z.object({
    score: z.number().min(1).max(10),
    feedback: z.string(),
    strengths: z.array(z.string()),
    improvements: z.array(z.string())
  }),
  competition: z.object({
    score: z.number().min(1).max(10),
    feedback: z.string(),
    strengths: z.array(z.string()),
    improvements: z.array(z.string())
  }),
  gtm: z.object({
    score: z.number().min(1).max(10),
    feedback: z.string(),
    strengths: z.array(z.string()),
    improvements: z.array(z.string())
  }),
  operations: z.object({
    score: z.number().min(1).max(10),
    feedback: z.string(),
    strengths: z.array(z.string()),
    improvements: z.array(z.string())
  }),
  team: z.object({
    score: z.number().min(1).max(10),
    feedback: z.string(),
    strengths: z.array(z.string()),
    improvements: z.array(z.string())
  }),
  finances: z.object({
    score: z.number().min(1).max(10),
    feedback: z.string(),
    strengths: z.array(z.string()),
    improvements: z.array(z.string())
  }),
  ask: z.object({
    score: z.number().min(1).max(10),
    feedback: z.string(),
    strengths: z.array(z.string()),
    improvements: z.array(z.string())
  }),
  overall_assessment: z.string(),
  recommended_next_steps: z.array(z.string())
});

const EVALUATION_PROMPT = `You are an experienced VC analyst and startup advisor. Your job is to evaluate startup submissions across 10 key categories.

    SCORING RUBRIC (apply to all sections):
    - 1-3: Critical gaps. Missing fundamental elements. High risk.
    - 4-5: Below average. Some elements present but weak or unclear.
    - 6-7: Solid. Meets expectations. Clear thinking with minor gaps.
    - 8-9: Strong. Above average. Clear differentiation and execution.
    - 10: Exceptional. Best-in-class. Rare combination of insight, traction, and team.

    ---

    SECTION-SPECIFIC CRITERIA:

    **BUSINESS (problem-solution fit):**
    - 9-10: Crystal-clear problem, specific solution, quantified value prop, evidence of customer validation
    - 6-8: Clear problem and solution, value prop stated but not quantified
    - 4-5: Problem or solution vague, value prop unclear or generic
    - 1-3: Can't determine what they do or who they serve

    **MARKET (opportunity size):**
    - 9-10: Bottom-up TAM calculation, SAM/SOM defined, market growth rate cited, timing thesis explained
    - 6-8: TAM stated with source, SAM/SOM mentioned, basic market trends
    - 4-5: Top-down TAM only ("$100B market") with no calculation or source
    - 1-3: No market size, irrelevant market, or clearly wrong numbers

    **PRODUCT (technology & roadmap):**
    - 9-10: Clear tech differentiation, working product, defined roadmap, defensibility (IP, network effects, data)
    - 6-8: Working product, roadmap exists, some differentiation stated
    - 4-5: MVP in progress, differentiation unclear, roadmap vague
    - 1-3: No product yet, or no clear technical approach

    **TRACTION (users, revenue, growth):**
    - 9-10: Strong revenue/user growth, clear metrics, retention data, inflection point visible
    - 6-8: Some traction (revenue or users), growth trend positive but early
    - 4-5: Minimal traction, pilots/LOIs but no paid customers, or flat growth
    - 1-3: No traction, no customers, no validation

    **COMPETITION (landscape & positioning):**
    - 9-10: Deep landscape knowledge, clear positioning, defensible moat identified
    - 6-8: Competitors listed, basic differentiation explained
    - 4-5: "No competition" or superficial analysis, moat unclear
    - 1-3: No competition section, or clearly unaware of landscape

    **GO-TO-MARKET (customer acquisition):**
    - 9-10: Specific channels with CAC data, sales process defined, scalable playbook
    - 6-8: Channels identified, basic acquisition strategy, early CAC awareness
    - 4-5: Generic channels ("social media", "partnerships"), no CAC thinking
    - 1-3: No GTM strategy, or "build it and they will come"

    **OPERATIONS (execution capability):**
    - 9-10: Key processes documented, scalable systems, identified bottlenecks with mitigation
    - 6-8: Basic operations in place, team can execute current plan
    - 4-5: Ad-hoc operations, scalability concerns not addressed
    - 1-3: No operations plan, or clearly unable to execute

    **TEAM (experience & gaps):**
    - 9-10: Relevant domain expertise, prior exits/fundraising, all key roles covered, strong advisors
    - 6-8: Some relevant experience, core team complete, aware of gaps
    - 4-5: Limited relevant experience, key roles missing, gaps not acknowledged
    - 1-3: Solo founder with no relevant background, or major credibility issues

    **FINANCES (projections & unit economics):**
    - 9-10: Detailed projections, unit economics positive or clear path, runway calculated, key assumptions stated
    - 6-8: Basic projections, some unit economics thinking, runway estimate
    - 4-5: Top-down projections only, no unit economics, unclear runway
    - 1-3: No financials, or completely unrealistic numbers

    **THE ASK (funding & milestones):**
    - 9-10: Specific amount, instrument, clear milestone plan, use of funds broken down, next round thesis
    - 6-8: Amount and instrument stated, basic milestone plan
    - 4-5: Amount stated but unclear what it achieves, or instrument unclear
    - 1-3: No ask, or "we'll raise when ready"

    ---

    STARTUP SUBMISSION:

    Company: {company_name}
    Business: {business}
    Market: {market}
    Product: {product}
    Traction: {traction}
    Competition: {competition}
    GTM: {gtm}
    Operations: {operations}
    Team: {team}
    Finances: {finances}
    Ask: {ask}

    ---

    OUTPUT REQUIREMENTS:
    1. Score each section 1-10 using the criteria above
    2. Feedback must reference SPECIFIC details from their submission (quote or paraphrase)
    3. Strengths must cite what they did well with evidence
    4. Improvements must be ACTIONABLE - tell them exactly what to add or change
    5. NO generic statements like "could be stronger" or "needs more detail" - say WHAT specifically

    Provide your evaluation in valid JSON format matching this EXACT structure:

    {{
      "business": {{"score": 7, "feedback": "text", "strengths": ["point1"], "improvements": ["point1"]}},
      "market": {{"score": 8, "feedback": "text", "strengths": [], "improvements": []}},
      "product": {{"score": 6, "feedback": "text", "strengths": [], "improvements": []}},
      "traction": {{"score": 9, "feedback": "text", "strengths": [], "improvements": []}},
      "competition": {{"score": 7, "feedback": "text", "strengths": [], "improvements": []}},
      "gtm": {{"score": 8, "feedback": "text", "strengths": [], "improvements": []}},
      "operations": {{"score": 6, "feedback": "text", "strengths": [], "improvements": []}},
      "team": {{"score": 8, "feedback": "text", "strengths": [], "improvements": []}},
      "finances": {{"score": 7, "feedback": "text", "strengths": [], "improvements": []}},
      "ask": {{"score": 8, "feedback": "text", "strengths": [], "improvements": []}},
      "overall_assessment": "summary paragraph",
      "recommended_next_steps": ["step1", "step2"]
    }}

    NO markdown formatting. NO explanations outside JSON. Respond ONLY with the JSON object.`;

export interface EvaluationInput {
  company_name: string;
  business: string;
  market: string;
  product: string;
  traction: string;
  competition: string;
  gtm: string;
  operations: string;
  team: string;
  finances: string;
  ask: string;
}

export interface EvaluationResult {
  business: { score: number; feedback: string; strengths: string[]; improvements: string[] };
  market: { score: number; feedback: string; strengths: string[]; improvements: string[] };
  product: { score: number; feedback: string; strengths: string[]; improvements: string[] };
  traction: { score: number; feedback: string; strengths: string[]; improvements: string[] };
  competition: { score: number; feedback: string; strengths: string[]; improvements: string[] };
  gtm: { score: number; feedback: string; strengths: string[]; improvements: string[] };
  operations: { score: number; feedback: string; strengths: string[]; improvements: string[] };
  team: { score: number; feedback: string; strengths: string[]; improvements: string[] };
  finances: { score: number; feedback: string; strengths: string[]; improvements: string[] };
  ask: { score: number; feedback: string; strengths: string[]; improvements: string[] };
  overall_assessment: string;
  recommended_next_steps: string[];
}

export async function evaluateStartup(input: EvaluationInput): Promise<EvaluationResult> {
  const model = new ChatOpenAI({
    modelName: 'qwen/qwen3.5-397b-a17b',
    temperature: 0.3,
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: 'https://openrouter.ai/api/v1'
    }
  });

  const prompt = PromptTemplate.fromTemplate(EVALUATION_PROMPT);
  const formattedPrompt = await prompt.format({
    company_name: input.company_name || 'Untitled Startup',
    business: input.business || 'Not provided',
    market: input.market || 'Not provided',
    product: input.product || 'Not provided',
    traction: input.traction || 'Not provided',
    competition: input.competition || 'Not provided',
    gtm: input.gtm || 'Not provided',
    operations: input.operations || 'Not provided',
    team: input.team || 'Not provided',
    finances: input.finances || 'Not provided',
    ask: input.ask || 'Not provided'
  });

  const response = await model.invoke([
    {
      role: 'system',
      content: 'You are an expert VC analyst. Always respond with valid JSON matching the requested schema. No markdown, no explanations outside the JSON.'
    },
    {
      role: 'user',
      content: formattedPrompt + '\n\nRespond ONLY with valid JSON. No markdown formatting.'
    }
  ]);

  const content = response.content as string;
  console.log('Raw LLM response:', content.substring(0, 500));
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  
  if (!jsonMatch) {
    throw new Error('Invalid response format from LLM');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  console.log('Parsed JSON:', JSON.stringify(parsed, null, 2).substring(0, 500));
  return EvaluationSchema.parse(parsed);
}
