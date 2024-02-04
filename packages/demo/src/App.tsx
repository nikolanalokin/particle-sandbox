import { useEffect, useRef } from 'react'
import { Scene } from '@particle-sandbox/engine'
import './App.css'

export const App = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const scene = new Scene({ rootEl: canvasRef.current })
        scene.play()

        return () => {
            scene.destroy()
        }
    }, [])

    return (
        <>
            <header className="header"></header>
            <main className="main">
                <canvas ref={canvasRef}></canvas>
            </main>
            <aside className="sidebar">
                <button data-type="0">Empty</button>
                <button data-type="1">Wall</button>
                <button data-type="2">Sand</button>
                <button data-type="3">Water</button>
            </aside>
            <footer className="footer"></footer>
        </>
    )
}
