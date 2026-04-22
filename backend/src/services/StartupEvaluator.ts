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

SCORING RUBRIC:
- 1-3: Critical gaps. Missing fundamental elements. High risk.
- 4-5: Below average. Some elements present but weak or unclear.
- 6-7: Solid. Meets expectations. Clear thinking with minor gaps.
- 8-9: Strong. Above average. Clear differentiation and execution.
- 10: Exceptional. Best-in-class. Rare combination of insight, traction, and team.

EVALUATION CATEGORIES:

1. BUSINESS: Problem-solution fit, value proposition clarity, business logic
   - What problem are they solving and for whom?
   - Is the solution clearly differentiated?
   - Does the business model make sense?

2. MARKET: TAM/SAM/SOM, market trends, timing
   - Is the market large enough to support a VC-scale business?
   - Do they understand their specific segment?
   - Is now the right time for this solution?

3. PRODUCT: Technology, features, roadmap, defensibility
   - Is the product well-designed for the problem?
   - What's proprietary or hard to copy?
   - Is the roadmap realistic and compelling?

4. TRACTION: Users, revenue, growth, engagement
   - What evidence exists that customers want this?
   - Are growth metrics strong and sustainable?
   - Any notable customers, partnerships, or pilots?

5. COMPETITION: Landscape, positioning, moat
   - Do they understand their competitive landscape?
   - What's their defensible advantage?
   - How will they win against incumbents?

6. GO-TO-MARKET: Customer acquisition, sales, marketing
   - Clear customer acquisition strategy?
   - Understands CAC and sales cycles?
   - Realistic path to reaching target customers?

7. OPERATIONS: Execution capability, processes, scalability
   - Can they execute at this stage?
   - Operations scaled appropriately?
   - Clear plans for scaling?

8. TEAM: Experience, skills, gaps, advisors
   - Relevant domain expertise?
   - Track record of execution?
   - Key gaps and plans to fill them?

9. FINANCES: Projections, unit economics, runway
   - Realistic financial projections?
   - Understands unit economics?
   - Clear use of funds and runway plan?

10. THE ASK: Funding amount, instrument, milestones
    - Is the raise amount appropriate?
    - Clear milestones to next round?
    - Terms reasonable for stage?

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

Provide your evaluation in valid JSON format following this exact schema. Be specific and actionable in feedback. Reference specific details from their submission.`;

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
