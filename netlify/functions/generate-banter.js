exports.handler = async function(event, context) {
  const { prompt, mood } = JSON.parse(event.body);
  const systemPrompt = `You're a witty, sarcastic, stream-savvy AI that generates one-liner banter for a Twitch streamer. It should feel human, off-the-cuff, and fit the selected tone.`;

  const userPrompt = `Make a single banter line about: "${prompt}". The tone should be "${mood}".`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4", // or "gpt-3.5-turbo"
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.9,
        max_tokens: 100
      })
    });

    const data = await response.json();
    const result = data.choices[0].message.content.trim();
    return {
      statusCode: 200,
      body: JSON.stringify({ line: result })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GPT call failed", details: err.message })
    };
  }
};
