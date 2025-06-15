import Answer from './Answers';

const QuestionAnswer = ({ item, index }) => {
  const isQuestion = item.type === 'q';

  return (
    <div
      key={index}
      className={`my-2 px-4 w-full flex ${isQuestion ? 'justify-end' : 'justify-start'}`}
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
        // For answers: render each bullet point or paragraph
        <div className="flex flex-col space-y-2 max-w-[80%]">
          {item.text.map((ansItem, ansIndex) => (
            <Answer
              key={ansIndex}
              ans={ansItem}
              totalResult={item.text.length}
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
