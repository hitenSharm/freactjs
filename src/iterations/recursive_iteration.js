function createElement(type, props, ...children) {
    //as any child could be something primitive like text/numbers we need a secial function just for those nodes
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
  
  function createTextElement(text) {
    return {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: text,
        children: [],
      },
    };
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
  
  //ReactDOM.render like function below
  
  function render(ele, container) {
    //this function will turn JS into a webpage
    const dom =
      ele.type == "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(ele.type);
    //this creates first element. once done we need to call recursively
    ele.props.children.forEach((child) => render(child, dom));
    //we also need to assign properties of node i.e. nodeValue and stuff
    const propertExists = (property) => property !== "children";
  
    Object.keys(ele.props)
      .filter(propertExists)
      .forEach((name) => {
        dom[name] = ele.props[name];
        console.log(name);
      });
  
    container.appendChild(dom);
  }
  
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
  