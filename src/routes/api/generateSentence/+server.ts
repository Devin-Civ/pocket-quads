import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import promptsData from '$lib/gptPrompts.json';
import { OPENAI_API_KEY } from '$env/static/private';

export const POST = async () => {
	const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

	const currentPrompt = promptsData.prompts.find((prompt) => prompt.id === 3);

	if (!currentPrompt || !currentPrompt.prompt) {
		return json({ error: 'Prompt not found or invalid' }, { status: 400 });
	}

	const completion = await openai.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			{ role: 'system', content: currentPrompt.prompt },
			{ role: 'user', content: 'Generate a random sentence' }
		]
	});

	const randomSentence = completion.choices[0].message.content;
	return json({ randomSentence });
};
