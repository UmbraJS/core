import { output } from "../main"

export function shadowDOM(that: any, template: string) {
  const templateNode = document.createElement('template')
  templateNode.innerHTML = template
  const shadow = that.attachShadow({mode: 'open'})
  shadow.append(templateNode.content.cloneNode(true))
  return shadow
}

const getArray = (name: string) => {
  const genObject = output.generated.filter((c) => c.name === name)
  return genObject
}

function shadeArray(el: Element | null, name?: string, index?: number) {
  if(!name || !el) return

  console.log("check", getArray(name), name)

  const shades = getArray(name)[index ||0].shades
  const pallet = el
  
  if(!pallet) return

  shades.forEach((shade, index) => {
    if(name === 'accents') name = 'accent'
    const value = `var(--${name}-${index})`
    const div = document.createElement('div')
    //assign
    div.style.backgroundColor = value
    div.innerHTML = "" + index || '0'
    pallet.appendChild(div)
  })
}
 
export function setColor(shadow: ShadowRoot, name: string, index?: number) {
  const pallets = shadow.querySelector('.pallets')
  shadeArray(pallets, name, index)
  if(name === 'accents') name  = 'accent'
  
  const colorCSS = `background: var(--${name});`
  shadow.querySelector('.color')?.setAttribute('style', colorCSS)
  return {
    reverse: () => {
      pallets?.classList.add('reverse')
    }
  }
}

export function stringMap(array?: string[]) {
  let string = ''
  if(!array) return string
  array.forEach((s) => {string += s})
  return string
}