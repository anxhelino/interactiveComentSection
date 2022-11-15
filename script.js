"use strict";

const parent = document.querySelector("main");

let dataObj = [];
let currentUser = {};
const replyOpen = {};

const getData = async function () {
  const get = await fetch("data.json");
  const data = await get.json();
  console.log(get);
  console.log(data);
  currentUser = {
    image: data.currentUser.image.png,
    username: data.currentUser.username,
  };

  data.comments.forEach((coment) => {
    replyOpen[coment.id] = false;
    dataObj.push({
      id: coment.id,
      createdAt: coment.createdAt,
      content: coment.content,
      score: coment.score,
      userImg: coment.user.image.png,
      username: coment.user.username,
      replies: coment.replies,
    });
  });

  console.log(dataObj);
  return dataObj;
};

// window.addEventListen{er("load", getData);
const markup = function (data, comment = false, replyContent = false) {
  return `<div class="container ${comment ? "reply-comment" : ""} id${
    data.id
  }" ${comment ? "style='margin-top: 3vh'" : ""} >
  <div class="aside">
    <div class="icon-plus">
      <img src="/images/icon-plus.svg" alt="" />
    </div>
    <div class="number">
      <p>${replyContent ? "0" : data.score}</p>
    </div>
    <div class="icon-minus">
      <img src="/images/icon-minus.svg" alt="" />
    </div>
  </div>
  <div class="comment">
    <div class="header-commenter">
      <div class="profile">
        <img
          class="profile-icon"
          src="${
            replyContent
              ? currentUser.image
              : data.userImg || data.user.image.png
          }"
          alt=""
        />
        <p class="profile-name">${
          replyContent
            ? currentUser.username
            : data.username || data.user.username
        }</p>
      </div>
      <p class="time-written">${data.createdAt}</p>
      <div class="reply">
        <img
          class="reply-icon"
          src="/images/icon-reply.svg"
          alt=""
          
        />
        <p class="reply-text">Reply</p>
      </div>
    </div>
    <div class="comments">
      <p>
      ${replyContent ? replyContent : data.content}
      </p>
    </div>
  </div>
</div>`;
};

const replyMarkup = function (data, commentReplyer = false) {
  return `<div class="container reply-container reply-comment ${
    commentReplyer ? "width" : ""
  }" style="margin-top: 3vh;">
  <div>
    <img
      class="profile-icon"
      src="${data.image}"
      alt=""
    />
  </div>
  <div class="input">
    <textarea class = 'reply-input'> </textarea>
    <a type='submit' href="#">Reply</a>
  </div>
</div>`;
};

async function data() {
  const data = await getData();
  console.log(data);
  //Inserta comments from API
  data.forEach((data) => {
    parent.insertAdjacentHTML("beforeend", markup(data));
    console.log(data.replies);
    data.replies.forEach((reply) =>
      parent.insertAdjacentHTML("beforeend", markup(reply, true, false))
    );

    // const number = document.querySelector(".number > p");
  });

  //Increase /Decrease score number
  parent.addEventListener("click", function (e) {
    const iconPlus = e.target.closest(".icon-plus");
    const iconMinus = e.target.closest(".icon-minus");

    // const numText = numContainer.firstChild;
    // console.log(+numContainer.textContent, iconMinus, iconPlus);
    if (iconPlus) {
      const numContainer = iconPlus.nextElementSibling;
      +numContainer.firstChild.nextElementSibling.textContent++;
    }
    if (iconMinus) {
      const numContainer = iconMinus.previousElementSibling;
      +numContainer.firstChild.nextElementSibling.textContent--;
    }
    // if (iconMinus) number.textContent = `${data.score-- - 1}`;
  });

  // parent.addEventListener("click", function (e) {
  //   const iconPlus = e.target.closest(".icon-plus");
  //   const iconMinus = e.target.closest(".icon-minus");
  //   const numContainer = iconPlus.nextElementSibling;
  //   console.log(numContainer.childNode);
  //   if (iconPlus) numContainer.textContent = `${1 + data[0].score}`;
  //   // if (iconMinus) number.textContent = `${data.score-- - 1}`;
  // });
  //Insert reply box on reply link clicking
  parent.addEventListener("click", function (e) {
    const reply = e.target.closest(".reply");
    // console.log(
    //   e.target
    //     .closest(".container")
    //     .nextElementSibling?.children[1]?.classList.contains("input") ===
    //     undefined
    // );

    console.log(e.target.closest(".container").classList);
    console.log(replyOpen);
    console.log(replyOpen["1"]);
    replyOpen["1"] = true;
    console.log(replyOpen["1"]);
    if (
      (reply &&
        !e.target
          .closest(".container")
          .nextElementSibling?.classList.contains("reply-container")) ||
      undefined
    ) {
      if (e.target) {
        const replyParent = reply.closest(".container");
        let isCommentReply = true;

        if (e.target.closest(".container").classList.contains("reply-comment"))
          isCommentReply = false;
        replyParent.insertAdjacentHTML(
          "afterend",
          replyMarkup(currentUser, isCommentReply)
        );
      }
    }
  });

  // const number = document.querySelector(".number > p");
  // parent.addEventListener("click", function (e) {
  //   const reply = e.target.closest(".reply");
  //   if (reply) {
  //     const replyParent = reply.closest(".container");

  //     replyParent.insertAdjacentHTML("afterend", replyMarkup());
  //   }

  //   const iconPlus = e.target.closest(".icon-plus");
  //   const iconMinus = e.target.closest(".icon-minus");
  //   console.log(iconPlus, number, data);
  //   if (iconPlus) number.textContent = `${1 + data.score++}`;
  //   if (iconMinus) number.textContent = `${data.score-- - 1}`;
  // });
  //Insert reply comment on reply button clicking
  parent.addEventListener("click", function (e) {
    e.preventDefault();
    const sendReply = e.target.closest(".input > a");
    if (!sendReply) return;
    const replyContent = parent.querySelector(".reply-input").value;
    if (!replyContent) return;
    const replyComment = e.target.closest(".container");
    console.log(replyContent);
    replyComment.insertAdjacentHTML(
      "afterend",
      markup(data, true, replyContent)
    );
    // parent.querySelector(".reply-input").value = "";
    console.log(e.target.closest(".reply-comment"));
    e.target.closest(".reply-comment").style.display = "none";
    e.target.closest(".container").innerHTML = "";
  });
}
data();
