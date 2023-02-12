import { useState } from "react"
import { Button, ButtonGroup, Input } from "semantic-ui-react"

const initialData: string[][] = Array(5).fill(Array(6).fill(""))

export const Journey = () => {
    const [cellData, setCellData] = useState<string[][]>(initialData)
    const [position, setPosition] = useState<[number, number]>([0, 0])

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
        setPosition([position[0], Math.max(0, position[1] - 1)])
    }

    const right = () => {
        setPosition([Math.min(cellData[0].length - 1, position[0] + 1), position[1]])
    }

    const down = () => {
        setPosition([position[0], Math.min(cellData.length - 1, position[1] + 1)])
    }

    const left = () => {
        setPosition([Math.max(0, position[0] - 1), position[1]])
    }

    // TODO: clean up buttons
    // TODO: add button for concatenating text in current position to overall journey string
    // TODO: add button for resetting journey

    return (
        <div className="container">
            <div className="grid">
                {cellData.map(renderRow)}
            </div>

            <div>
                <ButtonGroup>
                    <Button onClick={up}>Up</Button>
                    <Button onClick={right}>Right</Button>
                    <Button onClick={down}>Down</Button>
                    <Button onClick={left}>Left</Button>
                </ButtonGroup>
            </div>
        </div>
    )
}
