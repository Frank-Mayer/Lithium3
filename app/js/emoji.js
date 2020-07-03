"use strict";

const emoji = new class {
  emojiTable = {
    "👼": "angel",
    "😡": "angry",
    "😲": "astonished-1",
    "😖": "confused",
    "😎": "cool-1",
    "😢": "cry-1",
    "😭": "cry",
    "😈": "devil",
    "👿": "devil",
    "😵": "dizzy",
    "😑": "expressionless",
    "😦": "flushed",
    "☺": "happy-1",
    "😊": "happy-1",
    "😁": "happy-2",
    "😀": "happy",
    "😃": "happy",
    "😍": "in-love",
    "🥰": "in-love",
    "🤕": "injury",
    "😂": "joy",
    "🤣": "joy",
    "😗": "kiss",
    "😙": "kiss-1",
    "😘": "kiss-2",
    "😷": "mask",
    "😶": "mute",
    "😐": "neutral",
    "😞": "sad-1",
    "🙁": "sad",
    "☹": "sad",
    "😨": "scared-1",
    "😧": "scared",
    "🤐": "secret",
    "😱": "shocked",
    "🤒": "sick",
    "😴": "sleeping",
    "😄": "smile-1",
    "🙂": "smile",
    "😅": "smiling-1",
    "🤩": "smiling",
    "😏": "smirking",
    "😳": "surprised",
    "😓": "sweat",
    "🙄": "thinking",
    "😫": "tired",
    "😩": "tired",
    "😛": "tongue-1",
    "😝": "tongue-2",
    "😜": "tongue",
    "😒": "unamused",
    "🤮": "vomiting",
    "🤢": "vomiting",
    "😉": "wink",
    "🧟": "zombie"
  };

  replace(txt) {
    if (typeof txt !== "string") {
      throw 'TypeError: txt is not of type "String"';
    }
    let newTxt = txt;
    for (let i in this.emojiTable) {
      let re = new RegExp(i, 'g');
      let repl = '<img class="emoji" src="./img/emoji/' + this.emojiTable[i] + '.svg" alt="' + i + '">'
      newTxt = newTxt.replace(re, repl);
    }
    return newTxt;
  }
}