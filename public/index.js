const wordCard = document.querySelector("#word-card");
const inputQuestionRef = document.querySelector("#question");
const inputAnswerRef = document.querySelector("#answer");
const addButtonRef = document.querySelector("#addButton");
const url = "http://localhost:3000";

const handleGetItems = async () => {
  const res = await fetch(`${url}/memory`);
  const memories = await res.json();
  console.log("クライアント" + memories[0].answer);
  wordCard.textContent = memories[0].question;
  wordCard.addEventListener("click", () => showAnswer(memories, 0));
};

const showAnswer = (memories, index) => {
  wordCard.textContent = memories[index].answer;
};

const addWord = async () => {
  const question = inputQuestionRef.value;
  const answer = inputAnswerRef.value;
  const status = 1;
  //TODOステイタスも追加する
  console.log(question + answer);
  await fetch(`${url}/memory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: question,
      answer: answer,
      status: status,
    }),
  });
};

addButtonRef.addEventListener("click", async () => {
  if (inputAnswerRef.value && inputQuestionRef.value) {
    await addWord();
    alert("単語の登録ができました。");
  } else {
    alert("登録する単語と意味をどちらも入力してください");
    return;
  }
});

window.addEventListener("load", handleGetItems);
