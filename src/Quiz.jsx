import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Quiz({ onLogout }) {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const fetchQuestions = async () => {
    if (!topic || !type || !amount) {
      alert("Please select topic, type, and number of questions!");
      return;
    }

    const url = `https://opentdb.com/api.php?amount=${amount}&category=${topic}&type=${type}`;
    const res = await fetch(url);
    const data = await res.json();
    setQuestions(data.results);
    setAnswers({});
    setFinished(false);
  };

  const handleAnswer = (qIndex, answer, correct) => {
    if (answers[qIndex]) return;
    setAnswers({ ...answers, [qIndex]: answer === correct ? "correct" : "wrong" });
  };

  const score = Object.values(answers).filter((val) => val === "correct").length;

  return (
    <motion.div
      className="card max-w-2xl w-full"
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <motion.h2
          className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          BrainBuzz Quiz
        </motion.h2>
        <motion.button
          className="btn-ghost"
          onClick={onLogout}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Logout
        </motion.button>
      </div>

      {/* Quiz setup */}
      {!questions.length && !finished && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <select
            className="input w-full mb-2"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="">Select Topic</option>
            <option value="9">General Knowledge</option>
            <option value="21">Sports</option>
            <option value="23">History</option>
            <option value="17">Science & Nature</option>
          </select>

          <select
            className="input w-full mb-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="multiple">Multiple Choice</option>
            <option value="boolean">True / False</option>
          </select>

          <input
            type="number"
            className="input w-full mb-2"
            placeholder="Number of Questions"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <motion.button
            onClick={fetchQuestions}
            className="btn-primary w-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Quiz
          </motion.button>
        </motion.div>
      )}

      {/* Questions */}
      <AnimatePresence>
        {questions.length > 0 && !finished && (
          <motion.div
            key="quiz-questions"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
          >
            {questions.map((q, i) => (
              <motion.div
                key={i}
                className="mb-6 p-4 rounded-lg bg-gray-800 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <p
                  className="font-semibold mb-2"
                  dangerouslySetInnerHTML={{ __html: q.question }}
                />
                {[...q.incorrect_answers, q.correct_answer]
                  .sort()
                  .map((opt) => (
                    <motion.button
                      key={opt}
                      onClick={() => handleAnswer(i, opt, q.correct_answer)}
                      className={`block w-full text-left px-4 py-2 rounded-xl mb-2 transition-colors ${
                        answers[i] === undefined
                          ? "bg-gray-700 hover:bg-gray-600"
                          : opt === q.correct_answer
                          ? "bg-green-600"
                          : answers[i] === "wrong" && opt !== q.correct_answer
                          ? "bg-red-600"
                          : "bg-gray-700"
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      dangerouslySetInnerHTML={{ __html: opt }}
                    />
                  ))}
              </motion.div>
            ))}

            {/* End Quiz button */}
            <motion.button
              onClick={() => setFinished(true)}
              className="btn-primary w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              End Quiz
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {finished && (
          <motion.div
            key="quiz-results"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-center"
          >
            <p className="text-lg font-semibold mb-4">
              Your Score: {score}/{questions.length}
            </p>
            <motion.button
              onClick={fetchQuestions}
              className="btn-primary w-full mb-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retake Quiz
            </motion.button>
            <motion.button
              onClick={() => setQuestions([])}
              className="btn-ghost w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              New Quiz Setup
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
