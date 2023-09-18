// Sider/index.jsx

import React from 'react';
import classnames from 'classnames';
import { useStore } from 'reactflow';
import { Scrollbars } from 'react-custom-scrollbars';

// 可用节点
const allowedNodes = [
  {
    name: 'Input Tensor',
    className: "input-node",
    type: 'relation',
  },
  {
    name: 'Conv2D',
    className: "relation-node",
    type: 'relation', // 这是自定义节点类型
  },
  {
    name: 'Relu',
    className: "relation-node",
    type: 'relation', // 这是自定义节点类型
  },
  {
    name: 'BatchNorm',
    className: "relation-node",
    type: 'relation', // 这是自定义节点类型
  },
  {
    name: 'BatchNorm',
    className: "relation-node",
    type: 'relation', // 这是自定义节点类型
  },
  {
    name: 'LeakyReLu',
    className: "relation-node",
    type: 'relation', // 这是自定义节点类型
  },
  {
    name: 'Conv1D',
    className: "relation-node",
    type: 'relation', // 这是自定义节点类型
  },
  {
    name: 'MaxPooling1D',
    className: "relation-node",
    type: 'relation', // 这是自定义节点类型
  },
  {
    name: 'MaxPooling2D',
    className: "relation-node",
    type: 'relation', // 这是自定义节点类型
  },
  {
    name: 'BatchNorm',
    className: "relation-node",
    type: 'relation', // 这是自定义节点类型
  },
  {
    name: 'AvgPooling1D',
    className: "relation-node",
    type: 'relation', // 这是自定义节点类型
  },
  {
    name: 'AvgPooling2D',
    className: "relation-node",
    type: 'relation', // 这是自定义节点类型
  },
  {
    name: 'Output Tensor',
    className: "output-node",
    type: 'output',
  },
];

export default function FlowSider() {
  // 获取画布上的节点
  const nodes = useStore((store) => store.nodes);
  const onDragStart = (evt, nodeType, name) => {
    // 记录被拖拽的节点类型
    evt.dataTransfer.setData('application/reactflow', nodeType + ',' + name);
    evt.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Scrollbars style={ {width: 180}}>
      <div className="sider" >
        <div className="nodes">
          {allowedNodes?.map((x, i) => (
            <div
              key={`${x.type}-${i}`}
              className={classnames(["sider-node", x.className])}
              onDragStart={e => onDragStart(e, x.type, x.name)}
              draggable
            >
              {x.name}
            </div>
          ))}
        </div>
        <div className="print">
          <div className="print-line">
            节点数量：{ nodes?.length || '-' }
          </div>
          <ul className="print-list">
            {
              nodes?.map((x) => (
                <li key={x.id} className="print-item">
                  <span className="print-item-title">{x.data.name}</span>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </Scrollbars>
  );
}
