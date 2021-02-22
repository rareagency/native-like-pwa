import { ThreadInterface, messages, setThreads, threads, users } from './data/messages';
import { randomNumber, textLimiter } from './helpers';

function drawThreads(threads: ThreadInterface[]) {
  const template = document.querySelector<HTMLTemplateElement>('#chatTemplate')!;
  const li = template.content.firstElementChild!;
  const ul = document.querySelector<HTMLUListElement>('.chats')!;
  const children = ul.children;

  for (let i = 0; i < children.length; i++) {
    if (children[i].id !== 'archived') ul.removeChild(children[i]);
  }

  for (let i = 0; i < threads.length; i++) {
    const clone = li.cloneNode(true) as HTMLLIElement;
    const thread = threads[i];

    // clone.setAttribute('id', (i + 1).toString());
    clone.querySelector<HTMLImageElement>('img')!.setAttribute('src', `https://i.pravatar.cc/110?${i % 4}`);
    clone.querySelector<HTMLDivElement>('.message')!.innerHTML = textLimiter(thread.messages[0].message, 45);
    clone.querySelector<HTMLDivElement>('.sender')!.innerHTML = textLimiter(thread.messages[0].user, 35);
    clone.querySelector<HTMLDivElement>('.title')!.innerHTML = textLimiter(thread.title, 30);
    ul.appendChild(clone);
  }
}

function initThreads() {
  const messageCount = randomNumber(0, 8);
  const userCount = randomNumber(0, 8);

  const filled = threads.map((thread) => {
    for (let i = 0; i < userCount; i++) {
      thread.users.push(uniqueUser(thread.users));
    }

    for (let i = 0; i < messageCount; i++) {
      thread.messages.push(randomMessage(thread.users));
    }

    return thread;
  });

  setThreads(filled);
  drawThreads(filled);
}

function randomMessage(threadUsers: string[]) {
  return {
    user: threadUsers[randomNumber(0, threadUsers.length)],
    message: messages[randomNumber(0, messages.length)],
  };
}

function uniqueUser(threadUsers: string[]) {
  let newUser = users[randomNumber(0, users.length)];

  while (threadUsers.includes(newUser)) {
    newUser = users[randomNumber(0, users.length)];
  }

  return newUser;
}

function filterThreads() {
  console.log('test');

  const input = document.querySelector<HTMLInputElement>('#filterInput')!;
  if (input.value.length < 2) {
    drawThreads(threads);
    return;
  }

  const filtered = threads.filter((thread) => {
    if (thread.title.includes(input.value)) {
      return true;
    }

    const found = thread.messages.find((msg) => {
      return msg.message.includes(input.value);
    });

    return found;
  });

  drawThreads(filtered);
}

export { drawThreads, initThreads, filterThreads };
