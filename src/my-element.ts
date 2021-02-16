import './style.css';
import './long-press';
import { randomMessage } from './data/messages';
import { textLimiter } from './helpers';

function debounce<T extends Function>(cb: T, wait = 20) {
  let h = 0;
  let callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };
  return <T>(<any>callable);
}

function vibrate(...params: Parameters<typeof window.navigator.vibrate>) {
  try {
    window.navigator.vibrate(...params);
  } catch (error) {}
}

function init() {
  const li = document.querySelector('.chats li:last-child')!;
  const ul = document.querySelector<HTMLUListElement>('.chats')!;

  for (let i = 0; i < 20; i++) {
    const clone = li.cloneNode(true) as HTMLLIElement;
    const msg = randomMessage();

    clone.classList.remove('hidden');
    clone.setAttribute('id', (i + 1).toString());
    clone.querySelector<HTMLImageElement>('img')!.setAttribute('src', `https://i.pravatar.cc/110?${i % 4}`);
    clone.querySelector<HTMLDivElement>('.message')!.innerHTML = textLimiter(msg.message, 50);
    clone.querySelector<HTMLDivElement>('.title')!.innerHTML = textLimiter(msg.title, 35);
    ul.appendChild(clone);
  }
  const items = document.querySelectorAll('.chats li');

  let open: Element | null = null;
  let isAutoClosed: Element[] = [];

  /*
   * Close overlay
   */
  const $overlay = document.querySelector('#overlay')!;
  const $chatPreview = document.querySelector('.chat-preview')!;
  const $overlayActions = document.querySelector('.overlay-actions')!;

  let moved = false;
  $overlay.addEventListener('touchstart', () => {
    moved = false;
  });

  $overlay.addEventListener('touchmove', () => {
    moved = true;
  });

  $overlay.addEventListener('touchend', () => {
    if (moved) {
      return;
    }

    $overlay.classList.remove('overlay-visible');
    $overlay.classList.add('overlay-hiding');

    setTimeout(() => {
      $overlay.classList.remove('overlay-hiding');
    }, 200);
  });
  [$chatPreview, $overlayActions].forEach((el) => {
    el.addEventListener('touchend', (e) => {
      e.stopPropagation();
    });
  });

  /*
   * Show and hide archived messages
   */

  const $chatList = document.querySelector('#scroller')!;
  let archivedVisible: boolean = false;

  $chatList.addEventListener('scroll', () => {
    if (!archivedVisible && $chatList.scrollTop < -75) {
      vibrate(5);
      archivedVisible = true;
      ul.classList.add('all-visible');
    }

    if (archivedVisible && $chatList.scrollTop > 118) {
      archivedVisible = false;
      ul.classList.remove('all-visible');

      $chatList.scrollTop = 46;
    }
  });

  items.forEach((el) => {
    const $actions = el.querySelector<HTMLDivElement>('.actions')!;
    const $leftActions = el.querySelector<HTMLDivElement>('.actions-left')!;

    const $rightActions = el.querySelector<HTMLDivElement>('.actions-right')!;
    const $content = el.querySelector<HTMLDivElement>('.content')!;
    const leftBuff = el.querySelector<HTMLDivElement>('.buff-left')!;
    const rightBuff = el.querySelector<HTMLDivElement>('.buff-right')!;
    const $slider = el.querySelector<HTMLDivElement>('.content-inner')!;
    const $container = el.querySelector('.content-container')!;

    const actionsLeftWidth = $leftActions.getBoundingClientRect().width;
    const actionsRightWidth = $rightActions.getBoundingClientRect().width;

    const actionsTotalWidth = actionsLeftWidth + actionsRightWidth;

    /*
     * Open overlay
     */
    let timer: number;
    $slider.addEventListener('long-press', (event) => {
      event.preventDefault();

      $overlay.classList.add('overlay-showing');
      setTimeout(() => $overlay.classList.add('overlay-visible'), 1);
      setTimeout(() => $overlay.classList.remove('overlay-showing'), 3);
      clearTimeout(timer);
      $slider.classList.remove('touch');
    });

    $slider.addEventListener('touchstart', () => {
      timer = setTimeout(() => {
        $slider.classList.add('touch');
      }, 200);
    });
    $slider.addEventListener('touchmove', () => {
      clearTimeout(timer);
      $slider.classList.remove('touch');
    });
    $slider.addEventListener('touchend', () => {
      clearTimeout(timer);
      $slider.classList.remove('touch');
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
        $container.classList.remove('sliding');
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

    /*
     * Initialize buttons
     */

    $actions.querySelectorAll('button').forEach((el) => {
      el.style.position = 'absolute';
      el.style.left = '0';
      el.style.top = '0';
      el.style.width = `${$slider.getBoundingClientRect().width}px`;
    });

    el.querySelector('.content-container')!.addEventListener('scroll', (e) => {
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
            behavior: 'smooth',
          });
        }
        open = $container;
        open.classList.add('sliding');
      }

      if (diff != 0) {
        const buttonsL = Array.from($leftActions.querySelectorAll('button'));
        buttonsL.forEach((el, i) => {
          el.style.transform = `translateX(calc(-100% + ${(diff / buttonsL.length) * (i + 1)}px))`;
        });

        const buttonsR = Array.from($rightActions.querySelectorAll('button'));
        buttonsR.forEach((el, i) => {
          el.style.transform = `translateX(calc(100% - ${(diff / buttonsR.length) * (i + 1) * -1}px))`;
        });
      }
    });
  });
}

window.addEventListener('load', init);
