import "./style.css";

function init() {
  const li = document.querySelector("li")!;

  const ul = document.querySelector("ul")!;
  for (let i = 0; i < 5; i++) {
    const clone = li.cloneNode(true) as HTMLLIElement;
    clone
      .querySelector<HTMLImageElement>("img")!
      .setAttribute("src", `https://i.pravatar.cc/200?${i}`);
    ul.appendChild(clone);
  }

  Array.from(document.querySelectorAll("li")).forEach((el) => {
    el.querySelector(".content-container")!.addEventListener(
      "scroll",
      () => {}
    );

    const actionsLeftWidth = el
      .querySelector<HTMLDivElement>(".actions-left")!
      .getBoundingClientRect().width;
    const actionsRightWidth = el
      .querySelector<HTMLDivElement>(".actions-right")!
      .getBoundingClientRect().width;

    const actionsTotalWidth = actionsLeftWidth + actionsRightWidth;

    el.querySelector<HTMLDivElement>(
      ".content"
    )!.style.width = `calc(100% + ${actionsTotalWidth}px)`;

    el.querySelector<HTMLDivElement>(
      ".buff-left"
    )!.style.width = `${actionsLeftWidth}px`;

    el.querySelector<HTMLDivElement>(
      ".buff-right"
    )!.style.width = `${actionsRightWidth}px`;

    el.querySelector<HTMLDivElement>(
      ".content-inner"
    )!.style.width = `calc(100% - ${actionsTotalWidth - 1}px)`;

    el.querySelector(".content-container")!.scrollLeft = actionsLeftWidth;
  });
}

document.addEventListener("DOMContentLoaded", init);
