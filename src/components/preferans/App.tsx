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

function result() {
    let sumPool = 0
    for (let i = 0; i < state.length; i++) {
        let playerSum = 0
        for (let j = 0; j < state[i].length; j++) {
            playerSum += state[i][j].pool
        }
        sumPool += playerSum
    }
    return sumPool / 3
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

function whist(i: number, w: number) {
    // return (i + w + 1) % 3 + 1
    let players: number[] = [1, 2, 3]
    players.splice(i, 1)
    return players[w]
} 

export function App() {  
    return (
        <div>
            <div>Pool result: {result()}</div>
            {state.map((s, i) =>
                <div style={{marginBottom: 30}}>    
                    <div>Player {i + 1}</div>
                    <div>m: {formatHistory(s.map(r => r.mountain))}</div>
                    <div>p: {formatHistory(s.map(r => r.pool))}</div>
                    <div>w{whist(i, 0)}: {formatHistory(s.map(r => r.whist[0]))}</div>
                    <div>w{whist(i, 1)}: {formatHistory(s.map(r => r.whist[1]))}</div>
                </div>
            )}
        </div>
    )
}