import { useState } from "react"
import { Button, ButtonGroup, Checkbox, Icon, Input, Segment, Tab, Table } from "semantic-ui-react"

type Map = string[][]

type Position = [number, number]

type JourneyStop = {
    character: string
    pos: Position
    clue: string | null
}

type JourneyEntry = {
    text: string
    map: string
    wrapping: boolean
    startPos: Position
    clues: (string | null)[]
}

const MAP_WIDTH = 6
const MAP_HEIGHT = 5
const NUM_CLUES = 9

const initialMap: Map = Array(MAP_HEIGHT).fill(Array(MAP_WIDTH).fill(""))
const initialPos: Position = [2, 2]
const initialClues: string[] = Array(NUM_CLUES).fill("")

export const Journey = () => {
    const [map, setMap] = useState(initialMap)
    const [position, setPosition] = useState<Position>(initialPos)
    const [clues, setClues] = useState(initialClues)

    const [journey, setJourney] = useState<JourneyStop[]>([])
    const [allowWrapping, setAllowWrapping] = useState(false)

    const [mapToLoad, setMapToLoad] = useState("")

    const [maps, setMaps] = useState<Map[]>([])

    const [journeys, setJourneys] = useState<JourneyEntry[]>([])
    const [journeyDetails, setJourneyDetails] = useState<number>()

    const setClue = (clue: string, index: number) => {
        let newClues = clues.map((c, i) => i === index ? clue : c)
        setClues(newClues)
    }

    const getDirections = (clue: string) => clue.toLowerCase().replace(/[^urdl]/g, "").toUpperCase().split("")

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

    const up = () => setPosition(moveUp(position))

    const moveRight = (pos: Position) => {
        if (allowWrapping) {
            let newCol = pos[0] >= map[0].length - 1 ? 0 : pos[0] + 1
            return [newCol, pos[1]] as Position
        }

        return [Math.min(map[0].length - 1, pos[0] + 1), pos[1]] as Position
    }

    const right = () => setPosition(moveRight(position))

    const moveDown = (pos: Position) => {
        if (allowWrapping) {
            let newRow = pos[1] >= map.length - 1 ? 0 : pos[1] + 1
            return [pos[0], newRow] as Position
        }

        return [pos[0], Math.min(map.length - 1, pos[1] + 1)] as Position
    }

    const down = () => setPosition(moveDown(position))

    const moveLeft = (pos: Position) => {
        if (allowWrapping) {
            let newCol = pos[0] <= 0 ? map[0].length - 1 : pos[0] - 1
            return [newCol, pos[1]] as Position
        }

        return [Math.max(0, pos[0] - 1), pos[1]] as Position
    }

    const left = () => setPosition(moveLeft(position))

    const deleteMap = (index: number) => {
        let newMaps = [...maps]
        newMaps.splice(index, 1)
        setMaps(newMaps)
    }

    const flattenJourney = (j: JourneyStop[]) => j.flatMap(s => s.character)

    const saveJourney = () => setJourneys(j => [
        ...j,
        {
            text: flattenJourney(journey).join(""),
            map: flattenMap(map),
            wrapping: allowWrapping,
            startPos: journey[0].pos,
            clues: journey.some(s => s.clue != null) ? journey.map(s => s.clue || "") : []
        }
    ])

    const deleteJourney = (index: number) => {
        let newJourneys = [...journeys]
        newJourneys.splice(index, 1)
        setJourneys(newJourneys)
    }

    const addToJourney = (pos: Position, clue: string | null) => {
        let newChar = map[pos[1]][pos[0]]

        setJourney(j => [...j, {
            character: newChar,
            pos: pos,
            clue: clue,
        }])
    }

    const nothingToAdd = () => !map[position[1]][position[0]]

    const flattenMap = (map: Map) => map.flatMap(r => r).join("")

    const mapIsEmpty = (map: Map) => flattenMap(map).length <= 0

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

    const apply = (pos: Position, clue: string) => {
        let newPos = pos

        let directions = getDirections(clue)
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

        let newChar = map[newPos[1]][newPos[0]]
        let newStop = {
            character: newChar,
            pos: newPos,
            clue: clue,
        }

        setJourney(j => [...j, newStop])
        setPosition(newPos)

        return newPos
    }

    const applyAllAndUpdate = (pos: Position) => {
        let newPos = pos

        for (let c of clues) {
            newPos = apply(newPos, c)
        }
    }

    const reset = () => {
        setJourney([])
        setPosition(initialPos)
    }

    const renderButtons = () => <div className="journey-buttons">
        <div>
            <Button onClick={up}>Up</Button>
        </div>

        <div>
            <Button onClick={left}>Left</Button>

            <Button
                color="green"
                disabled={nothingToAdd()}
                onClick={() => addToJourney(position, null)}>
                Add
            </Button>

            <Button onClick={right}>Right</Button>
        </div>

        <div>
            <Button onClick={down}>Down</Button>
        </div>
    </div>

    const renderClues = () => <div className="clues">
        <Table compact>
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
                            <span>{getDirections(c).join(", ") || "-"}</span>
                        </Table.Cell>

                        <Table.Cell>
                            <Button
                                icon
                                color="green"
                                onClick={() => apply(position, c)}>
                                <Icon fitted name="play" />
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                ))}

                <Table.Row>
                    <Table.Cell colSpan={3}>
                        <Button fluid color="green" onClick={() => applyAllAndUpdate(position)}>
                            Apply all clues
                        </Button>
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    </div>

    const controlPanes = [
        {
            menuItem: "Buttons",
            render: renderButtons
        },
        {
            menuItem: "Clues",
            render: renderClues
        },
    ]

    const renderJourneyDetails = (j: JourneyEntry, index: number) => {
        let isOpen = journeyDetails === index

        let clues = [...j.clues]
        for (let i = 0; i < clues.length; i++) {
            if (!clues[i]) {
                clues[i] = "(empty)"
            }
        }

        return (
            <div>
                <div className="journey-header">
                    <div className="journey-name">
                        <span><strong>{j.text}</strong></span>
                    </div>

                    <div className="button-container">
                        <Button
                            icon
                            color="teal"
                            onClick={() => setJourneyDetails(isOpen ? undefined : index)}>
                            <Icon fitted name={isOpen ? "chevron up" : "chevron down"} />
                        </Button>

                        <Button
                            icon
                            color="red"
                            onClick={() => deleteJourney(index)}>
                            <Icon fitted name="trash" />
                        </Button>
                    </div>
                </div>

                {isOpen && <div className="journey-details">
                    <div>Map: <em>{j.map}</em></div>
                    <div>Wrapping: <em>{j.wrapping ? "on" : "off"}</em></div>
                    <div>Start position: <em>({j.startPos[0]}, {j.startPos[1]})</em></div>
                    <div>Clues: <em>{clues.length > 0 ? clues.join(", ") : "(none)"}</em></div>
                </div>}
            </div>
        )
    }

    return (
        <div className="columns">
            <div className="controls">
                <Segment>
                    <Checkbox
                        label="Allow wrapping"
                        checked={allowWrapping}
                        onChange={(e, data) => setAllowWrapping(data.checked || false)} />
                </Segment>

                <Tab menu={{ pointing: true }} panes={controlPanes} />
            </div>

            <div className="container">
                <div className="journey-string-container">
                    <div className="journey-string">
                        <p>{flattenJourney(journey).join("") || "?"}</p>
                    </div>

                    <ButtonGroup>
                        <Button
                            color="green"
                            disabled={!journey}
                            onClick={saveJourney}>
                            Save Journey
                        </Button>

                        <Button
                            color="red"
                            disabled={!journey}
                            onClick={reset}>
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
                            disabled={mapIsEmpty(map)}
                            onClick={() => setMaps([...maps, map])}>
                            Save Map
                        </Button>

                        <Button
                            color="red"
                            disabled={mapIsEmpty(map)}
                            onClick={() => setMap(initialMap)}>
                            Clear Map
                        </Button>
                    </ButtonGroup>
                </div>
            </div>

            <div className="save-data">
                <div className="maps">
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Maps</Table.HeaderCell>
                                <Table.HeaderCell></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {maps.length <= 0 && <Table.Row>
                                <Table.Cell className="placeholder-cell">
                                    None yet!
                                </Table.Cell>
                            </Table.Row>}

                            {maps.map((m, i) => (
                                <Table.Row>
                                    <Table.Cell>
                                        <div className="map-name">
                                            <span><strong>{m.flatMap(r => r).join("")}</strong></span>
                                        </div>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <div className="button-container">
                                            <Button
                                                icon
                                                color="yellow"
                                                onClick={() => navigator.clipboard.writeText(m.flatMap(r => r).join(""))}>
                                                <Icon fitted name="copy" />
                                            </Button>

                                            <Button
                                                icon
                                                color="red"
                                                onClick={() => deleteMap(i)}>
                                                <Icon fitted name="trash" />
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>

                <div className="journeys">
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Journeys</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {journeys.length <= 0 && <Table.Row>
                                <Table.Cell className="placeholder-cell">
                                    None yet!
                                </Table.Cell>
                            </Table.Row>}

                            {journeys.map((j, i) => (
                                <Table.Row>
                                    <Table.Cell>
                                        {renderJourneyDetails(j, i)}
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
