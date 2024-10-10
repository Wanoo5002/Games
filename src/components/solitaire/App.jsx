import { useReducer, useState } from 'react'

class Kard {
  constructor(rank, suit) {
    this.rank = rank
    this.suit = suit
    this.deck = true
    this.open = false
    this.stack = undefined
    this.color = this.suit === '♥' || this.suit === '♦' ? 'red' : 'black'
    this.clicked = false
  }
  
  removeFromStack() {
    this.stack.splice(this.stack.indexOf(this), 1)
  }

  moveToStack(stack) {
    if (stack === this.stack) return

    stack.push(this)

    if (!this.deck && this.stack.indexOf(this) < this.stack.length - 1) {
      this.stack[this.stack.indexOf(this) + 1].moveToStack(stack)
    }

    this.removeFromStack()
    this.stack = stack
    this.open = true
    this.deck = false
  }

  canPutAbove(card) {
    card = card.stack[card.stack.length - 1]

    if (this.rank !== card.rank - 1) {
      return false
    }  

    if (this.color === card.color) {
      return false
    }

    return true
  }

  canPutAboveHome(card) {
    if (!this.deck && this.stack.indexOf(this) !== this.stack.length - 1){
      return false
    }

    if (this.rank !== card.rank + 1) {
      return false
    }  

    if (this.suit !== card.suit) {
      return false
    }

    return true
  }
}

function initialState() {
  
  const suits = ['♥', '♠', '♦', '♣']
  let allCards = []
  let stacks = []
  let home = [[], [], [], []]
  /** @type {Kard[]} */
  let shuffledCards
  let openCards = []

  function makeDeck() {
    for (const suit of suits) {
        for (let i = 0; i < 13; i++) {
            allCards.push(new Kard(i, suit));
        }   
    }
  }

  function shufflingDeck() {
    shuffledCards = [...allCards];
    for (let i = 0; i < 1000; i++) {
        let firstCard =  shuffledCards[0];
        let secondIndex = Math.floor(Math.random() * (allCards.length - 1)) + 1;

        shuffledCards[0] = shuffledCards[secondIndex];
        shuffledCards[secondIndex] = firstCard;
    }
  }

  function moveToStart(rank, suit) {
    let indexAce = shuffledCards.findIndex(card => card.rank === rank && card.suit === suit)
    shuffledCards.unshift(...shuffledCards.splice(indexAce, 1))
  }

  makeDeck()
  shufflingDeck()

  // moveToStart(2, '♦')
  // moveToStart(1, '♠')
  // moveToStart(6, '♠')
  // moveToStart(1, '♦')
  // moveToStart(3, '♠')
  // moveToStart(0, '♦')

  let k = 0
  for (let i = 0; i < 7; i++) {
    stacks.push([])
    for(let j = 0; j <= i; j++) {
      shuffledCards[k].deck = false
      stacks[i].push(shuffledCards[k])
      shuffledCards[k].stack = stacks[i]
      shuffledCards[k].open = j === i
      k++
    }
  }
  shuffledCards.splice(0, k)
  for(let i = 0, l = shuffledCards.length; i < l; i++) {
    shuffledCards[i].stack = shuffledCards
  }

  return { 
    cards: shuffledCards,
    index: undefined,
    click: false,
    clickedCard: undefined,
    stacks,
    home,
  }
}

function Card({card, onClick}) {
  const [clicked, setClicked] = useState(false)
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const {rank, suit, color} = card

  return <div className={`card ${color} ${card.clicked ? 'clickedCard' : ''}`} onClick={() => {
      setClicked(!clicked)
      onClick(card)
    }}>
    <div className='left'>{ranks[rank]} {suit}</div>
    <div className='center'>{suit}</div>
  </div>
}

function Empty({onClick, stack, home, ...props}) {
  return <div className="card empty" onClick={() => onClick(stack, home)} {...props}></div>
}

function Closed({className, ...props}) {
  return <div className={`card closed ${className}`} {...props}></div>
}

function Stack({stack, onCardClick, onEmptyClick, home}) {
  let cards = []
  let offset = 0

  for(let j = 0; j < stack.length; j++) {
    let card
    let closed

    if (stack[j].open) {
      card = <Card card={stack[j]} onClick={onCardClick}/>
    } else {
      card = <Closed />
      closed = true
    }
    cards.push(<div key={j} className='stacked' style={{top: home ? '' : `${offset}rem`}}>{card}</div>)
    offset += closed ? 1 : 3
  }

  if(cards.length) {
    return <div className='stack'>{cards}</div>
  } else {
    return <div className='stack'> <Empty onClick={onEmptyClick} stack={stack} home={home}/> </div>
  }
}

function resetClickedStack(state) {
  if (!state.clickedCard) return state
    
    for (let i = state.clickedCard.stack.indexOf(state.clickedCard); i < state.clickedCard.stack.length; i++) {
      state.clickedCard.stack[i].clicked = false
    }
    state.clickedCard = undefined
    return { ...state }
}

function reducer(state, action) {
  console.log(action.name)
  if (action.name === 'resetClickedStack') {
    return resetClickedStack(state)
  } else if (action.name === 'onEmptyClick') {
    if (!state.clickedCard) return state

    const { home, stack } = action
    let card2 = state.clickedCard
    let stack2 = card2.stack

    if (home && card2.rank === 0 || !home && card2.rank === 12) {
      if(stack2 === state.cards) {
          if (!state.index) {
            state.index = undefined
          } else {
            state.index--
          }
      }

      card2.moveToStack(stack)
      if (stack2.length) {
        stack2[stack2.length - 1].open = true
      }
    }

    return resetClickedStack(state)
  } else if (action.name === 'onDeckClick') {
    if (!state.clickedCard) {
      const { card } = action
      card.clicked = true
      return { ...state, clickedCard: card }
    } else {
      return resetClickedStack(state)
    }
  } else {
    return { ...action.state }
  }
}

export function App() {
  const [state, dispatch] = useReducer(reducer, 0, initialState)

  function setClickedStack(card) {
    state.clickedCard = card
    for (let i = card.stack.indexOf(card); i < card.stack.length; i++) {
      card.stack[i].clicked = true
    }
  }

  function resetClickedStack() {
    if (!state.clickedCard) return
    
    for (let i = state.clickedCard.stack.indexOf(state.clickedCard); i < state.clickedCard.stack.length; i++) {
      state.clickedCard.stack[i].clicked = false
    }
    state.clickedCard = undefined
    dispatch({
      name: 'newState',
      state 
    })
  }

  function resetClickedStack2() {
    dispatch({name: 'resetClickedStack'})
  }

  function setClicked(card) {
    state.clickedCard = card
    state.clickedCard.clicked = true
  }

  function onDeckClick() {
    if (state.cards.length === 0) {
      resetClickedStack()
      return
    }

    if (state.index === undefined) {
      state.index = 0
    } else if (state.index === state.cards.length - 1) {
      state.index = undefined
    } else {
      state.index++
    }

    if (state.clickedCard) {
      resetClickedStack()
    } else {
      dispatch({
        name: 'newState',
        state 
      })
    }
  }

  function onCardClick(targetCard) {
    if (!state.clickedCard) {
      if (targetCard.stack.indexOf(targetCard) < targetCard.stack.length) {
        setClickedStack(targetCard)
        dispatch({
          name: 'newState',
          state 
        })
      } else {
        setClicked(targetCard)
      }
    } else if(state.clickedCard !== targetCard) {
      let card2 = state.clickedCard
      let stack2 = card2.stack

      if (!card2.canPutAbove(targetCard)) {
        resetClickedStack()
        return
      }

      if (card2.stack === state.cards) {
        if (!state.index) {
          state.index = undefined
          
        } else {
          state.index--
        }
      }

      card2.moveToStack(targetCard.stack)
      if (stack2.length) {
        stack2[stack2.length - 1].open = true
      }

      resetClickedStack()
    }
  }

  function onHomeCardClick(targetCard) {
    if (!state.clickedCard) {
      setClicked(targetCard)
    } else if(state.clickedCard !== targetCard) {
      let card2 = state.clickedCard
      let stack2 = card2.stack

      if (!card2.canPutAboveHome(targetCard)) {
        resetClickedStack()
        return
      }

      if (card2.stack === state.cards) {
        if (!state.index) {
          state.index = undefined
          
        } else {
          state.index--
        }
      }

      card2.moveToStack(targetCard.stack)
      if (stack2.length) {
        stack2[stack2.length - 1].open = true
      }

      resetClickedStack()
    }
  }


  function onDeckCardClick(card) {
    dispatch({
      name: 'onDeckClick',
      card
    })
  }

  function onEmptyClick(stack, home) {
    dispatch({
      name: 'onEmptyClick',
      stack,
      home
    })
  }

  return (
    <>
      <div style={{display: "flex"}}>
        <div style={{display: "flex"}}>
          {state.index === state.cards.length - 1 || state.cards.length === 0 ? <Empty onClick={onDeckClick}/> : <Closed onClick={onDeckClick}/>}
          {state.index !== undefined ? <Card card={state.cards[state.index]} onClick={onDeckCardClick}/> : <Empty onClick={resetClickedStack2}/>}
        </div>

        <div style={{display: "flex", marginLeft: "14rem"}}>
          {state.home.map((stack, i) => {
            return <Stack key={i} stack={stack} onCardClick={onHomeCardClick} onEmptyClick={onEmptyClick} home={true}/>
          })}
        </div>
      </div>

      <div style={{display: "flex"}}>
        {state.stacks.map((stack, i) => {
          return <Stack key={i} stack={stack} onCardClick={onCardClick} onEmptyClick={onEmptyClick}/>
        })}
      </div>
    </>
  )
}