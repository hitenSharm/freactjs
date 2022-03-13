// import React from 'react';
// import ReactDOM from 'react-dom';

const element ={
    type:"h1",
    props:{
      title:"fubar",
      children:"Text child"
    }
  };
  //jsx is turned into js using Babel
  //const element =<h1 title="fubar">Text child</h1> this is JSX; not valid JS
  //to turn into valid JS i need createElement
  //we can use React.createElement but we need to replace it with our own to make framework
  
  const container = document.getElementById("root")
  
  //we also need to replace ReactDom.render
  //so we need to create a node using the element
  
  const node = document.createElement(element.type);
  //create a node of type element.type and give it a title
  node["title"]=element.props.title;
  
  //next we need to work on children. i.e. create children nodes
  //here we have a string in children so we need to create a text node
  
  const text=document.createTextNode(element.props.children)
  
  //append to original node
  node.appendChild(text);
  //append to container
  container.appendChild(node);
  
  //---------------------------first iteration of a basic JavaScript only rendering system for text---------
  
  
  
  