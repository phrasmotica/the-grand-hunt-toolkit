import { useState } from "react"
import { Input } from "semantic-ui-react"

export const RTPoetry = () => {
    const data = [
        {
            text: "\"Who's da guy throwin' all da fireballs?\" [3]",
            index: 3,
        },
        {
            text: "Stylish, in the past [3]",
            index: 3,
        },
        {
            text: "\"Boy, the Stones sure look older!\" [3]",
            index: 3,
        },
        {
            text: "1986 [Russia] - 2001 [South Pacific], so about 15 years [2]",
            index: 2,
        },
        {
            text: "Racing where cold becomes good [5]",
            index: 5,
        },
        {
            text: "Right, Ava took US high school equivalency test [5]",
            index: 5,
        },
    ]

    return (
        <div>
            <div className="description">
                <p>This did not help us solve the puzzle. We thought we were meant to Google around for some item that might be made of silver or metal that could be dug up from the ground, and index that word with the numbers in the brackets. Turns out the Rolling Stones had a commemorative <em>silver</em> coin minted for them...</p>
            </div>

            <div className="container">
                {data.map(q => <Answer text={q.text} index={q.index} />)}
            </div>
        </div>
    )
}

interface AnswerProps {
    text: string
    index: number
}

const Answer = (props: AnswerProps) => {
    const [input, setInput] = useState("")
    const [char, setChar] = useState("")

    const setInputAndChar = (value: string) => {
        setInput(value)

        let index = props.index - 1
        setChar(value.length > index ? value[index] : "")
    }

    return (
        <div className="poetry-answer">
            <div>
                <span className="poetry-clue">{props.text}</span>
            </div>

            <div className="poetry-result-container">
                <Input value={input} onChange={(e, data) => setInputAndChar(data.value)} />

                <span className="poetry-result"> -&gt; <strong>{char || "?"}</strong></span>
            </div>
        </div>
    )
}
