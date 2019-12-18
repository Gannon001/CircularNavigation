const subMenu0 = [
  { label: 'Sub 0 - 0', data: 'ANIMATION_0_0' },
  { label: 'Sub 0 - 1', data: 'ANIMATION_0_0' },
  { label: 'Sub 0 - 2', data: 'ANIMATION_0_0' },
]

const subMenu1 = [
  { label: 'Sub 1 - 0', data: 'ANIMATION_0_0' },
  { label: 'Sub 1 - 1', data: 'ANIMATION_0_0' },
  { label: 'Sub 1 - 2', data: 'ANIMATION_0_0' },
  { label: 'Sub 1 - 4', data: 'ANIMATION_0_0' },
]

const subMenu2 = [
  { label: 'Sub 2 - 0', data: 'ANIMATION_0_0' },
  { label: 'Sub 2 - 1', data: 'ANIMATION_0_0' },
  { label: 'Sub 2 - 2', data: 'ANIMATION_0_0' },
  { label: 'Sub 2 - 3', data: 'ANIMATION_0_0' },
  { label: 'Sub 2 - 4', data: 'ANIMATION_0_0' },
  { label: 'Sub 2 - 5', data: 'ANIMATION_0_0' },
]

const subMenu3 = [
  { label: 'Sub 3 - 0', data: 'ANIMATION_0_0' },
  { label: 'Sub 3 - 1', data: 'ANIMATION_0_0' },
  { label: 'Sub 3 - 2', data: 'ANIMATION_0_0' },
  { label: 'Sub 3 - 3', data: 'ANIMATION_0_0' },
  { label: 'Sub 3 - 4', subMenu: [
    { label: 'Sub 3 - 4 - 0', data: 'ANIMATION_0_0' },
    { label: 'Sub 3 - 4 - 1', data: 'ANIMATION_0_0' },
  ] },
  { label: 'Sub 3 - 5', subMenu: [
    { label: 'Sub 3 - 5 - 0', data: 'ANIMATION_0_0' },
    { label: 'Sub 3 - 5 - 1', data: 'ANIMATION_0_0' },
  ] },
]

const menu = [
  { label: 'Menu 0', subMenu: subMenu0 },
  { label: 'Menu 1', subMenu: subMenu1 },
  { label: 'Menu 2', subMenu: subMenu2 },
  { label: 'X', data: 'cancel_event', class: 'cancel' },
  { label: 'Menu 3', subMenu: subMenu3 },
  { label: 'Menu 3', subMenu: subMenu3 },
]


class CircularMavigation {

  constructor ($svgElem, options = {}) {
    this.$svgElem = $svgElem
    const w = window.innerWidth || document.documentElement.clientWidth ||  document.body.clientWidth
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeigh
    this.$svgElem.style.width = w
    this.$svgElem.style.height = h
    this.$svgElem.setAttribute('viewBox', `${-w / 2} ${-h / 2} ${w} ${h}`)
    this.baseR = options.baseRayon || 250
    this.baseHeigth = 90
    this.elements = {
      items: [],
      subItem: []
    }
    this.currentDeep = []
  }

  showMenu (menu, deep = 0) {
    this.reset()
    this.buildMenu(menu, this.baseR, this.baseR + this.baseHeigth)
  }

  onPressItem (item, options) {
    if (! item.subMenu && options.type === 'click') {
      alert(JSON.stringify(item))
      this.reset()
      // DEBUG
      this.showMenu(menu)
      return
    }

    // On appuie pour ouvrir un sous menu
    const newDeep = options.deep
    
    let checkDeepIndex = 0
    let change = false
    do {
      if (checkDeepIndex >= this.currentDeep.length || checkDeepIndex >= newDeep.length) {
        break
      }
      if (newDeep[checkDeepIndex] !== this.currentDeep[checkDeepIndex]) {
        const e = this.getDeepElement(this.currentDeep.slice(0, checkDeepIndex + 1))
        this.resetItem(e)
        change = true
        break
      }
      checkDeepIndex++
    } while (true)

    if (change === false && newDeep.length <= this.currentDeep.length) {
      return
    }
    options.target.classList.add('select')
    this.currentDeep = options.deep
    if (item.subMenu) {
      const d = options.deep.length
      const r = this.baseR + d * this.baseHeigth
      this.buildMenu(item.subMenu, r, r + this.baseHeigth, 20, options.baseAngle, this.currentDeep)
    }
  }

  getDeepElement (deep) {
    const localDeep = deep.slice()
    let elem = this.elements
    while (localDeep.length !== 0) {
      elem = elem.subItem[localDeep.splice(0, 1)[0]]
    }
    return elem
  }

  resetItem (item) {
    // items.classList.remove('select')
    for (const e of item.items) {
      e.classList.remove('select')
    }
    while (item.subItem.length !== 0) {
      const _item = item.subItem.splice(0, 1)[0]
      this.deepDelete(_item)
    }
  }

  deepDelete (item) {
    for (const e of item.items) {
      this.$svgElem.removeChild(e)
    }
    while (item.subItem.length !== 0) {
      const _item = item.subItem.splice(0, 1)[0]
      this.deepDelete(_item)
    }
  }

  reset () {
    while (this.$svgElem.firstChild) {
      this.$svgElem.removeChild(this.$svgElem.firstChild)
    }
    this.elements = {
      items: [],
      subItem: []
    }
    this.currentDeep = []
  }

  buildMenu (menu, r1, r2, maxItem, deltaAngle, deep = [], $rootElement) {
    const $baseElement = $rootElement || this.$svgElem
    const nbElement = menu.length
    let angle = 360 / nbElement
    let baseAngle = deltaAngle !== undefined ? deltaAngle : 180
    if (maxItem !== undefined) {
      angle = 360 / maxItem
      baseAngle += ((nbElement - 1) / 2 * angle)
    }
    let elements = this.elements.subItem
    for (let index of this.currentDeep) {
      elements = elements[index].subItem
    }
    for (let i = 0; i < nbElement; i++) {
      const m = menu[i]
      const newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path')
      newElement.setAttribute('class', 'svg-button hidden')
      let a0 = baseAngle - angle * i - (angle / 2)
      let a1 = a0 + angle
      let angCenterBtn = baseAngle - angle * i
      let coef0x = Math.sin(a0 / 180 * Math.PI)
      let coef0y = Math.cos(a0 / 180 * Math.PI)
      let coef1x = Math.sin(a1 / 180 * Math.PI)
      let coef1y = Math.cos(a1 / 180 * Math.PI)
      const p0 = [coef0x * r2, coef0y * r2]
      const p1 = [coef1x * r2, coef1y * r2]
      const p2 = [coef1x * r1, coef1y * r1]
      const p3 = [coef0x * r1, coef0y * r1]
      let d = `M ${p0}`
      d += ` A ${r2} ${r2} 0 0 0 ${p1[0]} ${p1[1]}`
      d += ` L ${p2}`
      d += ` A ${r1} ${r1} 0 0 1 ${p3[0]} ${p3[1]}`
      d += ' Z'
      newElement.setAttribute('d', d)
      
      newElement.addEventListener('mouseenter', (e) => {
        this.onPressItem(m, {
          target: newElement,
          baseAngle: angCenterBtn,
          deep: [...deep, i],
          type: 'mouseenter'
        })
      })
      newElement.addEventListener('click', (e) => {
        this.onPressItem(m, {
          target: newElement,
          baseAngle: angCenterBtn,
          deep: [...deep, i],
          type: 'click'
        })
      })
      $baseElement.appendChild(newElement)

      const newElementText = document.createElementNS("http://www.w3.org/2000/svg", 'text')
      newElementText.setAttribute('class', 'svg-button-text hidden')
      newElementText.setAttribute('dominant-baseline', 'middle')
      newElementText.setAttribute('text-anchor', 'middle')
      newElementText.appendChild(document.createTextNode(m.label))
      
      let dist = (r2 + r1) / 2
      let posXbtn = Math.sin(angCenterBtn / 180 * Math.PI) * dist
      let posYbtn = Math.cos(angCenterBtn / 180 * Math.PI) * dist
      newElementText.setAttribute('x', posXbtn)
      newElementText.setAttribute('y', posYbtn)

      if (m.class) {
        newElement.classList.add(m.class)
        newElementText.classList.add(m.class)
      }

      $baseElement.appendChild(newElementText)
      elements.push({
        items: [newElement, newElementText],
        subItem: []
      })
      // this.elements.push([newElement, newElementText])
    }
    this.$svgElem.getBoundingClientRect()
    for (let el of elements) {
      for (let e of el.items) {
        e.classList.remove('hidden')
      }
    }
  }
}

// window.addEventListener('DOMContentLoaded', () => {
//   const $svgElem = document.querySelector('#svgMenu')
//   const myMenu = new CircularMavigation($svgElem)

//   myMenu.showMenu(menu)
// })

const main = function () {
  const $svgElem = document.querySelector('#svgMenu')
  const myMenu = new CircularMavigation($svgElem)
  myMenu.showMenu(menu)
}

if (document.readyState === 'complete') {
  main()
} else {
  document.addEventListener('DOMContentLoaded', main)
}

