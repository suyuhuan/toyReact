import {ToyReact, Component} from "./ToyReact.js"

class MyComponent extends Component{
    render() {
        return <div>
               <span>hello</span>
              <div>{this.children}</div>
            </div>
    }
    setAttribute(name, vaule) {
        this[name] = vaule;
    }
    mountTo(parent) {
        let vdom = this.render();
        vdom.mountTo(parent);
    }
}

let a = <MyComponent name = "a" id="ida">
    <div>123</div>
</MyComponent>
ToyReact.render(
    a,
    document.body
)
// document.body.appendChild(a);