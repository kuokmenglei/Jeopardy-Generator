const API_URL = "https://rithm-jeopardy.herokuapp.com/api/"; // The URL of the API.
const NUMBER_OF_CATEGORIES = 5; // The number of categories you will be fetching. You can change this number.
const NUMBER_OF_CLUES_PER_CATEGORY = 5; // The number of clues you will be displaying per category. You can change this number.

function changeCursor(element, cursorType) {
  element.style.cursor = cursorType;
}

function validateYouTubeUrl(url) {
  // Regular expression to match YouTube video URLs
  const youtubePattern =
    /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(watch\?v=|embed\/|v\/|e\/|.+\/)([a-zA-Z0-9_-]{11})(\S*)$/;

  // Test the URL against the regular expression
  return youtubePattern.test(url);
}

function transposeTable(table) {
  const numRows = table.rows.length;

  if (numRows == 0) return;

  const numCols = table.rows[0].cells.length;
  const newTable = document.createElement("table");

  for (let i = 0; i < numCols; i++) {
    const newRow = newTable.insertRow();
    for (let j = 0; j < numRows; j++) {
      const cell = newRow.insertCell();
      cell.innerHTML = table.rows[j].cells[i].innerHTML;
    }
  }

  if (table.parentNode == null) return;

  table.parentNode.replaceChild(newTable, table);
}

document.addEventListener("DOMContentLoaded", function () {
  const generator = document.getElementById("Jeopardy-Generator");
  const boxContainer = document.getElementById("box-container");
  const colorForm = document.getElementById("color-form");
  const imageInput = document.getElementById("iamge-input");
  const texttopInput = document.getElementById("text-top-input");
  const textbottomput = document.getElementById("text-bottom-input");
  const textScoreInput = document.getElementById("text-score-input");
  const newBoxButton = document.getElementById("new-box-button");
  const newGameButton = document.getElementById("new-game-button");

  const newBoxLabel = document.getElementById("box-container-header");
  newBoxLabel.style.display = "none";

  let ClientRectWidth = 0;

  /*
  imageInput.value =
    "https://cdn.accentuate.cloud/images/1666656/Skinnydip-London_Hello-Kitty-And-Friends_Phone-Wallpaper-v1711554781111.jpg";
  */
  imageInput.value = "https://www.youtube.com/embed/wCQfkEkePx8";
  texttopInput.value = "This is the signature Burger at Burger King";
  textbottomput.value = "What is the Whopper";
  textScoreInput.value = "100";

  let boxIdCounter = 0;

  async function setupTheGame() {
    newBoxLabel.innerHTML = "";
    boxContainer.innerHTML = "";
    newBoxLabel.style.display = "none";

    document.getElementById("spinner").style.display = "block";

    newGameButton.textContent = "Loading...";

    const categoryIds = await getCategoryIds();
    const categoriesData = await Promise.all(
      categoryIds.map((id) => getCategoryData(id))
    );

    fillTable(categoriesData);

    document.getElementById("spinner").style.display = "none";

    newGameButton.textContent = "Restart the Game!";
  }

  async function getCategoryIds() {
    const ids = [];

    try {
      const response = await fetch(
        `${API_URL}categories?$count=${NUMBER_OF_CATEGORIES}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      //console.info(data);

      // Randomly pick categories with enough clues
      const eligibleCategories = data.filter(
        (data) => data.clues_count >= NUMBER_OF_CLUES_PER_CATEGORY
      );
      //const shuffled = eligibleCategories.sort(() => 0.5 - Math.random());
      //const selectedCategories = shuffled.slice(0, NUMBER_OF_CATEGORIES);

      const selectedCategories = eligibleCategories.slice(
        0,
        NUMBER_OF_CATEGORIES
      );

      selectedCategories.forEach((category) => ids.push(category.id));

      return ids;
    } catch (error) {
      console.error("There was an error fetching the data:", error);
      throw error;
    }
  }

  async function getCategoryData(categoryId) {
    const response = await fetch(`${API_URL}category?id=${categoryId}`);
    const data = await response.json();

    //console.info(data);

    const categoryWithClues = {
      id: categoryId,
      title: data.title,
      clues: data.clues.slice(0, NUMBER_OF_CLUES_PER_CATEGORY).map((clue) => ({
        id: clue.id,
        value: clue.value || "$200",
        question: clue.question,
        answer: clue.answer,
      })),
    };

    return categoryWithClues;
  }

  function fillTable(categories) {
    let titles = [];
    /*
    categories.forEach((category) => {
      titles.push(category.title);
    });
    */

    categories.forEach((category) => titles.push(category.title));
    /*
    const headerRow = document.createElement("tr");

    categories.forEach((category) => {
      const header = document.createElement("th");
      header.textContent = category.title;
      headerRow.appendChild(header);

      let tmp = category.clues;
      titles.push(tmp);
    });

    boxContainer.appendChild(headerRow);
    */

    categories.forEach((category) => {
      category.clues.forEach((clue) => {
        const myElement = addNewBox(
          boxIdCounter.toString(),
          clue.question,
          clue.answer,
          clue.value,
          ""
        );

        if (myElement) {
          if ((boxIdCounter - 1) % NUMBER_OF_CLUES_PER_CATEGORY == 0) {
            const newRow = document.createElement("tr");

            const td1 = document.createElement("td");
            td1.appendChild(myElement);
            newRow.appendChild(td1);

            boxContainer.appendChild(newRow);
          } else {
            const td1 = document.createElement("td");
            td1.append(myElement);
            var lastRow = boxContainer.rows[boxContainer.rows.length - 1];
            lastRow.append(td1);
          }

          //alert(boxContainer.innerHTML);
          //console.log(boxContainer.innerHTML);
        } else {
          console.log("Element not found");
        }
      });
    });

    newBoxLabel.innerHTML = titles.join("___________________");
    //newBoxLabel.innerHTML = titles.join("XXXXXXXXXXXXXXXXXXX");

    if (ClientRectWidth == 0) {
      ClientRectWidth = boxContainer.getBoundingClientRect().width;
    }

    newBoxLabel.style.width = ClientRectWidth + "px";
    newBoxLabel.style.display = "block";
    //newBoxLabel.style.color = "white";
    console.log(boxContainer.getBoundingClientRect().width);

    transposeTable(boxContainer);
  }

  function addNewBox(
    data_box_id,
    data_top_input,
    data_bottom_input,
    data_score_input,
    data_youtube_input
  ) {
    const box = document.createElement("div");
    box.setAttribute("data-box-id", data_box_id);
    box.setAttribute("data-top-input", data_top_input);
    box.setAttribute("data-bottom-input", data_bottom_input);
    box.setAttribute("data-score-input", data_score_input);

    box.className = "box";
    //box.style.backgroundColor = boxColor;
    //https://cdn.accentuate.cloud/images/1666656/Skinnydip-London_Hello-Kitty-And-Friends_Phone-Wallpaper-v1711554781111.jpg

    if (!validateYouTubeUrl(data_youtube_input)) {
      var urlString = "url('" + data_youtube_input + "')";
      box.style.backgroundImage = urlString;
    } else {
      box.setAttribute("data-youtube-input", data_youtube_input);
    }

    box.style.backgroundSize = "cover";

    const texttop = document.createElement("div");
    texttop.textContent = data_top_input;
    texttop.className = "top-text";
    texttop.style.display = "none";
    box.append(texttop);

    const textbottom = document.createElement("div");
    textbottom.textContent = data_bottom_input;
    textbottom.className = "bottom-text";
    textbottom.style.display = "none";
    box.append(textbottom);

    const textScore = document.createElement("div");
    textScore.textContent = data_score_input;
    textScore.className = "score-text";
    textScore.style.display = "block";
    box.append(textScore);

    const closeBtn = document.createElement("div");
    closeBtn.textContent = "O";
    closeBtn.className = "close-Btn";
    closeBtn.style.display = "none";
    //closeBtn.style.display = "block";
    box.append(closeBtn);

    const textHint = document.createElement("div");
    textHint.textContent =
      "Continue <ESC> and Reveal Correct Response <Spacebar>";
    //textHint.className = "score-text";
    textHint.style.display = "none";
    box.append(textHint);

    //alert(boxContainer.rows[boxContainer.rows.length - 1].innerHTML);

    boxIdCounter++;

    return box;
  }

  colorForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var x = textScoreInput.value.trim().toString();
    var regex = /^[0-9]+$/;
    if (!regex.test(x)) {
      alert("Must input numbers for Score");
      return;
    }

    const myElement = addNewBox(
      boxIdCounter.toString(),
      texttopInput.value.trim().toString(),
      textbottomput.value.trim().toString(),
      textScoreInput.value.trim().toString(),
      imageInput.value.trim()
    );

    if (myElement) {
      //console.log("Element found:", myElement);

      if ((boxIdCounter - 1) % NUMBER_OF_CLUES_PER_CATEGORY == 0) {
        const newRow = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.appendChild(myElement);
        newRow.appendChild(td1);

        boxContainer.appendChild(newRow);
      } else {
        const td1 = document.createElement("td");
        td1.append(myElement);
        var lastRow = boxContainer.rows[boxContainer.rows.length - 1];
        lastRow.append(td1);
      }

      //console.log(boxContainer);

      //boxContainer.appendChild(myElement);
    } else {
      console.log("Element not found");
    }

    imageInput.value = "";
    texttopInput.value = "";
    textbottomput.value = "";

    textScoreInput.value = "";
  });

  newGameButton.addEventListener("click", function () {
    setupTheGame();
  });

  //dblclick
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("box")) {
      //event.target.remove();
      //full screen

      //const currentElement = event.target;

      boxContainer.setAttribute(
        "data-full-box-id",
        event.target.getAttribute("data-box-id")
      );

      /*
      const childElements = boxContainer.children;
      for (const child of childElements) {
      }
      */
      //boxContainer.style.display = "none";

      //newBoxLabel.innerHTML = "";

      const childElements = boxContainer.children;
      console.log(event.target);
      //console.log(boxContainer);
      for (const child of childElements) {
        const trElements = child.children;
        for (const tdElements of trElements) {
          for (const divElements of tdElements.children) {
            if (
              boxContainer.getAttribute("data-full-box-id") ===
              divElements.getAttribute("data-box-id")
            ) {
              const clonedElement = divElements.cloneNode(true); // Deep clone

              clonedElement.className = "box-full";

              clonedElement.children[0].style.display = "block";
              clonedElement.children[1].style.display = "none";
              clonedElement.children[2].style.display = "block";

              clonedElement.children[4].style.display = "block";

              if (clonedElement.getAttribute("data-youtube-input") === null) {
              } else if (
                clonedElement.getAttribute("data-youtube-input") === ""
              ) {
              } else {
                const videoContainer = document.createElement("div");
                videoContainer.classList.add("video-container");

                // Create the iframe element
                const iframe = document.createElement("iframe");

                // Set the iframe attributes
                iframe.src = clonedElement.getAttribute("data-youtube-input");
                //iframe.width = event.target.width - 20; // Width of the iframe
                //iframe.height = event.target.height - 20; // Height of the iframe
                iframe.className = "video-full";

                iframe.frameBorder = "0"; // Optional: to remove the frame border
                iframe.allow =
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"; // Allows certain permissions
                //iframe.allowFullscreen = true; // Optional: allows fullscreen mode

                // Append the iframe to the video container
                videoContainer.appendChild(iframe);

                //iframe.style.height = parseInt(iframe.style.height.slice(0, -2)) - 50 + "px";
                clonedElement.append(videoContainer);
              }

              clonedElement.style.display = "blcok";

              document.getElementById("full-clone").append(clonedElement);

              document.getElementById("Jeopardy-Content").style.display =
                "none";

              console.log("divElements found!");
            }
          }
        }
      }

      //console.log(event.target);
      //console.log(boxContainer);

      generator.style.display = "none";
    }
  });

  document.addEventListener("mouseover", function (event) {
    if (event.target.classList.contains("box")) {
      //event.target.textContent = `x: ${event.pageX}, y: ${event.pageY}`;
      event.target.children[0].style.display = "block";
      event.target.children[1].style.display = "none";
      event.target.children[2].style.display = "none";
      event.target.children[3].style.display = "block";
      event.target.children[4].style.display = "none";

      changeCursor(event.target, "pointer");
    }
  });

  document.addEventListener("mouseout", function (event) {
    if (event.target.classList.contains("box")) {
      const boxId = event.target.getAttribute("data-box-id");
      const topText = event.target.getAttribute("data-top-input");
      const bottomText = event.target.getAttribute("data-bottom-input");
      const scoreText = event.target.getAttribute("data-score-input");
      //event.target.textContent = `Box ${boxId}`;
      //event.target.textContent = topText + "    " + bottomText;

      event.target.children[0].style.display = "none";
      event.target.children[1].style.display = "none";
      event.target.children[2].style.display = "block";
      event.target.children[3].style.display = "none";
      event.target.children[4].style.display = "none";

      changeCursor(event.target, "auto");
    }
  });

  window.addEventListener("keydown", function (event) {
    if (event.target.id === "iamge-input") {
      return;
    }

    if (event.target.id === "text-top-input") {
      return;
    }

    if (event.target.id === "text-bottom-input") {
      return;
    }

    if (event.target.id === "text-score-input") {
      return;
    }

    if (event.key === "n" || event.key === "N") {
      //addNewBox();
    }

    if (event.key === "Escape" || event.keyCode === 27) {
      //event.target.className = "box";
      generator.style.display = "block";

      const childElements = boxContainer.children;
      for (const child of childElements) {
        const trElements = child.children;
        for (const tdElements of trElements) {
          for (const divElements of tdElements.children) {
            if (
              boxContainer.getAttribute("data-full-box-id") ===
              divElements.getAttribute("data-box-id")
            ) {
              divElements.className = "box";

              divElements.children[0].style.display = "none";
              divElements.children[1].style.display = "none";
              divElements.children[2].style.display = "block";
              divElements.children[3].style.display = "none";
              divElements.children[4].style.display = "none";

              if (divElements.childElementCount == 6) {
                //divElements.children[5].style.display = "none";
                divElements.children[5].remove();
              }

              boxContainer.setAttribute("data-full-box-id", "");

              document.getElementById("full-clone").innerHTML = "";

              // while (document.getElementById("full-clone").firstChild) {
              //   document
              //     .getElementById("full-clone")
              //     .removeChild(
              //       document.getElementById("full-clone").firstChild
              //     );
              // }

              document.getElementById("Jeopardy-Content").style.display =
                "block";

              console.log(document.getElementById("full-clone"));
            }
          }
        }
      }
    }

    if (event.keyCode === 32 || event.which === 32) {
      // Space key was pressed
      //event.target.className = "box";

      const childElements = boxContainer.children;
      for (const child of childElements) {
        const trElements = child.children;
        for (const tdElements of trElements) {
          for (const divElements of tdElements.children) {
            if (
              boxContainer.getAttribute("data-full-box-id") ===
              divElements.getAttribute("data-box-id")
            ) {
              console.log("equal");

              document.getElementById(
                "full-clone"
              ).children[0].children[1].style.display = "block";
            }
          }
        }
      }

      console.log("Space key pressed");
    }
  });
});
