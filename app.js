'use strict';

const output = document.getElementById('output');
const cmdline = document.getElementById('cmdline');
const promptEl = document.getElementById('prompt');
const helpPane = document.getElementById('helpPane');
const terminalShell = document.getElementById('terminalShell');
const doomOverlay = document.getElementById('doomOverlay');
let doomTimer = null;

const FASTFETCH_LOGO = [
  '              @@@@@@@@@@@@',
  '          @@@@@@@@@@@@@@@@@@@@',
  '       @@@@@@@@@@@@@@@@@@@@@@@@@@',
  '     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  '    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  '   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  '  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  ' @@@*.......@.....@@@@........@@@@@@@@@',
  ' @@@*        @     @     @    @@@@@@@@@@',
  '@@@@*    @    @@  @    @@@    @@@@@@@@@@',
  '@@@@*    @      @@    @@@@    @@@@@@@@@@',
  '@@@@*          @.      @@@    @@@@@@@@@@',
  '@@@@*   #@@@@@@    +    @@    @@@@@@@@@@',
  ' @@@*   #@@@@@    @@@    @.         @@@@',
  ' @@@*   #@@@@    @@@@@    @@        @@@',
  '  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  '   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  '    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  '     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  '       @@@@@@@@@@@@@@@@@@@@@@@@@@',
  '          @@@@@@@@@@@@@@@@@@@@',
  '              @@@@@@@@@@@@',
].join('\n');

const FASTFETCH_INFO = [
  'user        : anatolii',
  'uptime      : 25 years',
  'origin      : Odesa, UA',
  'role        : student / intern',
  'study       : Cybersecurity and Cloud',
  'focus       : cybersec, infra, automation',
  'interests   : self-hosting, open-source,',
  '              digital independence',
  'stack       : Linux, Docker, Terraform',
  'good_at     : infra design, networks, systems',
  'current     : trying out new stuff',
  'improving   : tech docs, reports, handovers',
  'working_on  : presenting, professional communication',
].join('\n');

const HELP_TEXT = [
  'Welcome to the prototype.',
  '',
  'Login:',
  '  username: anatolii',
  '  password: pxlstudent',
  '',
  'Available commands after login:',
  '  ls         list current directory',
  '  cd about   move into /about',
  '  cd ..      move back to /',
  '  pwd        print current directory',
  '  cat FILE   display file contents',
  '  fastfetch  show the basic information',
  '  doom       launch retro mode',
  '  help       show this help text',
  '  clear      clear terminal output',
  '',
  'Navigation:',
  '  ArrowUp / ArrowDown  browse history',
  '  Tab                  autocomplete command or path',
  '',
  'Current structure:',
  '  /',
  '  \u251C\u2500\u2500 about/',
  '  \u2502   \u251C\u2500\u2500 me.txt',
  '  \u2502   \u2514\u2500\u2500 skills.txt',
  '  \u2514\u2500\u2500 .help',
].join('\n');

const ME_TXT = [
  'Anatolii is a student and intern focused on cybersecurity, infrastructure, and automation.',
  '',
  'He is especially interested in self-hosted services, open-source software, and digital independence.',
  '',
  'His strengths are infrastructure design, networks, and systems thinking.',
  '',
  'He is currently trying out new stuff, usually in short and intense project bursts.',
  '',
  'Current growth areas include technical documentation, reports, handovers, presenting, and professional communication.',
].join('\n');

const SKILLS_TXT = [
  'Core stack:',
  '- Linux',
  '- Docker',
  '- Terraform',
  '',
  'Focus areas:',
  '- Cybersecurity',
  '- Infrastructure',
  '- Automation',
  '- Networked systems',
].join('\n');

const COMMANDS = ['ls', 'cd', 'pwd', 'help', 'clear', 'cat', 'fastfetch', 'doom'];

const RM_RF_LINES = [
  "rm: removing '/bin/sh'",
  "rm: removing '/bin/bash'",
  "rm: removing '/bin/ls'",
  "rm: removing '/bin/cat'",
  "rm: removing '/bin/kill'",
  "rm: removing '/bin/rm'",
  "rm: removing '/usr/bin/python3'",
  "rm: removing '/usr/bin/sudo'",
  "rm: removing '/usr/bin/vim'",
  "rm: removing '/usr/bin/ssh'",
  "rm: removing '/usr/bin/curl'",
  "rm: removing '/usr/bin/apt'",
  "rm: removing '/usr/bin/gcc'",
  "rm: removing '/usr/bin/make'",
  "rm: removing '/etc/passwd'",
  "rm: removing '/etc/shadow'",
  "rm: removing '/etc/fstab'",
  "rm: removing '/etc/hostname'",
  "rm: removing '/etc/hosts'",
  "rm: removing '/etc/crontab'",
  "rm: removing '/etc/resolv.conf'",
  "rm: removing '/home/anatolii/.bashrc'",
  "rm: removing '/home/anatolii/.profile'",
  "rm: removing '/home/anatolii/.ssh/id_rsa'",
  "rm: removing '/home/anatolii/.ssh/authorized_keys'",
  "rm: removing '/home/anatolii/documents/thesis.pdf'",
  "rm: removing '/home/anatolii/documents/portfolio.zip'",
  "rm: removing '/var/log/auth.log'",
  "rm: removing '/var/log/syslog'",
  "rm: removing '/var/cache/apt/archives'",
  "rm: removing '/lib/x86_64-linux-gnu/libc.so.6'",
  "rm: removing '/lib/x86_64-linux-gnu/libm.so.6'",
  "rm: removing '/lib/x86_64-linux-gnu/libpthread.so.0'",
  "rm: removing '/boot/vmlinuz-6.1.0-25-amd64'",
  "rm: removing '/boot/initrd.img-6.1.0-25-amd64'",
  "rm: removing '/boot/grub/grub.cfg'",
  "rm: removing '/'",
  "Segmentation fault (core dumped)",
];

const FS = {
  '/': {
    type: 'dir',
    children: {
      about: {
        type: 'dir',
        children: {
          'me.txt': { type: 'file', content: ME_TXT },
          'skills.txt': { type: 'file', content: SKILLS_TXT },
        },
      },
      '.help': { type: 'file', content: HELP_TEXT },
    },
  },
};

const state = {
  loggedIn: false,
  loginStage: 'username',
  pendingUsername: '',
  username: null,
  cwd: '/',
  history: [],
  historyIndex: null,
  draftInput: '',
};

function getNode(path) {
  if (path === '/') return FS['/'];
  const parts = path.split('/').filter(Boolean);
  let node = FS['/'];
  for (const part of parts) {
    if (!node.children || !node.children[part]) return null;
    node = node.children[part];
  }
  return node;
}

function normalizePath(input) {
  if (!input || input === '.') return state.cwd;
  const parts = input.startsWith('/') ? [] : state.cwd.split('/').filter(Boolean);
  for (const token of input.split('/')) {
    if (!token || token === '.') continue;
    if (token === '..') parts.pop();
    else parts.push(token);
  }
  return '/' + parts.join('/');
}

function appendLine(text, className) {
  const div = document.createElement('div');
  div.className = ('line ' + (className || '')).trim();
  div.textContent = text || '';
  output.appendChild(div);
  followTerminalBottom();
}

function appendHTML(htmlString) {
  const wrapper = document.createElement('div');
  wrapper.className = 'line';
  wrapper.innerHTML = htmlString;
  output.appendChild(wrapper);
  followTerminalBottom();
}

function appendBlock(text, className) {
  String(text).split('\n').forEach(function(line) { appendLine(line, className); });
}

function followTerminalBottom(force) {
  const dist = terminalShell.scrollHeight - terminalShell.clientHeight - terminalShell.scrollTop;
  if (force || dist < 120) {
    requestAnimationFrame(function() {
      terminalShell.scrollTo({ top: terminalShell.scrollHeight, behavior: 'smooth' });
      cmdline.focus({ preventScroll: true });
    });
  }
}

function renderPrompt() {
  if (!state.loggedIn) {
    promptEl.textContent = state.loginStage === 'username' ? 'login: ' : 'password: ';
    cmdline.type = state.loginStage === 'password' ? 'password' : 'text';
  } else {
    const shownPath = state.cwd === '/' ? '~' : '~' + state.cwd;
    promptEl.textContent = state.username + '@pxl:' + shownPath + '$';
    cmdline.type = 'text';
  }
  followTerminalBottom(true);
}

function renderHelp() {
  let context = '';
  if (!state.loggedIn) {
    context = 'Status: authentication required\n\nEnter username first, then password.';
  } else if (state.cwd === '/about') {
    context = 'Context: /about\n\nUse ls to inspect files.\nUse cat me.txt or cat skills.txt to read them.\nUse cd .. to return to /.';
  } else {
    context = 'Context: /\n\nUse fastfetch for a quick overview.\nUse ls to inspect the tree.\nUse cd about to enter /about.';
  }
  helpPane.textContent = HELP_TEXT + '\n\n------------------------------\n' + context;
}

function listDirectory() {
  const node = getNode(state.cwd);
  if (!node || node.type !== 'dir') { appendLine('ls: cannot access current directory'); return; }
  const names = Object.entries(node.children).map(function(e) {
    return e[1].type === 'dir' ? e[0] + '/' : e[0];
  });
  appendLine(names.join('    ') || '(empty)');
}

function changeDirectory(target) {
  const nextPath = normalizePath(target);
  const node = getNode(nextPath);
  if (!node) { appendLine('cd: no such file or directory: ' + target); return; }
  if (node.type !== 'dir') { appendLine('cd: not a directory: ' + target); return; }
  state.cwd = nextPath;
  renderPrompt();
  renderHelp();
}

function readFile(target) {
  if (!target) { appendLine('cat: missing file operand'); return; }
  const path = normalizePath(target);
  const node = getNode(path);
  if (!node) { appendLine('cat: ' + target + ': No such file or directory'); return; }
  if (node.type !== 'file') { appendLine('cat: ' + target + ': Is a directory'); return; }
  appendBlock(node.content);
}

function getAutocompleteOptions(input) {
  const parts = input.split(' ').filter(function(p) { return p.length > 0; });
  const isCommandPosition = parts.length === 0 || (parts.length === 1 && !input.endsWith(' '));
  if (isCommandPosition) {
    const prefix = parts[0] || '';
    return COMMANDS.filter(function(c) { return c.indexOf(prefix) === 0; });
  }
  const command = parts[0];
  if (command === 'cd' || command === 'cat') {
    const partial = input.endsWith(' ') ? '' : (parts[parts.length - 1] || '');
    const currentNode = getNode(state.cwd);
    if (!currentNode || currentNode.type !== 'dir') return [];
    let opts = Object.entries(currentNode.children)
      .filter(function(e) { return command !== 'cd' || e[1].type === 'dir'; })
      .map(function(e) { return e[1].type === 'dir' ? e[0] : e[0]; });
    if (command === 'cd' && state.cwd !== '/') opts.push('..');
    return opts.filter(function(o) { return o.indexOf(partial) === 0; });
  }
  return [];
}

function applyAutocomplete() {
  const current = cmdline.value;
  const matches = getAutocompleteOptions(current);
  if (!matches.length) return;
  const parts = current.split(' ').filter(function(p) { return p.length > 0; });
  if (matches.length === 1) {
    const isCmd = parts.length <= 1 && !current.endsWith(' ');
    if (isCmd) { cmdline.value = matches[0] + ' '; }
    else { cmdline.value = parts[0] + ' ' + matches[0] + ' '; }
    return;
  }
  appendLine(matches.join('    '));
  followTerminalBottom();
}

function pushHistory(value) {
  if (!value.trim()) return;
  if (state.history[state.history.length - 1] !== value) state.history.push(value);
  state.historyIndex = null;
  state.draftInput = '';
}

function navigateHistory(direction) {
  if (!state.history.length) return;
  if (state.historyIndex === null) { state.draftInput = cmdline.value; state.historyIndex = state.history.length; }
  state.historyIndex += direction;
  if (state.historyIndex < 0) state.historyIndex = 0;
  if (state.historyIndex > state.history.length) state.historyIndex = state.history.length;
  cmdline.value = state.historyIndex === state.history.length ? state.draftInput : state.history[state.historyIndex];
  requestAnimationFrame(function() { const e = cmdline.value.length; cmdline.setSelectionRange(e, e); });
}

function closeDoom() {
  document.body.classList.remove('doom-launching');
  var game = doomOverlay.querySelector('.doom-game');
  if (game) {
    game.style.opacity = '0';
    setTimeout(function() { game.innerHTML = ''; }, 400);
  }
  var btn = document.getElementById('doomClose');
  if (btn) btn.remove();
  clearTimeout(doomTimer);
  setTimeout(function() { cmdline.focus(); }, 100);
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.body.classList.contains('doom-launching')) {
    closeDoom();
  }
});

function startDoom() {
  var game = doomOverlay.querySelector('.doom-game');
  if (!game) return;
  game.innerHTML = '';
  game.style.opacity = '1';

  var btn = document.createElement('button');
  btn.id = 'doomClose';
  btn.className = 'doom-close';
  btn.textContent = 'click to exit';
  btn.addEventListener('click', closeDoom);
  document.body.appendChild(btn);

  // Verify the WASM assets are present before injecting the iframe.
  // They live in doom/ and must be downloaded once via doom/download.sh.
  fetch('./doom/chocolate-doom.wasm', { method: 'HEAD' })
    .then(function(r) {
      if (!r.ok) throw new Error(r.status);
      var iframe = document.createElement('iframe');
      iframe.src = './doom/index.html';
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
      game.appendChild(iframe);
    })
    .catch(function() {
      game.innerHTML =
        '<div style="font-family:\'Courier New\',monospace;color:#f88;padding:32px;line-height:1.8">' +
        'doom/ assets not found.<br>' +
        '<span style="color:#9a9a9a">run from project root:</span><br>' +
        '<span style="color:#fff">bash doom/download.sh</span><br><br>' +
        '<span style="color:#9a9a9a">~30 MB, one-time download.</span>' +
        '</div>';
    });
}

function launchRmRf() {
  var rmrfOverlay = document.getElementById('rmrfOverlay');
  var i = 0;
  cmdline.disabled = true;

  function printNext() {
    if (i < RM_RF_LINES.length) {
      var cls = RM_RF_LINES[i].startsWith('Seg') ? 'muted' : '';
      appendLine(RM_RF_LINES[i], cls);
      i++;
      setTimeout(printNext, i < RM_RF_LINES.length - 3 ? 55 : 200);
    } else {
      setTimeout(function() {
        document.body.classList.add('rmrf-active');
        rmrfOverlay.setAttribute('aria-hidden', 'false');

        function dismiss() {
          document.body.classList.remove('rmrf-active');
          rmrfOverlay.setAttribute('aria-hidden', 'true');
          cmdline.disabled = false;
          cmdline.focus();
          document.removeEventListener('keydown', dismiss);
          rmrfOverlay.removeEventListener('click', dismiss);
        }
        document.addEventListener('keydown', dismiss);
        rmrfOverlay.addEventListener('click', dismiss);
      }, 600);
    }
  }
  printNext();
}

function launchDoom() {
  appendLine('launching retro mode...');
  appendLine('[press ESC to return to terminal]', 'muted');
  document.body.classList.add('doom-launching');
  clearTimeout(doomTimer);
  doomTimer = setTimeout(startDoom, 1400);
}

function handleLoggedInCommand(raw) {
  var input = raw.trim();
  if (!input) return;
  if (input === 'rm -rf /') { launchRmRf(); return; }
  var parts = input.split(' ');
  var command = parts[0];
  var args = parts.slice(1);
  switch (command) {
    case 'ls': listDirectory(); break;
    case 'cd':
      if (!args[0]) { state.cwd = '/'; renderPrompt(); renderHelp(); }
      else changeDirectory(args[0]);
      break;
    case 'pwd': appendLine(state.cwd); break;
    case 'cat': readFile(args[0]); break;
    case 'fastfetch':
      appendHTML('<div class="fastfetch-block"><pre class="ascii-logo">' + FASTFETCH_LOGO + '</pre></div>');
      appendBlock(FASTFETCH_INFO);
      break;
    case 'help': appendBlock(HELP_TEXT); break;
    case 'clear': output.innerHTML = ''; followTerminalBottom(true); break;
    case 'doom': launchDoom(); break;
    default: appendLine(command + ': command not found'); break;
  }
}

function handleLoginInput(raw) {
  if (state.loginStage === 'username') {
    state.pendingUsername = raw.trim();
    if (!state.pendingUsername) { appendLine('username required'); return; }
    state.loginStage = 'password';
    renderPrompt();
    renderHelp();
    return;
  }
  if (state.pendingUsername === 'anatolii' && raw === 'pxlstudent') {
    state.loggedIn = true;
    state.username = state.pendingUsername;
    appendLine('Authentication successful.');
    appendLine('Type help to view available commands.', 'muted');
  } else {
    appendLine('Login incorrect');
    state.pendingUsername = '';
  }
  state.loginStage = 'username';
  renderPrompt();
  renderHelp();
}

cmdline.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    var shownValue = cmdline.value;
    var shownPrompt = promptEl.textContent;
    var displayed = cmdline.type === 'password' ? '*'.repeat(shownValue.length) : shownValue;
    appendLine((shownPrompt + ' ' + displayed).trimEnd(), 'command-echo');
    pushHistory(shownValue);
    if (state.loggedIn) handleLoggedInCommand(shownValue);
    else handleLoginInput(shownValue);
    cmdline.value = '';
    followTerminalBottom(true);
    return;
  }
  if (event.key === 'ArrowUp') { event.preventDefault(); navigateHistory(-1); return; }
  if (event.key === 'ArrowDown') { event.preventDefault(); navigateHistory(1); return; }
  if (event.key === 'Tab') { event.preventDefault(); if (state.loggedIn) applyAutocomplete(); }
});

cmdline.addEventListener('input', function() {
  if (state.historyIndex === null) state.draftInput = cmdline.value;
});

terminalShell.addEventListener('mousedown', function() {
  setTimeout(function() { cmdline.focus({ preventScroll: true }); }, 0);
});

appendLine('PXL portfolio terminal prototype');
appendLine('Use the credentials shown in the help / manual pane to log in.', 'muted');
renderPrompt();
renderHelp();
followTerminalBottom(true);
