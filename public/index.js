const wordCard = document.querySelector("#word-card");
const inputQuestionRef = document.querySelector("#question");
const inputAnswerRef = document.querySelector("#answer");
const addButtonRef = document.querySelector("#addButton");
const url = "http://localhost:3000";
const listShowButton = document.querySelector("#list-show-button");
var onShowAnswer = true;
var random = 0;
const wordListRef = document.querySelector("#word-list");
var registeredWords = [];

//データベースの単語を取得
const handleGetItems = async () => {
  const res = await fetch(`${url}/memory`);
  registeredWords = await res.json();
  console.log("クライアント" + registeredWords[0].answer);
  wordListRef.innerHTML = ""; // 以前の内容をクリア
  registeredWords.forEach((word) => {
    const wordListItemRef = document.createElement("div");
    wordListItemRef.className = "word-list-item";
    wordListItemRef.innerText = `単語：${word.question} 意味：${word.answer}`;
    wordListRef.appendChild(wordListItemRef);

    const wordEditorsRef = document.createElement("dev");
    wordEditorsRef.className = "word-editors";
    wordEditorsRef.id = `word_${word.id}`;
    wordListItemRef.appendChild(wordEditorsRef);

    const editButtonRef = document.createElement("button");
    editButtonRef.className = "edit-Button";
    editButtonRef.textContent = "編集";
    editButtonRef.addEventListener("click", () => {
      handleEditItem(word.id);
    });
    wordEditorsRef.appendChild(editButtonRef);

    const deleteButtonRef = document.createElement("button");
    deleteButtonRef.className = "delete-button";
    deleteButtonRef.textContent = "削除";
    deleteButtonRef.addEventListener("click", () => {
      handleDeleteItem(word.id);
    });
    wordEditorsRef.appendChild(deleteButtonRef);
  });
};

//単語の登録
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
  await handleGetItems();
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

//単語一覧の表示・非表示の切り替え
const ShowWordList = () => {
  if (wordListRef.classList.contains("hidden")) {
    wordListRef.classList.remove("hidden");
  } else {
    wordListRef.classList.add("hidden");
  }
};

listShowButton.addEventListener("click", () => {
  ShowWordList();
});

//単語の編集
const handleEditItem = async (id) => {
  const wordRef = document.querySelector(`#word_${id}`);
  if (wordRef.childElementCount < 3) {
    const editPart = document.createElement("div");
    editPart.id = `edit_${id}`;
    editPart.innerHTML = `<div>
    <label for="question">英単語:</label>
    <input type="text" id="edit-question_${id}" />
    <label for="answer">単語の意味:</label>
    <input type="text" id="edit-answer_${id}" />
  </div>`;
    wordRef.appendChild(editPart);
    const updateButton = document.createElement("button");
    updateButton.textContent = "更新";
    updateButton.addEventListener("click", () => {
      updateWord(id);
    });
    editPart.appendChild(updateButton);
  } else {
    const editPartRef = document.querySelector(`#edit_${id}`);
    editPartRef.remove();
  }
};

//編集した単語の更新
const updateWord = async (id) => {
  const editQuestionRef = document.querySelector(`#edit-question_${id}`);
  const editAnswerRef = document.querySelector(`#edit-answer_${id}`);
  const question = editQuestionRef.value;
  const answer = editAnswerRef.value;
  const status = 1;
  await fetch(`${url}/memory/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: question,
      answer: answer,
      status: status,
    }),
  });
  await handleGetItems();
};

//単語の削除
const handleDeleteItem = async (id) => {
  await fetch(`${url}/memory/${id}`, {
    method: "DELETE",
  });
  await handleGetItems();
};

//単語のテスト
const startTest = () => {
  if (onShowAnswer) {
    const wordsNum = registeredWords.length;
    random = Math.floor(Math.random() * wordsNum);
    wordCard.textContent = registeredWords[random].question;
    onShowAnswer = false;
  } else {
    wordCard.textContent = registeredWords[random].answer;
    onShowAnswer = true;
  }
};

wordCard.addEventListener("click", () => {
  startTest();
});

window.addEventListener("load", handleGetItems);
