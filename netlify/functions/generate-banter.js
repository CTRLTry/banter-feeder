exports.handler = async function(event, context) {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No request body provided." }),
      };
    }

    let parsed;
    try {
      parsed = JSON.parse(event.body);
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON format." }),
      };
    }

    const { prompt, mood } = parsed;

    // 👇 HERE is where you set the model dynamically
    const model = process.env.USE_GPT_4 === "true" ? "gpt-4o" : "gpt-3.5-turbo";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You're a clever Twitch banter writer." },
          { role: "user", content: `Write a banter line about: "${prompt}" in a "${mood}" tone.` }
        ],
        temperature: 0.9,
        max_tokens: 100
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "OpenAI API error", details: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ line: data.choices[0].message.content.trim() })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Function error", details: err.message })
    };
  }
};
