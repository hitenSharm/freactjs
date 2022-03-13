// import React from 'react';
// import ReactDOM from 'react-dom';

//as any child could be something primitive like text/numbers we need a secial function just for those nodes

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

//---------- creation basically does this

//--jsx below 

// const element = (                                
//   <h1 title="fubar">Text child</h1>
// );

//--turns to

// const element ={
//   type:"h1",
//   props:{
//     title:"fubar",
//     children:"Text child"
//   }
// };
//--------------------------------------------

// we need to create our own React.createElement type function which takes jsx and turns it to js
//a create element function basically creates an object with types and props


const container = document.getElementById("root")
