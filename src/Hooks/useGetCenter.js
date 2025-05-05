import { useDispatch } from 'react-redux'
import * as THREE from 'three'
import { useCallback } from 'react'
import { adjustPosition } from '../Redux/Slice/3Dslice'

export function useGetCenter() {
    const dispatch = useDispatch()

    const adjust = useCallback((modelRef) => {
        if (!modelRef?.current) return
        const box = new THREE.Box3().setFromObject(modelRef.current)
        let center;
        box.getCenter(center);

        return center;
    }, [dispatch])

    return adjust
}
