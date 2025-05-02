import { useDispatch } from 'react-redux'
import * as THREE from 'three'
import { useCallback } from 'react'
import { adjustPosition } from '../Redux/Slice/3Dslice'

export function useAdjustYToGround() {
    const dispatch = useDispatch()

    const adjust = useCallback((modelRef, position, id) => {
        if (!modelRef?.current || position.length === 0) return
        const box = new THREE.Box3().setFromObject(modelRef.current)
        const yOffset = parseFloat(box.min.y.toFixed(2))

        dispatch(
            adjustPosition({
                id,
                position: [position[0], position[1] - yOffset + 0.5, position[2]],
            })
        )
    }, [dispatch])

    return adjust
}
