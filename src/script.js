const punycode = require('punycode');
const EmojiButton = require('@joeattardi/emoji-button');
const tlds = require('./tlds').sort((a, b) => a.price - b.price); // https://en.wikipedia.org/wiki/Emoji_domain#Availability_and_registration

const q = (e) => document.querySelector(e);
const btn = q('button');
const domains = q('#domains');
const emojiHeader = q('#emojiHeader');
const picker = new EmojiButton({
  position: 'bottom',
});

const checkAvailability = (domain) => fetch(`checkAvailability/${domain}`);

const createDisplay = (emoji) => {
  domains.innerHTML = '';
  emojiHeader.innerText = `${emoji} (${punycode.encode(emoji)})`;
  tlds.forEach((tld) => {
    const a = document.createElement('a');
    const div = document.createElement('div');
    const h1 = document.createElement('h1');
    const span = document.createElement('span');
    a.href = `https://tld-list.com/tld/${tld.tld}`;
    h1.innerText = `.${tld.tld}`;
    span.innerText = '$'.repeat(tld.price);
    div.appendChild(h1);
    div.appendChild(span);
    a.appendChild(div);
    domains.appendChild(a);
    checkAvailability(`xn--${punycode.encode(emoji)}.${tld.tld}`).then(async (requestData) => {
      const json = await requestData.json();
      if (!json.success) {
        div.className = 'unknown';
        return;
      }
      div.className = json.isAvailable ? 'free' : 'taken';
    });
  });
};

picker.on('emoji', (emoji) => {
  createDisplay(emoji);
});

btn.onclick = () => (picker.pickerVisible ? picker.hidePicker() : picker.showPicker(btn));
