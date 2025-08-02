import { useState } from "react";
import { askQuestion } from "../api";

export default function QuestionBox() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    const { answer: apiAnswer, error } = await askQuestion(question);
    setAnswer(error || apiAnswer);
    setIsLoading(false);
  };

  return (
    <div className="question-box">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Thinking..." : "Ask"}
        </button>
      </form>
      {answer && <div className="answer">{answer}</div>}
    </div>
  );
}