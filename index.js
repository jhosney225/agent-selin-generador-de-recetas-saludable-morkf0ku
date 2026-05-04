const Anthropic = require('@anthropic-ai/sdk').default;

const client = new Anthropic();

async function generateHealthyRecipe(dietType = 'balanced', calorieTarget = 500) {
  const systemPrompt = `You are a professional nutritionist and chef specializing in healthy recipes. 
You provide detailed, nutritionally balanced recipes with accurate calorie counts.
Always format your response with the following structure:
- Recipe Name
- Servings
- Prep Time and Cook Time
- Ingredients (with quantities and individual calories)
- Instructions (step by step)
- Nutritional Information (total calories, protein, carbs, fat, fiber)
- Health Benefits`;

  const userPrompt = `Generate a ${dietType} healthy recipe with approximately ${calorieTarget} calories per serving. 
Make it practical, delicious, and include exact calorie counts for all ingredients.
The recipe should be suitable for someone trying to maintain a healthy lifestyle.`;

  console.log(`\n🥗 Generating ${dietType} recipe with ~${calorieTarget} calories...\n`);
  console.log('─'.repeat(60));

  const stream = await client.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt
      }
    ]
  });

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      process.stdout.write(chunk.delta.text);
    }
  }

  console.log('\n' + '─'.repeat(60));
  return stream.finalMessage;
}

async function generateMealPlan(days = 3, caloriePerDay = 2000) {
  const systemPrompt = `You are an expert meal planner and nutritionist.
Create practical, healthy meal plans with accurate calorie tracking.
Always include breakfast, lunch, dinner, and optional snacks.
Format each day clearly with meal names and calorie counts.`;

  const userPrompt = `Create a ${days}-day healthy meal plan with approximately ${caloriePerDay} calories per day.
Include variety, seasonal ingredients, and practical recipes.
Show calorie counts for each meal and daily totals.`;

  console.log(`\n📅 Generating ${days}-day meal plan with ${caloriePerDay} calories/day...\n`);
  console.log('─'.repeat(60));

  const stream = await client.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt
      }
    ]
  });

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      process.stdout.write(chunk.delta.text);
    }
  }

  console.log('\n' + '─'.repeat(60));
  return stream.finalMessage;
}

async function generateRecipeWithDietaryRestrictions(restrictions = [], calorieTarget = 400) {
  const restrictionText = restrictions.length > 0 ? restrictions.join(', ') : 'none';
  
  const systemPrompt = `You are a specialized chef experienced with dietary restrictions.
Create recipes that accommodate specific dietary needs while maintaining nutrition and taste.
Always clearly mark which restrictions each recipe accommodates.
Provide detailed ingredient lists with calorie counts and clear substitution options.`;

  const userPrompt = `Create a healthy recipe that avoids: ${restrictionText}
Target approximately ${calorieTarget} calories per serving.
Make sure the recipe is delicious and nutritionally complete despite the restrictions.
Suggest healthy alternatives for common ingredients if applicable.`;

  console.log(`\n🍽️ Generating recipe avoiding: ${restrictionText} (~${calorieTarget} cal)...\n`);
  console.log('─'.repeat(60));

  const stream = await client.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt
      }
    ]
  });

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      process.stdout.write(chunk.delta.text);
    }
  }

  console.log('\n' + '─'.repeat(60));
  return stream.finalMessage;
}

async function main() {
  console.log('🌟 Healthy Recipe Generator with Calorie Counter\n');
  console.log('='.repeat(60));

  try {
    // Generate different types of recipes
    await generateHealthyRecipe('Mediterranean', 450);
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a quick meal plan
    await generateMealPlan(2, 1800);
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate recipe with dietary restrictions
    await generateRecipeWithDietaryRestrictions(['gluten', 'dairy'], 350);
    
    console.log('\n' + '='.repeat(60));
    console.log('✨ Recipe generation complete!');
  } catch (error) {
    console.error('Error generating recipes:', error);
    process.exit(1);
  }
}

main();