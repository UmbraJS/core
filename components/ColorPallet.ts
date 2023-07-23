import { shadowDOM, setColor } from './shadow'

export class ColorPallet extends HTMLElement {
  static properties = {
    name: {type: String},
    index: {type: Number},
  };
  constructor() {
    super()
    const name = this.getAttribute('name') || 'foreground';
    const atIndex = this.getAttribute('index')
    const index = atIndex ? parseInt(atIndex, 10) : 0
    const shadow = shadowDOM(this, `
      <style>
        div.pallets {
          display: flex;
          flex-direction: column;
          width: 50px;
          border: 1px solid var(--foreground);
          box-sizing:border-box
        }
    
        div.pallets.reverse {
          flex-direction: column-reverse;
          border-top: 0px solid var(--foreground);
        }
    
        div.pallets > div {
          height: 50px;
          aspect-ratio: 1 / 1;
          background: var(--foreground);
          box-sizing: border-box;
        }

        div.pallets:not(.reverse) {
          border-bottom: 0px solid var(--foreground);
        }
      </style>
      <div class="pallets">
        <div class="color"></div>
      </div>
    `)

    if(name === 'foreground') setColor(shadow, name)
    if(name === 'background') setColor(shadow, name).reverse()  
    if(name === 'accents') setColor(shadow, name, index)
  }
}
