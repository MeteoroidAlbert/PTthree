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

export default function Scene2() {
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

  const { camera } = useThree();

  const ref = useRef();
  const lightRef = useRef();




  const handlePanelShowing = (type) => {
    set_s_islocking(prevState => !prevState);
    set_s_selectedObj_view2(prev => prev === type ? undefined : type);
    type === "Reactor1" && set_s_isShowing_reactor(prev => !prev);
    type === "Mixer" && setTimeout(() => set_s_isShowing_mixer(prev => !prev), 500)
  };


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
    setComponentView2(undefined)
  }, [s_cameraType])





  return (


    <>
      <color attach="background" args={['#d6edf3']} />
      <ComponentView2 clickable_view1={false} clickable_view2={true} position={[0, 0, 0]} s_data={s_data} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 100, 10]} />
      <ThirdPersonController
        cameraPosition={new THREE.Vector3(25, 25, 25)}
        orbitTarget={new THREE.Vector3(0, 1, 0)}
      />
    </>




  );
}
