export class CardColor {
    constructor(name, backgroundCode, textCode) {
        this.name = name;
        this.background = backgroundCode;
        this.text = textCode;

        CardColor.choices.push(this)
    }

    static choices = [];

    static getCardScheme(i) {
        return CardColor.choices[i % CardColor.choices.length]
    }
}

new CardColor('red', '#c23331' ,'#fff8db');
new CardColor('purple', '#BA9ACA', '#000000');
new CardColor('green', '#95A850', '#000000');
new CardColor('blue', '#98d4cd', '#000000');
new CardColor('salmon', '#EFA890', '#000000');
new CardColor('gray', '#bfb5b3', '#000000');
new CardColor('black', '#000000', '#fff8db');
