const wordCard = document.querySelector("#word-card");

const url = "http://localhost:3000";
const handleGetItems = async () => {
  const res = await fetch(`${url}/memory`);
  const memories = await res.json();
  console.log("クライアント" + memories[0].answer);
  wordCard.textContent = memories[0].question;
  wordCard.addEventListener("click", ()=>showAnswer(memories, 0));
};

const showAnswer = (memories, index) => {
  wordCard.textContent = memories[index].answer;
};

window.addEventListener("load", handleGetItems);
