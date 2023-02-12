import { useState } from "react"
import { Button, ButtonGroup, Checkbox, Icon, Input, Segment, Table } from "semantic-ui-react"

type Map = string[][]

type Position = [number, number]

const initialClues: string[] = Array(9).fill("")
const initialMap: Map = Array(5).fill(Array(6).fill(""))

export const Journey = () => {
    const [clues, setClues] = useState(initialClues)

    const [map, setMap] = useState(initialMap)
    const [position, setPosition] = useState<Position>([0, 0])
    const [journey, setJourney] = useState("")
    const [allowWrapping, setAllowWrapping] = useState(false)

    const [mapToLoad, setMapToLoad] = useState("")

    const [maps, setMaps] = useState<Map[]>([])

    const [journeys, setJourneys] = useState<string[]>([])

    const setClue = (clue: string, index: number) => {
        let newClues = clues.map((c, i) => i === index ? clue : c)
        setClues(newClues)
    }

    const extract = (clue: string) => clue.toLowerCase().replace(/[^urdl]/g, "").toUpperCase().split("")

    const setData = (value: string, y: number, x: number) => {
        if (value.length > 1) {
            return
        }

        let newData = map.map((row, r) => row.map((cell, c) => {
            return r === y && c === x ? value : cell
        }))

        setMap(newData)
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
            let newRow = pos[1] <= 0 ? map.length - 1 : pos[1] - 1
            return [pos[0], newRow] as Position
        }

        return [pos[0], Math.max(0, pos[1] - 1)] as Position
    }

    const moveRight = (pos: Position) => {
        if (allowWrapping) {
            let newCol = pos[0] >= map[0].length - 1 ? 0 : pos[0] + 1
            return [newCol, pos[1]] as Position
        }

        return [Math.min(map[0].length - 1, pos[0] + 1), pos[1]] as Position
    }

    const moveDown = (pos: Position) => {
        if (allowWrapping) {
            let newRow = pos[1] >= map.length - 1 ? 0 : pos[1] + 1
            return [pos[0], newRow] as Position
        }

        return [pos[0], Math.min(map.length - 1, pos[1] + 1)] as Position
    }

    const moveLeft = (pos: Position) => {
        if (allowWrapping) {
            let newCol = pos[0] <= 0 ? map[0].length - 1 : pos[0] - 1
            return [newCol, pos[1]] as Position
        }

        return [Math.max(0, pos[0] - 1), pos[1]] as Position
    }

    const addToJourney = (pos: Position) => {
        let newChar = map[pos[1]][pos[0]]
        setJourney(journey + newChar)
    }

    const loadMap = (mapStr: string) => {
        let newMap = []
        let index = 0

        for (let r = 0; r < map.length; r++) {
            let newRow = []

            for (let c = 0; c < map[0].length; c++) {
                newRow.push(mapStr[index])
                index++
            }

            newMap.push(newRow)
        }

        setMap(newMap)
        setMapToLoad("")
    }

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

                    <ButtonGroup>
                        <Button
                            color="green"
                            disabled={!journey}
                            onClick={() => setJourneys([...journeys, journey])}>
                            Save Journey
                        </Button>

                        <Button
                            color="red"
                            disabled={!journey}
                            onClick={() => setJourney("")}>
                            Reset
                        </Button>
                    </ButtonGroup>
                </div>

                <div className="grid">
                    {map.map(renderRow)}
                </div>

                <div className="load-map">
                    <Input
                        placeholder="Load map"
                        value={mapToLoad}
                        onChange={(e, data) => setMapToLoad(data.value as string)} />

                    <Button
                        color="yellow"
                        disabled={!mapToLoad}
                        onClick={() => loadMap(mapToLoad)}>
                        Load Map
                    </Button>
                </div>

                <div>
                    <ButtonGroup fluid>
                        <Button
                            color="green"
                            disabled={!map.flatMap(r => r).some(c => c.length > 0)}
                            onClick={() => setMaps([...maps, map])}>
                            Save Map
                        </Button>

                        <Button
                            color="red"
                            disabled={!map.flatMap(r => r).some(c => c.length > 0)}
                            onClick={() => setMap(initialMap)}>
                            Clear Map
                        </Button>
                    </ButtonGroup>
                </div>

                <Segment>
                    <Checkbox
                        label="Allow wrapping"
                        checked={allowWrapping}
                        onChange={(e, data) => setAllowWrapping(data.checked || false)} />
                </Segment>
            </div>

            <div className="save-data">
                <div className="maps">
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Maps</Table.HeaderCell>
                                <Table.HeaderCell>Copy</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {maps.length <= 0 && <Table.Row>
                                <Table.Cell className="placeholder-cell" colSpan={2}>
                                    None yet!
                                </Table.Cell>
                            </Table.Row>}

                            {maps.map(m => (
                                <Table.Row>
                                    <Table.Cell>
                                        {m.flatMap(r => r).join("")}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Button
                                            icon
                                            color="yellow"
                                            onClick={() => navigator.clipboard.writeText(m.flatMap(r => r).join(""))}>
                                            <Icon fitted name="copy" />
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>

                <div className="guesses">
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Guesses</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {journeys.length <= 0 && <Table.Row>
                                <Table.Cell className="placeholder-cell">
                                    None yet!
                                </Table.Cell>
                            </Table.Row>}

                            {journeys.map(g => (
                                <Table.Row>
                                    <Table.Cell>
                                        {g}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </div>
    )
}
