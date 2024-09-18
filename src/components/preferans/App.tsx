import { useState } from 'react'

type PlayerResult = {
    mountain: number
    pool: number
    whist: number[]
}

let state: PlayerResult[][] = [
    [],
    [],
    []
]

function addScore(results: PlayerResult[]) {
    for (let i = 0; i < results.length; i++) {
        state[i].push(results[i])
    }
}

function formatHistory(history: number[]) {
    let result: number[] = []
    let sum = 0
    
    for (let i = 0; i < history.length; i++) {
        if (history[i] === 0) continue
        
        sum += history[i]
        result.push(sum)
    }
    
    if (result.length === 0) return ''
    let n = history.at(-1) === 0 ? 1 : 2
    return `.${result.slice(-n).join('.')}`
    
}

addScore([
    {
        mountain: 0,
        pool: 2,
        whist: [0, 0]
    },
    {
        mountain: 0,
        pool: 0,
        whist: [16, 0]
    },
    {
        mountain: 0,
        pool: 0,
        whist: [0, 0]
    }
])

addScore([
    {
        mountain: 0,
        pool: 2,
        whist: [0, 0]
    },
    {
        mountain: 16,
        pool: 0,
        whist: [0, 0]
    },
    {
        mountain: 4,
        pool: 0,
        whist: [0, 0]
    }
])

addScore([
    {
        mountain: 2,
        pool: 0,
        whist: [0, 0]
    },
    {
        mountain: 2,
        pool: 0,
        whist: [0, 0]
    },
    {
        mountain: 6,
        pool: 0,
        whist: [0, 0]
    }
])

addScore([
    {
        mountain: 0,
        pool: 0,
        whist: [0, 0]
    },
    {
        mountain: 8,
        pool: 0,
        whist: [0, 0]
    },
    {
        mountain: 8,
        pool: 0,
        whist: [0, 0]
    }
])

export function App() {
    const [count, setCount] = useState(0)
    
    return (
        <div>
            <div>{count}</div>
            <button onClick={() => {console.log('count'); setCount(count + 1)}}>count++</button>

            {state.map((s, i) =>
                <div style={{marginBottom: 30}}>    
                    <div>Player {i + 1}</div>
                    <div>m: {formatHistory(s.map(r => r.mountain))}</div>
                    <div>p: {formatHistory(s.map(r => r.pool))}</div>
                </div>
            )}
        </div>
    )
}