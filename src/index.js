// import React from 'react';
// import ReactDOM from 'react-dom';

function createElement(type,props,...children)
{
  return {
    type,
    props:{
      ...props,
      children:children.map(child =>{
        typeof child === "object" ? child : createTextElement(child)
      })
    }
  }
}

//as any child could be something primitive like text/numbers we need a secial function just for those nodes

function createTextElement(text)
{
  return{
    type:"TEXT_ELEMENT",
    props:{
      nodeValue:text,
      children:[],
    }
  }
}

const element = (
  <div id="bar">
    <h1>Child below is empty</h1>
    <h2></h2>
  </div>
)

// we need to create our own React.createElement type function which takes jsx and turns it to js
//a create element function basically creates an object with types and props


const container = document.getElementById("root")
