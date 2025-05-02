import { Gltf } from '@react-three/drei';
import { useThreeContext } from '../Context/threeContext';
import { set_s_selectedObj_view3 } from '../Redux/Slice/3Dslice';
import { useDispatch } from 'react-redux';
export default function PressureGauge({ position, scale=[1.5, 1.5, 1.5], rotation, clickable_view2 = false }) {
    // const { set_s_selectedObj_view3 } = useThreeContext();
    const dispatch = useDispatch();


    const handleClick = () => {
        if (clickable_view2) {
            dispatch(set_s_selectedObj_view3("PressureGauge"));
        }
    }
    
    return (
        <Gltf
            src={"/modal/pressure_gauge/scene.gltf"}
            position={position} 
            scale={scale}
            rotation={rotation}
            onClick={handleClick}
        />
    )
}