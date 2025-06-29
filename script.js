import { getFormattedLoginDate } from './date.js';

const lines = [
  `<span class="last-login">${getFormattedLoginDate()}\n</span>`,
  `<span class="output">Landing-Page:~ lorenzogerosa$</span> Benvenuto sulla mia Landing Page!`,
  `<span class="output">Landing-Page:~ lorenzogerosa$</span> Digita <span style="color: #00ff00">help</span> per vedere i comandi disponibili.`,
];

const output = document.getElementById('terminal-output');
const inputEl = document.getElementById('user-input');
const cursor = document.getElementById('cursor');

let lineIndex = 0;
let charIndex = 0;
let typingDone = false;
let currentUser = 'user';
let currentDirectory = '';
const validDirectories = [];
let previousScreen = null;
let viewingFile = false;
let lastOpenedFile = '';

function typeLine() {
  if (lineIndex >= lines.length) {
    typingDone = true;
    return;
  }

  const currentLine = lines[lineIndex];
  const isHTML = currentLine.includes('<span');

  if (charIndex === 0 && isHTML) {
    output.innerHTML += currentLine + '\n';
    lineIndex++;
    charIndex = 0;
    setTimeout(typeLine, 400);
  } else {
    const line = lines[lineIndex];
    output.innerHTML += line.charAt(charIndex);
    charIndex++;

    if (charIndex < line.length) {
      setTimeout(typeLine, 25);
    } else {
      output.innerHTML += '\n';
      lineIndex++;
      charIndex = 0;
      setTimeout(typeLine, 250);
    }
  }
}

function enableTyping() {
  let inputText = '';

  document.addEventListener('keydown', (e) => {
    if (!typingDone) return;

    if (viewingFile) {
      const trimmed = inputText.trim();
      if (e.key === 'Enter') {
        if (trimmed === 'close') {
          output.innerHTML = previousScreen;
          viewingFile = false;
          lastOpenedFile = '';
          inputText = '';
          inputEl.textContent = '';
          return;
        } else if (trimmed === 'kill') {
          location.reload();
          return;
        } else {
          output.innerHTML += '<span style="color:red">digita <span style="color: #00ff00">close</span> per chiudere o digita <span style="color: #00ff00">kill</span> per riavviare il terminale</span>\n';
          inputText = '';
          inputEl.textContent = '';
          return;
        }
      } else if (e.key === 'Backspace') {
        inputText = inputText.slice(0, -1);
        inputEl.textContent = inputText;
        return;
      } else if (e.key.length === 1) {
        inputText += e.key;
        inputEl.textContent = inputText;
        return;
      } else {
        return;
      }
    }

    if (e.key === 'Backspace') {
      inputText = inputText.slice(0, -1);
    } else if (e.key === 'Enter') {
      const trimmed = inputText.trim();
      const setuserMatch = trimmed.match(/^setuser\s+(.+)$/);
      if (setuserMatch) {
        currentUser = setuserMatch[1];
      }
      output.innerHTML += `<span class="output">Landing-Page:~ ${currentUser}$</span> ${inputText}\n`;
      if (trimmed === 'help') {
        output.innerHTML += '<span style="color:#ff00ff"><b>\nLista di comandi:</b>\n</span>';
        output.innerHTML += '- <span style="color:#00ff00">help</span>: Mostra questa lista di comandi\n';
        output.innerHTML += '- <span style="color:#00ff00">setuser [argument]</span>: Imposta uno username\n';
        output.innerHTML += '- <span style="color:#00ff00">whoami</span>: Mostra user\n';
        output.innerHTML += '- <span style="color:#00ff00">clear</span>: Pulisce il terminale\n';
        output.innerHTML += '- <span style="color:#00ff00">kill</span>: Resetta il terminale\n';
        output.innerHTML += '- <span style="color:#00ff00">ls</span>: Mostra i file disponibili\n';
        output.innerHTML += '- <span style="color:#00ff00">open [argument]</span>: Apre un file\n';
        output.innerHTML += '- <span style="color:#00ff00">close</span>: Chiude un file aperto\n';
      } else if (trimmed === 'whoami') {
        output.innerHTML += `<span style=\"color:#00ff00\">${currentUser}</span>\n`;
      } else if (trimmed === 'clear') {
        output.innerHTML = '';
        lineIndex = 0;
        charIndex = 0;
        typingDone = false;
        typeLine();
        inputText = '';
        inputEl.textContent = '';
        return;
      } else if (trimmed === 'kill') {
        // Reload the page to reset everything
        location.reload();
        return;
      } else if (trimmed === 'ls') {
        let dirLabel = currentDirectory ? `/Landing-Page/${currentDirectory}` : '/Landing-Page';
        output.innerHTML += `\n<span style=\"color:#00ff00\">Directory: ${dirLabel}</span>\n`;
        if (!currentDirectory) {
          output.innerHTML += '- about.txt\n';
          output.innerHTML += '- musica.txt\n';
          output.innerHTML += '- contatti.txt\n';
          output.innerHTML += '- footer.txt\n';
        }
      } else if (trimmed.startsWith('open ')) {
        const arg = trimmed.slice(5).toLowerCase();
        const validFiles = ["about.txt", "contatti.txt", "footer.txt"];
        if (validFiles.includes(arg)) {
          previousScreen = output.innerHTML;
          viewingFile = true;
          lastOpenedFile = arg;
          output.innerHTML = '';
          output.innerHTML += `<span class="last-login">${getFormattedLoginDate()}\n</span>`;
          output.innerHTML += `<span class="output">Landing-Page/${arg}: lorenzogerosa$</span> Stai visualizzando: ${arg}\n`;
          output.innerHTML += `<span class="output">Landing-Page/${arg}: lorenzogerosa$</span> Digita <span style="color: #00ff00">close</span> per tornare alla schermata precedente.\n`;
          if (arg === 'about.txt') {
            output.innerHTML += '\nMi chiamo Lorenzo Gerosa, ho 20 anni e stud... faccio Design della Comunicazione al Politecnico di Milano.\n';
            output.innerHTML += 'Sono una persona creativa, silenziosa ed introversa.\n';
            output.innerHTML += 'La mia più grande passione è la musica. Suono principalmente la chitarra elettrica ma anche altri strumenti,\n';
            output.innerHTML += 'e tendenzialmente tutto il tempo libero che ho lo passo a registrare.\n';
            output.innerHTML += 'Anche il Web Design non è che mi faccia così schifo, dai.\n';
            output.innerHTML += '\n';
          } else if (arg === 'contatti.txt') {
            output.innerHTML += '\n<a href="mailto:lorenzo3.gerosa@mail.polimi.it">Email</a>\n';
            output.innerHTML += '\n<a href="tel:+393921442769">Telefono</a>\n';
            output.innerHTML += '\n<a href="https://www.instagram.com/lrnzgrs/">Instagram</a>\n';
            output.innerHTML += '\n';
          } else if (arg === 'footer.txt') {
            output.innerHTML += '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n';
            output.innerHTML += '\nLorenzo Gerosa\n';
            output.innerHTML += '\n249791\n';
            output.innerHTML += '\n10904161\n';
            output.innerHTML += '\nLanding Page\n';
            output.innerHTML += '\nLaboratorio di Web e Digital Design\n';
            output.innerHTML += '\n';
          }
        } else {
          output.innerHTML += '<span style="color:red">no such file</span>\n';
        }
      } else if (trimmed === 'close') {
        if (viewingFile) {
          output.innerHTML = previousScreen;
          viewingFile = false;
          lastOpenedFile = '';
        } else {
          output.innerHTML += '<span style="color:red">no file is currently open</span>\n';
        }
      }
      inputText = '';
    } else if (e.key.length === 1) {
      inputText += e.key;
    }

    inputEl.textContent = inputText;
  });
}

typeLine();
enableTyping();