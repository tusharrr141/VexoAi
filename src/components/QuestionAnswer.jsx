import Answer from './Answers';

const QuestionAnswer = ({ item, index }) => {
  const isQuestion = item.type === 'q';

  return (
    <div
      key={index}
      className={`py-2 px-4 w-full flex ${isQuestion ? 'justify-end' : 'justify-start'}`}
    >
      {/* For questions: single Answer bubble */}
      {isQuestion ? (
        <Answer
          ans={item.text}
          totalResult={1}
          index={index}
          type={item.type}
        />
      ) : (
        // For answers: render text safely as an array
        <div className="flex flex-col space-y-2 max-w-[80%] bg-zinc-200 dark:bg-zinc-700 rounded-xl py-2">
          {(Array.isArray(item.text) ? item.text : [item.text]).map((ansItem, ansIndex) => (
            <Answer
              key={ansIndex}
              ans={ansItem}
              totalResult={1}
              index={ansIndex}
              type={item.type}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionAnswer;
