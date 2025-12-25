---
title: "How to Fix LLM Output Control Issues: JSON Format, Length, and Structure"
date: "2025-08-16"
author: "Abyan Dimas"
excerpt: "Production guide to controlling LLM outputs. Fix JSON parsing errors, output length issues, and enforce structured responses reliably."
coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop"
---

![AI Code](https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop)

## The Problem: LLM Output Unpredictability

You're building an application using GPT-4, Claude, or Llama. The LLM works in the playground but breaks in production because:

- Outputs are too short or too verbose
- JSON responses are malformed
- The model ignores your formatting instructions
- Structured output fails to parse

**This is not a model problem. This is a prompt engineering problem.**

---

## Issue #1: Output Too Short

### Symptom

**Your Prompt:**
```
Explain how Docker works.
```

**Model Output:**
```
Docker is containerization technology.
```

**Expected:** A detailed explanation with examples.

### Root Cause

1. **Ambiguous instruction** - "Explain" can mean 1 sentence or 10 paragraphs
2. **No length constraint** - Model defaults to concise responses
3. **Missing context** - Model doesn't know your audience level

### Wrong Approach

```
Explain how Docker works in detail.
```

**Problem:** "In detail" is still vague.

### Correct Approach

**Technique 1: Specify Exact Length**

```
Explain how Docker works. Your response must be at least 300 words and include:
1. What Docker is
2. How containers differ from VMs
3. Basic Docker commands
4. A simple use case example

Write in a tutorial style for beginners.
```

**Technique 2: Use Word/Paragraph Count**

```
Write a 3-paragraph explanation of Docker:
- Paragraph 1: Definition and core concept
- Paragraph 2: Technical architecture (images, containers, daemon)
- Paragraph 3: Practical example with commands
```

**Technique 3: Chain of Thought**

```
Explain Docker step-by-step:
1. First, define what a container is
2. Then explain how Docker manages containers
3. Compare Docker to virtual machines
4. Finally, show a simple docker run example

Think through each step carefully before writing.
```

### Why This Works

- **Explicit constraints** give the model clear targets
- **Structured outline** forces comprehensive coverage
- **Audience specification** calibrates detail level

---

## Issue #2: Output Too Verbose

### Symptom

**Your Prompt:**
```
Extract the email address from this text: "Contact John at john.doe@example.com"
```

**Model Output:**
```
Certainly! I'd be happy to help you extract the email address from the provided text. 

The email address found in the text "Contact John at john.doe@example.com" is:

john.doe@example.com

This email appears to belong to someone named John Doe, based on the context provided. Email addresses typically follow the format of username@domain.extension...

[continues for 3 more paragraphs]
```

**Expected:** Just `john.doe@example.com`

### Root Cause

1. **Conversational training** - Models are trained to be helpful and verbose
2. **No output constraint** - Model assumes you want explanation
3. **Politeness bias** - Models add pleasantries by default

### Wrong Approach

```
Just give me the email, don't explain.
```

**Problem:** Still allows preamble and politeness.

### Correct Approach

**Technique 1: Direct Output Format**

```
Extract email from text. Output ONLY the email address, nothing else.

Text: "Contact John at john.doe@example.com"
```

**Technique 2: Template Enforcement**

```
Extract the email address.

Input: "Contact John at john.doe@example.com"
Output: [email only, no explanation]
```

**Technique 3: System Message (API)**

```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: "You are a data extraction tool. Output only the requested data with no preamble, explanation, or politeness. No markdown formatting."
    },
    {
      role: "user",
      content: "Extract email from: 'Contact John at john.doe@example.com'"
    }
  ]
});
```

**Technique 4: Few-Shot Examples**

```
Extract email addresses from text. Output only the email, nothing else.

Example 1:
Input: "Reach out to jane@company.com for details"
Output: jane@company.com

Example 2:
Input: "Email bob.smith@tech.org if interested"
Output: bob.smith@tech.org

Now do this:
Input: "Contact John at john.doe@example.com"
Output:
```

### Why This Works

- **System message** sets behavior at API level (highest priority)
- **"Output ONLY"** is explicit constraint
- **Few-shot examples** show exact format without ambiguity

---

## Issue #3: Invalid JSON Output

### Symptom

**Your Prompt:**
```
Extract name and email as JSON from: "John Doe, john@example.com"
```

**Model Output:**
```
Sure! Here's the JSON:

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

This JSON contains...
```

**Your Code:**
```javascript
const data = JSON.parse(response);
// Error: SyntaxError: Unexpected token S in JSON at position 0
```

**Problem:** Response has markdown code blocks and explanation text.

### Root Cause

1. **Markdown formatting** - Model wraps JSON in code blocks
2. **Extra text** - Preambles and explanations
3. **No schema enforcement** - Model guesses structure
4. **Inconsistent keys** - Model might use "full_name" vs "name"

### Wrong Approach

```
Return JSON without markdown.
```

**Problem:** Model might still add explanations. Not specific enough about schema.

### Correct Approach

**Technique 1: Explicit JSON-Only Instruction**

```
Extract data as JSON. Output ONLY valid JSON, no markdown formatting, no explanations.

Schema:
{
  "name": "string",
  "email": "string"
}

Input: "John Doe, john@example.com"
Output:
```

**Technique 2: Function Calling (OpenAI)**

```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "user", content: "Extract name and email from: 'John Doe, john@example.com'" }
  ],
  functions: [
    {
      name: "extract_contact",
      description: "Extract contact information",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Person's full name" },
          email: { type: "string", description: "Email address" }
        },
        required: ["name", "email"]
      }
    }
  ],
  function_call: { name: "extract_contact" }
});

const args = JSON.parse(response.choices[0].message.function_call.arguments);
// Guaranteed valid JSON: { name: "John Doe", email: "john@example.com" }
```

**Technique 3: Structured Output (OpenAI)**

```javascript
const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "user", content: "Extract name and email from: 'John Doe, john@example.com'" }
  ],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "contact_schema",
      strict: true,
      schema: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" }
        },
        required: ["name", "email"],
        additionalProperties: false
      }
    }
  }
});

// Guaranteed to match schema or API returns error
```

**Technique 4: Post-Processing (Fallback)**

```javascript
function extractJSON(text) {
  // Remove markdown code blocks
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // Find JSON object
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON found');
  
  return JSON.parse(match[0]);
}

const cleaned = extractJSON(response.content);
```

### Why This Works

- **Function Calling** enforces schema at API level (most reliable)
- **Structured Output** uses constrained decoding (100% guarantee)
- **Explicit schema** in prompt reduces ambiguity
- **Post-processing** handles legacy models or edge cases

---

## Issue #4: Model Not Following Format

### Symptom

**Your Prompt:**
```
List 3 programming languages. Format:
1. [Language] - [Use case]
```

**Model Output:**
```
Here are three popular programming languages:

• Python is great for data science
• JavaScript for web development  
• Go is used for backend systems
```

**Expected:**
```
1. Python - Data science and machine learning
2. JavaScript - Frontend and backend web development
3. Go - High-performance backend systems
```

### Root Cause

1. **Competing instructions** - Model prioritizes "helpfulness" over format
2. **Vague format specification** - "Format:" is not imperative enough
3. **No enforcement mechanism** - Model can ignore format without penalty

### Wrong Approach

```
Follow the format exactly!
```

**Problem:** Still not specific about what "exactly" means.

### Correct Approach

**Technique 1: Template with Placeholders**

```
List 3 programming languages using this EXACT template:

1. [LANGUAGE] - [USE_CASE]
2. [LANGUAGE] - [USE_CASE]
3. [LANGUAGE] - [USE_CASE]

Do not add any text before or after the list. Do not use bullet points. Numbers and dashes must be exactly as shown.
```

**Technique 2: Output Example First**

```
You must format your response exactly like this example:

Example:
1. Python - Data science
2. JavaScript - Web development
3. Go - Backend systems

Now list 3 database systems in the same format:
```

**Technique 3: Regex Validation Threat**

```
List 3 programming languages. Output must match this regex pattern:
^\d+\. \w+ - .+$

Format:
1. [Language] - [Use case]

Your output will be validated against the regex. Any deviation will fail.
```

**Technique 4: System Message + User Constraint**

```javascript
{
  role: "system",
  content: "You are an API that outputs data in exact formats. Never add preamble, explanations, or deviate from specified format."
},
{
  role: "user",
  content: `Output 3 languages in format:
1. [Language] - [Use case]
2. [Language] - [Use case]
3. [Language] - [Use case]`
}
```

### Why This Works

- **Exact template** removes interpretation space
- **Examples** are clearer than descriptions
- **Validation threat** signals importance (even if you don't validate)
- **System message** sets behavior mode upfront

---

## Issue #5: Forcing Structured Output (Production)

### Problem

You need **guaranteed** structured output for:
- API responses
- Database inserts
- UI rendering
- Downstream processing

Prompts alone are **unreliable** (~95% success rate).

### Production Solutions

#### Solution 1: OpenAI Function Calling

**Most reliable for GPT-4/GPT-3.5**

```javascript
const tools = [
  {
    type: "function",
    function: {
      name: "save_user_data",
      description: "Save extracted user information",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "integer" },
          email: { type: "string", format: "email" },
          interests: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["name", "email"]
      }
    }
  }
];

const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "user", content: "Extract: 'John, 30, john@test.com, loves coding and gaming'" }
  ],
  tools: tools,
  tool_choice: { type: "function", function: { name: "save_user_data" } }
});

const data = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments);
```

#### Solution 2: JSON Mode (OpenAI)

```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  response_format: { type: "json_object" },
  messages: [
    {
      role: "system",
      content: "Extract user data as JSON with keys: name, age, email, interests (array)"
    },
    {
      role: "user",
      content: "John, 30, john@test.com, loves coding and gaming"
    }
  ]
});

const data = JSON.parse(response.choices[0].message.content);
```

**Important:** You MUST mention "JSON" in the prompt when using `json_object` mode.

#### Solution 3: Structured Output (OpenAI Strict)

**Newest and most reliable (100% schema adherence)**

```javascript
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string(),
  age: z.number().int().positive(),
  email: z.string().email(),
  interests: z.array(z.string())
});

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "Extract user data" },
    { role: "user", content: "John, 30, john@test.com, loves coding and gaming" }
  ],
  response_format: zodResponseFormat(UserSchema, "user_data")
});

const data = completion.choices[0].message.parsed;
// Type-safe, guaranteed to match schema
```

#### Solution 4: Pydantic with Instructor (Python)

```python
from pydantic import BaseModel, EmailStr
from typing import List
import instructor
from openai import OpenAI

client = instructor.patch(OpenAI())

class UserData(BaseModel):
    name: str
    age: int
    email: EmailStr
    interests: List[str]

data = client.chat.completions.create(
    model="gpt-4",
    response_model=UserData,
    messages=[
        {"role": "user", "content": "John, 30, john@test.com, loves coding and gaming"}
    ]
)

print(data.model_dump())
# {'name': 'John', 'age': 30, 'email': 'john@test.com', 'interests': ['coding', 'gaming']}
```

#### Solution 5: Validation + Retry Pattern

```javascript
async function extractWithRetry(text, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Extract as JSON: {name: string, age: number, email: string, interests: string[]}"
        },
        { role: "user", content: text }
      ]
    });

    try {
      const data = JSON.parse(response.choices[0].message.content);
      
      // Validate schema
      if (!data.name || !data.email) {
        throw new Error('Missing required fields');
      }
      
      return data;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      // Retry with more explicit prompt
      console.log(`Attempt ${i + 1} failed, retrying...`);
    }
  }
}
```

---

## Common Mistakes

### Mistake #1: Assuming Models Read Like Humans

**Wrong:**
```
List the items in alphabetical order.
```

**Problem:** Model might alphabetize by first letter only, or ignore case.

**Correct:**
```
List items in strict alphabetical order (case-insensitive, full string comparison).

Example:
- Apple
- Banana
- Cherry

Not:
- Banana
- Apple
- cherry
```

### Mistake #2: Using Vague Constraints

**Wrong:**
```
Keep response brief.
```

**Correct:**
```
Response must be maximum 50 words.
```

### Mistake #3: Ignoring System Messages

**Wrong:**
```javascript
// All instructions in user message
messages: [
  { role: "user", content: "You are a JSON API. Extract name from 'John Doe'" }
]
```

**Correct:**
```javascript
messages: [
  { role: "system", content: "You are a JSON API. Output only valid JSON, no text." },
  { role: "user", content: "Extract name from 'John Doe'" }
]
```

System messages have higher priority than user messages.

### Mistake #4: Not Using Model-Specific Features

Each model family has strengths:

- **GPT-4/3.5**: Function calling, JSON mode
- **Claude**: Long context, markdown formatting
- **Llama**: Fast, good for constrained generation

Use the right tool for the job.

### Mistake #5: Over-Reliance on Model Behavior

**Never assume** the model will follow your format 100% of the time without enforcement.

**Always:**
- Use schema enforcement (function calling, Pydantic)
- Validate output
- Have fallback/retry logic

---

## Best Practices Checklist

### For Output Length

- [ ] Specify exact word/paragraph count
- [ ] Provide structural outline
- [ ] Define audience and detail level
- [ ] Use few-shot examples for expected length

### For Output Format

- [ ] Use system message to set behavior mode
- [ ] Provide exact template with placeholders
- [ ] Show format examples, not just descriptions
- [ ] Specify what NOT to include (e.g., "no markdown")

### For JSON/Structured Output

- [ ] Use function calling or structured output API features
- [ ] Define complete schema upfront
- [ ] Validate output with Zod/Pydantic
- [ ] Implement retry logic with error feedback
- [ ] Strip markdown/extra text in post-processing

### For Production Reliability

- [ ] Use explicit system messages
- [ ] Prefer API-level constraints over prompt instructions
- [ ] Test with edge cases (empty input, special characters)
- [ ] Log failures for prompt refinement
- [ ] Set temperature=0 for deterministic output
- [ ] Monitor success rate and iterate

---

## Quick Reference: Output Control Parameters

```javascript
// GPT-4 optimal settings for structured output
{
  model: "gpt-4-turbo",
  temperature: 0,              // Deterministic
  max_tokens: 500,             // Limit length
  response_format: { type: "json_object" },
  messages: [
    {
      role: "system",
      content: "Output only valid JSON. No explanations."
    },
    // ...
  ]
}
```

**Temperature:**
- `0.0` - Deterministic, consistent (use for structured output)
- `0.3-0.7` - Balanced (use for creative but controlled)
- `1.0+` - Creative, unpredictable (avoid for production APIs)

**Max Tokens:**
- Set to reasonable limit to prevent verbosity
- 500 for structured data extraction
- 1000 for explanations
- 2000+ for long-form content

---

## Debugging Workflow

When output is wrong:

1. **Check system message** - Is behavior mode set?
2. **Review prompt clarity** - Remove ambiguity
3. **Add few-shot examples** - Show exact format
4. **Enable JSON mode** - If using JSON
5. **Lower temperature** - Reduce randomness
6. **Use function calling** - For guaranteed structure
7. **Log failures** - Analyze patterns
8. **Iterate prompt** - Based on failure modes

---

## Conclusion

LLM output control is **engineering**, not magic:

- **Short output** → Specify length explicitly
- **Verbose output** → Use system message + constraints
- **Invalid JSON** → Function calling or structured output
- **Format ignored** → Templates + examples + validation

**The hierarchy of reliability:**

1. Structured Output API (100% schema adherence)
2. Function Calling (99% reliability)
3. JSON Mode + validation (95% reliability)
4. Prompt engineering alone (80-90% reliability)

For production, **always use #1 or #2**. Prompts are documentation, not enforcement.

> **Pro Tip**: Start with the strictest method (Structured Output) and only fall back to prompts if your model doesn't support it. Don't try to "fix" a prompt that should be a schema.
