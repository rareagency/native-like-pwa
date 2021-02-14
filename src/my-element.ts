import "./style.css";
import "./long-press";

function debounce<T extends Function>(cb: T, wait = 20) {
  let h = 0;
  let callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };
  return <T>(<any>callable);
}

function init() {
  const li = document.querySelector(".chats li")!;
  const ul = document.querySelector(".chats")!;

  for (let i = 0; i < 20; i++) {
    const clone = li.cloneNode(true) as HTMLLIElement;
    clone.setAttribute("id", (i + 1).toString());
    clone
      .querySelector<HTMLImageElement>("img")!
      .setAttribute("src", `https://i.pravatar.cc/110?${i % 4}`);
    ul.appendChild(clone);
  }
  const items = document.querySelectorAll(".chats li");

  let open: Element | null = null;
  let isAutoClosed: Element[] = [];

  /*
   * Close overlay
   */
  const $overlay = document.querySelector("#overlay")!;
  const $overlayContent = document.querySelector(".overlay-content")!;

  [$overlayContent, $overlay].forEach((el) => {
    let timer: number;
    el.addEventListener("touchstart", (e) => {
      timer = setTimeout(() => {
        if (e.target === el) {
          e.stopPropagation();
          $overlay.classList.remove("overlay-visible");
          $overlay.classList.add("overlay-hiding");

          setTimeout(() => {
            $overlay.classList.remove("overlay-hiding");
          }, 200);
        }
      }, 200);
    });
    el.addEventListener("touchmove", () => {
      clearTimeout(timer);
    });
  });

  items.forEach((el) => {
    const $leftActions = el.querySelector<HTMLDivElement>(".actions-left")!;

    const $rightActions = el.querySelector<HTMLDivElement>(".actions-right")!;
    const $content = el.querySelector<HTMLDivElement>(".content")!;
    const leftBuff = el.querySelector<HTMLDivElement>(".buff-left")!;
    const rightBuff = el.querySelector<HTMLDivElement>(".buff-right")!;
    const $slider = el.querySelector<HTMLDivElement>(".content-inner")!;
    const $container = el.querySelector(".content-container")!;

    const actionsLeftWidth = $leftActions.getBoundingClientRect().width;
    const actionsRightWidth = $rightActions.getBoundingClientRect().width;

    const actionsTotalWidth = actionsLeftWidth + actionsRightWidth;

    let timer: number;
    $slider.addEventListener("long-press", (event) => {
      event.preventDefault();

      $overlay.classList.add("overlay-showing");

      setTimeout(() => $overlay.classList.add("overlay-visible"), 1);
      setTimeout(() => $overlay.classList.remove("overlay-showing"), 3);
      clearTimeout(timer);
      $slider.classList.remove("touch");
    });

    $slider.addEventListener("touchstart", () => {
      timer = setTimeout(() => {
        $slider.classList.add("touch");
      }, 200);
    });
    $slider.addEventListener("touchmove", () => {
      clearTimeout(timer);
      $slider.classList.remove("touch");
    });
    $slider.addEventListener("touchend", () => {
      clearTimeout(timer);
      $slider.classList.remove("touch");
    });

    console.log({
      bod: window
        .getComputedStyle(window.document.body)
        .getPropertyValue("background-color"),
      actionsLeftWidth,
      actionsRightWidth,
      actionsTotalWidth,
    });

    $content.style.width = `calc(100% + ${actionsTotalWidth}px)`;
    leftBuff.style.width = `${actionsLeftWidth}px`;
    rightBuff.style.width = `${actionsRightWidth}px`;
    $slider.style.width = `calc(100% - ${actionsTotalWidth}px)`;

    const centerScrollPosition = actionsLeftWidth;

    $container.scrollLeft = centerScrollPosition;

    const clear = debounce((target: HTMLDivElement) => {
      const centered = Math.abs(target.scrollLeft - centerScrollPosition) < 2;

      if (centered) {
        $leftActions
          .querySelectorAll("button")
          .forEach((el) => (el.style.transform = ""));
        $rightActions
          .querySelectorAll("button")
          .forEach((el) => (el.style.transform = ""));
        $container.classList.remove("sliding");
      }

      if (centered && open === $container) {
        open = null;
      }

      if (centered && isAutoClosed.indexOf($container) > -1) {
        const index = isAutoClosed.indexOf($container);
        if (index > -1) {
          isAutoClosed.splice(index, 1);
        }
      }
    }, 30);

    el.querySelector(".content-container")!.addEventListener("scroll", (e) => {
      const target = e.target as HTMLDivElement;
      const diff = centerScrollPosition - target.scrollLeft;
      clear(target);

      if (isAutoClosed.indexOf($container) > -1) {
        return;
      }
      if (diff != 0) {
        if (open && open !== $container) {
          // Close the open
          isAutoClosed.push(open);

          open.scroll({
            left: centerScrollPosition,
            behavior: "smooth",
          });
        }
        open = $container;
        open.classList.add("sliding");
      }

      if (diff > 0) {
        const percentageOpen = diff / actionsLeftWidth;

        $leftActions.querySelectorAll("button").forEach((el, i) => {
          el.style.transform = `translateX(${
            -100 * (i + 1) * (1 - percentageOpen)
          }%)`;
        });
      }
      if (diff < 0) {
        const percentageOpen = (diff / actionsRightWidth) * -1;

        $rightActions.querySelectorAll("button").forEach((el, i) => {
          el.style.transform = `translateX(${
            100 * (i + 1) * (1 - percentageOpen)
          }%)`;
        });
      }
    });
  });
}

window.addEventListener("load", init);
