import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState, } from 'react';
import * as THREE from "three";
import { Box, HoleBox } from './Modal/Box';
import Reactor1 from './Modal/Reactor1';
import Reactor2 from './Modal/Reactor2';
import ThirdPersonController from './Modal/camera/ThirdPersonController';
import Mixer from './Modal/Mixer';
import Pallet from './Modal/Pallet';
import { DataTableMixer, DataTableReactor } from './Component/DataTable';
import PalletTruck from './Modal/PalletTruck';
import CautionTape from './Modal/CautionTape';
import FireExtinguisher from './Modal/FireExtinguisher';
import Scales from './Modal/Scale';
import { Button, Drawer, Space, Table } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Billboard, Environment, GizmoHelper, GizmoViewport, KeyboardControls, PointerLockControls, Text, useHelper, View } from '@react-three/drei';
import { useThreeContext } from './Context/threeContext';
import { Physics } from '@react-three/rapier';
import { Player } from './Modal/camera/Player';
import TestModle from './Modal/TestModle';
import TestBox from './Modal/TestBox';
import Scene1 from './Scene1';



const tableColumns_mixer = [
  {
    title: "TEST1",
    dataIndex: "test1",
    width: 120,
  },
  {
    title: "TEST2",
    dataIndex: "test2",
    width: 120,
  },
  {
    title: "TEST3",
    dataIndex: "test3",
    width: 120,
  },
  {
    title: "TEST4",
    dataIndex: "test4",
    width: 120,
  },
  {
    title: "TEST5",
    dataIndex: "test5",
    width: 120,
  }
]

const fakeData_mixer = [
  {
    test1: "1",
    test2: "2",
    test3: "3",
    test4: "4",
    test5: "5",
  }
]



const positionTarget = {
  default: [[80, 120, 60], []], // 0: cameraPosition, 1: orbitTarget
  Reactor1: [[0, 20, -20], [-20, 20, -20]],
  Mixer: [[60, 5, -50], [60, 5, -70]]
};

export default function ThreeScene() {
  const [s_isShowing_reactor, set_s_isShowing_reactor] = useState(false);  // Panel_ractor顯示與否
  const [s_isShowing_mixer, set_s_isShowing_mixer] = useState(false);      // Panel_mixer顯示與否
  const [s_islocking, set_s_islocking] = useState(false);                  // 視角鎖定與否
  const [s_cameraPosition, set_s_cameraPosition] = useState(               // 相機位置與目標
    new THREE.Vector3(...positionTarget.default[0])
  );
  const [s_orbitTarget, set_s_orbitTarget] = useState(
    new THREE.Vector3(...positionTarget.default[1])
  );

  const [s_showData, set_s_showData] = useState(false);
  const [s_data, set_s_data] = useState(undefined);  // 存取後端資料

  const {
    s_cameraType, set_s_cameraType,
    s_isDialogueShowing, s_interactObj,
    s_selectedObj_view2, set_s_selectedObj_view2,
    s_visible_view2, set_s_visible_view2,
    ComponentView2, setComponentView2,
    s_selectedObj_view3, set_s_selectedObj_view3,
    s_visible_view3, set_s_visible_view3,
    ComponentView3, setComponentView3,
  } = useThreeContext();



  const ref = useRef();
  const lightRef = useRef();

  const ws = useRef(null);
  let wsURL = "ws://localhost:5000";

  const connectToWs = () => {
    if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
      console.log("WebSocket is already connected or connecting.");
      return;
    };

    if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
      ws.current = new WebSocket(wsURL);   //與目的地建立websocket連線

      ws.current.addEventListener("message", handleMessage);   //監聽對象:ws (即與url指向的伺服器的websocket連線);監聽事件:伺服器向客戶端發送message
      ws.current.addEventListener("close", () => {
        setTimeout(() => {
          console.log('Disconnected. Trying to reconnect.');
          connectToWs();
        }, 1000);
      });
    }
  }

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    // console.log({ e, messageData });

    if (messageData.type === "test") {
      set_s_data(messageData.value);
    }
  }




  const handlePanelShowing = (type) => {
    set_s_islocking(prevState => !prevState);
    set_s_selectedObj_view2(prev => prev === type ? undefined : type);
    type === "Reactor1" && set_s_isShowing_reactor(prev => !prev);
    type === "Mixer" && setTimeout(() => set_s_isShowing_mixer(prev => !prev), 500)
  };


  useEffect(() => {
    connectToWs();
  }, [])

  // 調整相機目標、位置
  useEffect(() => {
    if (s_islocking && s_selectedObj_view2) {
      set_s_cameraPosition(new THREE.Vector3(...positionTarget[s_selectedObj_view2][0]));
      set_s_orbitTarget(new THREE.Vector3(...positionTarget[s_selectedObj_view2][1]));
    }
    else {
      set_s_cameraPosition(new THREE.Vector3(...positionTarget.default[0]));
      set_s_orbitTarget(new THREE.Vector3(...positionTarget.default[1]));
    }
  }, [s_islocking, s_selectedObj_view2]);




  useEffect(() => {
    console.log(s_cameraType, s_interactObj, s_isDialogueShowing);
    const handleKeyDown = (event) => {
      if (event.key === "F" || event.key === "f") {
        console.log("F已被按下")
        if (s_isDialogueShowing && s_interactObj === "reactor1" && s_cameraType === "first") {
          console.log("條件滿足")
          set_s_showData(true);
          set_s_cameraType("other");
        }
        else {
          console.log("條件未滿足:", s_isDialogueShowing, s_interactObj, s_cameraType)
        }
      }
      if (!s_interactObj) {
        set_s_showData(false);
      }
    };

    // 添加事件監聽器
    document.addEventListener('keydown', handleKeyDown);

    // 清理事件監聽器
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [s_cameraType, s_interactObj, s_isDialogueShowing]);


  useEffect(() => {
    setComponentView2(undefined)
  }, [s_cameraType])





  return (
    <div className="relative w-full h-screen bg-black">
      <Space className="absolute top-0 right-0 z-[100] p-2 bg-white border border-solid rounded-md m-2">
        <Button
          onClick={() => {
            set_s_cameraType("first");
          }}
          className={`${s_cameraType === "first" ? "bg-cyan-500 text-white" : null}`}
        >
          第一人稱
        </Button>
        <Button
          onClick={() => {
            set_s_cameraType("third");
          }}
          className={`${s_cameraType === "third" ? "bg-cyan-500 text-white" : null}`}
        >
          第三人稱
        </Button>
        <Button
          onClick={() => {
            set_s_cameraType("drag");
          }}
          className={`${s_cameraType === "drag" ? "bg-cyan-500 text-white" : null}`}
        >
          拖拽模式
        </Button>
      </Space>
      <div ref={ref} className="relative w-full h-screen">

        <View key="view1" index={1} className="absolute w-full h-full">
          <Scene1 />
        </View>

        <Canvas eventSource={ref} className="bg-[#b0c4de]" shadows>
          <View.Port />
        </Canvas>
      </div>
      {s_isDialogueShowing && (
        <div className="absolute top-[5%] left-[5%] z-[100] bg-white p-2">
          <p>F 開啟面板</p>

        </div>
      )}

      <Drawer
        placement="bottom"
        open={s_cameraType === "drag"}
        mask={false}
        height="25vh"
      >
        <div className="w-[100px] h-[100px] rounded-md border border-solid border-gray-500" draggable>
          Reactor2
        </div>
      </Drawer>


    </div>
  );
}
