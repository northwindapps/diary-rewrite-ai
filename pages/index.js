import { useState } from "react";

export default function Home() {
  const [diary, setDiary] = useState("");
  const [style, setStyle] = useState("dramatic");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!diary.trim()) return;
    setLoading(true);
    setResult("");

    const res = await fetch("/api/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ diary, style }),
    });
    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  const shareText = encodeURIComponent(result);
  const shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;

  return (
    <main className="flex flex-col items-center p-10 min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-700">
          ✨ Diary Rewrite AI
        </h1>
        <p className="text-center text-gray-600 mb-6 italic">
          “Because even an ordinary life can sound like a legend.”
        </p>

        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none resize-none"
          rows={6}
          placeholder="Write your diary entry here..."
          value={diary}
          onChange={(e) => setDiary(e.target.value)}
        />

        <div className="flex justify-between items-center mt-4">
          <select
            className="p-2 border rounded-lg text-gray-700"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            <option value="dramatic">Dramatic</option>
            <option value="fantasy">Fantasy Epic</option>
            <option value="romantic">Romantic</option>
            <option value="shakespearean">Shakespearean</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="seinfeld">Seinfeld</option>
          </select>

          <button
            onClick={submit}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
          >
            {loading ? "Rewriting..." : "Rewrite"}
          </button>
        </div>

        {result && (
          <div className="mt-8 bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-inner">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              ✍️ Your Epic Rewrite:
            </h2>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {result}
            </p>

            <div className="mt-4 flex justify-end">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:underline"
              >
                Share on X (Twitter)
              </a>
            </div>
          </div>
        )}
      </div>
      <footer className="mt-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} Diary Rewrite AI
      </footer>
    </main>
  );
}
