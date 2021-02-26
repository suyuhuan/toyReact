class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }
    //elementWrapper
    setAttribute(name, value) {
        if(/^on([\s\S]+)$/.test(name)) {
            let eventName = RegExp.$1.replace(/^[\s\S]+/, s => s.toLowerCase())
            this.root.addEventListener(eventName, value)
        }

        if (name === 'className') {
            name = 'class'
        }
           
        this.root.setAttribute(name, value)
    }
    appendChild(vchild) {
      let range = document.createRange();
      if(this.root.children.length){
        range.setStartAfter(this.root.lastChild)
        range.setEndAfter(this.root.lastChild)
      } else {
        range.setStart(this.root,0)
        range.setEnd(this.root,0)
      }
     
      vchild.mountTo(range);
    }
    //elementWrapper
    mountTo(range) {
        range.deleteContents();
       range.insertNode(this.root);
    //    range.insertNode(this.root);
    //   range.appendChild(this.root)
    }
}
class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
    //text
    mountTo(range) {
      range.deleteContents();
       range.insertNode(this.root);
        // parent.appendChild(this.root)
    }
}

export class Component {
    constructor() {
        this.children = [];
        this.props = Object.create(null);
    }
    //component
    setAttribute(name, value) {
        this.props[name] = value;
        this[name] = value;
    }
    setState(state) {
        let merge = (oldState, newState) => {
            for(let p in oldState) {
              if (typeof newState[p] === 'object') {
                if(typeof oldState[p] !== 'object') {
                    oldState[p] = {};
                //   continue
                }
                merge(oldState[p], newState[p])
              } else {
                oldState[p] = newState[p];
              }
            }
        }

        if (!this.state && state) {
            this.state = {}
        }
        merge(this.state, state)
        this.updated();
    }
  
    mountTo(range) {
        this.range = range;
        this.updated();
    }
    appendChild(vchild) {
        this.children.push(vchild)
    }
    updated() {
        let placeholder = document.createComment("placeholder");
        let range = document.createRange();
        range.setStart(this.range.endContainer, this.range.endOffset);
        range.setEnd(this.range.endContainer, this.range.endOffset);
        range.insertNode(placeholder);

       this.range.deleteContents();
        
        let vdom = this.render();
        vdom.mountTo(this.range);

        // placeholder.parentNode.removeChild(placeholder);
    }
}

export let ToyReact = {
    createElement(type, attributes, ...children) {
        let element;
        if (typeof type === "string") {
            element = new ElementWrapper(type)
        } else {
            element = new type()
        }

        // let element = document.createElement(type)
        for (let name in attributes) {
            element.setAttribute(name, attributes[name]);
        }
        let insertChildren = (children) => {
            for(let child of children) {
                if (typeof child === "string") {
                    child = new TextWrapper(child);
                } else if (typeof child === "object" && child instanceof Array) {
                    insertChildren(child)
                    continue;
                } else {
                    if (!(child instanceof Component) &&
                        !(child instanceof ElementWrapper) &&
                        !(child instanceof TextWrapper)
                    ) {
                        child = String(child);
                    }
                }

                element.appendChild(child)
            }
        }

        insertChildren(children);
        return element;
    },
    render(vdom, element) {
      let range = document.createRange();
      if(element.children.length){
        range.setStartAfter(element.lastChild)
        range.setEndAfter(element.lastChild)
      } else {
        range.setStart(element,0)
        range.setEnd(element,0)
      }
     
        vdom.mountTo(range);
    }
}