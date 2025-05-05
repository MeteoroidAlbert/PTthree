import { useDispatch } from 'react-redux'
import * as THREE from 'three'
import { useCallback } from 'react'
import { set_s_selectedObj_view2, adjustPosition } from '../Redux/Slice/3Dslice'

export default function useShowView2Mod() {
    const dispatch = useDispatch();
    const showView2Mod = (value) => {
        dispatch(set_s_selectedObj_view2(value));
    }
    return { showView2Mod }
}