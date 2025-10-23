export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { diary, style } = req.body;

  if (!diary || diary.trim() === "") {
    return res.status(400).json({ error: "Diary text required." });
  }

  try {
    // Adjust prompt for Seinfeld style
    const stylePrompt =
      style === "seinfeld"
        ? `Rewrite this diary entry in the style of Seinfeld: observational humor, mundane life exaggerated, witty, and ironic. Keep it under 200 words.`
        : `Rewrite this diary entry in a ${style} tone, making it sound like an epic or poetic story.Keep it under 200 words.:`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a talented novelist who turns dull diaries into emotionally powerful, poetic, or epic stories. Use vivid imagery and emotion.Keep the rewrite concise, under 200 words.`,
          },
          {
            role: "user",
            content: `${stylePrompt}\n\n${diary}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || "No response.";
    res.status(200).json({ result: output });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to rewrite diary." });
  }
}
