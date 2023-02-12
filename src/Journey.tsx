import { useState } from "react"
import { Button, Checkbox, Icon, Input, Segment, Table } from "semantic-ui-react"

type Position = [number, number]

const initialClues: string[] = Array(9).fill("")
const initialCellData: string[][] = Array(5).fill(Array(6).fill(""))

export const Journey = () => {
    const [clues, setClues] = useState(initialClues)

    const [cellData, setCellData] = useState(initialCellData)
    const [position, setPosition] = useState<Position>([0, 0])
    const [journey, setJourney] = useState("")
    const [allowWrapping, setAllowWrapping] = useState(false)

    const setClue = (clue: string, index: number) => {
        let newClues = clues.map((c, i) => i === index ? clue : c)
        setClues(newClues)
    }

    const extract = (clue: string) => clue.toLowerCase().replace(/[^urdl]/g, "").toUpperCase().split("")

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

    const moveUp = (pos: Position) => {
        if (allowWrapping) {
            let newRow = pos[1] <= 0 ? cellData.length - 1 : pos[1] - 1
            return [pos[0], newRow] as Position
        }

        return [pos[0], Math.max(0, pos[1] - 1)] as Position
    }

    const up = () => setPosition(moveUp(position))

    const moveRight = (pos: Position) => {
        if (allowWrapping) {
            let newCol = pos[0] >= cellData[0].length - 1 ? 0 : pos[0] + 1
            return [newCol, pos[1]] as Position
        }

        return [Math.min(cellData[0].length - 1, pos[0] + 1), pos[1]] as Position
    }

    const right = () => setPosition(moveRight(position))

    const moveDown = (pos: Position) => {
        if (allowWrapping) {
            let newRow = pos[1] >= cellData.length - 1 ? 0 : pos[1] + 1
            return [pos[0], newRow] as Position
        }

        return [pos[0], Math.min(cellData.length - 1, pos[1] + 1)] as Position
    }

    const down = () => setPosition(moveDown(position))

    const moveLeft = (pos: Position) => {
        if (allowWrapping) {
            let newCol = pos[0] <= 0 ? cellData[0].length - 1 : pos[0] - 1
            return [newCol, pos[1]] as Position
        }

        return [Math.max(0, pos[0] - 1), pos[1]] as Position
    }

    const left = () => setPosition(moveLeft(position))

    const addToJourney = (pos: Position) => {
        let newChar = cellData[pos[1]][pos[0]]
        setJourney(journey + newChar)
    }

    const nothingToAdd = () => !cellData[position[1]][position[0]]

    const apply = (directions: string[]) => {
        let newPos = position

        for (let dir of directions) {
            switch (dir) {
                case "U":
                    newPos = moveUp(newPos)
                    break

                case "R":
                    newPos = moveRight(newPos)
                    break

                case "D":
                    newPos = moveDown(newPos)
                    break

                case "L":
                    newPos = moveLeft(newPos)
                    break

                default:
                    break
            }
        }

        setPosition(newPos)
        addToJourney(newPos)
    }

    return (
        <div className="columns">
            <div className="clues">
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Clue</Table.HeaderCell>
                            <Table.HeaderCell>Directions</Table.HeaderCell>
                            <Table.HeaderCell>Apply</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {clues.map((c, i) => (
                            <Table.Row>
                                <Table.Cell>
                                    <Input
                                        placeholder={"Answer " + (i + 1)}
                                        value={c}
                                        onChange={(e, data) => setClue(data.value as string, i)} />
                                </Table.Cell>

                                <Table.Cell>
                                    <span>{extract(c).join(", ") || "-"}</span>
                                </Table.Cell>

                                <Table.Cell>
                                    <Button
                                        icon
                                        color="green"
                                        onClick={() => apply(extract(c))}>
                                        <Icon fitted name="play" />
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>

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
                        onClick={() => addToJourney(position)}>
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
        </div>
    )
}
