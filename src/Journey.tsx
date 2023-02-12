import { useState } from "react"
import { Button, Checkbox, Input, Segment } from "semantic-ui-react"

const initialData: string[][] = Array(5).fill(Array(6).fill(""))

export const Journey = () => {
    const [cellData, setCellData] = useState<string[][]>(initialData)
    const [position, setPosition] = useState<[number, number]>([0, 0])
    const [journey, setJourney] = useState("")
    const [allowWrapping, setAllowWrapping] = useState(false)

    const setData = (value: string, y: number, x: number) => {
        if (value.length > 1) {
            return
        }

        let newData = cellData.map((row, r) => row.map((cell, c) => {
            return r === y && c === x ? value : cell
        }))

        setCellData(newData)
    }

    const renderRow = (row: string[], y: number) => (
        <div key={y} className="row">
            {row.map((r, x) => renderCell(r, y, x))}
        </div>
    )

    const renderCell = (row: string, y: number, x: number) => {
        let className = "cell journey"
        if (x === position[0] && y === position[1]) {
            className += " highlight"
        }

        return (
            <div key={x} className={className}>
                <Input value={row} onChange={(e, data) => setData(data.value, y, x)} />
            </div>
        )
    }

    const up = () => {
        if (allowWrapping) {
            let newRow = position[1] <= 0 ? cellData.length - 1 : position[1] - 1
            setPosition([position[0], newRow])
        }
        else {
            setPosition([position[0], Math.max(0, position[1] - 1)])
        }
    }

    const right = () => {
        if (allowWrapping) {
            let newCol = position[0] >= cellData[0].length - 1 ? 0 : position[0] + 1
            setPosition([newCol, position[1]])
        }
        else {
            setPosition([Math.min(cellData[0].length - 1, position[0] + 1), position[1]])
        }
    }

    const down = () => {
        if (allowWrapping) {
            let newRow = position[1] >= cellData.length - 1 ? 0 : position[1] + 1
            setPosition([position[0], newRow])
        }
        else {
            setPosition([position[0], Math.min(cellData.length - 1, position[1] + 1)])
        }
    }

    const left = () => {
        if (allowWrapping) {
            let newCol = position[0] <= 0 ? cellData[0].length - 1 : position[0] - 1
            setPosition([newCol, position[1]])
        }
        else {
            setPosition([Math.max(0, position[0] - 1), position[1]])
        }
    }

    const addToJourney = () => {
        let newChar = cellData[position[1]][position[0]]
        setJourney(journey + newChar)
    }

    const nothingToAdd = () => !cellData[position[1]][position[0]]

    return (
        <div className="container">
            <div className="journey-string-container">
                <div className="journey-string">
                    <p>{journey || "?"}</p>
                </div>

                <Button
                    color="red"
                    disabled={!journey}
                    onClick={() => setJourney("")}>
                    Reset
                </Button>
            </div>

            <div className="grid">
                {cellData.map(renderRow)}
            </div>

            <div className="journey-buttons">
                <Button onClick={up}>Up</Button>
            </div>

            <div className="journey-buttons">
                <Button onClick={left}>Left</Button>

                <Button
                    color="green"
                    disabled={nothingToAdd()}
                    onClick={addToJourney}>
                    Add
                </Button>

                <Button onClick={right}>Right</Button>
            </div>

            <div className="journey-buttons">
                <Button onClick={down}>Down</Button>
            </div>

            <Segment>
                <Checkbox
                    label="Allow wrapping"
                    checked={allowWrapping}
                    onChange={(e, data) => setAllowWrapping(data.checked || false)} />
            </Segment>
        </div>
    )
}
