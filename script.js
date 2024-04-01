class Node {
    constructor(type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;  // children type is a Node
    }
}

function render(node) {
    if (typeof node === 'string') {
        return document.createTextNode(node);
    }

    const element = document.createElement(node.type);

    for (let prop in node.props) {
        element[prop] = node.props[prop];
    }

    // Creating element for child tag and appending to parent tag by recursion 

    node.children.forEach(child => {
        element.appendChild(render(child));
    });

    return element;
}

function update(parent, newNode, oldNode, index = 0) {

    // Update logic here
    if(!oldNode) {  // if there is no old node present or oldnode is null then add newnode
        parent.appendChild(render(newNode));  
    }else if(!newNode) {
        parent.removeChild(parent.childNodes[index]);
    }else if(changed(newNode , oldNode)) {
        parent.replaceChild(render(newNode) , parent.childNodes[index]);  // nodes are different replace like instead of <p> we got <buttion> 
    } else if (newNode.type) {
        updateElement(parent.childNodes[index], newNode, oldNode);
    }
}

function updateElement(element, newNode, oldNode) {
    for (let prop in newNode.props) {
        if (newNode.props[prop] !== oldNode.props[prop]) {
            element[prop] = newNode.props[prop];
        }
    }

    const maxLength = Math.max(newNode.children.length, oldNode.children.length);
    for (let i = 0; i < maxLength; i++) {
        update(element, newNode.children[i], oldNode.children[i], i);
    }
}

function changed(node1, node2) {
    return typeof node1 !== typeof node2 ||
        typeof node1 === 'string' && node1 !== node2 ||
        node1.type !== node2.type;
}

const virtualDom = new Node('div', { id: 'app' , class : "style" }, [
    new Node('h1', {}, ['Hello, World!']),
    new Node('p', {}, ['This is a custom virtual DOM.']),
]);

const root = document.getElementById('root');
root.appendChild(render(virtualDom));

// Example update
const newVirtualDom = new Node('p', { id: 'app' }, [
    new Node('h1', {}, ['Hello, Virtual DOM!']),
    new Node('p', {}, ['This is a custom virtual DOM.']),
]);

update(root, newVirtualDom, virtualDom);