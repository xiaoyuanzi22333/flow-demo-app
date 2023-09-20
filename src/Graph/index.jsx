// Graph/index.jsx

import React, { useRef,  useContext, useEffect, useCallback } from "react";
import ReactFlow, { addEdge, Controls, Background } from "reactflow";
import RelationNode from "../components/Node/RelationNode";
import LinkEdge from "../components/Edge/LinkEdge";
import { FlowContext, Actions } from "../context";
import 'reactflow/dist/style.css';



const defaultElements = [
  {
    id: "000",
    position: { x: 283, y: 65 },
    type: "relation",
    data: { label: "relation node", name: "input tensor" },
  },
  {
    id: "999",
    position: { x: 576, y: 118 },
    type: "relation",
    data: { label: "relation node", name: "output tensor" },
  },
  {
    id: "reactflow__edge-rmGjd9wVnull-FkJ6fZXDnull",
    source: "000",
    sourceHandle: null,
    target: "999",
    targetHandle: null,
    type: "link",
    label: "transfer",
    arrowHeadType: 'arrowclosed'
  },
];


const initialNodes = [
  {
    id: "000",
    position: { x: 283, y: 65 },
    type: "relation",
    data: { label: "relation node", name: "input tensor" },
  },
  {
    id: "020",
    position: { x: 800, y: 65 },
    type: "relation",
    data: { label: "relation node", name: "input tensor" },
  },
  {
    id: "999",
    position: { x: 576, y: 118 },
    type: "relation",
    data: { label: "relation node", name: "output tensor" },
  }
];

const initialEdges = [
  {
    id: "reactflow__edge-rmGjd9wVnull-FkJ6fZXDnull",
    source: "000",
    sourceHandle: null,
    target: "999",
    targetHandle: null,
    type: "link",
    label: "transfer",
    arrowHeadType: 'arrowclosed'
  }
];



// 自定义节点
const nodeTypes = {
  relation: RelationNode,
};

// 自定义连线
const edgeTypes = {
  link: LinkEdge,
};


function getHash(len) {
  let length = Number(len) || 8;
  const arr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
  const al = arr.length;
  let chars = "";
  while (length--) {
    chars += arr[parseInt(Math.random() * al, 10)];
  }
  return chars;
}

export default function FlowGraph(props) {
  const { state, dispatch } = useContext(FlowContext);
  const { elements, reactFlowInstance } = state;

  console.log({state});
  // 画布的 DOM 容器，用于计算节点坐标
  const graphWrapper = useRef(null);

  const setReactFlowInstance = (instance) => {
    dispatch({
      type: Actions.SET_INSTANCE,
      payload: instance,
    });
  };

  const setElements = useCallback((els) => {
    dispatch({
      type: Actions.SET_ELEMENTS,
      payload: els,
    });
  },[dispatch]);

  

  // 画布加载完毕，保存当前画布实例
  const onLoad = (instance) => setReactFlowInstance(instance);
  // 连线
  const onConnect = (params) =>
  {
    console.log('connecting');
    const id = `reactflow__edge-${params.source}${params.sourceHandle}-${params.target}${params.targetHandle}`;
    dispatch({
      type: Actions.SET_FLOW_NODE,
      payload: {
        id,
        label: "Edge Label",
      },
    });

    dispatch({
      type: Actions.SET_ELEMENTS,
      payload: {
        id ,
        label: "Edge Label",
        ...params
      },
    });

    setElements(
      addEdge(
        {
          ...params,
          type: "link",
          label: "Edge Label"
        },
        elements
      )
    );
  }
    

  // 拖拽完成后放置节点
  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = graphWrapper.current.getBoundingClientRect();
    const nodeData = event.dataTransfer.getData("application/reactflow").split(',')
    const type = nodeData[0];
    const name = nodeData[1];
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: getHash(),
      type,
      position,
      data: { label: `${type} node`, name },
    };
    dispatch({
      type: Actions.SET_FLOW_NODE,
      payload: {
        id: newNode.id,
        ...newNode.data,
      },
    });
    setElements(elements.concat(newNode));
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  useEffect(() => {
    defaultElements.forEach(element => {
      dispatch({
        type: Actions.SET_FLOW_NODE,
        payload: {
          id: element.id,
          ...element.data,
        },
      });
    });
    setElements(defaultElements);
  }, [dispatch, setElements]);
  
  

  return (
    <div className="graph" ref={graphWrapper}>
      <ReactFlow
        // elements={elements}
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        onLoad={onLoad}
        onDrop={onDrop}
        onDragOver={onDragOver}
        // draggable
      >
        <Controls position="bottom-right"/>
        <Background />
      </ReactFlow>
    </div>
  );
}
