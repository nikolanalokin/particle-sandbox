import { useEffect, useRef, useState } from 'react'
import { Scene, Species, SpeciesValue } from '@particle-sandbox/engine'
import './App.css'

export const App = () => {
    const canvasRef = useRef(null)
    const sceneRef = useRef<Scene>(null)

    const [species, setSpecies] = useState<SpeciesValue>(Species.Sand)

    useEffect(() => {
        sceneRef.current = new Scene({ rootEl: canvasRef.current })
        sceneRef.current.play()

        return () => {
            sceneRef.current.destroy()
        }
    }, [])

    const handleSpeciesButtonClick = (species: SpeciesValue) => {
        sceneRef.current.setBrushSpecies(species)
        setSpecies(species)
    }

    return (
        <>
            <header className="header"></header>
            <main className="main">
                <canvas ref={canvasRef}></canvas>
            </main>
            <aside className="sidebar">
                { Object.entries(Species).map(([name, value]) => (
                    <button
                        key={value}
                        data-species-name={name}
                        data-species-value={value}
                        data-selected={species === value}
                        onClick={() => handleSpeciesButtonClick(value)}
                    >
                        { name }
                    </button>
                )) }
            </aside>
            <footer className="footer"></footer>
        </>
    )
}
