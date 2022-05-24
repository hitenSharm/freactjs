function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}
//this creates a VDOM
//this will return children as an array, Elements in children array
//can also be primitive stuff like strings in which case we will have to turn it into text object

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function commitWork(fiber){
  if(!fiber)return;
      
  const domParent=fiber.parent.dom;
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)  
}

function commitRoot(){
  //this is where the final render to the DOM happens      
  commitWork(wipRoot.child);
  wipRoot=null;
}

function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  const isProperty = key => key !== "children";

  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });
  //this copies properties from VDOM to DOM except children as we are appending child seperately in recursive manner
  return dom;
}

let nextWork = null;
let wipRoot = null; //work in progress root

function render(element, container) {
  //this turns my VDOM into DOM using fibers
  //set root node for fiber tree (work in progress root)
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  }
  nextWork = wipRoot;
}

function workingLoop(deadline) {
  let isYield = false;
  while (nextWork && !isYield) {
    nextWork = peformUnitWork(nextWork);
    isYield = deadline.timeRemaining() < 1;
    //timeRemaining is used to see how much time is left in the frame
  }
  if(!nextWork && wipRoot){
    commitRoot();
  }
  requestIdleCallback(workingLoop);
  //requestIdleCallback is like setTimeout but browser runs it automatically when
  //the main thread is idle in the frame
}

requestIdleCallback(workingLoop);

function peformUnitWork(fiber) {  
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
    //creation for root node
  }

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];
    //create a fiber for each child
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };    
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    //this is to make the sibling nodes
    index++;
  }
  //now we need to return next unit of work
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  //if sibling then return sibling else return
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
    //get uncle node
  }  
}
//ReactDOM.render like function below
//--------------------------------------------------------------------------------------------------
  //the main problem with my old render was that render would keep going till it hits the end of 
  //recursion stack. It wont stop till it hits the end of the tree.
  //If the element tree is big, it may block the main thread for too long.
  //So i plan to break the rendering into smaller parts. the browser will try to render it
  //if it takes too long it will skip it for now. this way i can render simple things like
  //input text boxes easily and not have to wait for some complicated task to finish first.
  //I will use requestIdleCallBack to tell the browser when it needs to take control again 
  //my function will have a way to check what is the next thing we have to render.
  //I will use a tree Data Structure in which each element will have a child and a sibling
  //The main aim of this DS is to help the browser find a way to render the next element
//--------------------------------------------------------------------------------------------------

//Tree iteration algo concept-----------------------------------------------------------------------

//Start at root, move to first node, work on it, if it has a child; move to child. 
//If it doesent have a child; move to sibling node.
//If there are no siblings or child nodes. Move to the UNCLE node(sibling of parent) Try to find one if possible
//in the end we will reach root when none are left
//the main concept of this tree is to find a way to get the next unitOfWork

//---------------------------------------------------------------------------------------------------

const Freact = {
  createElement,
  render,
};

//this comment tells Babel to use our stuff
/** @jsx Freact.createElement */

const app = (
  <div id="fubar" style="background: aliceblue">
    <h1 style="text-align:right">Hello</h1>
    <h2>World</h2>
    <div style="background: red">div number 2</div>    
    <div style="background: purple">
      <img
        style="width: 500px; height:300px;"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Facebook_Thumb_icon.svg/640px-Facebook_Thumb_icon.svg.png"
      ></img>
    </div>
    <div>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/qXUl3VsbA6o"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>  
);

const container = document.getElementById("root");

Freact.render(app, container);
